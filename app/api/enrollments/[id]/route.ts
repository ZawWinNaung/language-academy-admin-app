import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { ResultSetHeader } from "mysql2";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const status = body.status || body.enrollment_status;

    if (!status) {
      return NextResponse.json(
        { success: false, message: "Missing enrollment status" },
        { status: 400 },
      );
    }

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE enrollments SET status = ? WHERE id = ?`,
      [status, id],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Enrollment record not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Enrollment status updated successfully",
    });
  } catch (error) {
    console.error("Update Enrollment API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update enrollment status" },
      { status: 500 },
    );
  }
}
