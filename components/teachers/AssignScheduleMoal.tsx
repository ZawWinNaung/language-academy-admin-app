"use client";

import React, { useEffect, useState } from "react";
import {
  FaClock,
  FaTimes,
  FaExclamationTriangle,
  FaCalendarTimes,
} from "react-icons/fa";

interface TimetableOption {
  id: number;
  class_name: string;
  course_title: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  room_number: string;
}

interface AssignScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherId: number;
  existingSchedules: {
    day_of_week: string;
    start_time: string;
    end_time: string;
    class_name: string;
  }[];
  onAssignSuccess: () => void;
}

export default function AssignScheduleModal({
  isOpen,
  onClose,
  teacherId,
  existingSchedules,
  onAssignSuccess,
}: AssignScheduleModalProps) {
  const [availableSchedules, setAvailableSchedules] = useState<
    TimetableOption[]
  >([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedSchedule, setSelectedSchedule] =
    useState<TimetableOption | null>(null);
  const [conflict, setConflict] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Convert "HH:MM:SS" or "HH:MM" string to total minutes for comparison
  const timeToMinutes = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Check if two time slots overlap: (StartA < EndB) AND (EndA > StartB)
  const checkOverlap = (candidate: TimetableOption) => {
    const candStart = timeToMinutes(candidate.start_time);
    const candEnd = timeToMinutes(candidate.end_time);

    for (const existing of existingSchedules) {
      if (
        existing.day_of_week.toLowerCase() ===
        candidate.day_of_week.toLowerCase()
      ) {
        const existStart = timeToMinutes(existing.start_time);
        const existEnd = timeToMinutes(existing.end_time);

        if (candStart < existEnd && candEnd > existStart) {
          return `Time conflict with existing class "${existing.class_name}" on ${existing.day_of_week} (${existing.start_time} - ${existing.end_time})`;
        }
      }
    }
    return null;
  };

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch("/api/timetable/unassigned")
        .then(async (res) => {
          if (!res.ok) return { success: false, data: [] };
          const text = await res.text();
          return text ? JSON.parse(text) : { success: false, data: [] };
        })
        .then((result) => {
          if (result.success && Array.isArray(result.data)) {
            setAvailableSchedules(result.data);
          } else {
            setAvailableSchedules([]);
          }
        })
        .catch((err) => {
          console.error("Error fetching unassigned schedules:", err);
          setAvailableSchedules([]);
        })
        .finally(() => setLoading(false));
    } else {
      setSelectedId("");
      setSelectedSchedule(null);
      setConflict(null);
    }
  }, [isOpen]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedId(id);

    const schedule =
      availableSchedules.find((s) => s.id === Number(id)) || null;
    setSelectedSchedule(schedule);

    if (schedule) {
      const conflictMsg = checkOverlap(schedule);
      setConflict(conflictMsg);
    } else {
      setConflict(null);
    }
  };

  const handleAssign = async () => {
    if (!selectedId || conflict) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/timetable/${selectedId}/assign`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacher_id: teacherId }),
      });

      const result = await res.json();
      if (result.success) {
        onAssignSuccess();
        onClose();
      } else {
        alert(result.message || "Failed to assign schedule.");
      }
    } catch (err) {
      console.error("Error assigning schedule", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white">
            Assign Timetable Schedule
          </h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 text-xs"
          >
            <FaTimes />
          </button>
        </div>

        {loading ? (
          <p className="text-xs text-slate-400 text-center py-4">
            Loading unassigned timetables...
          </p>
        ) : availableSchedules.length === 0 ? (
          <div className="py-8 text-center space-y-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 text-slate-400">
              <FaCalendarTimes className="text-base" />
            </div>
            <p className="text-xs text-slate-400">
              No unassigned schedules available.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl font-semibold transition-all"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1.5">
                Select Timetable Slot
              </label>
              <select
                value={selectedId}
                onChange={handleSelectChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="">-- Choose an unassigned schedule --</option>
                {availableSchedules.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.class_name} ({item.course_title}) - {item.day_of_week}{" "}
                    ({item.start_time} - {item.end_time})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Schedule Details */}
            {selectedSchedule && (
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">
                    {selectedSchedule.class_name}
                  </span>
                  <span className="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                    {selectedSchedule.course_title}
                  </span>
                </div>

                <div className="text-slate-400 space-y-1 text-xs">
                  <p>
                    <strong className="text-slate-300">Day:</strong>{" "}
                    {selectedSchedule.day_of_week}
                  </p>
                  <p className="flex items-center gap-1">
                    <FaClock className="text-indigo-400 text-[10px]" />
                    <strong className="text-slate-300">Time:</strong>{" "}
                    {selectedSchedule.start_time} - {selectedSchedule.end_time}
                  </p>
                  <p>
                    <strong className="text-slate-300">Room:</strong>{" "}
                    {selectedSchedule.room_number || "N/A"}
                  </p>
                </div>
              </div>
            )}

            {/* Overlap Warning Box */}
            {conflict && (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 flex items-start gap-2.5 text-rose-300 text-xs">
                <FaExclamationTriangle className="text-rose-400 text-sm shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-rose-200 font-semibold mb-0.5">
                    Schedule Conflict Detected
                  </strong>
                  {conflict}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-800 text-slate-400 rounded-xl hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedSchedule || Boolean(conflict) || submitting}
                onClick={handleAssign}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all"
              >
                {submitting ? "Assigning..." : "Assign Schedule"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
