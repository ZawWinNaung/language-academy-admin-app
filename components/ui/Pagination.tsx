"use client";

import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize = 20,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(
    currentPage * pageSize,
    totalItems ?? currentPage * pageSize,
  );

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border-main text-xs">
      <div className="text-text-muted">
        {totalItems !== undefined ? (
          <span>
            Showing <strong className="text-text-main">{startItem}</strong> to{" "}
            <strong className="text-text-main">{endItem}</strong> of{" "}
            <strong className="text-text-main">{totalItems}</strong> entries
          </span>
        ) : (
          <span>
            Page <strong className="text-text-main">{currentPage}</strong> of{" "}
            <strong className="text-text-main">{totalPages}</strong>
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 bg-surface border border-border-main hover:bg-surface-hover hover:border-brand-primary/40 disabled:opacity-40 disabled:hover:bg-surface disabled:hover:border-border-main text-text-main rounded-lg transition-all cursor-pointer"
          aria-label="Previous page"
        >
          <FaChevronLeft className="text-[10px]" />
        </button>

        {getPageNumbers().map((page, idx) =>
          typeof page === "number" ? (
            <button
              key={idx}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                currentPage === page
                  ? "bg-brand-primary border-brand-primary text-white shadow-xs"
                  : "bg-surface border-border-main hover:bg-surface-hover hover:border-brand-primary/40 text-text-main"
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={idx} className="px-2 text-text-dim">
              {page}
            </span>
          ),
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 bg-surface border border-border-main hover:bg-surface-hover hover:border-brand-primary/40 disabled:opacity-40 disabled:hover:bg-surface disabled:hover:border-border-main text-text-main rounded-lg transition-all cursor-pointer"
          aria-label="Next page"
        >
          <FaChevronRight className="text-[10px]" />
        </button>
      </div>
    </div>
  );
}
