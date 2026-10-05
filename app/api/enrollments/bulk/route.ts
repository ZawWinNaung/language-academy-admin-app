import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { class_id, student_ids } = body;

    if (!class_id || !Array.isArray(student_ids) || student_ids.length === 0) {
      return NextResponse.json(
        { success: false, message: "Missing class_id or student_ids list." },
        { status: 400 },
      );
    }

    const values = student_ids.map((studentId: number) => [
      studentId,
      class_id,
      "Active",
    ]);

    await pool.query(
      `INSERT INTO enrollments (student_id, class_id, status) 
       VALUES ? 
       ON DUPLICATE KEY UPDATE status = 'Active', status_updated_date = CURRENT_TIMESTAMP`,
      [values],
    );

    return NextResponse.json({
      success: true,
      message: `${student_ids.length} student(s) enrolled successfully.`,
    });
  } catch (error) {
    console.error("POST Bulk Enroll Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to enroll students." },
      { status: 500 },
    );
  }
}
