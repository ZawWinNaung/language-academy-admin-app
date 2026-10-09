import { ApiResponse } from "@/types/common";
import { Course, CreateCourseInput, CourseListResponse } from "@/types/course";

export async function fetchCourses(
  page: number = 1,
  limit: number = 20,
  search: string = "",
  status: string = "",
): Promise<CourseListResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search,
  });
  if (status !== "") {
    params.set("is_archived", status === "archived" ? "1" : "0");
  }

  const res = await fetch(`/api/courses?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch courses");
  const rawData = await res.json();
  return {
    ...rawData,
    data: (rawData.data || []).map((course: any) => ({
      ...course,
      is_archived: Boolean(course.is_archived),
    })),
  };
}

export async function fetchCourseById(
  id: string | number,
): Promise<ApiResponse<Course>> {
  const res = await fetch(`/api/courses/${id}`);
  return res.json();
}

export async function createCourse(
  course: CreateCourseInput,
): Promise<ApiResponse<Course>> {
  const res = await fetch("/api/courses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course),
  });

  const data = await res.json();
  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Failed to create course.",
    };
  }
  return data;
}

export async function updateCourse(
  id: string | number,
  course: CreateCourseInput,
): Promise<ApiResponse<Course>> {
  const res = await fetch(`/api/courses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course),
  });

  const data = await res.json();
  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Failed to update course.",
    };
  }
  return data;
}

export async function archiveCourse(
  id: string | number,
): Promise<ApiResponse<Course>> {
  const res = await fetch(`/api/courses/${id}/archive`, {
    method: "PATCH",
  });

  const data = await res.json();
  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Failed to archive course.",
    };
  }
  return data;
}

export async function unarchiveCourse(
  id: string | number,
): Promise<ApiResponse<Course>> {
  const res = await fetch(`/api/courses/${id}/unarchive`, {
    method: "PATCH",
  });

  const data = await res.json();
  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Failed to unarchive course.",
    };
  }
  return data;
}

export interface PaginatedClassesResponse {
  success: boolean;
  message?: string;
  data: Array<{
    id: number;
    course_id: number;
    name: string;
    start_date: string;
    end_date: string;
  }>;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export async function fetchCourseClasses(
  courseId: string | number,
  page: number = 1,
): Promise<PaginatedClassesResponse> {
  const res = await fetch(`/api/courses/${courseId}/classes?page=${page}`);
  if (!res.ok) throw new Error("Failed to fetch classes");
  return res.json();
}
