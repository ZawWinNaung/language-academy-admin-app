import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export interface Course extends RowDataPacket {
  id: number;
  code: string;
  title: string;
  description: string;
}

export async function GET() {
  try {
    const [rows] = await pool.query<Course[]>(
      `SELECT id, code, title, description FROM courses ORDER BY id ASC`,
    );
    return NextResponse.json({ success: true, data: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch courses",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
