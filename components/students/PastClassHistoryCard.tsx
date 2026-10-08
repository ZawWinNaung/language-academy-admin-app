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
  onItemClick: (classId: number) => void;
}

const getEnrollmentStatusBadge = (status: string) => {
  const normalizedStatus = status.toLowerCase();

  switch (normalizedStatus) {
    case "promoted":
    case "graduated":
      return "bg-status-success/10 text-status-success border-status-success/30";
    case "demoted":
    case "dropped":
    case "failed":
      return "bg-status-danger/10 text-status-danger border-status-danger/30";
    default:
      return "bg-surface-hover text-text-muted border-border-main";
  }
};

export default function PastClassHistoryCard({
  pastEnrollments,
  onItemClick,
}: PastClassHistoryCardProps) {
  return (
    <div className="glass-card border border-border-main rounded-2xl p-5 space-y-4">
      <h2 className="text-sm font-bold text-text-main flex items-center gap-2 border-b border-border-main pb-3">
        <FaHistory className="text-brand-primary" /> Past Class History
      </h2>

      {pastEnrollments.length === 0 ? (
        <div className="text-center py-6 text-xs text-text-dim border border-dashed border-border-main rounded-xl">
          No past enrollments found.
        </div>
      ) : (
        <div className="space-y-3">
          {pastEnrollments.map((item) => (
            <div
              key={item.enrollment_id}
              className="bg-surface-hover border border-border-main hover:border-brand-primary/40 hover:bg-brand-primary-light cursor-pointer transition-all duration-200 rounded-xl p-3 flex items-center justify-between text-xs group"
              onClick={() => onItemClick(item.class_id)}
            >
              <div>
                <div className="font-semibold text-text-main group-hover:text-brand-primary transition-colors">
                  {item.class_name}
                </div>
                <div className="text-[11px] text-text-muted">
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
