"use client";

import { useState, useEffect } from "react";

interface UseClassFiltersOptions {
  onFilterChange?: () => void;
}

export function useClassFilters(options?: UseClassFiltersOptions) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    options?.onFilterChange?.();
  }, [searchQuery, statusFilter]);

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    options?.onFilterChange?.();
  };

  const isFiltered = Boolean(searchQuery || statusFilter);

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    resetFilters,
    isFiltered,
  };
}
