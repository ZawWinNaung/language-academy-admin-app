"use client";

import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { fetchDashboardUnpaidFees } from "@/services/dashboardService";
import { createPayment } from "@/services/paymentService";
import { UnpaidFeeStudent } from "@/types/dashboard";

export function useUnpaidFees() {
  const { mutate: globalMutate } = useSWRConfig();
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState<string>(
    String(currentDate.getFullYear()),
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    String(currentDate.getMonth() + 1).padStart(2, "0"),
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const limit = 10;

  const cacheKey = [
    "unpaid-fees",
    selectedYear,
    selectedMonth,
    currentPage,
    limit,
  ];

  const { data, error, isLoading, mutate } = useSWR(cacheKey, () =>
    fetchDashboardUnpaidFees({
      year: selectedYear,
      month: selectedMonth,
      page: currentPage,
      limit,
    }),
  );

  const recordPayment = async (student: UnpaidFeeStudent) => {
    setProcessingId(student.enrollment_id);
    try {
      const res = await createPayment({
        enrollment_id: student.enrollment_id,
        payment_month: student.unpaid_month,
        status: "Paid",
      });

      if (res.success) {
        mutate();
        globalMutate(
          (key) => Array.isArray(key) && key[0] === "class-payments",
          undefined,
          { revalidate: true },
        );
      } else {
        alert(res.message || "Failed to record payment.");
      }
    } catch (err) {
      console.error("Error recording payment:", err);
      alert("An unexpected error occurred.");
    } finally {
      setProcessingId(null);
    }
  };

  return {
    students: data?.data ?? [],
    pagination: data?.pagination ?? {
      totalItems: 0,
      totalPages: 1,
      currentPage: 1,
      itemsPerPage: limit,
    },
    selectedYear,
    setSelectedYear: (year: string) => {
      setSelectedYear(year);
      setCurrentPage(1);
    },
    selectedMonth,
    setSelectedMonth: (month: string) => {
      setSelectedMonth(month);
      setCurrentPage(1);
    },
    currentPage,
    setCurrentPage,
    loading: isLoading,
    isError: Boolean(error),
    recordPayment,
    processingId,
  };
}
