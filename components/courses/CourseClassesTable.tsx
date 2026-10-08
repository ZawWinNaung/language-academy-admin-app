"use client";

import React from "react";
import Pagination from "@/components/ui/Pagination";
import { CourseClass, CourseClassesPagination } from "@/types/course";
import { FaChalkboardTeacher, FaChevronRight } from "react-icons/fa";

interface CourseClassesTableProps {
  classes: CourseClass[];
  loading: boolean;
  pagination: CourseClassesPagination;
  onPageChange: (page: number) => void;
  onItemClick: (classId: number) => void;
}

export default function CourseClassesTable({
  classes,
  loading,
  pagination,
  onPageChange,
  onItemClick,
}: CourseClassesTableProps) {
  return (
    <div className="glass-card border border-border-main p-6 rounded-2xl h-auto self-start space-y-4 overflow-hidden">
      <div className="flex items-center justify-between border-b border-border-main pb-3">
        <h2 className="text-sm font-semibold text-text-main flex items-center gap-2">
          <FaChalkboardTeacher className="text-brand-primary" />
          Associated Classes ({pagination.totalItems})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border-main text-text-muted font-medium">
              <th className="py-2 px-3">Class Name</th>
              <th className="py-2 px-3">Start Date</th>
              <th className="py-2 px-3">End Date</th>
              <th className="py-2 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-main">
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-3 px-3">
                    <div className="h-3 bg-surface-hover rounded w-3/4" />
                  </td>
                  <td className="py-3 px-3">
                    <div className="h-3 bg-surface-hover rounded w-1/2" />
                  </td>
                  <td className="py-3 px-3">
                    <div className="h-3 bg-surface-hover rounded w-1/2" />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="h-3 bg-surface-hover rounded w-4 ml-auto" />
                  </td>
                </tr>
              ))
            ) : classes.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-8 text-center text-text-muted text-xs font-medium"
                >
                  No classes assigned to this course yet.
                </td>
              </tr>
            ) : (
              classes.map((cls) => (
                <tr
                  key={cls.id}
                  onClick={() => onItemClick(cls.id)}
                  className="hover:bg-surface-hover cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-3 font-semibold text-text-main group-hover:text-brand-primary">
                    {cls.name}
                  </td>
                  <td className="py-3 px-3 text-text-muted font-mono">
                    {cls.start_date
                      ? new Date(cls.start_date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-3 px-3 text-text-muted font-mono">
                    {cls.end_date
                      ? new Date(cls.end_date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-3 px-3 text-right text-text-dim group-hover:text-brand-primary transition-colors">
                    <FaChevronRight className="text-xs inline" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        pageSize={pagination.pageSize}
        onPageChange={onPageChange}
      />
    </div>
  );
}
