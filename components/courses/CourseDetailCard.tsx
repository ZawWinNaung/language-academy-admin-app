"use client";

import React, { useState, useEffect } from "react";
import { Course, CourseFormData } from "@/types/course";
import { FaBookOpen, FaUserEdit } from "react-icons/fa";

interface CourseDetailCardProps {
  course: Course;
  submitting: boolean;
  onUpdate: (formData: CourseFormData) => Promise<boolean>;
}

export default function CourseDetailCard({
  course,
  submitting,
  onUpdate,
}: CourseDetailCardProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<CourseFormData>({
    code: course.code,
    title: course.title,
    description: course.description || "",
  });

  useEffect(() => {
    if (course) {
      setFormData({
        code: course.code,
        title: course.title,
        description: course.description || "",
      });
    }
  }, [course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onUpdate(formData);
    if (success) {
      setIsEditing(false);
    }
  };

  return (
    <div className="glass-card border border-border-main p-6 rounded-2xl h-auto self-start space-y-4">
      <div className="flex items-center justify-between border-b border-border-main pb-3">
        <div className="flex items-center gap-2 text-text-main font-semibold text-sm">
          <FaBookOpen className="text-brand-primary" />
          <span>Course Details</span>
        </div>
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs text-brand-primary hover:text-brand-primary-hover flex items-center gap-1 font-medium transition-colors cursor-pointer"
        >
          <FaUserEdit /> {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="text-text-muted block mb-1 font-medium uppercase tracking-wider text-[10px]">
            Course Code
          </label>
          <input
            type="text"
            required
            disabled={!isEditing}
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            className="w-full bg-surface-hover border border-border-main rounded-xl px-3 py-2 text-text-main font-mono disabled:opacity-60 focus:outline-none focus:border-brand-primary"
          />
        </div>

        <div>
          <label className="text-text-muted block mb-1 font-medium uppercase tracking-wider text-[10px]">
            Course Title
          </label>
          <input
            type="text"
            required
            disabled={!isEditing}
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full bg-surface-hover border border-border-main rounded-xl px-3 py-2 text-text-main disabled:opacity-60 focus:outline-none focus:border-brand-primary"
          />
        </div>

        <div>
          <label className="text-text-muted block mb-1 font-medium uppercase tracking-wider text-[10px]">
            Description
          </label>
          <textarea
            rows={4}
            disabled={!isEditing}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="No description provided for this course."
            className="w-full bg-surface-hover border border-border-main rounded-xl px-3 py-2 text-text-main disabled:opacity-60 focus:outline-none focus:border-brand-primary"
          />
        </div>

        {isEditing && (
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-medium py-2 rounded-xl transition-all disabled:opacity-50 mt-2 shadow-md shadow-brand-primary/20 cursor-pointer"
          >
            {submitting ? "Saving Changes..." : "Save Changes"}
          </button>
        )}
      </form>
    </div>
  );
}
