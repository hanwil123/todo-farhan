import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import supabase from "@/app/lib/supabase";

export async function POST(request: Request) {
  const { email, password, full_name, username, role } = await request.json();
  if (!email || !password || !full_name || !username) {
    return NextResponse.json(
      { message: "Semua field harus diisi" },
      { status: 400 }
    );
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const {data: authData, error: authError} = await supabase.from("users").insert([{email, password: hashedPassword, full_name, username, role}]).select("*").single();

  if (authError) {
    return NextResponse.json({ message: authError.message }, { status: 500 });
  }

    return NextResponse.json({ message: "User berhasil dibuat", data: authData });
}
