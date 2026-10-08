"use client";

import React from "react";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaDollarSign,
  FaExclamationTriangle,
} from "react-icons/fa";
import { DashboardSummaryMetrics } from "@/types/dashboard";

interface DashboardMetricsGridProps {
  metrics: DashboardSummaryMetrics;
  loading: boolean;
}

export default function DashboardMetricsGrid({
  metrics,
  loading,
}: DashboardMetricsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-surface border border-border-main p-5 rounded-2xl flex items-center gap-4 shadow-xs">
        <div className="w-12 h-12 rounded-xl bg-brand-primary-light border border-brand-primary/20 flex items-center justify-center text-brand-primary text-xl shrink-0">
          <FaUserGraduate />
        </div>
        <div>
          <p className="text-xs font-medium text-text-muted">Active Students</p>
          <h3 className="text-2xl font-bold text-text-main tracking-tight mt-0.5">
            {loading ? "..." : metrics.activeStudents}
          </h3>
        </div>
      </div>

      <div className="bg-surface border border-border-main p-5 rounded-2xl flex items-center gap-4 shadow-xs">
        <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 text-xl shrink-0">
          <FaChalkboardTeacher />
        </div>
        <div>
          <p className="text-xs font-medium text-text-muted">Ongoing Classes</p>
          <h3 className="text-2xl font-bold text-text-main tracking-tight mt-0.5">
            {loading ? "..." : metrics.ongoingClasses}
          </h3>
        </div>
      </div>

      <div className="bg-surface border border-border-main p-5 rounded-2xl flex items-center gap-4 shadow-xs">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-status-success text-xl shrink-0">
          <FaDollarSign />
        </div>
        <div>
          <p className="text-xs font-medium text-text-muted">Monthly Revenue</p>
          <h3 className="text-2xl font-bold text-text-main tracking-tight mt-0.5">
            {loading ? "..." : `$${metrics.monthlyRevenue.toFixed(2)}`}
          </h3>
        </div>
      </div>

      <div className="bg-surface border border-border-main p-5 rounded-2xl flex items-center gap-4 shadow-xs">
        <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-status-danger text-xl shrink-0">
          <FaExclamationTriangle />
        </div>
        <div>
          <p className="text-xs font-medium text-text-muted">Unpaid Fees</p>
          <div className="flex items-baseline gap-2 mt-0.5">
            <h3 className="text-2xl font-bold text-text-main tracking-tight">
              {loading ? "..." : metrics.unpaidCount}
            </h3>
            {!loading && metrics.completedUnpaidCount > 0 && (
              <span className="text-[10px] text-status-warning bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-semibold">
                +{metrics.completedUnpaidCount} completed
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
