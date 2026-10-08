"use client";

import React, { useState, useEffect } from "react";
import { FaGraduationCap, FaUserPlus } from "react-icons/fa";
import {
  ClassEnrolledStudent,
  EnrollmentStatus,
  ClassStatus,
} from "@/types/class";
import { EnrollStudentsModal } from "@/components/classes/EnrollStudentsModal";
import Pagination from "@/components/ui/Pagination";

interface EnrolledStudentsTableProps {
  classId: number;
  classStatus?: ClassStatus;
  students: ClassEnrolledStudent[];
  updatingId: number | null;
  onStatusChange: (
    enrollmentId: number,
    newStatus: EnrollmentStatus,
  ) => Promise<boolean>;
  onRefresh: () => void;
  onItemClick: (student_id: number) => void;
}

const PAGE_SIZE = 10;

export function EnrolledStudentsTable({
  classId,
  classStatus,
  students,
  updatingId,
  onStatusChange,
  onRefresh,
  onItemClick,
}: EnrolledStudentsTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const isCompleted = classStatus === "Completed";
  const totalItems = students.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [students.length, totalPages, currentPage]);

  const paginatedStudents = students.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const statusBadgeStyle = (status: EnrollmentStatus) => {
    switch (status) {
      case "Active":
        return "bg-status-success/10 text-status-success border-status-success/20";
      case "Promoted":
        return "bg-brand-primary-light text-brand-primary border-brand-primary/20";
      case "Dropped":
        return "bg-status-danger/10 text-status-danger border-status-danger/20";
      case "Completed":
        return "bg-brand-primary-light text-brand-primary border-brand-primary/20";
      default:
        return "bg-surface-hover text-text-muted border-border-main";
    }
  };

  return (
    <div className="glass-card border border-border-main p-6 rounded-2xl h-auto self-start space-y-4 overflow-hidden">
      <div className="flex items-center justify-between border-b border-border-main pb-3">
        <h2 className="text-sm font-semibold text-text-main flex items-center gap-2">
          <FaGraduationCap className="text-brand-primary" />
          Enrolled Students ({totalItems})
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={isCompleted}
          title={
            isCompleted
              ? "Cannot enroll students into a completed class"
              : undefined
          }
          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary hover:bg-brand-primary-hover disabled:bg-surface-hover disabled:text-text-dim disabled:cursor-not-allowed text-xs text-white font-medium rounded-xl transition-all"
        >
          <FaUserPlus className="text-[11px]" /> Enroll Students
        </button>
      </div>

      {students.length === 0 ? (
        <p className="text-xs text-text-muted text-center py-8">
          No students enrolled in this class yet.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-text-muted border-collapse">
              <thead>
                <tr className="border-b border-border-main text-text-muted font-medium">
                  <th className="py-2 px-3">Student Name</th>
                  <th className="py-2 px-3">Email & Phone</th>
                  <th className="py-2 px-3">Enrolled Date</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main">
                {paginatedStudents.map((st) => (
                  <tr
                    key={st.enrollment_id}
                    className="hover:bg-surface-hover"
                    onClick={() => onItemClick(st.student_id)}
                  >
                    <td className="py-3 px-3 font-medium text-text-main">
                      {st.name}
                    </td>
                    <td className="py-3 px-3 text-text-muted">
                      <div>{st.email}</div>
                      <div className="text-[11px] text-text-dim">
                        {st.phone}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-text-muted">
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
                        className="bg-surface-hover border border-border-main text-xs text-text-main rounded-xl px-2 py-1 focus:outline-none focus:border-brand-primary disabled:opacity-50"
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

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={PAGE_SIZE}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}

      <EnrollStudentsModal
        classId={classId}
        isOpen={isModalOpen && !isCompleted}
        onClose={() => setIsModalOpen(false)}
        onSuccess={onRefresh}
      />
    </div>
  );
}
