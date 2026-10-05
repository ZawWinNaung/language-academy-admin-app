"use client";

import { useState } from "react";

export function usePagination(initialPage: number = 1) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const goToPage = (page: number, totalPages?: number) => {
    const targetPage = Math.max(
      1,
      totalPages ? Math.min(page, totalPages) : page,
    );
    setCurrentPage(targetPage);
  };

  const resetPage = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    setCurrentPage: goToPage,
    resetPage,
  };
}
