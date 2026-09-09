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
    <div className="glass-card rounded-2xl border border-slate-800/80 p-5 space-y-4 hover:border-slate-700/80 transition-all flex flex-col justify-between">
      {/* Header: ID & Avatar/Name */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] text-cyan-400 font-semibold">
            #{String(student.id).padStart(4, "0")}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-medium border border-emerald-500/20">
            Active
          </span>
        </div>

        <div className="flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold shrink-0">
            <FaUserGraduate className="text-sm" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-white text-sm truncate">
              {student.name}
            </h3>
            <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
              <FaCalendarAlt className="text-[10px] text-slate-500" />
              Joined {student.joined_date}
            </span>
          </div>
        </div>
      </div>

      {/* Details: Contact Info */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2.5 text-slate-300">
          <FaEnvelope className="text-slate-500 text-xs shrink-0" />
          <span className="truncate">{student.email}</span>
        </div>
        <div className="flex items-center gap-2.5 text-slate-300 font-mono">
          <FaPhone className="text-slate-500 text-xs shrink-0" />
          <span>{student.phone}</span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2">
        <button
          onClick={() => onView?.(student)}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-500/10 transition-colors"
        >
          View Profile
        </button>
        <button
          onClick={() => onRemove?.(student)}
          className="text-xs text-rose-400 hover:text-rose-300 font-medium px-3 py-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
