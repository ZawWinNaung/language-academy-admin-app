import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const [classRows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        c.id,
        c.name,
        c.course_id,
        DATE_FORMAT(c.start_date, '%Y-%m-%d') AS start_date,
        DATE_FORMAT(c.end_date, '%Y-%m-%d') AS end_date,
        co.title AS course_title,
        co.code AS course_code,
        CASE 
          WHEN CURDATE() < c.start_date THEN 'Upcoming'
          WHEN CURDATE() BETWEEN c.start_date AND c.end_date THEN 'Ongoing'
          ELSE 'Completed'
        END AS class_status
      FROM classes c
      JOIN courses co ON c.course_id = co.id
      WHERE c.id = ? AND c.is_deleted = 0`,
      [id],
    );

    if (classRows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Class not found" },
        { status: 404 },
      );
    }

    const classDetail = classRows[0];

    const [studentRows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        e.id AS enrollment_id,
        s.id AS student_id,
        s.name,
        s.email,
        s.phone,
        DATE_FORMAT(e.enrolled_at, '%Y-%m-%d') AS enrolled_date,
        e.status AS enrollment_status
      FROM enrollments e
      JOIN students s ON e.student_id = s.id
      WHERE e.class_id = ? AND s.is_deleted = 0
      ORDER BY e.enrolled_at DESC`,
      [id],
    );

    classDetail.students = studentRows;

    return NextResponse.json({
      success: true,
      data: { class_detail: classDetail },
    });
  } catch (error) {
    console.error("GET Class Detail API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch class details" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, course_id, start_date, end_date } = body;

    await pool.query(
      `UPDATE classes 
       SET name = ?, course_id = ?, start_date = ?, end_date = ? 
       WHERE id = ? AND is_deleted = 0`,
      [name, course_id, start_date, end_date, id],
    );

    return NextResponse.json({
      success: true,
      message: "Class details updated successfully",
    });
  } catch (error) {
    console.error("PUT Class Detail API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update class details" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await pool.query(`UPDATE classes SET is_deleted = 1 WHERE id = ?`, [id]);

    return NextResponse.json({
      success: true,
      message: "Class soft-deleted successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete class." },
      { status: 500 },
    );
  }
}
