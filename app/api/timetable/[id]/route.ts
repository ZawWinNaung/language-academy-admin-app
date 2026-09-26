import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const scheduleId = params.id;
    const { day_of_week, start_time, end_time, room_number } = await req.json();

    await pool.query(
      `UPDATE timetable_schedules 
       SET day_of_week = ?, start_time = ?, end_time = ?, room_number = ?
       WHERE id = ?`,
      [day_of_week, start_time, end_time, room_number, scheduleId],
    );

    return NextResponse.json({ success: true, message: "Schedule updated" });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update schedule",
        error: String(error),
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const scheduleId = params.id;
    await pool.query(`DELETE FROM timetable_schedules WHERE id = ?`, [
      scheduleId,
    ]);
    return NextResponse.json({ success: true, message: "Schedule deleted" });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete schedule",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
