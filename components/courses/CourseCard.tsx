"use client";

import React from "react";
import { FaBookOpen, FaHashtag } from "react-icons/fa";
import { Course } from "@/types/course";

interface CourseCardProps {
  course: Course;
  onView?: (course: Course) => void;
  onArchive?: (course: Course) => void;
  onUnarchive?: (course: Course) => void;
}

export default function CourseCard({
  course,
  onView,
  onArchive,
  onUnarchive,
}: CourseCardProps) {
  return (
    <div className="glass-card rounded-2xl border border-border-main p-5 space-y-4 hover:border-brand-primary/40 transition-all flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-start gap-3 border-b border-border-main pb-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary-light border border-brand-primary/20 flex items-center justify-center text-brand-primary font-bold shrink-0 mt-0.5">
            <FaBookOpen className="text-sm" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-text-main text-sm line-clamp-2 leading-snug">
              {course.title}
            </h3>
            <span className="text-brand-primary font-mono font-bold text-xs mt-0.5 block">
              {course.code}
            </span>
          </div>
        </div>
      </div>

      <div className="text-xs text-text-muted leading-relaxed min-h-10">
        <p className="line-clamp-2">
          {course.description || "No description provided."}
        </p>
      </div>

      <div className="pt-3 border-t border-border-main flex items-center justify-end gap-2">
        <button
          onClick={() => onView?.(course)}
          className="text-xs text-brand-primary hover:text-brand-primary-hover font-medium px-3 py-1.5 rounded-lg hover:bg-brand-primary-light transition-colors cursor-pointer"
        >
          View
        </button>

        {course.is_archived ? (
          <button
            onClick={() => onUnarchive?.(course)}
            className="text-xs text-brand-primary hover:text-brand-primary-hover font-medium px-3 py-1.5 rounded-lg hover:bg-brand-primary-light transition-colors cursor-pointer"
          >
            Unarchive
          </button>
        ) : (
          <button
            onClick={() => onArchive?.(course)}
            className="text-xs text-status-danger hover:text-status-danger/80 font-medium px-3 py-1.5 rounded-lg hover:bg-status-danger/10 transition-colors cursor-pointer"
          >
            Archive
          </button>
        )}
      </div>
    </div>
  );
}
