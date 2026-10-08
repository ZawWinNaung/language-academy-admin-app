import { ApiResponse } from "@/types/common";

export interface Course {
  id: number;
  code: string;
  title: string;
  description: string;
  is_archived?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CourseClass {
  id: number;
  course_id: number;
  name: string;
  start_date: string;
  end_date: string;
}

export interface CourseFormData {
  code: string;
  title: string;
  description: string;
}

export interface CreateCourseInput {
  code: string;
  title: string;
  description?: string;
}

export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export type CourseListResponse = ApiResponse<Course[]> & {
  pagination?: PaginationInfo;
};

export interface CourseClassesPagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface UseCoursesArgs {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}
