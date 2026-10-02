import { ApiResponse } from "@/types/common";
import {
  ClassDetailResponse,
  EnrollmentStatus,
  ClassDetail,
  ClassFormData,
} from "@/types/class";
import { Course } from "@/types/course";

export async function fetchClasses(
  url: string,
): Promise<ApiResponse<ClassDetail[]>> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch classes");
  return res.json();
}

export async function fetchCourses(
  url: string,
): Promise<ApiResponse<Course[]>> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch courses");
  return res.json();
}

export async function createClass(data: ClassFormData): Promise<ApiResponse> {
  const res = await fetch("/api/classes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteClass(classId: number): Promise<ApiResponse> {
  const res = await fetch(`/api/classes/${classId}`, {
    method: "DELETE",
  });
  return res.json();
}

export async function fetchClassDetail(
  url: string,
): Promise<ClassDetailResponse> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch class detail");
  return res.json();
}

export async function updateClassDetail(
  classId: string | number,
  data: Partial<ClassDetail>,
): Promise<ApiResponse> {
  const res = await fetch(`/api/classes/${classId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateEnrollmentStatus(
  enrollmentId: number,
  status: EnrollmentStatus,
): Promise<ApiResponse> {
  const res = await fetch(`/api/enrollments/${enrollmentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, enrollment_status: status }),
  });
  return res.json();
}
