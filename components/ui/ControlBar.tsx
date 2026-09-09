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
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 glass-card p-4 rounded-2xl border border-slate-800/80">
      <div className="relative w-full sm:w-80">
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
        />
        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none" />
      </div>
      <div className="text-xs text-slate-400 font-medium">
        Showing{" "}
        <span className="text-indigo-400 font-bold">{filteredCount}</span> of{" "}
        <span className="text-white font-bold">{totalCount}</span> {entityName}
      </div>
    </div>
  );
}
