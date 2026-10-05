import { ApiResponse } from "@/types/common";

export type EnrollmentStatus = "Active" | "Dropped" | "Promoted" | "Completed";
export type ClassStatus = "Upcoming" | "Ongoing" | "Completed";

export interface ClassEnrolledStudent {
  enrollment_id: number;
  student_id: number;
  name: string;
  email: string;
  phone: string;
  enrolled_date: string;
  enrollment_status: EnrollmentStatus;
}

export interface ClassDetail {
  id: number;
  class_name?: string;
  name?: string;
  course_id: number;
  course_title: string;
  course_code: string;
  teacher_id?: number;
  teacher_name?: string;
  start_date: string;
  end_date: string;
  class_status?: ClassStatus;
  active_students?: number;
  students?: ClassEnrolledStudent[];
}

export interface ClassFormData {
  name: string;
  course_id: string;
  start_date: string;
  end_date: string;
}

export interface ClassDetailResponseData {
  class_detail: ClassDetail;
}

export type ClassListResponse = ApiResponse<ClassDetail[]>;
export type ClassDetailResponse = ApiResponse<ClassDetailResponseData>;
