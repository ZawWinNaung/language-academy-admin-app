"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FaChevronDown,
  FaUserCheck,
  FaSearch,
  FaSpinner,
} from "react-icons/fa";
import { useTeacherInfinite } from "@/hooks/useTeachers";

interface TeacherComboboxProps {
  value: number | null;
  onChange: (teacherId: number) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function TeacherCombobox({
  value,
  onChange,
  disabled = false,
  placeholder = "Select an instructor...",
}: TeacherComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { teachers, loading, isValidating, isReachingEnd, loadMore } =
    useTeacherInfinite(debouncedSearch);

  const selectedTeacher = teachers.find((t) => t.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleScroll = () => {
    if (!scrollContainerRef.current || isReachingEnd || isValidating) return;

    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    if (scrollHeight - scrollTop - clientHeight < 20) {
      loadMore();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full bg-surface-hover border border-border-main rounded-xl px-3 py-2 text-left text-xs text-text-main disabled:opacity-60 focus:outline-none focus:border-brand-primary flex items-center justify-between cursor-pointer"
      >
        <span className="truncate">
          {selectedTeacher
            ? `${selectedTeacher.name} (${selectedTeacher.qualification})`
            : placeholder}
        </span>
        <FaChevronDown
          className={`text-[10px] text-text-dim transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full bg-surface border border-border-main rounded-xl shadow-xl p-2 space-y-2 animate-in fade-in zoom-in-95 max-h-60 flex flex-col">
          {/* Search Bar */}
          <div className="relative shrink-0">
            <FaSearch className="absolute left-2.5 top-2.5 text-text-dim text-[10px]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or qualification..."
              className="w-full bg-surface-hover border border-border-main rounded-lg pl-7 pr-2 py-1.5 text-xs text-text-main focus:outline-none focus:border-brand-primary"
              autoFocus
            />
          </div>

          {/* Infinite Scroll Container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="overflow-y-auto flex-1 divide-y divide-border-main/50 pr-1"
          >
            {teachers.length === 0 && !loading ? (
              <p className="p-3 text-center text-text-muted text-xs">
                No active instructors found.
              </p>
            ) : (
              teachers.map((teacher) => (
                <button
                  key={teacher.id}
                  type="button"
                  onClick={() => {
                    onChange(teacher.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 hover:bg-brand-primary-light/50 transition-colors rounded-lg flex items-center justify-between text-xs cursor-pointer ${
                    teacher.id === value
                      ? "bg-brand-primary-light text-brand-primary font-semibold"
                      : "text-text-main"
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <span className="block truncate">{teacher.name}</span>
                    <span className="text-[10px] text-text-muted block truncate">
                      {teacher.qualification}
                    </span>
                  </div>
                  {teacher.id === value && (
                    <FaUserCheck className="text-brand-primary shrink-0 text-xs" />
                  )}
                </button>
              ))
            )}

            {/* Spinner for subsequent page loads */}
            {isValidating && (
              <div className="p-2 text-center text-brand-primary flex items-center justify-center gap-1.5 text-[11px]">
                <FaSpinner className="animate-spin" /> Loading more...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
