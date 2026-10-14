import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export async function PUT(request: NextRequest) {
  try {
    const adminId = request.headers.get("x-admin-id");
    if (!adminId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { current_password, new_password } = await request.json();

    if (!current_password || !new_password) {
      return NextResponse.json(
        {
          success: false,
          message: "Both current and new passwords are required.",
        },
        { status: 400 },
      );
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT password_hash FROM admins WHERE id = ?",
      [adminId],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const isPasswordValid = await bcrypt.compare(
      current_password,
      rows[0].password_hash,
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Incorrect current password." },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await pool.query<ResultSetHeader>(
      "UPDATE admins SET password_hash = ? WHERE id = ?",
      [hashedPassword, adminId],
    );

    return NextResponse.json(
      { success: true, message: "Password updated successfully." },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update password",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
