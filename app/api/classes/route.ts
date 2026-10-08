import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { calculateClassStatus } from "@/lib/utils/classStatus";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "20", 10));
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const offset = (page - 1) * limit;

    let whereClause = "WHERE (c.is_deleted = 0 OR c.is_deleted IS NULL)";
    const params: any[] = [];

    if (search) {
      whereClause += ` AND (c.name LIKE ? OR co.code LIKE ? OR co.title LIKE ?)`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    const [rows]: any = await pool.query(
      `
      SELECT 
        c.id,
        c.name AS class_name,
        DATE_FORMAT(c.start_date, '%Y-%m-%d') AS start_date,
        DATE_FORMAT(c.end_date, '%Y-%m-%d') AS end_date,
        co.code AS course_code,
        co.title AS course_title,
        COUNT(e.id) AS active_students
      FROM classes c
      LEFT JOIN courses co ON c.course_id = co.id
      LEFT JOIN enrollments e ON e.class_id = c.id
      ${whereClause}
      GROUP BY c.id, c.name, c.start_date, c.end_date, co.code, co.title
      ORDER BY c.start_date DESC
    `,
      params,
    );

    let formattedClasses = rows.map((cls: any) => ({
      ...cls,
      start_date: cls.start_date || "",
      end_date: cls.end_date || "",
      status: calculateClassStatus(cls.start_date, cls.end_date),
      class_status: calculateClassStatus(cls.start_date, cls.end_date),
    }));

    if (status) {
      formattedClasses = formattedClasses.filter(
        (cls: any) => cls.class_status.toLowerCase() === status.toLowerCase(),
      );
    }

    const totalItems = formattedClasses.length;
    const totalPages = Math.ceil(totalItems / limit) || 1;
    const paginatedClasses = formattedClasses.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedClasses,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Failed to fetch classes:", error);
    return NextResponse.json(
      { success: false, message: "Error loading classes" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, course_id, start_date, end_date } = body;

    if (!name || !course_id || !start_date || !end_date) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 },
      );
    }

    if (new Date(start_date) > new Date(end_date)) {
      return NextResponse.json(
        { success: false, message: "Start date cannot be after end date." },
        { status: 400 },
      );
    }

    // Check if selected course is archived
    const [courseRows] = await pool.query<RowDataPacket[]>(
      `SELECT id, is_archived FROM courses WHERE id = ?`,
      [Number(course_id)],
    );

    if (courseRows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Selected course does not exist." },
        { status: 400 },
      );
    }

    if (courseRows[0].is_archived) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cannot create class. The selected course has been archived.",
        },
        { status: 400 },
      );
    }

    const [result]: [ResultSetHeader, any] = await pool.query(
      `INSERT INTO classes (course_id, name, start_date, end_date, is_deleted)
       VALUES (?, ?, ?, ?, 0)`,
      [Number(course_id), name.trim(), start_date, end_date],
    );

    return NextResponse.json(
      {
        success: true,
        message: "Class created successfully",
        data: {
          id: result.insertId,
          name,
          course_id: Number(course_id),
          start_date,
          end_date,
          class_status: calculateClassStatus(start_date, end_date),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create class:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error while creating class" },
      { status: 500 },
    );
  }
}
