"use client";

import React, { useEffect, useState } from "react";
import {
  FaExclamationTriangle,
  FaCalendarTimes,
  FaGraduationCap,
} from "react-icons/fa";

interface UnpaidSummary {
  student_id: number;
  student_name: string;
  student_email: string;
  class_id: number;
  class_name: string;
  course_title: string;
  class_status: "Ongoing" | "Completed" | "Upcoming";
  unpaid_count: number;
  skipped_months: string[];
}

export default function UnpaidFeesOverview() {
  const [unpaidList, setUnpaidList] = useState<UnpaidSummary[]>([]);
  const [totalUnpaid, setTotalUnpaid] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnpaidFees = async () => {
      try {
        const res = await fetch("/api/dashboard/unpaid-fees");
        const result = await res.json();
        if (result.success) {
          setUnpaidList(result.data || []);
          setTotalUnpaid(result.total_unpaid_months || 0);
        }
      } catch (err) {
        console.error("Failed to load unpaid fees:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUnpaidFees();
  }, []);

  if (loading) {
    return (
      <div className="text-xs text-slate-500 py-4 text-center">
        Loading unpaid fee records...
      </div>
    );
  }

  if (unpaidList.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-rose-400">
          <FaExclamationTriangle />
          <h2 className="text-sm font-bold text-white">
            Unpaid Fees & Skipped Months
          </h2>
        </div>
        <span className="text-xs bg-rose-500/10 border border-rose-500/20 text-rose-300 px-2.5 py-1 rounded-lg font-semibold">
          {totalUnpaid} Total Overdue Months
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {unpaidList.map((item, idx) => (
          <div
            key={`${item.student_id}-${item.class_id}-${idx}`}
            className="bg-slate-950/60 border border-slate-800 hover:border-rose-500/30 transition-all rounded-xl p-4 space-y-3"
          >
            {/* Student & Class Info */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white">
                  {item.student_name}
                </h3>
                <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <FaGraduationCap className="text-indigo-400" />
                  {item.class_name} ({item.course_title})
                </p>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${
                  item.class_status === "Completed"
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
                    : "bg-cyan-500/10 border-cyan-500/20 text-cyan-300"
                }`}
              >
                {item.class_status} Class
              </span>
            </div>

            {/* Skipped Months List */}
            <div className="bg-slate-900/80 rounded-lg p-2.5 space-y-1.5 border border-slate-800/80">
              <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                <FaCalendarTimes className="text-rose-400" />
                Skipped Month(s):
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.skipped_months.map((m) => (
                  <span
                    key={m}
                    className="text-[10px] bg-rose-500/10 border border-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-mono font-medium"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
