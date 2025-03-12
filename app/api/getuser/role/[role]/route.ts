import supabase from "@/app/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

// GET users by role (public endpoint - no authentication required)
export async function GET(request: NextRequest, { params }: { params: { role: string } }) {
  try {
    // Dapatkan role dari parameter URL
    const role = params.role?.toLowerCase()

    // Validasi role yang diperbolehkan dengan case insensitive
    if (!role || (role !== "lead" && role !== "team")) {
      return NextResponse.json(
        {
          message: "Role tidak valid. Gunakan 'lead' atau 'team'",
          status: "error",
        },
        { status: 400 },
      )
    }

    // // Dapatkan parameter pagination dari URL (opsional)
    // const searchParams = request.nextUrl.searchParams
    // const page = Number.parseInt(searchParams.get("page") || "1")
    // const limit = Number.parseInt(searchParams.get("limit") || "10")
    // const from = (page - 1) * limit
    // const to = from + limit - 1

    // Query users dari database berdasarkan role dengan pagination
    const {
      data: users,
      error: usersError,
    //   count,
    } = await supabase
      .from("users")
      .select(
        // Hanya mengembalikan data yang tidak sensitif
        "id, username, full_name, role, created_at",
        { count: "exact" },
      )
      .eq("role", role)
    //   .range(from, to)
      .order("created_at", { ascending: false })

    // Jika terjadi error
    if (usersError) {
      console.error("Database error:", usersError)
      return NextResponse.json(
        {
          message: "Gagal mengambil data users",
          status: "error",
          error: usersError.message,
        },
        { status: 500 },
      )
    }

    // Return data users dengan pagination
    return NextResponse.json({
      message: `Data users dengan role ${role} berhasil diambil`,
      status: "success",
      data: users || [], // Pastikan selalu mengembalikan array meski kosong
    //   pagination: {
    //     total: count || 0,
    //     page,
    //     limit,
    //     totalPages: Math.ceil((count || 0) / limit),
    //   },
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      {
        message: "Terjadi kesalahan pada server",
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

