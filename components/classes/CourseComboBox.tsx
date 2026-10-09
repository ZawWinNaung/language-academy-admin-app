"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaChevronDown, FaCheck, FaSpinner } from "react-icons/fa";
import { useCourses } from "@/hooks/useCourses";
import { Course } from "@/types/course";

interface CourseComboboxProps {
  value: number | null | undefined;
  onChange: (courseId: number) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function CourseCombobox({
  value,
  onChange,
  placeholder = "Search or select a course...",
  disabled = false,
}: CourseComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { courses, loading } = useCourses({
    page: 1,
    limit: 20,
    search: debouncedSearch,
    status: "",
  });

  const selectedCourse = courses.find((c) => c.id === value);

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

  const handleSelect = (course: Course) => {
    onChange(course.id);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full bg-surface-hover border border-border-main rounded-xl px-3 py-2 text-left text-sm text-text-main flex items-center justify-between focus:outline-none focus:border-brand-primary disabled:opacity-60 disabled:cursor-not-allowed transition-all"
      >
        <span className="truncate">
          {selectedCourse ? (
            <span className="flex items-center gap-2">
              <span className="font-mono font-bold text-brand-primary text-xs">
                [{selectedCourse.code}]
              </span>
              <span>{selectedCourse.title}</span>
              {selectedCourse.is_archived && (
                <span className="text-[10px] bg-status-warning/10 text-status-warning border border-status-warning/20 px-1.5 py-0.5 rounded font-medium">
                  Archived
                </span>
              )}
            </span>
          ) : (
            <span className="text-text-muted">{placeholder}</span>
          )}
        </span>
        <FaChevronDown className="text-xs text-text-muted shrink-0 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-surface border border-border-main rounded-xl shadow-xl overflow-hidden text-xs">
          <div className="p-2 border-b border-border-main flex items-center gap-2 bg-surface-hover">
            <FaSearch className="text-text-muted shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Type to search courses..."
              autoFocus
              className="w-full bg-transparent text-text-main placeholder-text-muted focus:outline-none text-xs"
            />
            {loading && (
              <FaSpinner className="animate-spin text-brand-primary shrink-0" />
            )}
          </div>

          <div className="max-h-40 overflow-y-auto p-1 space-y-0.5 custom-scrollbar">
            {courses.length === 0 && !loading ? (
              <div className="p-3 text-center text-text-muted">
                No courses found.
              </div>
            ) : (
              courses.map((course) => {
                const isSelected = course.id === value;
                return (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => handleSelect(course)}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                      isSelected
                        ? "bg-brand-primary-light text-brand-primary font-semibold"
                        : "hover:bg-surface-hover text-text-main"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono font-bold text-brand-primary text-[11px] shrink-0">
                        {course.code}
                      </span>
                      <span className="truncate">{course.title}</span>
                      {course.is_archived && (
                        <span className="text-[10px] bg-status-warning/10 text-status-warning border border-status-warning/20 px-1.5 py-0.5 rounded shrink-0 font-normal">
                          Archived
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <FaCheck className="text-brand-primary text-xs shrink-0 ml-2" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
