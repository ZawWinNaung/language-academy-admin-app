import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { ResultSetHeader } from "mysql2";
import { AdminRow } from "@/types/admin";

export async function GET(request: NextRequest) {
  try {
    const adminId = request.headers.get("x-admin-id");
    if (!adminId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const [rows] = await pool.query<AdminRow[]>(
      "SELECT id, name, email, phone FROM admins WHERE id = ?",
      [adminId],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const admin = rows[0];

    return NextResponse.json(
      {
        success: true,
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          phone: admin.phone || "",
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch user session",
        error: String(error),
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const adminId = request.headers.get("x-admin-id");
    if (!adminId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { name, phone } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, message: "Name is required." },
        { status: 400 },
      );
    }

    await pool.query<ResultSetHeader>(
      "UPDATE admins SET name = ?, phone = ? WHERE id = ?",
      [name.trim(), phone?.trim() || null, adminId],
    );

    return NextResponse.json(
      { success: true, message: "Profile updated successfully." },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
