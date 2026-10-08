"use client";

import { FaSearch } from "react-icons/fa";

interface ControlBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
  filteredCount: number;
  totalCount: number;
  entityName?: string;
}

export default function ControlBar({
  searchQuery,
  onSearchChange,
  placeholder = "Search...",
  filteredCount,
  totalCount,
  entityName = "Items",
}: ControlBarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 glass-card p-4 rounded-2xl border border-border-main bg-surface shadow-xs">
      <div className="relative w-full sm:w-80">
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-surface-hover border border-border-main rounded-xl text-xs text-text-main placeholder-text-dim focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
        />
        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim text-xs pointer-events-none" />
      </div>
      <div className="text-xs text-text-muted font-medium">
        Showing{" "}
        <span className="text-brand-primary font-bold">{filteredCount}</span> of{" "}
        <span className="text-text-main font-bold">{totalCount}</span>{" "}
        {entityName}
      </div>
    </div>
  );
}
