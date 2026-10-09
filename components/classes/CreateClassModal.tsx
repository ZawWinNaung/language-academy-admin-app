"use client";

import React, { useRef } from "react";
import { ClassFormData } from "@/types/class";
import CourseCombobox from "./CourseComboBox";

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formData: ClassFormData;
  setFormData: React.Dispatch<React.SetStateAction<ClassFormData>>;
  submitting: boolean;
}

export default function CreateClassModal({
  isOpen,
  onClose,
  onSubmit,
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
      <div className="glass-card rounded-2xl shadow-2xl w-full max-w-md border border-border-main relative z-10">
        <div className="px-6 py-4 border-b border-border-main flex justify-between items-center bg-surface-hover rounded-t-2xl">
          <h3 className="font-bold text-text-main text-sm">
            Create New Class Batch
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-text-dim hover:text-text-main text-base"
          >
            ✕
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">
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
              className="w-full bg-surface-hover border border-border-main rounded-xl px-3.5 py-2.5 text-xs text-text-main placeholder-text-dim focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">
              Select Course
            </label>
            <CourseCombobox
              value={formData.course_id ? Number(formData.course_id) : null}
              onChange={(courseId) =>
                setFormData({ ...formData, course_id: String(courseId) })
              }
              placeholder="Type or select a course..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">
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
                className="w-full bg-surface-hover border border-border-main rounded-xl px-3.5 py-2.5 text-xs text-text-main focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary cursor-pointer [scheme:light] [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">
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
                className="w-full bg-surface-hover border border-border-main rounded-xl px-3.5 py-2.5 text-xs text-text-main focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary cursor-pointer [scheme:light] [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-border-main">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border-main text-text-muted text-xs font-semibold rounded-xl hover:bg-surface-hover transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !formData.course_id}
              className="px-4 py-2 bg-brand-primary text-white text-xs font-semibold rounded-xl hover:bg-brand-primary-hover shadow-lg shadow-brand-primary/20 disabled:opacity-50 transition-all"
            >
              {submitting ? "Saving..." : "Create Class"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
