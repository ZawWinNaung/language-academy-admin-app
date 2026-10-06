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
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <FaBookOpen className="text-emerald-400" /> Active Enrollment
        </h2>
        <button
          onClick={onOpenEnrollModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all"
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
          className="bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/20 cursor-pointer transition-all duration-200 rounded-xl p-4 flex items-center justify-between text-xs group"
          onClick={() => onItemClick(activeEnrollment.class_id)}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">
                {activeEnrollment.class_name}
              </span>
              <span className="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                {activeEnrollment.course_title}
              </span>
            </div>
            <div className="text-slate-400 text-[11px] mt-1">
              Enrolled on: {activeEnrollment.enrolled_date}
            </div>
          </div>
          <span className="bg-emerald-500/20 text-emerald-300 font-semibold px-2.5 py-1 rounded-md text-[11px]">
            Active
          </span>
        </div>
      ) : (
        <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
          No active class enrollment currently.
        </div>
      )}
    </div>
  );
}
