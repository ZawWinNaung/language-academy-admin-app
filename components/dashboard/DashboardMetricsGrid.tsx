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
      {/* Active Students */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-xl shrink-0">
          <FaUserGraduate />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400">Active Students</p>
          <h3 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            {loading ? "..." : metrics.activeStudents}
          </h3>
        </div>
      </div>

      {/* Ongoing Classes */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-xl shrink-0">
          <FaChalkboardTeacher />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400">Ongoing Classes</p>
          <h3 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            {loading ? "..." : metrics.ongoingClasses}
          </h3>
        </div>
      </div>

      {/* Monthly Revenue */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl shrink-0">
          <FaDollarSign />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400">Monthly Revenue</p>
          <h3 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            {loading ? "..." : `$${metrics.monthlyRevenue.toFixed(2)}`}
          </h3>
        </div>
      </div>

      {/* Pending / Unpaid Payments */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 text-xl shrink-0">
          <FaExclamationTriangle />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400">Unpaid Fees</p>
          <div className="flex items-baseline gap-2 mt-0.5">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {loading ? "..." : metrics.unpaidCount}
            </h3>
            {!loading && metrics.completedUnpaidCount > 0 && (
              <span className="text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md font-semibold">
                +{metrics.completedUnpaidCount} completed
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
