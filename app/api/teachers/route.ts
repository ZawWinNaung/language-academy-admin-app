import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface Teacher extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  phone: string;
  qualification: string;
  is_active: boolean;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const search = searchParams.get("search") || "";

    const offset = (page - 1) * limit;

    let whereClause = "WHERE is_deleted = FALSE";
    const queryParams: (string | number)[] = [];

    if (search) {
      whereClause +=
        " AND (name LIKE ? OR email LIKE ? OR qualification LIKE ?)";
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern);
    }

    const [countRows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM teachers ${whereClause}`,
      queryParams,
    );
    const totalItems = countRows[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, name, email, phone, qualification, is_active 
       FROM teachers 
       ${whereClause} 
       ORDER BY name ASC 
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset],
    );

    return NextResponse.json(
      {
        success: true,
        data: rows,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          pageSize: limit,
        },
      },
      { status: 200 },
    );
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, qualification } = body;

    if (!name || !email || !phone || !qualification) {
      return NextResponse.json(
        {
          success: false,
          message:
            "All fields (name, email, phone, qualification) are required.",
        },
        { status: 400 },
      );
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO teachers (name, email, phone, qualification, is_active, is_deleted) 
       VALUES (?, ?, ?, ?, TRUE, FALSE)`,
      [name.trim(), email.trim(), phone.trim(), qualification.trim()],
    );

    return NextResponse.json(
      {
        success: true,
        message: "Teacher added successfully.",
        data: {
          id: result.insertId,
          name,
          email,
          phone,
          qualification,
          is_active: true,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        {
          success: false,
          message: "A teacher with this email address already exists.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create teacher.",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
