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
    <div className="glass-card rounded-2xl border border-border-main p-5 space-y-4 hover:border-brand-primary/40 transition-all flex flex-col justify-between">
      {/* Header: ID & Status */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] text-brand-primary font-semibold">
            #{String(teacher.id).padStart(3, "0")}
          </span>
          {teacher.is_active ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-status-success/10 border border-status-success/20 text-status-success text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-hover border border-border-main text-text-muted text-[10px] font-semibold">
              Inactive
            </span>
          )}
        </div>

        {/* Instructor Info */}
        <div className="flex items-center gap-3 border-b border-border-main pb-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary-light border border-brand-primary/20 flex items-center justify-center text-brand-primary font-bold shrink-0">
            <FaChalkboardTeacher className="text-sm" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-text-main text-sm truncate">
              {teacher.name}
            </h3>
            <span className="text-[11px] text-brand-primary flex items-center gap-1 font-mono mt-0.5">
              <FaAward className="text-[10px] text-brand-primary shrink-0" />
              <span className="truncate">{teacher.qualification}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Details: Contact Info */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2.5 text-text-muted">
          <FaEnvelope className="text-text-dim text-xs shrink-0" />
          <span className="truncate">{teacher.email}</span>
        </div>
        <div className="flex items-center gap-2.5 text-text-muted font-mono">
          <FaPhone className="text-text-dim text-xs shrink-0" />
          <span>{teacher.phone}</span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-border-main flex items-center justify-end gap-2">
        <button
          onClick={() => onEdit?.(teacher)}
          className="text-xs text-brand-primary hover:text-brand-primary-hover font-medium px-3 py-1.5 rounded-lg hover:bg-brand-primary-light transition-colors"
        >
          Edit Details
        </button>
        <button
          onClick={() => onRemove?.(teacher)}
          className="text-xs text-status-danger hover:text-status-danger/80 font-medium px-3 py-1.5 rounded-lg hover:bg-status-danger/10 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
