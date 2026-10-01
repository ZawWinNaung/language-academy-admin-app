import { ApiResponse } from "@/types/common";

export interface StudentPaymentStatus {
  student_id: number;
  student_name: string;
  enrollment_id: number;
  payment_id: number | null;
  amount: string | null;
  paid_date: string | null;
  status: "Paid" | "Refunded" | "Unpaid";
}

export interface ClassPaymentGroup {
  class_id: number;
  class_name: string;
  course_title: string;
  start_date: string;
  end_date: string;
  class_status: "Upcoming" | "Ongoing" | "Completed";
  stats: {
    paid: number;
    unpaid: number;
    refunded: number;
    total: number;
  };
  students: StudentPaymentStatus[];
}

export interface ClassPaymentsResponseData {
  selected_month: string;
  data: ClassPaymentGroup[];
  completed_unpaid_data: ClassPaymentGroup[];
}

export type ClassPaymentsResponse = ApiResponse<ClassPaymentGroup[]> & {
  selected_month?: string;
  completed_unpaid_data?: ClassPaymentGroup[];
};

export interface UnpaidFeeStudent {
  student_id: number;
  student_name: string;
  student_email: string;
  student_phone: string;
  class_id: number;
  class_name: string;
  course_title: string;
  class_status: "Upcoming" | "Ongoing" | "Completed";
  unpaid_month: string;
}

export interface UnpaidFeesPagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export type UnpaidFeesResponse = ApiResponse<UnpaidFeeStudent[]> & {
  selected_period?: string;
  pagination?: UnpaidFeesPagination;
};

export interface DashboardSummaryMetrics {
  activeStudents: number;
  ongoingClasses: number;
  monthlyRevenue: number;
  unpaidCount: number;
  completedUnpaidCount: number;
}
