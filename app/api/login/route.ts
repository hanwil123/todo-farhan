import supabase from "@/app/lib/supabase";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
// if (!JWT_SECRET) {
//   throw new Error("JWT_SECRET environment variable is not set");
// }

export async function POST(request: Request) {
  try {
    // Ekstrak email dan password dari request
    const { email, password } = await request.json();

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    // Cek apakah email ada di database
    const { data: authData, error: authError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    // console.log("Query result:", authData, authError);

    // Jika terjadi error saat query atau user tidak ditemukan
    if (authError || !authData) {
      // console.error("Auth error:", authError);
      return NextResponse.json(
        { message: "Email atau password salah" },
        { status: 400 }
      );
    }

    // Verifikasi password dengan bcrypt
    const passwordMatch = await bcrypt.compare(password, authData.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Email atau password salah" },
        { status: 400 }
      );
    }

    // Buat session dan token
    const userSession = {
      id: authData.id,
      email: authData.email,
      username: authData.username,
      full_name: authData.full_name,
      role : authData.role
    };

    // Buat token JWT
    const token = jwt.sign(userSession, JWT_SECRET, { expiresIn: "1h" });

    // Return sukses dengan token
    return NextResponse.json({
      message: "Login berhasil",
      data: { token, user: userSession },
    });
  } catch (error) {
    // Log error detail untuk debugging
    // console.error("Login error:", error);

    return NextResponse.json(
      { message: `Terjadi kesalahan pada server : ${error}}` },
      { status: 500 }
    );
  }
}
