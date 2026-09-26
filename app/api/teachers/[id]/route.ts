import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

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

    //Fetch Teacher Info
    const [teacherRows] = await pool.query<RowDataPacket[]>(
      `SELECT id, name, email, phone, qualification, is_active 
       FROM teachers 
       WHERE id = ? AND is_deleted = FALSE`,
      [teacherId],
    );

    if (teacherRows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Teacher not found" },
        { status: 404 },
      );
    }

    const [scheduleRows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        ts.id AS schedule_id,
        ts.class_id,
        ts.day_of_week,
        ts.start_time,
        ts.end_time,
        ts.room_no,
        COALESCE(c.name, 'Unassigned Class') AS class_name,
        COALESCE(co.title, 'Unassigned Course') AS course_title
       FROM timetable_schedules ts
       LEFT JOIN classes c ON ts.class_id = c.id
       LEFT JOIN courses co ON c.course_id = co.id
       WHERE ts.teacher_id = ?
       ORDER BY FIELD(ts.day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), ts.start_time ASC`,
      [teacherId],
    );

    return NextResponse.json({
      success: true,
      data: {
        teacher: teacherRows[0],
        schedules: scheduleRows || [],
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch teacher details",
        error: String(error),
      },
      { status: 500 },
    );
  }
}

// UPDATE Teacher Profile
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const resolvedParams = await params;
    const teacherId = resolvedParams.id;

    const body = await req.json();
    const { name, email, phone, qualification, is_active } = body;

    await pool.query<ResultSetHeader>(
      `UPDATE teachers 
       SET name = ?, email = ?, phone = ?, qualification = ?, is_active = ?
       WHERE id = ?`,
      [name, email, phone, qualification, is_active, teacherId],
    );

    return NextResponse.json({
      success: true,
      message: "Teacher updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update teacher",
        error: String(error),
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Teacher ID is required" },
        { status: 400 },
      );
    }

    await pool.query(
      "UPDATE teachers SET is_deleted = 1, is_active = 0 WHERE id = ?",
      [id],
    );

    await pool.query(
      "UPDATE timetable_schedules SET teacher_id = NULL WHERE teacher_id = ?",
      [id],
    );

    return NextResponse.json({
      success: true,
      message: "Teacher soft deleted successfully",
    });
  } catch (error) {
    console.error("Error soft deleting teacher:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
