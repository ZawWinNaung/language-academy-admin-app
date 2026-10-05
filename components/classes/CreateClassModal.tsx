"use client";

import React, { useRef } from "react";
import { Course } from "@/types/course";
import { ClassFormData } from "@/types/class";

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  courses: Course[];
  formData: ClassFormData;
  setFormData: React.Dispatch<React.SetStateAction<ClassFormData>>;
  submitting: boolean;
}

export default function CreateClassModal({
  isOpen,
  onClose,
  onSubmit,
  courses,
  formData,
  setFormData,
  submitting,
}: CreateClassModalProps) {
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const openDatePicker = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (!ref.current) return;
    const inputEl = ref.current;

    if ("showPicker" in inputEl && typeof inputEl.showPicker === "function") {
      inputEl.showPicker();
    } else {
      inputEl.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="glass-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-800 relative z-10">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/40">
          <h3 className="font-bold text-white text-sm">
            Create New Class Batch
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-base"
          >
            ✕
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Class Name / Batch Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Batch 2026 - A"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Select Course
            </label>
            <select
              required
              value={formData.course_id}
              onChange={(e) =>
                setFormData({ ...formData, course_id: e.target.value })
              }
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              {courses.length === 0 ? (
                <option value="" disabled>
                  No courses available. Please create a course first.
                </option>
              ) : (
                courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    [{course.code}] {course.title}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Start Date Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Start Date
              </label>
              <input
                ref={startDateRef}
                type="date"
                required
                value={formData.start_date}
                max={formData.end_date || undefined}
                onKeyDown={(e) => e.preventDefault()}
                onClick={() => openDatePicker(startDateRef)}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer [scheme:dark] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:filter-[invert(63%)_sepia(80%)_saturate(3000%)_hue-rotate(215deg)_brightness(102%)_contrast(97%)]"
              />
            </div>

            {/* End Date Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                End Date
              </label>
              <input
                ref={endDateRef}
                type="date"
                required
                value={formData.end_date}
                min={formData.start_date || undefined}
                onKeyDown={(e) => e.preventDefault()}
                onClick={() => openDatePicker(endDateRef)}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer [scheme:dark] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:filter-[invert(63%)_sepia(80%)_saturate(3000%)_hue-rotate(215deg)_brightness(102%)_contrast(97%)]"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-700 text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-800/60 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || courses.length === 0}
              className="px-4 py-2 bg-linear-to-r from-indigo-600 to-indigo-500 text-white text-xs font-semibold rounded-xl hover:from-indigo-500 hover:to-indigo-400 shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all"
            >
              {submitting ? "Saving..." : "Create Class"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
