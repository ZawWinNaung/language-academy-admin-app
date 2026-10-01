"use client";

import React from "react";
import OngoingClassPayments from "@/components/dashboard/OngoingClassPayments";
import UnpaidFeesOverview from "@/components/dashboard/UnpaidFeesOverview";
import DashboardMetricsGrid from "@/components/dashboard/DashboardMetricsGrid";
import { useDashboard } from "@/hooks/useDashboard";

export default function DashboardPage() {
  const { metrics, loading } = useDashboard();

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            School Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time monitoring for ongoing classes, student payments, and
            performance.
          </p>
        </div>
      </div>

      <DashboardMetricsGrid metrics={metrics} loading={loading} />

      <div className="space-y-6">
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
          <OngoingClassPayments />
        </div>
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
          <UnpaidFeesOverview />
        </div>
      </div>
    </div>
  );
}
