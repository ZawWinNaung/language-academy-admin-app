"use client";

import React from "react";
import { FaClock, FaUser, FaBook } from "react-icons/fa";
import { TimetableEntry } from "@/types/timetable";

interface ClassTimetableCardProps {
  item: TimetableEntry;
  onEdit?: () => void;
  onRemove?: () => void;
}

export default function ClassTimetableCard({
  item,
  onEdit,
  onRemove,
}: ClassTimetableCardProps) {
  if (!item) return null;

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  return (
    <div className="glass-card rounded-2xl border border-border-main p-4 space-y-3.5 hover:border-brand-primary/40 transition-all flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-border-main pb-2.5">
        <h3 className="font-bold text-text-main text-sm">
          {item.day_of_week || "N/A"}
        </h3>
        <span className="text-[11px] text-brand-primary font-mono flex items-center gap-1 bg-brand-primary-light px-2.5 py-0.5 rounded-lg border border-brand-primary/20">
          <FaClock className="text-[10px]" /> {formatTime(item.start_time)} -{" "}
          {formatTime(item.end_time)}
        </span>
      </div>

      <div className="space-y-2 text-xs">
        {/* Subject */}
        <div className="flex items-start gap-2.5">
          <FaBook className="text-text-dim text-xs mt-0.5 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-semibold text-text-dim block tracking-wider">
              Subject
            </span>
            <span className="text-xs font-semibold text-text-main truncate block">
              {item.subject || "N/A"}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <FaUser className="text-text-dim text-xs mt-0.5 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-semibold text-text-dim block tracking-wider">
              Teacher
            </span>
            <span className="text-xs text-text-main font-medium truncate block">
              {item.teacher_name ||
                (item.teacher_id
                  ? `Teacher #${item.teacher_id}`
                  : "Unassigned")}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-2 border-t border-border-main flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="text-xs text-brand-primary hover:text-brand-primary-hover font-medium px-2.5 py-1 rounded-lg hover:bg-brand-primary-light transition-colors cursor-pointer"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs text-status-danger hover:text-status-danger/80 font-medium px-2.5 py-1 rounded-lg hover:bg-status-danger/10 transition-colors cursor-pointer"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
