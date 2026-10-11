import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const resolvedParams = await params;
    const teacherId = resolvedParams.id;

    if (!teacherId || teacherId === "undefined") {
      return NextResponse.json(
        { success: false, message: "Invalid teacher ID provided" },
        { status: 400 },
      );
    }

    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const limit = Math.max(
      1,
      parseInt(url.searchParams.get("limit") || "10", 10),
    );
    const offset = (page - 1) * limit;

    const [countRows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS total 
       FROM timetable_schedules ts
       LEFT JOIN classes c ON ts.class_id = c.id
       WHERE ts.teacher_id = ? AND c.end_date >= CURDATE()`,
      [teacherId],
    );
    const totalItems = countRows[0]?.total || 0;
    const totalPages = Math.ceil(totalItems / limit) || 1;

    const [scheduleRows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        ts.id AS schedule_id,
        ts.class_id,
        ts.day_of_week,
        ts.start_time,
        ts.end_time,
        COALESCE(c.name, 'Unassigned Class') AS class_name,
        COALESCE(co.title, 'Unassigned Course') AS course_title
       FROM timetable_schedules ts
       LEFT JOIN classes c ON ts.class_id = c.id
       LEFT JOIN courses co ON c.course_id = co.id
       WHERE ts.teacher_id = ? AND c.end_date >= CURDATE()
       ORDER BY FIELD(ts.day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), ts.start_time ASC
       LIMIT ? OFFSET ?`,
      [teacherId, limit, offset],
    );

    return NextResponse.json({
      success: true,
      data: scheduleRows || [],
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Fetch Teacher Schedules Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch teacher schedules",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
