import { NextResponse, NextRequest } from "next/server";
import pool from "@/lib/db";
import { ResultSetHeader } from "mysql2";
import { calculateClassStatus } from "@/lib/utils/classStatus";

// GET api/students/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const studentId = parseInt(id, 10);

    if (isNaN(studentId)) {
      return NextResponse.json(
        { success: false, message: "Invalid student ID" },
        { status: 400 },
      );
    }

    //Fetch Student Profile
    const [studentRows]: any = await pool.query(
      `SELECT id, name, email, phone, DATE_FORMAT(joined_date, '%Y-%m-%d') AS joined_date 
       FROM students 
       WHERE id = ? AND (is_deleted = 0 OR is_deleted IS NULL OR is_deleted = FALSE)`,
      [studentId],
    );

    if (!studentRows || studentRows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 },
      );
    }

    //Fetch Enrollments
    const [enrollmentRows]: any = await pool.query(
      `SELECT 
        e.id AS enrollment_id,
        e.class_id,
        c.name AS class_name,
        co.title AS course_title,
        c.start_date,
        c.end_date,
        e.status AS raw_enrollment_status,
        DATE_FORMAT(e.enrolled_at, '%Y-%m-%d') AS enrolled_date
       FROM enrollments e
       JOIN classes c ON e.class_id = c.id
       JOIN courses co ON c.course_id = co.id
       WHERE e.student_id = ? AND (c.is_deleted = 0 OR c.is_deleted IS NULL OR c.is_deleted = FALSE)
       ORDER BY e.enrolled_at DESC`,
      [studentId],
    );

    const enrolledClasses = (enrollmentRows || []).map((row: any) => {
      const computedClassStatus = calculateClassStatus(
        row.start_date,
        row.end_date,
      );

      return {
        enrollment_id: row.enrollment_id,
        class_id: row.class_id,
        class_name: row.class_name,
        course_title: row.course_title,
        start_date: row.start_date,
        end_date: row.end_date,
        class_status: computedClassStatus,
        enrollment_status: row.raw_enrollment_status,
        enrolled_date: row.enrolled_date,
      };
    });

    //Fetch Available Classes for New Enrollment (EXCLUDING already joined classes)
    const [availableRows]: any = await pool.query(
      `SELECT 
        c.id, 
        c.name, 
        c.start_date, 
        c.end_date, 
        co.title AS course_title 
       FROM classes c
       JOIN courses co ON c.course_id = co.id
       WHERE (c.is_deleted = 0 OR c.is_deleted IS NULL OR c.is_deleted = FALSE)
         AND c.id NOT IN (
           SELECT class_id FROM enrollments WHERE student_id = ?
         )
       ORDER BY c.start_date ASC`,
      [studentId],
    );

    const availableClasses = (availableRows || [])
      .map((cls: any) => ({
        id: cls.id,
        name: cls.name,
        course_title: cls.course_title,
        class_status: calculateClassStatus(cls.start_date, cls.end_date),
      }))
      .filter((cls: any) => cls.class_status !== "Completed");

    return NextResponse.json({
      success: true,
      data: {
        student: studentRows[0],
        enrolled_classes: enrolledClasses,
        available_classes: availableClasses,
      },
    });
  } catch (error) {
    console.error("Error fetching student profile:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: String(error) },
      { status: 500 },
    );
  }
}

// PUT api/students/[id]
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, email, phone, joined_date } = body;

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE students 
       SET name = ?, email = ?, phone = ?, joined_date = ? 
       WHERE id = ? AND (is_deleted = 0 OR is_deleted IS NULL OR is_deleted = FALSE)`,
      [name, email, phone, joined_date, id],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Student not found or no changes made" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Student profile updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating student profile:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update profile" },
      { status: 500 },
    );
  }
}
