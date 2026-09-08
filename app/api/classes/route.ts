import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export interface ClassDetail extends RowDataPacket {
  id: number;
  class_name: string;
  course_code: string;
  course_title: string;
  start_date: string;
  end_date: string;
  status: string;
  active_students: number;
}

export async function GET() {
  try {
    const [rows] = await pool.query<ClassDetail[]>(
      `SELECT 
        c.id, 
        c.name AS class_name, 
        co.code AS course_code, 
        co.title AS course_title, 
        DATE_FORMAT(c.start_date, '%Y-%m-%d') AS start_date, 
        DATE_FORMAT(c.end_date, '%Y-%m-%d') AS end_date, 
        c.status,
        COUNT(e.id) AS active_students
       FROM classes c
       JOIN courses co ON c.course_id = co.id
       LEFT JOIN enrollments e ON c.id = e.class_id AND e.status = 'Active'
       GROUP BY c.id
       ORDER BY c.start_date DESC`,
    );
    return NextResponse.json({ success: true, data: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch classes",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
