"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  FaCalendarAlt,
  FaUserGraduate,
  FaCheckCircle,
  FaExclamationCircle,
  FaUndo,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

interface StudentPayment {
  student_id: number;
  student_name: string;
  enrollment_id: number;
  payment_id: number | null;
  amount: string | null;
  paid_date: string | null;
  status: "Paid" | "Refunded" | "Unpaid";
}

interface ClassGroup {
  class_id: number;
  class_name: string;
  course_title: string;
  stats: { paid: number; unpaid: number; refunded: number; total: number };
  students: StudentPayment[];
}

export default function OngoingClassPayments() {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7),
  );
  const [classesData, setClassesData] = useState<ClassGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Track open/close state for each class row
  const [expandedClasses, setExpandedClasses] = useState<
    Record<number, boolean>
  >({});

  const monthInputRef = useRef<HTMLInputElement>(null);

  const fetchDashboardData = async (month: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/class-payments?month=${month}`);
      const result = await res.json();
      if (result.success) {
        setClassesData(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard class payments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(selectedMonth);
  }, [selectedMonth]);

  const handleMonthContainerClick = () => {
    const input = monthInputRef.current;
    if (!input) return;
    if ("showPicker" in input && typeof input.showPicker === "function") {
      input.showPicker();
    } else {
      input.focus();
    }
  };

  // Toggle single class expand state
  const toggleExpand = (classId: number) => {
    setExpandedClasses((prev) => ({
      ...prev,
      [classId]: !prev[classId],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header & Custom Month Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Ongoing Classes - Payment Status
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Overview of student payment records for active classes
          </p>
        </div>

        <div
          onClick={handleMonthContainerClick}
          className="relative flex items-center bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl px-3.5 py-2 cursor-pointer transition-all min-w-[140px] justify-between self-start sm:self-auto"
        >
          <div className="flex items-center gap-2 pointer-events-none">
            <FaCalendarAlt className="text-indigo-400 text-xs shrink-0" />
            <span className="text-xs font-semibold text-slate-200">
              {new Date(`${selectedMonth}-01`).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <input
            ref={monthInputRef}
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer [color-scheme:dark]"
          />
        </div>
      </div>

      {/* Accordion / Full-Width Single Row per Class */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-slate-900/50 border border-slate-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : classesData.length === 0 ? (
        <div className="text-center py-10 bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-400 text-xs">
          No ongoing classes found for this period.
        </div>
      ) : (
        <div className="space-y-3">
          {classesData.map((cls) => {
            const isExpanded = Boolean(expandedClasses[cls.class_id]);

            return (
              <div
                key={cls.class_id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl transition-all overflow-hidden"
              >
                {/* Single Class Row Bar */}
                <div
                  onClick={() => toggleExpand(cls.class_id)}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer select-none hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                      {isExpanded ? (
                        <FaChevronUp className="text-xs" />
                      ) : (
                        <FaChevronDown className="text-xs" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">
                        {cls.class_name}
                      </h3>
                      <p className="text-xs text-indigo-400 font-medium mt-0.5">
                        {cls.course_title}
                      </p>
                    </div>
                  </div>

                  {/* Right Side Stats & Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-3 border-t border-slate-800/60 md:border-none pt-2 md:pt-0">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                        Paid: {cls.stats.paid}
                      </span>
                      <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-lg">
                        Unpaid: {cls.stats.unpaid}
                      </span>
                      {cls.stats.refunded > 0 && (
                        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                          Refunded: {cls.stats.refunded}
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-medium text-slate-400 bg-slate-800/60 border border-slate-700/50 px-2.5 py-1 rounded-lg shrink-0">
                      {cls.students.length} Student
                      {cls.students.length > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Expandable Student List */}
                {isExpanded && (
                  <div className="border-t border-slate-800 bg-slate-950/40 p-4 space-y-2">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Enrolled Student List ({cls.students.length})
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      {cls.students.map((student) => (
                        <div
                          key={student.enrollment_id}
                          className="flex items-center justify-between p-3 bg-slate-900/90 border border-slate-800/80 rounded-xl text-xs hover:border-slate-700/60 transition-all"
                        >
                          <div className="flex items-center gap-2.5 truncate pr-2">
                            <FaUserGraduate className="text-slate-500 shrink-0 text-xs" />
                            <span className="font-medium text-slate-200 truncate">
                              {student.student_name}
                            </span>
                          </div>

                          {/* Status Badge */}
                          <div className="shrink-0">
                            {student.status === "Paid" && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                <FaCheckCircle className="text-[9px]" /> Paid
                              </span>
                            )}
                            {student.status === "Unpaid" && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                                <FaExclamationCircle className="text-[9px]" />{" "}
                                Unpaid
                              </span>
                            )}
                            {student.status === "Refunded" && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                                <FaUndo className="text-[9px]" /> Refunded
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
