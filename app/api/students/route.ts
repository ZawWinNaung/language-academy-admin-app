import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface Student extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  phone: string;
  joined_date: string;
}

export async function GET() {
  try {
    const [rows] = await pool.query<Student[]>(
      `SELECT id, name, email, phone, DATE_FORMAT(joined_date, '%Y-%m-%d') AS joined_date 
       FROM students 
       WHERE is_deleted = FALSE 
       ORDER BY id DESC`,
    );
    return NextResponse.json({ success: true, data: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch students",
        error: String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, joined_date } = body;

    if (!name || !email || !phone || !joined_date) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO students (name, email, phone, joined_date) VALUES (?, ?, ?, ?)`,
      [name, email, phone, joined_date],
    );

    return NextResponse.json(
      {
        success: true,
        message: "Student created successfully",
        id: result.insertId,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create student",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
