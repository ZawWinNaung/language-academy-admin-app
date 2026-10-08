"use client";

import React from "react";
import { FaBookOpen, FaExchangeAlt, FaPlus } from "react-icons/fa";

interface EnrollmentRecord {
  enrollment_id: number;
  class_id: number;
  class_name: string;
  course_title: string;
  class_status: "Upcoming" | "Ongoing" | "Completed";
  enrollment_status: string;
  enrolled_date: string;
}

interface ActiveEnrollmentCardProps {
  activeEnrollment: EnrollmentRecord | undefined;
  onOpenEnrollModal: () => void;
  onItemClick: (classId: number) => void;
}

export default function ActiveEnrollmentCard({
  activeEnrollment,
  onOpenEnrollModal,
  onItemClick,
}: ActiveEnrollmentCardProps) {
  return (
    <div className="glass-card border border-border-main rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-border-main pb-3">
        <h2 className="text-sm font-bold text-text-main flex items-center gap-2">
          <FaBookOpen className="text-brand-primary" /> Active Enrollment
        </h2>
        <button
          onClick={onOpenEnrollModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold rounded-xl transition-all"
        >
          {activeEnrollment ? (
            <FaExchangeAlt className="text-[10px]" />
          ) : (
            <FaPlus className="text-[10px]" />
          )}
          {activeEnrollment ? "Change Class" : "Enroll in Class"}
        </button>
      </div>

      {activeEnrollment ? (
        <div
          className="bg-status-success/10 border border-status-success/20 hover:border-status-success/50 hover:bg-status-success/20 cursor-pointer transition-all duration-200 rounded-xl p-4 flex items-center justify-between text-xs group"
          onClick={() => onItemClick(activeEnrollment.class_id)}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-text-main text-sm group-hover:text-status-success transition-colors">
                {activeEnrollment.class_name}
              </span>
              <span className="text-[10px] text-brand-primary bg-brand-primary-light border border-brand-primary/20 px-2 py-0.5 rounded-md">
                {activeEnrollment.course_title}
              </span>
            </div>
            <div className="text-text-muted text-[11px] mt-1">
              Enrolled on: {activeEnrollment.enrolled_date}
            </div>
          </div>
          <span className="bg-status-success/20 text-status-success font-semibold px-2.5 py-1 rounded-md text-[11px]">
            Active
          </span>
        </div>
      ) : (
        <div className="text-center py-8 text-xs text-text-dim border border-dashed border-border-main rounded-xl">
          No active class enrollment currently.
        </div>
      )}
    </div>
  );
}
