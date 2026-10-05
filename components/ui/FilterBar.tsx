"use client";

import React, { useRef } from "react";
import { FaSearch, FaFilter, FaCalendarAlt, FaTimes } from "react-icons/fa";

interface FilterBarProps {
  children: React.ReactNode;
  className?: string;
}

export function FilterBar({ children, className = "" }: FilterBarProps) {
  return (
    <div
      className={`bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-md shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}

FilterBar.Group = function FilterBarGroup({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {children}
    </div>
  );
};

interface SearchWidgetProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

FilterBar.Search = function FilterBarSearch({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}: SearchWidgetProps) {
  return (
    <div className={`relative flex-1 ${className}`}>
      <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
};

interface SelectOption {
  label: string;
  value: string;
}

interface SelectWidgetProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  icon?: React.ElementType;
}

FilterBar.Select = function FilterBarSelect({
  value,
  onChange,
  options,
  placeholder = "All Statuses",
  icon: Icon = FaFilter,
}: SelectWidgetProps) {
  return (
    <div className="relative flex items-center">
      <Icon className="absolute left-3 text-slate-500 text-[10px] pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-950/80 border border-slate-800 text-slate-300 rounded-xl pl-8 pr-4 py-2 text-xs focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

interface MonthWidgetProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

FilterBar.MonthPicker = function FilterBarMonthPicker({
  value,
  onChange,
  placeholder = "Select Month",
}: MonthWidgetProps) {
  const monthInputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
    const input = monthInputRef.current;
    if (!input) return;
    if ("showPicker" in input && typeof input.showPicker === "function") {
      input.showPicker();
    } else {
      input.focus();
    }
  };

  return (
    <div
      onClick={handleContainerClick}
      className="relative flex items-center bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-2 cursor-pointer transition-all group min-w-[130px] justify-between"
    >
      <div className="flex items-center gap-2 pointer-events-none">
        <FaCalendarAlt className="text-slate-500 group-hover:text-indigo-400 text-xs transition-colors shrink-0" />
        <span className="text-xs text-slate-300 select-none">
          {value
            ? new Date(`${value}-01`).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })
            : placeholder}
        </span>
      </div>

      <input
        ref={monthInputRef}
        type="month"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer [color-scheme:dark]"
      />

      {value && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChange("");
          }}
          className="text-slate-500 hover:text-rose-400 text-xs ml-2 z-10"
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
};

FilterBar.Reset = function FilterBarReset({
  onReset,
}: {
  onReset: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onReset}
      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-all"
    >
      <FaTimes className="text-[10px]" /> Reset
    </button>
  );
};

interface CounterWidgetProps {
  filteredCount: number;
  totalCount: number;
  entityName?: string;
}

FilterBar.Counter = function FilterBarCounter({
  filteredCount,
  totalCount,
  entityName,
}: CounterWidgetProps) {
  return (
    <span className="text-xs font-mono text-slate-400 bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700/50 shrink-0">
      Showing <strong className="text-indigo-400">{filteredCount}</strong> /{" "}
      {totalCount} {entityName ? entityName : ""}
    </span>
  );
};

interface TabOption {
  label: string;
  value: string;
  count?: number;
}

interface TabsWidgetProps {
  value: string;
  onChange: (value: string) => void;
  options: TabOption[];
  className?: string;
}

FilterBar.Tabs = function FilterBarTabs({
  value,
  onChange,
  options,
  className = "",
}: TabsWidgetProps) {
  return (
    <div
      className={`flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 ${className}`}
    >
      {options.map((tab) => {
        const isActive = value === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              isActive
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive
                    ? "bg-indigo-500/50 text-white"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
