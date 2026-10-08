"use client";

import { FaBookOpen, FaHashtag } from "react-icons/fa";

export interface Course {
  id: number;
  code: string;
  title: string;
  description: string;
}

interface CourseCardProps {
  course: Course;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
}

export default function CourseCard({
  course,
  onEdit,
  onDelete,
}: CourseCardProps) {
  return (
    <div className="glass-card rounded-2xl border border-border-main p-5 space-y-4 hover:border-brand-primary/40 transition-all flex flex-col justify-between">
      {/* Header: ID & Course Code */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] text-brand-primary font-semibold flex items-center gap-1">
            <FaHashtag className="text-[10px] text-text-dim" />
            {String(course.id).padStart(3, "0")}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-brand-primary-light border border-brand-primary/20 text-brand-primary font-mono font-bold text-xs">
            {course.code}
          </span>
        </div>

        {/* Course Info */}
        <div className="flex items-start gap-3 border-b border-border-main pb-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary-light border border-brand-primary/20 flex items-center justify-center text-brand-primary font-bold shrink-0 mt-0.5">
            <FaBookOpen className="text-sm" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-text-main text-sm line-clamp-2 leading-snug">
              {course.title}
            </h3>
          </div>
        </div>
      </div>

      {/* Course Description */}
      <div className="text-xs text-text-muted leading-relaxed min-h-[2.5rem]">
        <p className="line-clamp-3">
          {course.description || "No description provided."}
        </p>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-border-main flex items-center justify-end gap-2">
        <button
          onClick={() => onEdit?.(course)}
          className="text-xs text-brand-primary hover:text-brand-primary-hover font-medium px-3 py-1.5 rounded-lg hover:bg-brand-primary-light transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete?.(course)}
          className="text-xs text-status-danger hover:text-status-danger/80 font-medium px-3 py-1.5 rounded-lg hover:bg-status-danger/10 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
