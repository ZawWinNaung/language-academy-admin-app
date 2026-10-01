import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyJWT } from "@/lib/auth";
import { RowDataPacket } from "mysql2";
import { calculateClassStatus } from "@/lib/utils/classStatus";

interface StudentUnpaidRow extends RowDataPacket {
  student_id: number;
  student_name: string;
  student_email: string;
  student_phone: string;
  class_id: number;
  class_name: string;
  course_title: string;
  class_start_date: string;
  class_end_date: string;
  enrollment_id: number;
  enrolled_at: string;
  payment_id: number | null;
  payment_status: string | null;
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("admin_session")?.value;
    if (!token || !(await verifyJWT(token))) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const currentDate = new Date();

    const selectedYear =
      searchParams.get("year") || String(currentDate.getFullYear());
    const selectedMonthNum =
      searchParams.get("month") ||
      String(currentDate.getMonth() + 1).padStart(2, "0");
    const targetMonth = `${selectedYear}-${selectedMonthNum.padStart(2, "0")}`;

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const query = `
      SELECT 
        s.id AS student_id,
        s.name AS student_name,
        s.email AS student_email,
        s.phone AS student_phone,
        cl.id AS class_id,
        cl.name AS class_name,
        cl.start_date AS class_start_date,
        cl.end_date AS class_end_date,
        co.title AS course_title,
        e.id AS enrollment_id,
        e.enrolled_at,
        p.id AS payment_id,
        p.status AS payment_status
      FROM enrollments e
      INNER JOIN students s ON e.student_id = s.id AND (s.is_deleted = 0 OR s.is_deleted IS NULL)
      INNER JOIN classes cl ON e.class_id = cl.id AND (cl.is_deleted = 0 OR cl.is_deleted IS NULL)
      INNER JOIN courses co ON cl.course_id = co.id
      LEFT JOIN payments p ON p.enrollment_id = e.id AND p.payment_month = ? AND p.status = 'Paid'
      WHERE 
        DATE_FORMAT(e.enrolled_at, '%Y-%m') <= ?
        AND DATE_FORMAT(cl.start_date, '%Y-%m') <= ?
        AND DATE_FORMAT(cl.end_date, '%Y-%m') >= ?
        AND (p.id IS NULL OR p.status != 'Paid')
      ORDER BY s.name ASC, cl.name ASC;
    `;

    const [rows] = await pool.query<StudentUnpaidRow[]>(query, [
      targetMonth,
      targetMonth,
      targetMonth,
      targetMonth,
    ]);

    const formattedData = rows.map((row) => ({
      student_id: row.student_id,
      student_name: row.student_name,
      student_email: row.student_email,
      student_phone: row.student_phone,
      class_id: row.class_id,
      class_name: row.class_name,
      course_title: row.course_title,
      class_status: calculateClassStatus(
        row.class_start_date,
        row.class_end_date,
      ),
      unpaid_month: targetMonth,
    }));

    const totalItems = formattedData.length;
    const totalPages = Math.ceil(totalItems / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedData = formattedData.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      selected_period: targetMonth,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
      data: paginatedData,
    });
  } catch (error) {
    console.error("Unpaid Fees Filter API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch unpaid fees list" },
      { status: 500 },
    );
  }
}
