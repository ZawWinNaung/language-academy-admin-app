import {
  PaymentResponse,
  CreatePaymentPayload,
  PaymentFilterParams,
} from "@/types/payment";

export async function fetchPayments(
  params: PaymentFilterParams,
): Promise<PaymentResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.status) searchParams.set("status", params.status);
  if (params.payment_month)
    searchParams.set("payment_month", params.payment_month);
  if (params.enrollment_id)
    searchParams.set("enrollment_id", params.enrollment_id.toString());
  if (params.start_date) searchParams.set("start_date", params.start_date);
  if (params.end_date) searchParams.set("end_date", params.end_date);
  if (params.search) searchParams.set("search", params.search);

  const res = await fetch(`/api/payments?${searchParams.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch payments");
  return res.json();
}

export async function createPayment(payload: CreatePaymentPayload) {
  const res = await fetch("/api/payments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function updatePaymentStatus(
  id: number,
  status: "Paid" | "Refunded",
) {
  const res = await fetch("/api/payments", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status }),
  });
  return res.json();
}
