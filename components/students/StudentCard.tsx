"use client";

import {
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaUserGraduate,
} from "react-icons/fa";

export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  joined_date: string;
}

interface StudentCardProps {
  student: Student;
  onView?: (student: Student) => void;
  onRemove?: (student: Student) => void;
}

export default function StudentCard({
  student,
  onView,
  onRemove,
}: StudentCardProps) {
  return (
    <div className="glass-card rounded-2xl border border-border-main bg-surface p-5 space-y-4 hover:border-brand-primary/40 transition-all flex flex-col justify-between shadow-xs">
      {/* Header: ID & Avatar/Name */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] text-brand-primary font-semibold">
            #{String(student.id).padStart(4, "0")}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-medium border border-emerald-200">
            Active
          </span>
        </div>

        <div className="flex items-center gap-3 border-b border-border-main pb-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary-light border border-brand-primary/20 flex items-center justify-center text-brand-primary font-bold shrink-0">
            <FaUserGraduate className="text-sm" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-text-main text-sm truncate">
              {student.name}
            </h3>
            <span className="text-[11px] text-text-muted flex items-center gap-1 font-mono">
              <FaCalendarAlt className="text-[10px] text-text-dim" />
              Joined {student.joined_date}
            </span>
          </div>
        </div>
      </div>

      {/* Details: Contact Info */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2.5 text-text-main">
          <FaEnvelope className="text-text-dim text-xs shrink-0" />
          <span className="truncate">{student.email}</span>
        </div>
        <div className="flex items-center gap-2.5 text-text-main font-mono">
          <FaPhone className="text-text-dim text-xs shrink-0" />
          <span>{student.phone}</span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-border-main flex items-center justify-end gap-2">
        <button
          onClick={() => onView?.(student)}
          className="text-xs text-brand-primary hover:text-brand-primary-hover font-medium px-3 py-1.5 rounded-lg hover:bg-brand-primary-light transition-colors cursor-pointer"
        >
          View Profile
        </button>
        <button
          onClick={() => onRemove?.(student)}
          className="text-xs text-status-danger hover:text-rose-700 font-medium px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
