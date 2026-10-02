import { ApiResponse } from "@/types/common";

export interface Course {
  id: number;
  code: string;
  title: string;
  description: string;
}

export type CourseListResponse = ApiResponse<Course[]>;
