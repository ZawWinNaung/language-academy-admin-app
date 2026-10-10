import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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

    // CHECK 1: Same Class Time Overlap Check
    // Prevents this exact class from having multiple overlapping slots on the same day
    const [sameClassConflicts] = await pool.query<RowDataPacket[]>(
      `SELECT id, subject, start_time, end_time 
       FROM timetable_schedules 
       WHERE class_id = ? 
         AND day_of_week = ? 
         AND (? < end_time AND ? > start_time)`,
      [classId, day_of_week, start_time, end_time],
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

    //CHECK 2: Teacher Conflict Check across overlapping class date ranges & time slots
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
           AND c.is_deleted = FALSE
           AND t.day_of_week = ?
           -- Overlapping Class Date Ranges
           AND (c.start_date <= ? AND c.end_date >= ?)
           -- Overlapping Schedule Time Window
           AND (? < t.end_time AND ? > t.start_time)`,
        [
          teacherIdParsed,
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

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO timetable_schedules (class_id, teacher_id, day_of_week, start_time, end_time, subject)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [classId, teacherIdParsed, day_of_week, start_time, end_time, subject],
    );

    return NextResponse.json(
      {
        success: true,
        message: "Timetable slot added successfully.",
        data: { id: result.insertId },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("POST Class Timetable Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 },
    );
  }
}
