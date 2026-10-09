import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const courseId = parseInt(id, 10);

    if (isNaN(courseId)) {
      return NextResponse.json(
        { success: false, message: "Invalid course ID." },
        { status: 400 },
      );
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id FROM courses WHERE id = ?`,
      [courseId],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Course not found." },
        { status: 404 },
      );
    }

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE courses SET is_archived = TRUE WHERE id = ?`,
      [courseId],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Failed to archive course." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Course archived successfully.",
        data: { id: courseId, is_archived: true },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to archive course.",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
