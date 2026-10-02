"use client";

import React from "react";
import { FaGraduationCap } from "react-icons/fa";
import { ClassEnrolledStudent, EnrollmentStatus } from "@/types/class";

interface EnrolledStudentsTableProps {
  students: ClassEnrolledStudent[];
  updatingId: number | null;
  onStatusChange: (
    enrollmentId: number,
    newStatus: EnrollmentStatus,
  ) => Promise<boolean>;
}

export function EnrolledStudentsTable({
  students,
  updatingId,
  onStatusChange,
}: EnrolledStudentsTableProps) {
  const statusBadgeStyle = (status: EnrollmentStatus) => {
    switch (status) {
      case "Active":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Promoted":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "Dropped":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "Completed":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-slate-800 text-slate-400 border-slate-700";
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl h-auto self-start space-y-4 overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <FaGraduationCap className="text-indigo-400" />
          Enrolled Students ({students.length})
        </h2>
      </div>

      {students.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-8">
          No students enrolled in this class yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium">
                <th className="py-2 px-3">Student Name</th>
                <th className="py-2 px-3">Email & Phone</th>
                <th className="py-2 px-3">Enrolled Date</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {students.map((st) => (
                <tr key={st.enrollment_id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3 font-medium text-white">
                    {st.name}
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    <div>{st.email}</div>
                    <div className="text-[11px] text-slate-500">{st.phone}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    {st.enrolled_date}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] px-2.5 py-1 rounded-lg border font-medium inline-block ${statusBadgeStyle(
                        st.enrollment_status,
                      )}`}
                    >
                      {st.enrollment_status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <select
                      disabled={updatingId === st.enrollment_id}
                      value={st.enrollment_status}
                      onChange={(e) =>
                        onStatusChange(
                          st.enrollment_id,
                          e.target.value as EnrollmentStatus,
                        )
                      }
                      className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-2 py-1 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                    >
                      <option value="Active">Active</option>
                      <option value="Promoted">Promoted</option>
                      <option value="Graduated">Graduated</option>
                      <option value="Demoted">Demoted</option>
                      <option value="Dropped">Dropped</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
