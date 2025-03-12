import supabase from "@/app/lib/supabase";
import {  NextResponse } from "next/server";
// import jwt from "jsonwebtoken";


// const JWT_SECRET = process.env.JWT_SECRET as string;

// GET user data based on token
export async function GET() {
  try {
    // Get token from Authorization header
    // const authHeader = request.headers.get("authorization");
    // const token = authHeader?.split(" ")[1];
    
    // // Return error if no token provided
    // if (!token) {
    //   return NextResponse.json(
    //     { message: "Unauthorized: Token tidak ditemukan" },
    //     { status: 401 }
    //   );
    // }
    
    // // Verify token
    // let decodedToken;
    // try {
    //   decodedToken = jwt.verify(token, JWT_SECRET);
    // } catch (error) {
    //     return NextResponse.json(
    //       { message: `Unauthorized: Token tidak valid : ${error}` },
    //       { status: 401 }
    //     );
    //   }
    
    // // Get user ID from token
    // // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // const userId = (decodedToken as any).id;
    
    // Query tasks assigned to the authenticated user
    const { data: tasksData, error: tasksError } = await supabase
      .from("taskss")
      .select("*")
    //   .eq("assigned_to", userId);
      
    if (tasksError) {
      return NextResponse.json(
        { message: `Error fetching tasks: ${tasksError.message}` },
        { status: 500 }
      );
    }
    
    // Return tasks data
    return NextResponse.json({
      message: tasksData && tasksData.length > 0
        ? "Data task berhasil diambil"
        : "Tidak ada task yang ditemukan",
      data: tasksData || [],
    });
  } catch (error) {
    return NextResponse.json(
      { message: `Terjadi kesalahan pada server: ${error}` },
      { status: 500 }
    );
  }
}