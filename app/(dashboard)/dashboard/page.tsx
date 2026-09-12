"use client";

import React, { useEffect, useState } from "react";
import OngoingClassPayments from "@/components/dashboard/OngoingClassPayments";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaDollarSign,
  FaExclamationTriangle,
} from "react-icons/fa";

interface SummaryMetrics {
  activeStudents: number;
  ongoingClasses: number;
  monthlyRevenue: number;
  unpaidCount: number;
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<SummaryMetrics>({
    activeStudents: 0,
    ongoingClasses: 0,
    monthlyRevenue: 0,
    unpaidCount: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const res = await fetch(
          `/api/dashboard/class-payments?month=${currentMonth}`,
        );
        const result = await res.json();

        if (result.success) {
          let studentsSet = new Set<number>();
          let revenue = 0;
          let unpaid = 0;

          result.data.forEach((cls: any) => {
            unpaid += cls.stats.unpaid;
            cls.students.forEach((s: any) => {
              studentsSet.add(s.student_id);
              if (s.status === "Paid" && s.amount) {
                revenue += parseFloat(s.amount);
              }
            });
          });

          setMetrics({
            activeStudents: studentsSet.size,
            ongoingClasses: result.data.length,
            monthlyRevenue: revenue,
            unpaidCount: unpaid,
          });
        }
      } catch (error) {
        console.error("Failed to load dashboard summary metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      {/* Page Header */}
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

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Students */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-xl shrink-0">
            <FaUserGraduate />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">
              Active Students
            </p>
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
            <p className="text-xs font-medium text-slate-400">
              Ongoing Classes
            </p>
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
            <p className="text-xs font-medium text-slate-400">
              Monthly Revenue
            </p>
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
            <h3 className="text-2xl font-bold text-white tracking-tight mt-0.5">
              {loading ? "..." : metrics.unpaidCount}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Content: Ongoing Classes & Student Payment Status */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
        <OngoingClassPayments />
      </div>
    </div>
  );
}
