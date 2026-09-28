import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const studentId = parseInt(id, 10);
    const { class_id } = await req.json();

    if (!class_id) {
      return NextResponse.json(
        { success: false, message: "Class ID is required." },
        { status: 400 },
      );
    }

    // Check if the student already has an Active enrollment
    const [activeEnrollments]: any = await pool.query(
      `SELECT id FROM enrollments WHERE student_id = ? AND (status = 'Active' OR status = 'enrolled')`,
      [studentId],
    );

    if (activeEnrollments && activeEnrollments.length > 0) {
      // Update only the class_id of the active enrollment
      await pool.query(
        `UPDATE enrollments SET class_id = ?, status_updated_date = NOW() WHERE id = ?`,
        [class_id, activeEnrollments[0].id],
      );
    } else {
      // Create new active enrollment
      await pool.query(
        `INSERT INTO enrollments (student_id, class_id, status, enrolled_at) VALUES (?, ?, 'Active', NOW())`,
        [studentId, class_id],
      );
    }

    return NextResponse.json({
      success: true,
      message: "Enrollment updated successfully.",
    });
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process enrollment.",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
