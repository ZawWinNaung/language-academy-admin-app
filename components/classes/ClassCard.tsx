"use client";

import { FaCalendarAlt, FaUsers, FaChalkboardTeacher } from "react-icons/fa";

export interface ClassDetail {
  id: number;
  class_name: string;
  course_code: string;
  course_title: string;
  start_date: string;
  end_date: string;
  status: string;
  active_students: number;
}

interface ClassCardProps {
  item: ClassDetail;
  onManage?: (item: ClassDetail) => void;
  onDelete?: (item: ClassDetail) => void;
}

export default function ClassCard({
  item,
  onManage,
  onDelete,
}: ClassCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "ongoing":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Ongoing
          </span>
        );
      case "completed":
      case "finished":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-semibold">
            Completed
          </span>
        );
      case "upcoming":
      case "scheduled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-semibold">
            Upcoming
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-semibold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="glass-card rounded-2xl border border-slate-800/80 p-5 space-y-4 hover:border-slate-700/80 transition-all flex flex-col justify-between">
      {/* Header: Class Name & Status */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold text-white text-base tracking-tight truncate">
            {item.class_name}
          </h3>
          {getStatusBadge(item.status)}
        </div>

        {/* Course Meta Info */}
        <div className="flex items-start gap-3 border-b border-slate-800/80 pb-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold shrink-0">
            <FaChalkboardTeacher className="text-sm" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-slate-200 text-xs truncate">
              {item.course_title}
            </div>
            <span className="font-mono text-[10px] text-indigo-400 font-bold">
              {item.course_code}
            </span>
          </div>
        </div>
      </div>

      {/* Details: Schedule & Enrolment */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
          <FaCalendarAlt className="text-slate-500 text-xs shrink-0" />
          <span>
            {item.start_date} → {item.end_date}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono text-[11px]">
            <FaUsers className="text-xs" /> {item.active_students} Enrolled
          </span>
        </div>
      </div>

      {/* Card Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2">
        <button
          onClick={() => onManage?.(item)}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-500/10 transition-colors"
        >
          Manage
        </button>
        <button
          onClick={() => onDelete?.(item)}
          className="text-xs text-rose-400 hover:text-rose-300 font-medium px-3 py-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
