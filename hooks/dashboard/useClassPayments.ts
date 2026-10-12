"use client";

import { useState } from "react";
import useSWR from "swr";
import { fetchDashboardClassPayments } from "@/services/dashboardService";

export function useClassPayments() {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7),
  );

  const cacheKey = ["class-payments", selectedMonth];
  const { data, error, isLoading, mutate } = useSWR(cacheKey, () =>
    fetchDashboardClassPayments(selectedMonth),
  );

  return {
    classesData: data?.data ?? [],
    completedUnpaidData: data?.completed_unpaid_data ?? [],
    selectedMonth,
    setSelectedMonth,
    loading: isLoading,
    isError: Boolean(error),
    refreshClassPayments: mutate,
  };
}
