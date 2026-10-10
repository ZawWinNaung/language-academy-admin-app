export interface TimetableEntry {
  id: number;
  class_id: number;
  teacher_id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  subject: string;
  created_at?: string;
  class_name?: string;
  teacher_name?: string;
}

export interface TimetableResponse {
  success: boolean;
  data: TimetableEntry[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface AddTimetablePayload {
  class_id: number;
  teacher_id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  subject: string;
}

export interface UpdateTimetablePayload extends AddTimetablePayload {
  slot_id: number;
}

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
