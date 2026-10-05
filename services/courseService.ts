import { ApiResponse } from "@/types/common";
import { Course } from "@/types/course";

export async function fetchCourses(): Promise<ApiResponse<Course[]>> {
  const res = await fetch("/api/courses");
  if (!res.ok) throw new Error("Failed to fetch courses");
  return res.json();
}
