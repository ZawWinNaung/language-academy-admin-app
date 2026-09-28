import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await pool.query(`UPDATE classes SET is_deleted = 1 WHERE id = ?`, [id]);

    return NextResponse.json({
      success: true,
      message: "Class soft-deleted successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete class." },
      { status: 500 },
    );
  }
}
