import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyJWT } from "@/lib/auth";
import { RowDataPacket, ResultSetHeader } from "mysql2";

interface PaymentRow extends RowDataPacket {
  id: number;
  enrollment_id: number;
  amount: string;
  payment_month: string;
  paid_date: string;
  status: "Paid" | "Refunded";
  created_at: string;
  student_name?: string;
  class_name?: string;
  course_title?: string;
}

interface CountRow extends RowDataPacket {
  total: number;
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

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10", 10));
    const status = searchParams.get("status");
    const month = searchParams.get("payment_month");
    const enrollmentId = searchParams.get("enrollment_id");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const search = searchParams.get("search");

    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        p.id,
        p.enrollment_id,
        p.amount,
        p.payment_month,
        p.paid_date,
        p.status,
        p.created_at,
        s.name AS student_name,
        cl.name AS class_name,
        co.title AS course_title
      FROM payments p
      INNER JOIN enrollments e ON p.enrollment_id = e.id
      INNER JOIN students s ON e.student_id = s.id AND s.is_deleted = FALSE
      INNER JOIN classes cl ON e.class_id = cl.id
      INNER JOIN courses co ON cl.course_id = co.id
      WHERE 1=1
    `;

    let countQuery = `
      SELECT COUNT(*) as total 
      FROM payments p
      INNER JOIN enrollments e ON p.enrollment_id = e.id
      INNER JOIN students s ON e.student_id = s.id AND s.is_deleted = FALSE
      WHERE 1=1
    `;

    const queryParams: (string | number)[] = [];

    if (status) {
      query += ` AND p.status = ?`;
      countQuery += ` AND p.status = ?`;
      queryParams.push(status);
    }

    if (month) {
      query += ` AND p.payment_month = ?`;
      countQuery += ` AND p.payment_month = ?`;
      queryParams.push(month);
    }

    if (enrollmentId) {
      query += ` AND p.enrollment_id = ?`;
      countQuery += ` AND p.enrollment_id = ?`;
      queryParams.push(Number(enrollmentId));
    }

    if (startDate && endDate) {
      query += ` AND p.paid_date BETWEEN ? AND ?`;
      countQuery += ` AND p.paid_date BETWEEN ? AND ?`;
      queryParams.push(startDate, endDate);
    }

    if (search) {
      query += ` AND (s.name LIKE ? OR CAST(p.enrollment_id AS CHAR) LIKE ?)`;
      countQuery += ` AND (s.name LIKE ? OR CAST(p.enrollment_id AS CHAR) LIKE ?)`;
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm);
    }

    query += ` ORDER BY p.paid_date DESC LIMIT ? OFFSET ?`;

    const [rows] = await pool.query<PaymentRow[]>(query, [
      ...queryParams,
      limit,
      offset,
    ]);

    const [countRows] = await pool.query<CountRow[]>(countQuery, queryParams);
    const totalRecords = countRows[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: rows,
      pagination: {
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("GET Payments API Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error fetching payments" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("admin_session")?.value;
    if (!token || !(await verifyJWT(token))) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { enrollment_id, amount, payment_month, paid_date, status } = body;

    if (!enrollment_id || !amount || !payment_month) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    const query = `
      INSERT INTO payments (enrollment_id, amount, payment_month, paid_date, status)
      VALUES (?, ?, ?, COALESCE(?, NOW()), COALESCE(?, 'Paid'))
    `;

    const [result] = await pool.query<ResultSetHeader>(query, [
      enrollment_id,
      amount,
      payment_month,
      paid_date || null,
      status || "Paid",
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Payment recorded successfully",
        payment_id: result.insertId,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("POST Payment Error:", error);

    if (error?.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        {
          success: false,
          message:
            "A payment record for this enrollment and month already exists.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to record payment" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("admin_session")?.value;
    if (!token || !(await verifyJWT(token))) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !["Paid", "Refunded"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid payment ID or status value" },
        { status: 400 },
      );
    }

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE payments SET status = ? WHERE id = ?`,
      [status, id],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Payment record not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Payment status updated to ${status}`,
    });
  } catch (error) {
    console.error("PUT Payment Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update payment" },
      { status: 500 },
    );
  }
}
