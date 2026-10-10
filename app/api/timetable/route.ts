import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "20", 10));
    const search = searchParams.get("search") || "";
    const day = searchParams.get("day") || "";

    const offset = (page - 1) * limit;

    const whereConditions: string[] = [];
    const params: any[] = [];

    if (day) {
      whereConditions.push("t.day_of_week = ?");
      params.push(day);
    }

    if (search) {
      whereConditions.push(
        "(t.subject LIKE ? OR t.day_of_week LIKE ? OR c.name LIKE ? OR tch.name LIKE ?)",
      );
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const [countRows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total 
       FROM timetable_schedules t
       LEFT JOIN classes c ON t.class_id = c.id
       LEFT JOIN teachers tch ON t.teacher_id = tch.id
       ${whereClause}`,
      params,
    );

    const totalItems = countRows[0]?.total || 0;
    const totalPages = Math.ceil(totalItems / limit) || 1;

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        t.id,
        t.class_id,
        t.teacher_id,
        t.day_of_week,
        t.start_time,
        t.end_time,
        t.subject,
        t.created_at,
        c.name AS class_name,
        tch.name AS teacher_name
      FROM timetable_schedules t
      LEFT JOIN classes c ON t.class_id = c.id
      LEFT JOIN teachers tch ON t.teacher_id = tch.id
      ${whereClause}
      ORDER BY FIELD(t.day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), t.start_time ASC
      LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    );

    return NextResponse.json({
      success: true,
      data: rows,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalItems,
        totalPages,
      },
    });
  } catch (error: any) {
    console.error("GET Timetable API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch timetable" },
      { status: 500 },
    );
  }
}
