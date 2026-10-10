import { ApiResponse, PaginatedApiResponse } from "@/types/common";
import { TimetableResponse } from "@/types/timetable";
import {
  TimetableEntry,
  AddTimetablePayload,
  UpdateTimetablePayload,
} from "@/types/timetable";

export async function fetchTimetable(
  page: number = 1,
  limit: number = 20,
  search: string = "",
  day: string = "",
): Promise<TimetableResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search,
  });

  if (day) {
    params.set("day", day);
  }

  const res = await fetch(`/api/timetable?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch timetable schedules");
  return res.json();
}

export async function fetchClassTimetable(
  classId: string | number,
): Promise<ApiResponse<TimetableEntry[]>> {
  const res = await fetch(`/api/classes/${classId}/timetable`);
  if (!res.ok) throw new Error("Failed to fetch class timetable schedule");
  return res.json();
}

export async function createClassTimetable(
  payload: AddTimetablePayload,
): Promise<ApiResponse<{ id: number }>> {
  try {
    const res = await fetch(`/api/classes/${payload.class_id}/timetable`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to reach server.",
    };
  }
}

export async function updateClassTimetable(
  payload: UpdateTimetablePayload,
): Promise<ApiResponse<{ id: number }>> {
  try {
    const res = await fetch(
      `/api/classes/${payload.class_id}/timetable/${payload.slot_id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    const data = await res.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to reach server.",
    };
  }
}

export async function deleteClassTimetable(
  classId: string | number,
  slotId: number,
): Promise<ApiResponse<{ id: number }>> {
  try {
    const res = await fetch(`/api/classes/${classId}/timetable/${slotId}`, {
      method: "DELETE",
    });

    const data = await res.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to reach server.",
    };
  }
}
