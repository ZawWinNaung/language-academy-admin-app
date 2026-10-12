"use client";

import useSWR from "swr";
import { fetchPayments } from "@/services/paymentService";

interface UsePaymentsParams {
  page: number;
  limit?: number;
  status?: string;
  payment_month?: string;
  search?: string;
  start_date?: string;
  end_date?: string;
}

export function usePayments(params: UsePaymentsParams) {
  const pageSize = params.limit ?? 20;

  const cacheKey = [
    "payments",
    params.page,
    pageSize,
    params.status,
    params.payment_month,
    params.search,
    params.start_date,
    params.end_date,
  ];

  const { data, error, isLoading, mutate } = useSWR(cacheKey, () =>
    fetchPayments({
      page: params.page,
      limit: pageSize,
      status: params.status || undefined,
      payment_month: params.payment_month || undefined,
      search: params.search || undefined,
      start_date: params.start_date || undefined,
      end_date: params.end_date || undefined,
    }),
  );

  const payments = data?.data ?? [];
  const pagination = data?.pagination ?? {
    currentPage: params.page,
    limit: pageSize,
    totalRecords: 0,
    totalPages: 1,
  };

  return {
    payments,
    pagination,
    loading: isLoading,
    isError: Boolean(error),
    refreshPayments: mutate,
  };
}
