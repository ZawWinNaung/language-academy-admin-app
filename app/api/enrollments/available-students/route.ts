import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const classId = searchParams.get("class_id");

    let query = `
      SELECT DISTINCT
        s.id, 
        s.name, 
        s.email, 
        s.phone
       FROM students s
       WHERE s.is_deleted = 0
    `;

    const params: any[] = [];

    if (classId) {
      query += `
        AND s.id NOT IN (
          SELECT student_id 
          FROM enrollments 
          WHERE class_id = ? AND status != 'Dropped'
        )
      `;
      params.push(classId);
    } else {
      query += `
        AND s.id NOT IN (
          SELECT e.student_id 
          FROM enrollments e
          JOIN classes c ON e.class_id = c.id
          WHERE e.status = 'Active' AND c.end_date >= CURDATE()
        )
      `;
    }

    query += ` ORDER BY s.name ASC`;

    const [students] = await pool.query<RowDataPacket[]>(query, params);

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
