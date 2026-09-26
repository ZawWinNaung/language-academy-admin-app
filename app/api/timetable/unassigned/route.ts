import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        ts.id,
        ts.day_of_week,
        ts.start_time,
        ts.end_time,
        ts.room_no,
        COALESCE(c.name, 'Unassigned Class') AS class_name,
        COALESCE(co.title, 'Unassigned Course') AS course_title
       FROM timetable_schedules ts
       LEFT JOIN classes c ON ts.class_id = c.id
       LEFT JOIN courses co ON c.course_id = co.id
       WHERE ts.teacher_id IS NULL
       ORDER BY FIELD(ts.day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), ts.start_time ASC`,
    );

    return NextResponse.json({ success: true, data: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch unassigned timetables",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
