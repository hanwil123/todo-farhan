import supabase from "@/app/lib/supabase";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function DELETE(request: Request) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Token tidak ditemukan" },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(" ")[1];
    
    if (!token) {
      return NextResponse.json(
        { message: "Token tidak valid" },
        { status: 401 }
      );
    }

    try {
      // Verify the token
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      // Update the refresh_token to null in the database
      const { error } = await supabase
        .from("users")
        .update({ refresh_token: null })
        .eq("id", decoded.id);

      if (error) {
        return NextResponse.json(
          { message: "Gagal menghapus token dari database" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: "Logout berhasil",
        data: null
      });
    } catch (jwtError) {
      return NextResponse.json(
        { message: `Token tidak valid atau sudah kadaluarsa : ${jwtError}` },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: `Terjadi kesalahan pada server: ${error}` },
      { status: 500 }
    );
  }
}