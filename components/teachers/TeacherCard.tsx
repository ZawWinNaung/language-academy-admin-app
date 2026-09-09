"use client";

import {
  FaEnvelope,
  FaPhone,
  FaChalkboardTeacher,
  FaAward,
} from "react-icons/fa";

export interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  qualification: string;
  is_active: boolean;
}

interface TeacherCardProps {
  teacher: Teacher;
  onEdit?: (teacher: Teacher) => void;
  onRemove?: (teacher: Teacher) => void;
}

export default function TeacherCard({
  teacher,
  onEdit,
  onRemove,
}: TeacherCardProps) {
  return (
    <div className="glass-card rounded-2xl border border-slate-800/80 p-5 space-y-4 hover:border-slate-700/80 transition-all flex flex-col justify-between">
      {/* Header: ID & Status */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] text-cyan-400 font-semibold">
            #{String(teacher.id).padStart(3, "0")}
          </span>
          {teacher.is_active ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-semibold">
              Inactive
            </span>
          )}
        </div>

        {/* Instructor Info */}
        <div className="flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold shrink-0">
            <FaChalkboardTeacher className="text-sm" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-white text-sm truncate">
              {teacher.name}
            </h3>
            <span className="text-[11px] text-indigo-300 flex items-center gap-1 font-mono mt-0.5">
              <FaAward className="text-[10px] text-indigo-400 shrink-0" />
              <span className="truncate">{teacher.qualification}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Details: Contact Info */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2.5 text-slate-300">
          <FaEnvelope className="text-slate-500 text-xs shrink-0" />
          <span className="truncate">{teacher.email}</span>
        </div>
        <div className="flex items-center gap-2.5 text-slate-300 font-mono">
          <FaPhone className="text-slate-500 text-xs shrink-0" />
          <span>{teacher.phone}</span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2">
        <button
          onClick={() => onEdit?.(teacher)}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-500/10 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onRemove?.(teacher)}
          className="text-xs text-rose-400 hover:text-rose-300 font-medium px-3 py-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
