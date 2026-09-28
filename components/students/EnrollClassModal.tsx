"use client";

import React, { useState } from "react";
import {
  FaGraduationCap,
  FaTimes,
  FaPlus,
  FaExclamationCircle,
} from "react-icons/fa";
import Link from "next/link";

interface AvailableClass {
  id: number;
  name: string;
  course_title: string;
}

interface EnrollClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (classId: number) => void;
  availableClasses: AvailableClass[];
  enrolling: boolean;
}

export default function EnrollClassModal({
  isOpen,
  onClose,
  onEnroll,
  availableClasses,
  enrolling,
}: EnrollClassModalProps) {
  const [selectedClassId, setSelectedClassId] = useState<number | "">("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClassId) {
      onEnroll(Number(selectedClassId));
    }
  };

  const hasAvailableClasses = availableClasses && availableClasses.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <FaGraduationCap className="text-indigo-400" /> Enroll in New Class
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <FaTimes />
          </button>
        </div>

        {!hasAvailableClasses ? (
          <div className="space-y-4 py-2 text-xs">
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 flex items-start gap-3">
              <FaExclamationCircle className="text-base shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-200">
                  No Available Classes Found
                </p>
                <p className="text-[11px] text-amber-300/80 mt-1">
                  There are no open or eligible classes available for enrollment
                  right now.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
              >
                Close
              </button>
              <Link
                href="/classes"
                onClick={onClose}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold inline-flex items-center gap-1.5"
              >
                <FaPlus className="text-[10px]" /> Create New Class
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Select Target Class
              </label>
              <select
                value={selectedClassId}
                onChange={(e) =>
                  setSelectedClassId(
                    e.target.value ? Number(e.target.value) : "",
                  )
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                required
              >
                <option value="">-- Select a class --</option>
                {availableClasses.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.course_title})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={enrolling || !selectedClassId}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold disabled:opacity-50"
              >
                {enrolling ? "Enrolling..." : "Confirm Enrollment"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
