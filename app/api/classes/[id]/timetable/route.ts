import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // Handle Next.js 15+ async params
) {
  try {
    const resolvedParams = await params;
    const classId = parseInt(resolvedParams.id, 10);

    if (isNaN(classId)) {
      return NextResponse.json(
        { success: false, message: "Invalid Class ID" },
        { status: 400 },
      );
    }

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
      WHERE t.class_id = ?
      ORDER BY FIELD(t.day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), t.start_time ASC`,
      [classId],
    );

    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    console.error("GET Class Timetable Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
