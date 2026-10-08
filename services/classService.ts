import { ApiResponse } from "@/types/common";
import {
  ClassDetailResponse,
  EnrollmentStatus,
  ClassDetail,
  ClassFormData,
} from "@/types/class";

export interface PaginatedApiResponse<T> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface FetchClassesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export async function fetchClasses(
  params?: FetchClassesParams,
): Promise<PaginatedApiResponse<ClassDetail[]>> {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.search) searchParams.set("search", params.search);
  if (params?.status) searchParams.set("status", params.status);

  const queryString = searchParams.toString();
  const url = `/api/classes${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch classes");
  return res.json();
}

export async function createClass(
  formData: ClassFormData,
): Promise<ApiResponse<ClassDetail>> {
  const res = await fetch("/api/classes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
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
  classId: string | number,
): Promise<ClassDetailResponse> {
  const res = await fetch(`/api/classes/${classId}`);
  if (!res.ok) throw new Error("Failed to fetch class detail");
  return res.json();
}

export async function updateClassDetail(
  classId: string | number,
  data: Partial<ClassDetail>,
): Promise<{ success: boolean; message?: string }> {
  const res = await fetch(`/api/classes/${classId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: responseData.message || "Failed to update class details.",
    };
  }

  return responseData;
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

export async function fetchAvailableStudents(): Promise<ApiResponse> {
  const res = await fetch("/api/enrollments/available-students");
  if (!res.ok) throw new Error("Failed to fetch available students");
  return res.json();
}

export async function bulkEnrollStudents(
  classId: number,
  studentIds: number[],
): Promise<ApiResponse> {
  const res = await fetch("/api/enrollments/bulk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ class_id: classId, student_ids: studentIds }),
  });
  return res.json();
}
