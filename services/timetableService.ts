import { TimetableResponse } from "@/types/timetable";

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
