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
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5 text-rose-400">
          <FaExclamationTriangle className="text-lg" />
          <div>
            <h2 className="text-base font-bold text-white">Unpaid Fees</h2>
            <p className="text-xs text-slate-400">
              Students who haven't settled fees for the selected period.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300">
            <FaFilter className="text-slate-500 text-xs" />
            <span>Filter:</span>
          </div>

          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2 outline-none focus:border-rose-500/50"
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
            className="bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2 outline-none focus:border-rose-500/50"
          >
            {years.map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/40">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">Student Name</th>
              <th className="py-3 px-4">Contact Details</th>
              <th className="py-3 px-4">Enrolled Class</th>
              <th className="py-3 px-4 text-right">Class Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {loading ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500">
                  Loading unpaid student list...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500">
                  No unpaid records found for {selectedYear}-{selectedMonth}.
                </td>
              </tr>
            ) : (
              students.map((st, idx) => (
                <tr
                  key={`${st.student_id}-${st.class_id}-${idx}`}
                  className="hover:bg-slate-900/50 transition-colors"
                >
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {st.student_name}
                  </td>
                  <td className="py-3.5 px-4 space-y-0.5 text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <FaEnvelope className="text-slate-500 text-[10px]" />
                      <span>{st.student_email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FaPhoneAlt className="text-slate-500 text-[10px]" />
                      <span>{st.student_phone}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-200">
                      {st.class_name}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <FaGraduationCap className="text-indigo-400" />
                      {st.course_title}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-md font-semibold border inline-block ${
                        st.class_status === "Completed"
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
                          : "bg-cyan-500/10 border-cyan-500/20 text-cyan-300"
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

      {/* Pagination Bar */}
      {!loading && pagination.totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-400">
          <div>
            Showing{" "}
            <span className="font-semibold text-white">
              {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-white">
              {Math.min(
                pagination.currentPage * pagination.itemsPerPage,
                pagination.totalItems,
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-white">
              {pagination.totalItems}
            </span>{" "}
            students
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={pagination.currentPage === 1}
              className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <FaChevronLeft />
            </button>
            <span className="px-2 font-medium text-slate-300">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, pagination.totalPages),
                )
              }
              disabled={pagination.currentPage === pagination.totalPages}
              className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
