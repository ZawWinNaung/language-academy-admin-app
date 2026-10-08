"use client";

import React from "react";
import OngoingClassPayments from "@/components/dashboard/OngoingClassPayments";
import UnpaidFeesOverview from "@/components/dashboard/UnpaidFeesOverview";
import DashboardMetricsGrid from "@/components/dashboard/DashboardMetricsGrid";
import HeaderBar from "@/components/ui/HeaderBar";
import { useDashboard } from "@/hooks/useDashboard";

export default function DashboardPage() {
  const { metrics, loading } = useDashboard();

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      <HeaderBar
        title="School Overview"
        description="Real-time monitoring for ongoing classes, student payments, and performance."
      />

      <DashboardMetricsGrid metrics={metrics} loading={loading} />

      <div className="space-y-6">
        <div className="glass-card rounded-2xl p-6">
          <OngoingClassPayments />
        </div>
        <div className="glass-card rounded-2xl p-6">
          <UnpaidFeesOverview />
        </div>
      </div>
    </div>
  );
}
