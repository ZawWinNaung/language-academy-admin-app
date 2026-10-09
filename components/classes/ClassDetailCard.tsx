"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaUserEdit } from "react-icons/fa";
import { ClassDetail } from "@/types/class";
import { Course } from "@/types/course";
import CourseCombobox from "./CourseComboBox";

interface ClassDetailCardProps {
  classDetail: ClassDetail;
  courses: Course[];
  saving: boolean;
  onSave: (updatedData: Partial<ClassDetail>) => Promise<boolean>;
}

export function ClassDetailCard({
  classDetail,
  courses,
  saving,
  onSave,
}: ClassDetailCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    course_id: 0,
    start_date: "",
    end_date: "",
  });

  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString.split("T")[0] || "";
    return date.toISOString().split("T")[0];
  };

  const resetForm = () => {
    if (classDetail) {
      setFormData({
        name: classDetail.name || classDetail.class_name || "",
        course_id: classDetail.course_id || 0,
        start_date: formatDateForInput(classDetail.start_date),
        end_date: formatDateForInput(classDetail.end_date),
      });
    }
  };

  useEffect(() => {
    if (classDetail) {
      setFormData({
        name: classDetail.name || classDetail.class_name || "",
        course_id: classDetail.course_id || 0,
        start_date: formatDateForInput(classDetail.start_date),
        end_date: formatDateForInput(classDetail.end_date),
      });
    }
  }, [classDetail]);

  const handleToggleEdit = () => {
    if (isEditing) {
      resetForm();
    }
    setIsEditing((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.end_date < formData.start_date) {
      alert("End date cannot be earlier than start date.");
      return;
    }

    const success = await onSave(formData);
    if (success) {
      setIsEditing(false);
    }
  };

  const openDatePicker = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (!isEditing || !ref.current) return;
    const inputEl = ref.current;

    if ("showPicker" in inputEl && typeof inputEl.showPicker === "function") {
      inputEl.showPicker();
    } else {
      inputEl.focus();
    }
  };

  return (
    <div className="glass-card border border-border-main p-6 rounded-2xl h-auto space-y-5">
      <div className="flex items-center justify-between border-b border-border-main pb-3.5">
        <h2 className="text-sm font-semibold text-text-main">Class Details</h2>
        <button
          type="button"
          onClick={handleToggleEdit}
          className="text-xs text-brand-primary hover:text-brand-primary-hover flex items-center gap-1.5 font-medium transition-colors"
        >
          <FaUserEdit /> {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="text-text-muted block mb-1 font-medium">
            Class Name
          </label>
          <input
            type="text"
            disabled={!isEditing}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-surface-hover border border-border-main rounded-xl px-3 py-2 text-text-main disabled:opacity-60 focus:outline-none focus:border-brand-primary"
            required
          />
        </div>

        <div>
          <label className="text-text-muted block mb-1 font-medium">
            Associated Course
          </label>
          <CourseCombobox
            disabled={!isEditing}
            value={formData.course_id ? Number(formData.course_id) : null}
            onChange={(courseId) =>
              setFormData({ ...formData, course_id: courseId })
            }
            placeholder="Type or select a course..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-text-muted block mb-1 font-medium">
              Start Date
            </label>
            <input
              ref={startDateRef}
              type="date"
              disabled={!isEditing}
              value={formData.start_date}
              max={formData.end_date || undefined}
              onKeyDown={(e) => e.preventDefault()}
              onClick={() => openDatePicker(startDateRef)}
              onChange={(e) =>
                setFormData({ ...formData, start_date: e.target.value })
              }
              className="w-full bg-surface-hover border border-border-main rounded-xl px-3 py-2 text-text-main disabled:opacity-60 focus:outline-none focus:border-brand-primary cursor-pointer [scheme:light] [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              required
            />
          </div>

          <div>
            <label className="text-text-muted block mb-1 font-medium">
              End Date
            </label>
            <input
              ref={endDateRef}
              type="date"
              disabled={!isEditing}
              value={formData.end_date}
              min={formData.start_date || undefined}
              onKeyDown={(e) => e.preventDefault()}
              onClick={() => openDatePicker(endDateRef)}
              onChange={(e) =>
                setFormData({ ...formData, end_date: e.target.value })
              }
              className="w-full bg-surface-hover border border-border-main rounded-xl px-3 py-2 text-text-main disabled:opacity-60 focus:outline-none focus:border-brand-primary cursor-pointer [scheme:light] [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              required
            />
          </div>
        </div>

        {isEditing && (
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-medium py-2 rounded-xl transition-all disabled:opacity-50 mt-2 shadow-md shadow-brand-primary/20"
          >
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        )}
      </form>
    </div>
  );
}
