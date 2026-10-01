import { ApiResponse } from "@/types/common";
import { StudentProfile, StudentDetailsResponse } from "@/types/student";

export async function fetchStudentsList(
  url: string,
): Promise<ApiResponse<StudentProfile[]>> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch students list");
  return res.json();
}

export async function createStudent(
  data: Omit<StudentProfile, "id">,
): Promise<ApiResponse<{ id: number }>> {
  const res = await fetch("/api/students", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchStudentDetails(
  url: string,
): Promise<StudentDetailsResponse> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch student details");
  return res.json();
}

export async function updateStudentProfile(
  studentId: string,
  profile: StudentProfile,
): Promise<ApiResponse> {
  const res = await fetch(`/api/students/${studentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
  return res.json();
}

export async function enrollStudentInClass(
  studentId: string,
  classId: number,
): Promise<ApiResponse> {
  const res = await fetch(`/api/students/${studentId}/enroll`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ class_id: classId }),
  });
  return res.json();
}
