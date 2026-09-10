import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2";
import { signJWT } from "@/lib/auth";

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

    const userPayload = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
    };

    const token = await signJWT(userPayload);

    const response = NextResponse.json(
      {
        success: true,
        user: userPayload,
      },
      { status: 200 },
    );

    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
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
