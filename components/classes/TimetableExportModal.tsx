"use client";

import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import {
  FaDownload,
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { TimetableEntry } from "@/types/timetable";

interface TimetableExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  className: string;
  courseTitle: string;
  startDate?: string;
  endDate?: string;
  schedules: TimetableEntry[];
}

export function TimetableExportModal({
  isOpen,
  onClose,
  className,
  courseTitle,
  startDate,
  endDate,
  schedules,
}: TimetableExportModalProps) {
  const exportRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!exportRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(exportRef.current, {
        cacheBust: true,
        quality: 0.95,
      });
      const link = document.createElement("a");
      link.download = `${className.replace(/\s+/g, "_")}_Timetable.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate timetable image:", err);
      alert("Could not export image. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-card bg-surface-main border border-border-main rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-main">
          <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
            <FaCalendarAlt className="text-brand-primary" /> Export Student
            Timetable
          </h3>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-main p-1 rounded-lg transition-colors cursor-pointer"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh] bg-surface-hover flex justify-center">
          <div
            ref={exportRef}
            className="w-full max-w-lg bg-white text-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 flex flex-col space-y-6"
            style={{ fontFamily: "inherit" }}
          >
            <div className="text-center border-b border-slate-100 pb-4 space-y-1.5">
              <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                Cambridge Language Academy
              </span>
              <h1 className="text-xl font-black text-slate-800 mt-2">
                {className}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {courseTitle}
              </p>

              {startDate && endDate && (
                <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-600 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 mt-1 font-medium">
                  <FaCalendarAlt className="text-indigo-500 text-[10px]" />
                  <span>
                    Batch Period:{" "}
                    <strong className="text-slate-800">{startDate}</strong> to{" "}
                    <strong className="text-slate-800">{endDate}</strong>
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Weekly Class Schedule
              </h4>
              {schedules.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-4">
                  No active schedules assigned.
                </p>
              ) : (
                schedules.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                        {slot.day_of_week}
                      </span>
                      <p className="text-xs font-semibold text-slate-700">
                        {slot.subject}
                      </p>
                    </div>
                    <div className="text-right space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium justify-end">
                        <FaClock className="text-slate-400 text-[10px]" />
                        <span>
                          {slot.start_time} - {slot.end_time}
                        </span>
                      </div>
                      {slot.teacher_name && (
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium justify-end">
                          <FaChalkboardTeacher className="text-slate-400 text-[10px]" />
                          <span>{slot.teacher_name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="text-center pt-2 border-t border-slate-100">
              <p className="text-[10px] text-slate-400">
                Please attend classes on time. For inquiries, contact academy
                admin.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-main bg-surface-main">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-text-muted hover:text-text-main cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={downloading || schedules.length === 0}
            onClick={handleDownload}
            className="bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-brand-primary/20 flex items-center gap-2 cursor-pointer"
          >
            <FaDownload />{" "}
            {downloading ? "Generating Image..." : "Download Timetable PNG"}
          </button>
        </div>
      </div>
    </div>
  );
}
