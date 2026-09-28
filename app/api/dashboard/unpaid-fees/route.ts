import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyJWT } from "@/lib/auth";
import { RowDataPacket } from "mysql2";
import { calculateClassStatus } from "@/lib/utils/classStatus";

interface UnpaidRecordRow extends RowDataPacket {
  student_id: number;
  student_name: string;
  student_email: string;
  class_id: number;
  class_name: string;
  course_title: string;
  class_start_date: string;
  class_end_date: string;
  enrollment_id: number;
  enrolled_at: string;
  payment_id: number | null;
  payment_month: string | null;
  payment_status: string | null;
}

// Helper to generate YYYY-MM array between two dates
function generateMonthRange(
  startDateStr: string,
  endDateStr: string,
): string[] {
  const months: string[] = [];
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  let current = new Date(start.getFullYear(), start.getMonth(), 1);
  const last = new Date(end.getFullYear(), end.getMonth(), 1);

  while (current <= last) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, "0");
    months.push(`${year}-${month}`);
    current.setMonth(current.getMonth() + 1);
  }

  return months;
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

    const currentMonthStr = new Date().toISOString().slice(0, 7);

    // Query active & finished enrollments along with all recorded payments
    const query = `
      SELECT 
        s.id AS student_id,
        s.name AS student_name,
        s.email AS student_email,
        cl.id AS class_id,
        cl.name AS class_name,
        cl.start_date AS class_start_date,
        cl.end_date AS class_end_date,
        co.title AS course_title,
        e.id AS enrollment_id,
        e.enrolled_at,
        p.id AS payment_id,
        p.payment_month,
        p.status AS payment_status
      FROM enrollments e
      INNER JOIN students s ON e.student_id = s.id AND (s.is_deleted = 0 OR s.is_deleted IS NULL OR s.is_deleted = FALSE)
      INNER JOIN classes cl ON e.class_id = cl.id AND (cl.is_deleted = 0 OR cl.is_deleted IS NULL OR cl.is_deleted = FALSE)
      INNER JOIN courses co ON cl.course_id = co.id
      LEFT JOIN payments p ON p.enrollment_id = e.id AND p.status = 'Paid'
      ORDER BY s.name ASC, cl.name ASC;
    `;

    const [rows] = await pool.query<UnpaidRecordRow[]>(query);

    // Group rows by enrollment
    const enrollmentMap: Record<number, any> = {};

    rows.forEach((row) => {
      if (!enrollmentMap[row.enrollment_id]) {
        enrollmentMap[row.enrollment_id] = {
          student_id: row.student_id,
          student_name: row.student_name,
          student_email: row.student_email,
          class_id: row.class_id,
          class_name: row.class_name,
          course_title: row.course_title,
          class_status: calculateClassStatus(
            row.class_start_date,
            row.class_end_date,
          ),
          class_start_date: row.class_start_date,
          class_end_date: row.class_end_date,
          enrolled_at: row.enrolled_at,
          paid_months: new Set<string>(),
        };
      }

      if (row.payment_month && row.payment_status === "Paid") {
        enrollmentMap[row.enrollment_id].paid_months.add(row.payment_month);
      }
    });

    const unpaidSummaries: any[] = [];
    let totalUnpaidMonthsCount = 0;

    Object.values(enrollmentMap).forEach((item) => {
      // Determine applicable month range (from enrollment/start date up to min(class end date, current month))
      const startDate = item.enrolled_at || item.class_start_date;
      const classEndDate = item.class_end_date;

      const effectiveEndDate =
        item.class_status === "Completed" && classEndDate < currentMonthStr
          ? classEndDate
          : currentMonthStr;

      if (!startDate) return;

      const expectedMonths = generateMonthRange(startDate, effectiveEndDate);

      // Find skipped/missing months
      const skippedMonths = expectedMonths.filter(
        (m) => !item.paid_months.has(m),
      );

      if (skippedMonths.length > 0) {
        totalUnpaidMonthsCount += skippedMonths.length;
        unpaidSummaries.push({
          student_id: item.student_id,
          student_name: item.student_name,
          student_email: item.student_email,
          class_id: item.class_id,
          class_name: item.class_name,
          course_title: item.course_title,
          class_status: item.class_status,
          unpaid_count: skippedMonths.length,
          skipped_months: skippedMonths, // e.g., ["2026-01", "2026-03"]
        });
      }
    });

    return NextResponse.json({
      success: true,
      total_unpaid_months: totalUnpaidMonthsCount,
      data: unpaidSummaries,
    });
  } catch (error) {
    console.error("Unpaid Fees API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load unpaid fees details" },
      { status: 500 },
    );
  }
}
