"use client";

import React, { useRef } from "react";
import { FaSearch, FaFilter, FaCalendarAlt, FaTimes } from "react-icons/fa";

interface PaymentFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  filteredCount: number;
  totalCount: number;
}

export default function PaymentFilterBar({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedMonth,
  onMonthChange,
  filteredCount,
  totalCount,
}: PaymentFilterBarProps) {
  const monthInputRef = useRef<HTMLInputElement>(null);

  const handleMonthContainerClick = () => {
    const input = monthInputRef.current;
    if (!input) return;

    if ("showPicker" in input && typeof input.showPicker === "function") {
      input.showPicker();
    } else {
      input.focus();
    }
  };

  const isFiltered = Boolean(searchQuery || selectedStatus || selectedMonth);

  const handleResetFilters = () => {
    onSearchChange("");
    onStatusChange("");
    onMonthChange("");
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-md shadow-lg">
      {/* Search Input */}
      <div className="relative flex-1">
        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by student name or enrollment ID..."
          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
          >
            <FaTimes />
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Dropdown */}
        <div className="relative flex items-center">
          <FaFilter className="absolute left-3 text-slate-500 text-[10px] pointer-events-none" />
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-slate-950/80 border border-slate-800 text-slate-300 rounded-xl pl-8 pr-4 py-2 text-xs focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>

        {/* Enhanced Native Web Month Date Picker */}
        {/* Custom Month Picker Wrapper */}
        <div
          onClick={handleMonthContainerClick}
          className="relative flex items-center bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-2 cursor-pointer transition-all group min-w-[130px] justify-between"
        >
          <div className="flex items-center gap-2 pointer-events-none">
            <FaCalendarAlt className="text-slate-500 group-hover:text-indigo-400 text-xs transition-colors shrink-0" />
            <span className="text-xs text-slate-300 select-none">
              {selectedMonth
                ? new Date(`${selectedMonth}-01`).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })
                : "Select Month"}
            </span>
          </div>

          {/* Hidden Input Layer - Triggers Native Picker */}
          <input
            ref={monthInputRef}
            type="month"
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer [color-scheme:dark]"
          />

          {/* Clear Month Button */}
          {selectedMonth && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMonthChange("");
              }}
              className="text-slate-500 hover:text-rose-400 text-xs ml-2 z-10"
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* Reset Filters Button */}
        {isFiltered && (
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-all"
          >
            <FaTimes className="text-[10px]" /> Reset
          </button>
        )}

        {/* Counter Badge */}
        <span className="text-xs font-mono text-slate-400 bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700/50 shrink-0">
          Showing <strong className="text-indigo-400">{filteredCount}</strong> /{" "}
          {totalCount}
        </span>
      </div>
    </div>
  );
}
