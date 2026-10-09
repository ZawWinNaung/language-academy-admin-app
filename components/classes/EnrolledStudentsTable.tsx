"use client";

import React, { useState, useEffect } from "react";
import { FaGraduationCap, FaUserPlus, FaTrashAlt } from "react-icons/fa";
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
  onRemoveStudent?: (enrollmentId: number) => void;
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
  onRemoveStudent,
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

  return (
    <div className="glass-card border border-border-main p-4 sm:p-6 rounded-2xl h-auto lg:h-full flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-main pb-3 shrink-0 gap-2">
        <h2 className="text-sm font-semibold text-text-main flex items-center gap-2 truncate">
          <FaGraduationCap className="text-brand-primary shrink-0" />
          <span>Enrolled Students ({totalItems})</span>
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={isCompleted}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary hover:bg-brand-primary-hover disabled:bg-surface-hover disabled:text-text-dim text-xs text-white font-medium rounded-xl transition-all cursor-pointer shrink-0"
        >
          <FaUserPlus className="text-[11px]" />
          <span className="hidden sm:inline">Enroll Students</span>
          <span className="sm:hidden">Enroll</span>
        </button>
      </div>

      {/* Content Body */}
      {students.length === 0 ? (
        <div className="py-8 text-center text-xs text-text-muted">
          No students enrolled in this class yet.
        </div>
      ) : (
        <div className="lg:flex-1 overflow-x-auto lg:overflow-y-auto my-3">
          <table className="w-full text-left text-xs text-text-muted border-collapse min-w-125">
            <thead className="sticky top-0 bg-surface z-10">
              <tr className="border-b border-border-main text-text-muted font-medium">
                <th className="py-2 px-3 text-center">Name</th>
                <th className="py-2 px-3 text-center">Contact</th>
                <th className="py-2 px-3 text-center">Enrolled Date</th>
                <th className="py-2 px-3 text-center">Status</th>
                <th className="py-2 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {paginatedStudents.map((st) => (
                <tr
                  key={st.enrollment_id}
                  className="hover:bg-surface-hover cursor-pointer"
                  onClick={() => onItemClick(st.student_id)}
                >
                  <td className="py-3 px-3 font-medium text-text-main">
                    {st.name}
                  </td>
                  <td className="py-3 px-3 text-text-muted">
                    <div>{st.email}</div>
                    <div className="text-[11px] text-text-dim">{st.phone}</div>
                  </td>
                  <td className="py-3 px-3 text-text-muted">
                    {st.enrolled_date}
                  </td>
                  <td
                    className="py-3 px-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <select
                      disabled={updatingId === st.enrollment_id}
                      value={st.enrollment_status}
                      onChange={(e) =>
                        onStatusChange(
                          st.enrollment_id,
                          e.target.value as EnrollmentStatus,
                        )
                      }
                      className="bg-surface-hover border border-border-main text-xs text-text-main font-medium rounded-xl px-2.5 py-1 focus:outline-none focus:border-brand-primary disabled:opacity-50 cursor-pointer"
                    >
                      <option value="Active">Active</option>
                      <option value="Promoted">Promoted</option>
                      <option value="Graduated">Graduated</option>
                      <option value="Demoted">Demoted</option>
                      <option value="Dropped">Dropped</option>
                    </select>
                  </td>
                  <td
                    className="py-3 px-3 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      disabled={updatingId === st.enrollment_id}
                      onClick={() =>
                        onRemoveStudent
                          ? onRemoveStudent(st.enrollment_id)
                          : onStatusChange(st.enrollment_id, "Dropped")
                      }
                      className="inline-flex items-center gap-1 text-xs text-status-danger hover:text-rose-700 font-medium px-2.5 py-1 rounded-lg hover:bg-status-danger/10 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      <div className="shrink-0 pt-2 border-t border-border-main">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={PAGE_SIZE}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      <EnrollStudentsModal
        classId={classId}
        isOpen={isModalOpen && !isCompleted}
        onClose={() => setIsModalOpen(false)}
        onSuccess={onRefresh}
      />
    </div>
  );
}
