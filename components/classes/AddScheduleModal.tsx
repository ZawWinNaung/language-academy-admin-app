"use client";

import React, { useState } from "react";
import {
  FaTimes,
  FaClock,
  FaBook,
  FaUser,
  FaExclamationTriangle,
} from "react-icons/fa";
import TeacherCombobox from "@/components/classes/TeacherComboBox";
import { useClassTimetable } from "@/hooks/classes";

interface AddScheduleModalProps {
  classId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function AddScheduleModal({
  classId,
  isOpen,
  onClose,
  onSuccess,
}: AddScheduleModalProps) {
  const { addSlot, addingSlot } = useClassTimetable(classId);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    day_of_week: "Monday",
    subject: "",
    teacher_id: null as number | null,
    start_time: "09:00",
    end_time: "10:30",
  });

  if (!isOpen) return null;

  const handleClose = () => {
    setErrorMessage(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.subject.trim()) {
      setErrorMessage("Please enter a subject.");
      return;
    }
    if (!formData.teacher_id) {
      setErrorMessage("Please select an instructor.");
      return;
    }
    if (formData.start_time >= formData.end_time) {
      setErrorMessage("End time must be later than start time.");
      return;
    }

    const res = await addSlot({
      teacher_id: formData.teacher_id,
      day_of_week: formData.day_of_week,
      start_time: formData.start_time,
      end_time: formData.end_time,
      subject: formData.subject.trim(),
    });

    if (res.success) {
      onSuccess();
      handleClose();
      setFormData({
        day_of_week: "Monday",
        subject: "",
        teacher_id: null,
        start_time: "09:00",
        end_time: "10:30",
      });
    } else {
      // Shows conflict message smoothly in modal UI
      setErrorMessage(res.message || "Failed to add schedule slot.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card bg-surface border border-border-main w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border-main pb-3">
          <h2 className="text-sm font-bold text-text-main flex items-center gap-2">
            <FaClock className="text-brand-primary" /> Add Schedule Slot
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-text-dim hover:text-text-main transition-colors p-1 cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>

        {/* Inline Error Banner */}
        {errorMessage && (
          <div className="p-3 bg-status-danger/10 border border-status-danger/20 rounded-xl text-status-danger text-xs flex items-start gap-2.5 animate-in fade-in">
            <FaExclamationTriangle className="shrink-0 text-sm mt-0.5" />
            <div className="leading-relaxed font-medium">{errorMessage}</div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Day of Week */}
          <div>
            <label className="text-text-muted block mb-1 font-medium">
              Day of Week
            </label>
            <select
              value={formData.day_of_week}
              onChange={(e) =>
                setFormData({ ...formData, day_of_week: e.target.value })
              }
              className="w-full bg-surface-hover border border-border-main rounded-xl px-3 py-2 text-text-main focus:outline-none focus:border-brand-primary cursor-pointer font-medium"
            >
              {DAYS_OF_WEEK.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="text-text-muted block mb-1 font-medium flex items-center gap-1.5">
              <FaBook className="text-text-dim text-[11px]" /> Subject
            </label>
            <input
              type="text"
              placeholder="e.g., Advanced Academic Writing"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              className="w-full bg-surface-hover border border-border-main rounded-xl px-3 py-2 text-text-main focus:outline-none focus:border-brand-primary"
              required
            />
          </div>

          {/* Assigned Teacher Combobox */}
          <div>
            <label className="text-text-muted block mb-1 font-medium flex items-center gap-1.5">
              <FaUser className="text-text-dim text-[11px]" /> Assigned Teacher
            </label>
            <TeacherCombobox
              value={formData.teacher_id}
              onChange={(teacherId) => {
                setErrorMessage(null);
                setFormData({ ...formData, teacher_id: teacherId });
              }}
              placeholder="Type or select an instructor..."
            />
          </div>

          {/* Start & End Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-text-muted block mb-1 font-medium">
                Start Time
              </label>
              <input
                type="time"
                value={formData.start_time}
                onChange={(e) =>
                  setFormData({ ...formData, start_time: e.target.value })
                }
                className="w-full bg-surface-hover border border-border-main rounded-xl px-3 py-2 text-text-main focus:outline-none focus:border-brand-primary cursor-pointer"
                required
              />
            </div>
            <div>
              <label className="text-text-muted block mb-1 font-medium">
                End Time
              </label>
              <input
                type="time"
                value={formData.end_time}
                onChange={(e) =>
                  setFormData({ ...formData, end_time: e.target.value })
                }
                className="w-full bg-surface-hover border border-border-main rounded-xl px-3 py-2 text-text-main focus:outline-none focus:border-brand-primary cursor-pointer"
                required
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-main">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl text-text-muted hover:text-text-main font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addingSlot}
              className="bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-brand-primary/20 disabled:opacity-50 cursor-pointer"
            >
              {addingSlot ? "Adding Slot..." : "Add Slot"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
