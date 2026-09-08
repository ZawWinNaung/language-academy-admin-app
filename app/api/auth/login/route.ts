import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2";

interface AdminRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password_hash: string;
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const [rows] = await pool.query<AdminRow[]>(
      "SELECT id, name, email, password_hash FROM admins WHERE email = ?",
      [email],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 },
      );
    }

    const admin = rows[0];

    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 },
      );
    }

    const response = NextResponse.json(
      {
        success: true,
        user: { id: admin.id, name: admin.name, email: admin.email },
      },
      { status: 200 },
    );

    response.cookies.set("admin_session", String(admin.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days session duration
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Authentication failed",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
