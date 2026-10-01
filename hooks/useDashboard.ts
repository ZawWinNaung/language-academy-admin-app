"use client";

import useSWR from "swr";
import { fetchDashboardClassPayments } from "@/services/dashboardService";
import { DashboardSummaryMetrics } from "@/types/dashboard";

export function useDashboard(selectedMonth?: string) {
  const monthParam = selectedMonth || new Date().toISOString().slice(0, 7);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/dashboard/class-payments?month=${monthParam}`,
    fetchDashboardClassPayments,
  );

  // Compute metrics from fetched data
  const metrics: DashboardSummaryMetrics = {
    activeStudents: 0,
    ongoingClasses: 0,
    monthlyRevenue: 0,
    unpaidCount: 0,
    completedUnpaidCount: 0,
  };

  if (data?.success && data.data) {
    const studentsSet = new Set<number>();
    let revenue = 0;
    let unpaid = 0;
    let completedUnpaid = 0;

    // Ongoing classes metrics calculation
    data.data.forEach((cls) => {
      unpaid += cls.stats.unpaid;
      cls.students.forEach((s) => {
        studentsSet.add(s.student_id);
        if (s.status === "Paid" && s.amount) {
          revenue += parseFloat(s.amount);
        }
      });
    });

    // Completed classes with unpaid records calculation
    (data.completed_unpaid_data || []).forEach((cls) => {
      completedUnpaid += cls.stats.unpaid;
    });

    metrics.activeStudents = studentsSet.size;
    metrics.ongoingClasses = data.data.length;
    metrics.monthlyRevenue = revenue;
    metrics.unpaidCount = unpaid;
    metrics.completedUnpaidCount = completedUnpaid;
  }

  return {
    metrics,
    loading: isLoading,
    isError: Boolean(error),
    refreshDashboard: mutate,
  };
}
