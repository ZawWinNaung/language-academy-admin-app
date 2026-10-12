import { ClassPaymentsResponse, UnpaidFeesResponse } from "@/types/dashboard";

export async function fetchDashboardClassPayments(
  month: string,
): Promise<ClassPaymentsResponse> {
  const res = await fetch(`/api/dashboard/class-payments?month=${month}`);
  if (!res.ok) throw new Error("Failed to fetch dashboard class payments");
  return res.json();
}

export async function fetchDashboardUnpaidFees(params: {
  year: string;
  month: string;
  page: number;
  limit: number;
}): Promise<UnpaidFeesResponse> {
  const queryParams = new URLSearchParams({
    year: params.year,
    month: params.month,
    page: String(params.page),
    limit: String(params.limit),
  });

  const res = await fetch(
    `/api/dashboard/unpaid-fees?${queryParams.toString()}`,
  );
  if (!res.ok) throw new Error("Failed to fetch unpaid fees overview");
  return res.json();
}
