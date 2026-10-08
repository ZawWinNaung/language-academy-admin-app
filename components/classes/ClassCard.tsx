"use client";

import React from "react";
import { FaCalendarAlt, FaUsers, FaChalkboardTeacher } from "react-icons/fa";
import { ClassDetail } from "@/types/class";
import { formatDateForDisplay } from "@/lib/utils/date";

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
  const rawStatus = item.class_status || "Unknown";

  const getStatusBadge = (status: string = "Unknown") => {
    switch (status.toLowerCase()) {
      case "active":
      case "ongoing":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-status-success/10 border border-status-success/20 text-status-success text-[10px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
            Ongoing
          </span>
        );
      case "completed":
      case "finished":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-primary-light border border-brand-primary/20 text-brand-primary text-[10px] font-semibold">
            Completed
          </span>
        );
      case "upcoming":
      case "scheduled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-status-warning/10 border border-status-warning/20 text-status-warning text-[10px] font-semibold">
            Upcoming
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-hover border border-border-main text-text-muted text-[10px] font-semibold">
            {status}
          </span>
        );
    }
  };

  const className = item.class_name || item.name || "Untitled Class";
  const courseTitle = item.course_title || "Unassigned Course";
  const courseCode = item.course_code || "N/A";
  const studentCount = item.active_students ?? 0;

  return (
    <div className="glass-card rounded-2xl border border-border-main p-5 space-y-4 hover:border-brand-primary/40 transition-all flex flex-col justify-between">
      {/* Header: Class Name & Status */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold text-text-main text-base tracking-tight truncate">
            {className}
          </h3>
          {getStatusBadge(rawStatus)}
        </div>

        {/* Course Meta Info */}
        <div className="flex items-start gap-3 border-b border-border-main pb-3">
          <div className="w-9 h-9 rounded-xl bg-brand-primary-light border border-brand-primary/20 flex items-center justify-center text-brand-primary font-bold shrink-0">
            <FaChalkboardTeacher className="text-sm" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-text-main text-xs truncate">
              {courseTitle}
            </div>
            <span className="font-mono text-[10px] text-brand-primary font-bold">
              {courseCode}
            </span>
          </div>
        </div>
      </div>

      {/* Details: Schedule & Enrolment */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2 text-text-muted font-mono text-[11px]">
          <FaCalendarAlt className="text-text-dim text-xs shrink-0" />
          <span>
            {formatDateForDisplay(item.start_date) || "TBD"} →{" "}
            {formatDateForDisplay(item.end_date) || "TBD"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-primary-light border border-brand-primary/20 text-brand-primary font-mono text-[11px]">
            <FaUsers className="text-xs" /> {studentCount} Enrolled
          </span>
        </div>
      </div>

      {/* Card Actions */}
      <div className="pt-3 border-t border-border-main flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => onManage?.(item)}
          className="text-xs text-brand-primary hover:text-brand-primary-hover font-medium px-3 py-1.5 rounded-lg hover:bg-brand-primary-light transition-colors"
        >
          Manage
        </button>
        <button
          type="button"
          onClick={() => onDelete?.(item)}
          className="text-xs text-status-danger hover:text-status-danger/80 font-medium px-3 py-1.5 rounded-lg hover:bg-status-danger/10 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
