import { ClassPaymentsResponse, UnpaidFeesResponse } from "@/types/dashboard";

export async function fetchDashboardClassPayments(
  url: string,
): Promise<ClassPaymentsResponse> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch dashboard class payments");
  return res.json();
}

export async function fetchDashboardUnpaidFees(
  url: string,
): Promise<UnpaidFeesResponse> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch unpaid fees overview");
  return res.json();
}
