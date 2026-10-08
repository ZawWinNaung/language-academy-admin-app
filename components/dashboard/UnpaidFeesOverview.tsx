"use client";

import React, { useEffect, useState } from "react";
import {
  FaExclamationTriangle,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaEnvelope,
  FaPhoneAlt,
  FaGraduationCap,
} from "react-icons/fa";

interface UnpaidStudentItem {
  student_id: number;
  student_name: string;
  student_email: string;
  student_phone: string;
  class_id: number;
  class_name: string;
  course_title: string;
  class_status: string;
  unpaid_month: string;
}

interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

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
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState<string>(
    String(currentDate.getFullYear()),
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    String(currentDate.getMonth() + 1).padStart(2, "0"),
  );
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [students, setStudents] = useState<UnpaidStudentItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10,
  });
  const [loading, setLoading] = useState<boolean>(true);

  const years = Array.from(
    { length: 5 },
    (_, i) => currentDate.getFullYear() - 2 + i,
  );

  const fetchUnpaidStudents = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        year: selectedYear,
        month: selectedMonth,
        page: String(currentPage),
        limit: "10",
      });

      const res = await fetch(
        `/api/dashboard/unpaid-fees?${queryParams.toString()}`,
      );
      const result = await res.json();

      if (result.success) {
        setStudents(result.data || []);
        setPagination(result.pagination);
      }
    } catch (err) {
      console.error("Failed to load unpaid fee list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnpaidStudents();
  }, [selectedYear, selectedMonth, currentPage]);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
    setCurrentPage(1);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
    setCurrentPage(1);
  };

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
            onChange={handleMonthChange}
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
            onChange={handleYearChange}
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
              <th className="py-3 px-4 text-right">Class Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-main text-text-main">
            {loading ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-text-dim">
                  Loading unpaid student list...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-text-dim">
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
                  <td className="py-3.5 px-4 text-right">
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
