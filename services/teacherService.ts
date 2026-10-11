import { ApiResponse, PaginatedApiResponse } from "@/types/common";
import { Teacher } from "@/types/teacher";

export async function fetchTeachers(
  search = "",
  page = 1,
  limit = 15,
): Promise<PaginatedApiResponse<Teacher[]>> {
  const searchParams = new URLSearchParams();
  if (search) searchParams.set("search", search);
  searchParams.set("page", String(page));
  searchParams.set("limit", String(limit));

  const res = await fetch(`/api/teachers?${searchParams.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch teachers");
  return res.json();
}

export async function fetchTeacherDetail(
  teacherId: string | number,
  page = 1,
  limit = 10,
) {
  const res = await fetch(
    `/api/teachers/${teacherId}?page=${page}&limit=${limit}`,
  );
  if (!res.ok) throw new Error("Failed to fetch teacher details");
  return res.json();
}

export async function updateTeacherDetail(
  teacherId: string | number,
  data: any,
): Promise<ApiResponse> {
  const res = await fetch(`/api/teachers/${teacherId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function unassignScheduleSlot(
  scheduleId: number,
): Promise<ApiResponse> {
  const res = await fetch(`/api/timetable/${scheduleId}/assign`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ teacher_id: null }),
  });
  return res.json();
}

export async function fetchTeacherSchedules(
  teacherId: string | number,
  page = 1,
  limit = 10,
) {
  const res = await fetch(
    `/api/teachers/${teacherId}/schedules?page=${page}&limit=${limit}`,
  );
  if (!res.ok) throw new Error("Failed to fetch teacher schedules");
  return res.json();
}
