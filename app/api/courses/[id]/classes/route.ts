import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(
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

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    // Get total count of non-deleted classes for this course
    const [countRows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS total
       FROM classes
       WHERE course_id = ? AND (is_deleted = FALSE OR is_deleted IS NULL)`,
      [courseId],
    );
    const totalItems = countRows[0]?.total || 0;
    const totalPages = Math.ceil(totalItems / pageSize) || 1;

    // Fetch paginated classes
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, course_id, name, start_date, end_date
       FROM classes
       WHERE course_id = ? AND (is_deleted = FALSE OR is_deleted IS NULL)
       ORDER BY start_date DESC, id DESC
       LIMIT ? OFFSET ?`,
      [courseId, pageSize, offset],
    );

    return NextResponse.json(
      {
        success: true,
        data: rows,
        pagination: {
          currentPage: page,
          pageSize,
          totalItems,
          totalPages,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch classes for course.",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
