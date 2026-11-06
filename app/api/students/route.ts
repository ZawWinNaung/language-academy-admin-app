import { NextResponse, NextRequest } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface Student extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  phone: string;
  joined_date: string;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "20", 10));
    const offset = (page - 1) * limit;

    const [countRows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS total FROM students WHERE is_deleted = FALSE`,
    );
    const totalItems = countRows[0]?.total || 0;
    const totalPages = Math.ceil(totalItems / limit) || 1;

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, name, email, phone, DATE_FORMAT(joined_date, '%Y-%m-%d') AS joined_date 
       FROM students 
       WHERE is_deleted = FALSE 
       ORDER BY id DESC
       LIMIT ? OFFSET ?`,
      [limit, offset],
    );

    return NextResponse.json(
      {
        success: true,
        data: rows,
        pagination: {
          currentPage: page,
          pageSize: limit,
          totalItems,
          totalPages,
        },
      },
      { status: 200 },
    );
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, joined_date } = body;

    if (!name || !email || !phone || !joined_date) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 },
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    const [existing] = await pool.query<RowDataPacket[]>(
      `SELECT id FROM students WHERE LOWER(email) = ? AND is_deleted = 0`,
      [trimmedEmail],
    );

    if (existing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "A student with this email address already exists.",
        },
        { status: 400 },
      );
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO students (name, email, phone, joined_date, is_deleted)
       VALUES (?, ?, ?, ?, 0)`,
      [name.trim(), trimmedEmail, phone.trim(), joined_date],
    );

    return NextResponse.json(
      {
        success: true,
        message: "Student registered successfully",
        data: { id: result.insertId },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("POST Student API Error:", error);

    if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
      return NextResponse.json(
        {
          success: false,
          message: "A student with this email address already exists.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to create student" },
      { status: 500 },
    );
  }
}
