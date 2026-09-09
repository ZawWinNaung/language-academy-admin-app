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
    <div className="glass-card rounded-2xl border border-slate-800/80 p-5 space-y-4 hover:border-slate-700/80 transition-all flex flex-col justify-between">
      {/* Header: ID & Course Code */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] text-cyan-400 font-semibold flex items-center gap-1">
            <FaHashtag className="text-[10px] text-slate-500" />
            {String(course.id).padStart(3, "0")}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono font-bold text-xs">
            {course.code}
          </span>
        </div>

        {/* Course Info */}
        <div className="flex items-start gap-3 border-b border-slate-800/80 pb-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold shrink-0 mt-0.5">
            <FaBookOpen className="text-sm" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-white text-sm line-clamp-2 leading-snug">
              {course.title}
            </h3>
          </div>
        </div>
      </div>

      {/* Course Description */}
      <div className="text-xs text-slate-400 leading-relaxed min-h-[2.5rem]">
        <p className="line-clamp-3">
          {course.description || "No description provided."}
        </p>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2">
        <button
          onClick={() => onEdit?.(course)}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-500/10 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete?.(course)}
          className="text-xs text-rose-400 hover:text-rose-300 font-medium px-3 py-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
