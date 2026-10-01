import { ApiResponse } from "@/types/common";

export interface StudentProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  joined_date: string;
}

export interface EnrollmentRecord {
  enrollment_id: number;
  class_id: number;
  class_name: string;
  course_title: string;
  start_date?: string;
  end_date?: string;
  class_status: "Upcoming" | "Ongoing" | "Completed";
  enrollment_status: string;
  enrolled_date: string;
}

export interface AvailableClass {
  id: number;
  name: string;
  course_title: string;
}

export interface StudentDetailsData {
  student: StudentProfile;
  enrolled_classes: EnrollmentRecord[];
  available_classes: AvailableClass[];
}

export type StudentDetailsResponse = ApiResponse<StudentDetailsData>;
