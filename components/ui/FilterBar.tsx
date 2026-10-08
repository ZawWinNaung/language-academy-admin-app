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
      className={`bg-surface border border-border-main rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs ${className}`}
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
      <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim text-xs pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-surface-hover border border-border-main rounded-xl pl-9 pr-8 py-2 text-xs text-text-main placeholder-text-dim focus:outline-none focus:border-brand-primary transition-all"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-muted text-xs cursor-pointer"
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
      <Icon className="absolute left-3 text-text-dim text-[10px] pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-surface-hover border border-border-main text-text-main rounded-xl pl-8 pr-4 py-2 text-xs focus:outline-none focus:border-brand-primary transition-all appearance-none cursor-pointer"
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
      className="relative flex items-center bg-surface-hover border border-border-main hover:border-brand-primary/40 rounded-xl px-3 py-2 cursor-pointer transition-all group min-w-[130px] justify-between"
    >
      <div className="flex items-center gap-2 pointer-events-none">
        <FaCalendarAlt className="text-text-dim group-hover:text-brand-primary text-xs transition-colors shrink-0" />
        <span className="text-xs text-text-main select-none">
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
        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer [color-scheme:light]"
      />

      {value && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChange("");
          }}
          className="text-text-dim hover:text-status-danger text-xs ml-2 z-10 cursor-pointer"
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
      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-status-danger hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all cursor-pointer"
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
    <span className="text-xs font-mono text-text-muted bg-surface-hover px-3 py-2 rounded-xl border border-border-main shrink-0">
      Showing <strong className="text-brand-primary">{filteredCount}</strong> /{" "}
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
      className={`flex items-center gap-1 bg-surface-hover p-1 rounded-xl border border-border-main ${className}`}
    >
      {options.map((tab) => {
        const isActive = value === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              isActive
                ? "bg-brand-primary text-white shadow-xs"
                : "text-text-muted hover:text-text-main hover:bg-surface"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-surface border border-border-main text-text-muted"
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
