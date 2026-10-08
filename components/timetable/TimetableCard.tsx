"use client";

import { FaClock, FaDoorOpen, FaUser, FaBook } from "react-icons/fa";

export interface TimetableEntry {
  id: number;
  class_id: number;
  teacher_id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  subject: string;
  room_no: string;
  class_name?: string;
  teacher_name?: string;
}

interface TimetableCardProps {
  item: TimetableEntry;
  onEdit?: (item: TimetableEntry) => void;
  onRemove?: (item: TimetableEntry) => void;
}

export default function TimetableCard({
  item,
  onEdit,
  onRemove,
}: TimetableCardProps) {
  const formatTime = (timeStr: string) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  return (
    <div className="glass-card rounded-2xl border border-border-main p-5 space-y-4 hover:border-brand-primary/40 transition-all flex flex-col justify-between">
      {/* Top Header: Day, ID & Room */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] text-brand-primary font-semibold">
            #{String(item.id).padStart(4, "0")}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-surface-hover text-text-muted font-mono text-[11px] border border-border-main flex items-center gap-1.5">
            <FaDoorOpen className="text-text-dim" /> {item.room_no}
          </span>
        </div>

        {/* Day & Time */}
        <div className="flex items-center justify-between border-b border-border-main pb-3">
          <h3 className="font-bold text-text-main text-base">{item.day_of_week}</h3>
          <span className="text-[11px] text-brand-primary font-mono flex items-center gap-1 bg-brand-primary-light px-2.5 py-1 rounded-lg border border-brand-primary/20">
            <FaClock /> {formatTime(item.start_time)} -{" "}
            {formatTime(item.end_time)}
          </span>
        </div>
      </div>

      {/* Body: Subject & Information */}
      <div className="space-y-2.5">
        <div className="flex items-start gap-2.5">
          <FaBook className="text-text-dim text-xs mt-1 shrink-0" />
          <div>
            <span className="text-[10px] uppercase font-semibold text-text-dim block tracking-wider">
              Subject
            </span>
            <span className="text-xs font-semibold text-text-main">
              {item.subject}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <FaUser className="text-text-dim text-xs mt-1 shrink-0" />
          <div>
            <span className="text-[10px] uppercase font-semibold text-text-dim block tracking-wider">
              Class & Instructor
            </span>
            <span className="text-xs text-text-main font-medium block">
              {item.class_name || `Class #${item.class_id}`}
            </span>
            <span className="text-[11px] text-text-muted">
              {item.teacher_name || `Teacher #${item.teacher_id}`}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-border-main flex items-center justify-end gap-2">
        <button
          onClick={() => onEdit?.(item)}
          className="text-xs text-brand-primary hover:text-brand-primary-hover font-medium px-3 py-1.5 rounded-lg hover:bg-brand-primary-light transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onRemove?.(item)}
          className="text-xs text-status-danger hover:text-status-danger/80 font-medium px-3 py-1.5 rounded-lg hover:bg-status-danger/10 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
