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
    <div className="glass-card rounded-2xl border border-slate-800/80 p-5 space-y-4 hover:border-slate-700/80 transition-all flex flex-col justify-between">
      {/* Top Header: Day, ID & Room */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] text-cyan-400 font-semibold">
            #{String(item.id).padStart(4, "0")}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700/60 flex items-center gap-1.5">
            <FaDoorOpen className="text-slate-400" /> {item.room_no}
          </span>
        </div>

        {/* Day & Time */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h3 className="font-bold text-white text-base">{item.day_of_week}</h3>
          <span className="text-[11px] text-indigo-400 font-mono flex items-center gap-1 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
            <FaClock /> {formatTime(item.start_time)} -{" "}
            {formatTime(item.end_time)}
          </span>
        </div>
      </div>

      {/* Body: Subject & Information */}
      <div className="space-y-2.5">
        <div className="flex items-start gap-2.5">
          <FaBook className="text-slate-500 text-xs mt-1 shrink-0" />
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-500 block tracking-wider">
              Subject
            </span>
            <span className="text-xs font-semibold text-white">
              {item.subject}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <FaUser className="text-slate-500 text-xs mt-1 shrink-0" />
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-500 block tracking-wider">
              Class & Instructor
            </span>
            <span className="text-xs text-slate-300 font-medium block">
              {item.class_name || `Class #${item.class_id}`}
            </span>
            <span className="text-[11px] text-slate-400">
              {item.teacher_name || `Teacher #${item.teacher_id}`}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2">
        <button
          onClick={() => onEdit?.(item)}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-500/10 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onRemove?.(item)}
          className="text-xs text-rose-400 hover:text-rose-300 font-medium px-3 py-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
