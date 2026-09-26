import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const resolvedParams = await params;
    const scheduleId = resolvedParams.id;
    const { teacher_id } = await req.json();

    const targetTeacherId =
      teacher_id && Number(teacher_id) > 0 ? Number(teacher_id) : null;

    await pool.query(
      `UPDATE timetable_schedules 
       SET teacher_id = ? 
       WHERE id = ?`,
      [targetTeacherId, scheduleId],
    );

    return NextResponse.json({
      success: true,
      message: targetTeacherId ? "Schedule assigned" : "Schedule unassigned",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update schedule assignment",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
