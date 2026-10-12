"use client";

import React from "react";
import {
  FaExclamationTriangle,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaEnvelope,
  FaPhoneAlt,
  FaGraduationCap,
  FaCheckCircle,
} from "react-icons/fa";
import { useUnpaidFees } from "@/hooks/dashboard/useUnpaidFees";

const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export default function UnpaidFeesOverview() {
  const {
    students,
    pagination,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    currentPage,
    setCurrentPage,
    loading,
    recordPayment,
    processingId,
  } = useUnpaidFees();

  const currentDate = new Date();
  const years = Array.from(
    { length: 5 },
    (_, i) => currentDate.getFullYear() - 2 + i,
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-main pb-4">
        <div className="flex items-center gap-2.5 text-status-danger">
          <FaExclamationTriangle className="text-lg" />
          <div>
            <h2 className="text-base font-bold text-text-main">Unpaid Fees</h2>
            <p className="text-xs text-text-muted">
              Students who haven't settled fees for the selected period.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-surface border border-border-main px-3 py-1.5 rounded-xl text-xs text-text-muted shadow-xs">
            <FaFilter className="text-text-dim text-xs" />
            <span>Filter:</span>
          </div>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-surface border border-border-main text-xs text-text-main rounded-xl px-3 py-2 outline-none focus:border-brand-primary shadow-xs"
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-surface border border-border-main text-xs text-text-main rounded-xl px-3 py-2 outline-none focus:border-brand-primary shadow-xs"
          >
            {years.map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border-main bg-surface shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-surface-hover text-text-muted border-b border-border-main font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">Student Name</th>
              <th className="py-3 px-4">Contact Details</th>
              <th className="py-3 px-4">Enrolled Class</th>
              <th className="py-3 px-4 text-center">Class Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-main text-text-main">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-text-dim">
                  Loading unpaid student list...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-text-dim">
                  No unpaid records found for {selectedYear}-{selectedMonth}.
                </td>
              </tr>
            ) : (
              students.map((st, idx) => (
                <tr
                  key={`${st.student_id}-${st.class_id}-${idx}`}
                  className="hover:bg-surface-hover transition-colors"
                >
                  <td className="py-3.5 px-4 font-semibold text-text-main">
                    {st.student_name}
                  </td>
                  <td className="py-3.5 px-4 space-y-0.5 text-text-muted">
                    <div className="flex items-center gap-1.5">
                      <FaEnvelope className="text-text-dim text-[10px]" />
                      <span>{st.student_email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FaPhoneAlt className="text-text-dim text-[10px]" />
                      <span>{st.student_phone}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-text-main">
                      {st.class_name}
                    </div>
                    <div className="text-[11px] text-text-muted flex items-center gap-1 mt-0.5">
                      <FaGraduationCap className="text-brand-primary" />
                      {st.course_title}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-md font-semibold border inline-block ${
                        st.class_status === "Completed"
                          ? "bg-amber-50 border-amber-200 text-status-warning"
                          : "bg-sky-50 border-sky-200 text-sky-700"
                      }`}
                    >
                      {st.class_status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => recordPayment(st)}
                      disabled={processingId === st.enrollment_id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-status-success/10 hover:bg-status-success/20 text-status-success border border-status-success/20 font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50 text-[11px]"
                    >
                      <FaCheckCircle />
                      {processingId === st.enrollment_id
                        ? "Recording..."
                        : "Record Payment"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && pagination.totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-text-muted">
          <div>
            Showing{" "}
            <span className="font-semibold text-text-main">
              {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-text-main">
              {Math.min(
                pagination.currentPage * pagination.itemsPerPage,
                pagination.totalItems,
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-text-main">
              {pagination.totalItems}
            </span>{" "}
            students
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={pagination.currentPage === 1}
              className="p-2 bg-surface border border-border-main rounded-lg text-text-muted hover:text-text-main disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
            >
              <FaChevronLeft />
            </button>
            <span className="px-2 font-medium text-text-main">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, pagination.totalPages),
                )
              }
              disabled={pagination.currentPage === pagination.totalPages}
              className="p-2 bg-surface border border-border-main rounded-lg text-text-muted hover:text-text-main disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
