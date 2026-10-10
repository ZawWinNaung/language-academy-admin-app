import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; slotId: string }> },
) {
  try {
    const resolvedParams = await params;
    const classId = parseInt(resolvedParams.id, 10);
    const slotId = parseInt(resolvedParams.slotId, 10);

    if (isNaN(classId) || isNaN(slotId)) {
      return NextResponse.json(
        { success: false, message: "Invalid Class ID or Slot ID" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const { teacher_id, day_of_week, start_time, end_time, subject } = body;

    if (!day_of_week || !start_time || !end_time || !subject) {
      return NextResponse.json(
        { success: false, message: "Missing required schedule fields." },
        { status: 400 },
      );
    }

    if (start_time >= end_time) {
      return NextResponse.json(
        { success: false, message: "End time must be later than start time." },
        { status: 400 },
      );
    }

    const [currentClassRows] = await pool.query<RowDataPacket[]>(
      `SELECT id, name, start_date, end_date FROM classes WHERE id = ? AND is_deleted = FALSE`,
      [classId],
    );

    if (currentClassRows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Target class not found or deleted." },
        { status: 404 },
      );
    }

    const targetClass = currentClassRows[0];
    const teacherIdParsed = teacher_id ? parseInt(teacher_id, 10) : null;

    // Same Class Time Overlap Check
    const [sameClassConflicts] = await pool.query<RowDataPacket[]>(
      `SELECT id, subject, start_time, end_time 
       FROM timetable_schedules 
       WHERE class_id = ? 
         AND id != ?
         AND day_of_week = ? 
         AND (? < end_time AND ? > start_time)`,
      [classId, slotId, day_of_week, start_time, end_time],
    );

    if (sameClassConflicts.length > 0) {
      const conflict = sameClassConflicts[0];
      return NextResponse.json(
        {
          success: false,
          message: `Schedule conflict: This class already has a "${conflict.subject}" slot on ${day_of_week} from ${conflict.start_time} to ${conflict.end_time}.`,
        },
        { status: 409 },
      );
    }

    // Teacher Conflict Check
    if (teacherIdParsed) {
      const [teacherConflicts] = await pool.query<RowDataPacket[]>(
        `SELECT 
          t.id,
          t.day_of_week,
          t.start_time,
          t.end_time,
          c.name AS conflicting_class_name,
          tch.name AS teacher_name
         FROM timetable_schedules t
         JOIN classes c ON t.class_id = c.id
         JOIN teachers tch ON t.teacher_id = tch.id
         WHERE t.teacher_id = ?
           AND t.id != ?
           AND c.is_deleted = FALSE
           AND t.day_of_week = ?
           AND (c.start_date <= ? AND c.end_date >= ?)
           AND (? < t.end_time AND ? > t.start_time)`,
        [
          teacherIdParsed,
          slotId,
          day_of_week,
          targetClass.end_date,
          targetClass.start_date,
          start_time,
          end_time,
        ],
      );

      if (teacherConflicts.length > 0) {
        const conflict = teacherConflicts[0];
        return NextResponse.json(
          {
            success: false,
            message: `Teacher conflict: ${conflict.teacher_name} is already assigned to "${conflict.conflicting_class_name}" on ${conflict.day_of_week} from ${conflict.start_time} to ${conflict.end_time}.`,
          },
          { status: 409 },
        );
      }
    }

    await pool.query(
      `UPDATE timetable_schedules 
       SET teacher_id = ?, day_of_week = ?, start_time = ?, end_time = ?, subject = ?
       WHERE id = ? AND class_id = ?`,
      [
        teacherIdParsed,
        day_of_week,
        start_time,
        end_time,
        subject,
        slotId,
        classId,
      ],
    );

    return NextResponse.json(
      { success: true, message: "Timetable slot updated successfully." },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("PUT Class Timetable Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; slotId: string }> },
) {
  try {
    const resolvedParams = await params;
    const classId = parseInt(resolvedParams.id, 10);
    const slotId = parseInt(resolvedParams.slotId, 10);

    if (isNaN(classId) || isNaN(slotId)) {
      return NextResponse.json(
        { success: false, message: "Invalid Class ID or Slot ID" },
        { status: 400 },
      );
    }

    const [result] = await pool.query<ResultSetHeader>(
      `DELETE FROM timetable_schedules WHERE id = ? AND class_id = ?`,
      [slotId, classId],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Timetable slot not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Timetable slot deleted successfully." },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("DELETE Class Timetable Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 },
    );
  }
}
