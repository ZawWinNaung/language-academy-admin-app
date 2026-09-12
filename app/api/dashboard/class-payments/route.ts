import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyJWT } from "@/lib/auth";
import { RowDataPacket } from "mysql2";

interface ClassPaymentRow extends RowDataPacket {
  class_id: number;
  class_name: string;
  course_title: string;
  student_id: number;
  student_name: string;
  enrollment_id: number;
  payment_id: number | null;
  amount: string | null;
  paid_date: string | null;
  status: "Paid" | "Refunded" | "Unpaid";
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
    const currentMonth = new Date().toISOString().slice(0, 7);
    const month = searchParams.get("month") || currentMonth;

    const query = `
      SELECT 
        cl.id AS class_id,
        cl.name AS class_name,
        co.title AS course_title,
        s.id AS student_id,
        s.name AS student_name,
        e.id AS enrollment_id,
        p.id AS payment_id,
        p.amount,
        p.paid_date,
        COALESCE(p.status, 'Unpaid') AS status
      FROM classes cl
      INNER JOIN courses co ON cl.course_id = co.id
      INNER JOIN enrollments e ON e.class_id = cl.id AND e.status = 'Active'
      INNER JOIN students s ON e.student_id = s.id AND s.is_deleted = FALSE
      LEFT JOIN payments p ON p.enrollment_id = e.id AND p.payment_month = ?
      WHERE cl.status = 'Ongoing'
      ORDER BY cl.name ASC, s.name ASC;
    `;

    const [rows] = await pool.query<ClassPaymentRow[]>(query, [month]);

    const classMap: Record<number, any> = {};

    rows.forEach((row) => {
      if (!classMap[row.class_id]) {
        classMap[row.class_id] = {
          class_id: row.class_id,
          class_name: row.class_name,
          course_title: row.course_title,
          stats: { paid: 0, unpaid: 0, refunded: 0, total: 0 },
          students: [],
        };
      }

      const statusKey = row.status.toLowerCase() as
        | "paid"
        | "unpaid"
        | "refunded";
      classMap[row.class_id].stats[statusKey] += 1;
      classMap[row.class_id].stats.total += 1;

      classMap[row.class_id].students.push({
        student_id: row.student_id,
        student_name: row.student_name,
        enrollment_id: row.enrollment_id,
        payment_id: row.payment_id,
        amount: row.amount,
        paid_date: row.paid_date,
        status: row.status,
      });
    });

    return NextResponse.json({
      success: true,
      selected_month: month,
      data: Object.values(classMap),
    });
  } catch (error) {
    console.error("Dashboard Class Payments API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load dashboard payment data" },
      { status: 500 },
    );
  }
}
