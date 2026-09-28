import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { calculateClassStatus } from "@/lib/utils/classStatus";

export async function GET() {
  try {
    const [rows]: any = await pool.query(`
      SELECT 
        c.id,
        c.name AS class_name,
        c.start_date,
        c.end_date,
        co.code AS course_code,
        co.title AS course_title,
        COUNT(e.id) AS active_students
      FROM classes c
      LEFT JOIN courses co ON c.course_id = co.id
      LEFT JOIN enrollments e ON e.class_id = c.id
      WHERE c.is_deleted = 0 OR c.is_deleted IS NULL
      GROUP BY c.id, c.name, c.start_date, c.end_date, co.code, co.title
      ORDER BY c.start_date DESC
    `);

    const formattedClasses = rows.map((cls: any) => ({
      ...cls,
      start_date: cls.start_date
        ? new Date(cls.start_date).toISOString().split("T")[0]
        : "",
      end_date: cls.end_date
        ? new Date(cls.end_date).toISOString().split("T")[0]
        : "",
      status: calculateClassStatus(cls.start_date, cls.end_date),
      class_status: calculateClassStatus(cls.start_date, cls.end_date),
    }));

    return NextResponse.json({
      success: true,
      data: formattedClasses,
    });
  } catch (error) {
    console.error("Failed to fetch classes:", error);
    return NextResponse.json(
      { success: false, message: "Error loading classes" },
      { status: 500 },
    );
  }
}
