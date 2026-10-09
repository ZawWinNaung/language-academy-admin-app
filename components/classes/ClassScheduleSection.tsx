"use client";

import React, { useState } from "react";
import ClassTimetableCard from "@/components/classes/ClassTimetableCard";
import { AddScheduleModal } from "@/components/classes/AddScheduleModal";
import { useClassTimetable } from "@/hooks/classes";
import { ClassStatus } from "@/types/class";

interface ClassScheduleSectionProps {
  classId: string | number;
  classStatus?: ClassStatus;
  teachers?: { id: number; name: string }[];
}

export function ClassScheduleSection({
  classId,
  classStatus,
  teachers = [],
}: ClassScheduleSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { schedules, loading, isError, refreshTimetable } =
    useClassTimetable(classId);

  const isCompleted = classStatus === "Completed";

  return (
    <div className="glass-card border border-border-main p-4 sm:p-6 rounded-2xl h-auto lg:h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-main pb-3 shrink-0 gap-2">
        <div>
          <h2 className="text-sm font-semibold text-text-main">
            Weekly Schedule
          </h2>
        </div>
        <button
          type="button"
          disabled={isCompleted}
          title={
            isCompleted
              ? "Cannot add schedule slots to a completed class"
              : undefined
          }
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-primary hover:bg-brand-primary-hover disabled:bg-surface-hover disabled:text-text-dim disabled:border-border-main disabled:shadow-none disabled:cursor-not-allowed text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-all shadow-md shadow-brand-primary/20 border border-brand-primary/30 cursor-pointer shrink-0"
        >
          + Add Slot
        </button>
      </div>

      {/* Schedule Slot Grid */}
      <div className="lg:flex-1 lg:overflow-y-auto my-3">
        {loading ? (
          <div className="p-8 text-center text-xs text-text-muted">
            Loading schedule...
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-xs text-status-danger border border-status-danger/20 rounded-xl bg-status-danger/5">
            Failed to load schedule.
          </div>
        ) : schedules.length === 0 ? (
          <div className="p-6 text-center text-xs text-text-muted border border-dashed border-border-main rounded-xl">
            No schedule slots configured yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {schedules.map((slot) => (
              <ClassTimetableCard key={slot.id} item={slot} />
            ))}
          </div>
        )}
      </div>

      <AddScheduleModal
        classId={Number(classId)}
        isOpen={isModalOpen && !isCompleted}
        teachers={teachers}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => refreshTimetable?.()}
      />
    </div>
  );
}
