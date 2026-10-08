import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "20", 10));
    const search = searchParams.get("search") || "";

    const isArchivedParam = searchParams.get("is_archived");
    const statusParam = searchParams.get("status");

    const isArchived = isArchivedParam === "1" || statusParam === "archived";
    const shouldFilterArchive =
      isArchivedParam === "0" ||
      isArchivedParam === "1" ||
      statusParam === "active" ||
      statusParam === "archived";

    const offset = (page - 1) * limit;

    const whereConditions: string[] = [];
    const params: any[] = [];

    if (shouldFilterArchive) {
      if (isArchived) {
        whereConditions.push("is_archived = 1");
      } else {
        whereConditions.push("(is_archived = 0 OR is_archived IS NULL)");
      }
    }

    if (search) {
      whereConditions.push(
        "(code LIKE ? OR title LIKE ? OR description LIKE ?)",
      );
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const [countRows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM courses ${whereClause}`,
      params,
    );
    const totalItems = countRows[0]?.total || 0;
    const totalPages = Math.ceil(totalItems / limit) || 1;

    const [courses] = await pool.query<RowDataPacket[]>(
      `SELECT id, code, title, description, is_archived, created_at, updated_at
       FROM courses
       ${whereClause}
       ORDER BY id DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    );

    return NextResponse.json({
      success: true,
      data: courses,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    console.error("GET Courses API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch courses" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, title, description } = body;

    if (!code || !title) {
      return NextResponse.json(
        { success: false, message: "Code and title are required." },
        { status: 400 },
      );
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO courses (code, title, description, is_archived, is_deleted)
       VALUES (?, ?, ?, 0, 0)`,
      [code.trim(), title.trim(), description ? description.trim() : ""],
    );

    return NextResponse.json(
      {
        success: true,
        message: "Course created successfully",
        data: {
          id: result.insertId,
          code,
          title,
          description,
          is_archived: false,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST Course API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create course" },
      { status: 500 },
    );
  }
}
