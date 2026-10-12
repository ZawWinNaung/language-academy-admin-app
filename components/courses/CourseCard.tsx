"use client";

import React from "react";
import { FaBook, FaTag, FaCoins } from "react-icons/fa";
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
  const formattedFee = Math.round(
    parseFloat(String(course.tuition_fee || "0")),
  ).toLocaleString();

  return (
    <div className="group relative bg-surface border border-border-main hover:border-brand-primary/50 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0 transition-transform group-hover:scale-105 duration-300">
            <FaBook className="text-sm" />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="font-bold text-text-main text-sm leading-snug line-clamp-2">
              {course.title}
            </h3>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-brand-primary bg-brand-primary/5 border border-brand-primary/15 px-2 py-0.5 rounded-md">
                <FaTag className="text-[9px]" />
                {course.code}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-text-main bg-surface-hover border border-border-main px-2 py-0.5 rounded-md shadow-2xs">
                <FaCoins className="text-[9px] text-amber-500" />
                {formattedFee} MMK
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="py-4 my-2 text-xs text-text-muted leading-relaxed">
        <p className="line-clamp-2">
          {course.description || "No description provided for this course."}
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
