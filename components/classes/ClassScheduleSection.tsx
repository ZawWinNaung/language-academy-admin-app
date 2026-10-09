"use client";

import ClassTimetableCard from "@/components/classes/ClassTimetableCard";
import { useClassTimetable } from "@/hooks/classes";

interface ClassScheduleSectionProps {
  classId: string | number;
}

export function ClassScheduleSection({ classId }: ClassScheduleSectionProps) {
  const { schedules, loading, isError } = useClassTimetable(classId);

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
          onClick={() => console.log("Add slot for class:", classId)}
          className="bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-all shadow-md shadow-brand-primary/20 border border-brand-primary/30 cursor-pointer shrink-0"
        >
          + Add Slot
        </button>
      </div>

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
    </div>
  );
}
