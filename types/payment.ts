export interface Payment {
  id: number;
  enrollment_id: number;
  amount: string;
  payment_month: string;
  paid_date: string;
  status: "Paid" | "Refunded";
  created_at: string;
  student_name?: string;
  class_name?: string;
  course_title?: string;
}

export interface PaymentPagination {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface PaymentResponse {
  success: boolean;
  data: Payment[];
  pagination: PaymentPagination;
  message?: string;
}

export interface CreatePaymentPayload {
  enrollment_id: number | string;
  payment_month: string;
  paid_date?: string;
  status?: "Paid" | "Refunded";
}

export interface PaymentFilterParams {
  page?: number;
  limit?: number;
  status?: string;
  payment_month?: string;
  enrollment_id?: string | number;
  start_date?: string;
  end_date?: string;
  search?: string;
}

export interface PaymentItem {
  id: number;
  enrollment_id: number;
  amount: string;
  payment_month: string;
  paid_date: string;
  status: "Paid" | "Refunded";
  student_name?: string;
  course_title?: string;
  class_name?: string;
}
