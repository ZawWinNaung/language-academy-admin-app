import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";
import { verifyJWT } from "@/lib/auth";
import { RowDataPacket } from "mysql2";

interface AdminRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - No session cookie" },
        { status: 401 },
      );
    }

    const decoded = await verifyJWT(token);

    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Invalid token" },
        { status: 401 },
      );
    }

    const [rows] = await pool.query<AdminRow[]>(
      "SELECT id, name, email FROM admins WHERE id = ?",
      [decoded.id],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const admin = rows[0];

    return NextResponse.json(
      {
        success: true,
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch user session",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
