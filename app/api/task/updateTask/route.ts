import { logTaskActivity } from "@/app/lib/logtask";
import supabase from "@/app/lib/supabase";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function PUT(request: Request) {
  try {
    // Dapatkan token dari header Authorization
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    // Jika tidak ada token, kembalikan error unauthorized
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: Token tidak ditemukan" },
        { status: 401 }
      );
    }

    // Verifikasi token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { message: `Unauthorized: Token tidak valid : ${error}` },
        { status: 401 }
      );
    }

    // Dapatkan user ID dari token
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (decodedToken as any).id;

    // Dapatkan data dari request body
    const { id, title, description, status, assigned_to } =
      await request.json();

    // Validasi id task
    if (!id) {
      return NextResponse.json(
        { message: "Task ID is required" },
        { status: 400 }
      );
    }

    // Validasi field yang akan diupdate
    if (!title && !description && !status && !assigned_to) {
      return NextResponse.json(
        { message: "At least one field must be updated" },
        { status: 400 }
      );
    }

    // Siapkan data untuk update
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (status) updateData.status = status;
    if (assigned_to) updateData.assigned_to = assigned_to;

    // Update data task di database
    const { data: updatedTask, error: updateError } = await supabase
      .from("taskss")
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single();

    if (updateError) {
      return NextResponse.json(
        { message: `Error updating task: ${updateError.message}` },
        { status: 500 }
      );
    }

    // Jika tidak ada data yang terupdate (mungkin task tidak ditemukan)
    if (!updatedTask) {
      return NextResponse.json(
        { message: "Task not found or you don't have permission to update it" },
        { status: 404 }
      );
    }

       // Log the task update activity
       await logTaskActivity({
        task_id: id,
        user_id: userId,
        changes: updateData,
        action: 'update',
        new_values: updatedTask
      });

    // Return updated task data
    return NextResponse.json({
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    return NextResponse.json(
      { message: `Terjadi kesalahan pada server: ${error}` },
      { status: 500 }
    );
  }
}
