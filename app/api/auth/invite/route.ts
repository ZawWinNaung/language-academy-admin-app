import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import generator from "generate-password";
import { ResultSetHeader } from "mysql2";

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Name and email are required." },
        { status: 400 },
      );
    }

    const [existing]: any = await pool.query(
      "SELECT id FROM admins WHERE email = ?",
      [email],
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: "An admin with this email already exists." },
        { status: 409 },
      );
    }

    const tempPassword = generator.generate({
      length: 10,
      numbers: true,
      symbols: true,
      strict: true,
    });

    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO admins (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Failed to create admin record." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Admin created successfully!",
      temp_password: tempPassword,
    });
  } catch (error) {
    console.error("Invite Admin Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 },
    );
  }
}
