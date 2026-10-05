import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [students] = await pool.query<RowDataPacket[]>(
      `SELECT 
        s.id, 
        s.name, 
        s.email, 
        s.phone
       FROM students s
       WHERE s.is_deleted = 0
         AND s.id NOT IN (
           SELECT student_id 
           FROM enrollments 
           WHERE status = 'Active'
         )
       ORDER BY s.name ASC`,
    );

    return NextResponse.json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("GET Available Students API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch available students" },
      { status: 500 },
    );
  }
}
