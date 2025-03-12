import supabase from "@/app/lib/supabase";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { logTaskActivity } from "@/app/lib/logtask";

const JWT_SECRET = process.env.JWT_SECRET as string;
export async function POST(request: Request) {
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
  const { title, description, status, assigned_to } = await request.json();
  if (!title || !description || !status || !assigned_to) {
    return NextResponse.json(
      { message: "All fields must be filled" },
      { status: 400 }
    );
  }
const { data: taskData, error: taskError } = await supabase
    .from("taskss")
    .insert([{ title, description, status, assigned_to }])
    .eq("user_id", userId)
    .select("*")
    .single();
  if (taskError) {
    return NextResponse.json({ message: taskError.message }, { status: 500 });
  }
    // Log the task creation activity
    await logTaskActivity({
      task_id: taskData.id,
      user_id: userId,
      action: 'create',
      new_values: {
        title,
        description,
        status,
        assigned_to
      }
    });
  return NextResponse.json({
    message: "Task created successfully",
    data: taskData,
  });
}
