import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await pool.query(`UPDATE courses SET is_archived = 0 WHERE id = ?`, [id]);

    return NextResponse.json({
      success: true,
      message: "Course unarchived successfully.",
    });
  } catch (error) {
    console.error("PATCH Unarchive Course API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to unarchive course." },
      { status: 500 },
    );
  }
}
