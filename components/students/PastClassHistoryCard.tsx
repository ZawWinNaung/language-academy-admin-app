"use client";

import React from "react";
import { FaHistory } from "react-icons/fa";

interface EnrollmentRecord {
  enrollment_id: number;
  class_id: number;
  class_name: string;
  course_title: string;
  class_status: "Upcoming" | "Ongoing" | "Completed";
  enrollment_status: string;
  enrolled_date: string;
}

interface PastClassHistoryCardProps {
  pastEnrollments: EnrollmentRecord[];
}

const getEnrollmentStatusBadge = (status: string) => {
  const normalizedStatus = status.toLowerCase();

  switch (normalizedStatus) {
    case "promoted":
    case "graduated":
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    case "demoted":
    case "dropped":
    case "failed":
      return "bg-rose-500/20 text-rose-300 border-rose-500/30";
    default:
      return "bg-slate-800 text-slate-300 border-slate-700";
  }
};

export default function PastClassHistoryCard({
  pastEnrollments,
}: PastClassHistoryCardProps) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md space-y-4">
      <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
        <FaHistory className="text-indigo-400" /> Past Class History
      </h2>

      {pastEnrollments.length === 0 ? (
        <div className="text-center py-6 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
          No past enrollments found.
        </div>
      ) : (
        <div className="space-y-3">
          {pastEnrollments.map((item) => (
            <div
              key={item.enrollment_id}
              className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-semibold text-slate-300">
                  {item.class_name}
                </div>
                <div className="text-[11px] text-slate-500">
                  {item.course_title}
                </div>
              </div>

              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border capitalize ${getEnrollmentStatusBadge(
                  item.enrollment_status,
                )}`}
              >
                {item.enrollment_status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
