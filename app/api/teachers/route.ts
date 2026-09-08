import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export interface Teacher extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  phone: string;
  qualification: string;
  is_active: boolean;
}

export async function GET() {
  try {
    const [rows] = await pool.query<Teacher[]>(
      `SELECT id, name, email, phone, qualification, is_active 
       FROM teachers 
       WHERE is_deleted = FALSE 
       ORDER BY name ASC`,
    );
    return NextResponse.json({ success: true, data: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch teachers",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
