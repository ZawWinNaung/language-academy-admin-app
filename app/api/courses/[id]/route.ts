import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Course } from "@/types/course";

type CourseRow = Course & RowDataPacket;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const courseId = parseInt(id, 10);

    if (isNaN(courseId)) {
      return NextResponse.json(
        { success: false, message: "Invalid course ID." },
        { status: 400 },
      );
    }

    const [rows] = await pool.query<CourseRow[]>(
      `SELECT id, code, title, COALESCE(description, '') AS description, created_at, updated_at
       FROM courses
       WHERE id = ?`,
      [courseId],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Course not found." },
        { status: 444 },
      );
    }

    return NextResponse.json({ success: true, data: rows[0] }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch course details.",
        error: String(error),
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const courseId = parseInt(id, 10);

    if (isNaN(courseId)) {
      return NextResponse.json(
        { success: false, message: "Invalid course ID." },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { code, title, description } = body;

    if (!code?.trim() || !title?.trim()) {
      return NextResponse.json(
        { success: false, message: "Course code and title are required." },
        { status: 400 },
      );
    }

    const trimmedCode = code.trim();
    const trimmedTitle = title.trim();
    const trimmedDesc = description?.trim() ?? "";

    if (trimmedCode.length > 20 || trimmedTitle.length > 150) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Code must be 20 characters or fewer and title 150 characters or fewer.",
        },
        { status: 400 },
      );
    }

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE courses
       SET code = ?, title = ?, description = ?
       WHERE id = ?`,
      [trimmedCode, trimmedTitle, trimmedDesc, courseId],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Course not found or no changes made." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Course updated successfully.",
        data: {
          id: courseId,
          code: trimmedCode,
          title: trimmedTitle,
          description: trimmedDesc,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    if (error?.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { success: false, message: "A course with this code already exists." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update course.",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
