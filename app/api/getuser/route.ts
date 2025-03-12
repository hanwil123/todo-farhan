import supabase from "@/app/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET as string

// GET user data based on token
export async function GET(request: NextRequest) {
  try {
    // Dapatkan token dari header Authorization
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.split(" ")[1]

    // Jika tidak ada token, kembalikan error unauthorized
    if (!token) {
      return NextResponse.json({ message: "Unauthorized: Token tidak ditemukan" }, { status: 401 })
    }

    // Verifikasi token
    let decodedToken
    try {
      decodedToken = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json({ message: `Unauthorized: Token tidak valid : ${error}` }, { status: 401 })
    }

    // Dapatkan user ID dari token
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (decodedToken as any).id

    // Query user dari database berdasarkan ID dari token
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, email, username, full_name, role, created_at, updated_at")
      .eq("id", userId)
      .maybeSingle()

    // Jika terjadi error atau user tidak ditemukan
    if (userError || !userData) {
      return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 })
    }

    // Return data user
    return NextResponse.json({
      message: "Data users berhasil diambil",
      data: userData,
    })
  } catch (error) {
    return NextResponse.json({ message: `Terjadi kesalahan pada server: ${error}` }, { status: 500 })
  }
}

