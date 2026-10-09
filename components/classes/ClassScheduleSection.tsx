"use client";

import ClassTimetableCard from "@/components/classes/ClassTimetableCard";
import { useClassTimetable } from "@/hooks/classes";

interface ClassScheduleSectionProps {
  classId: string | number;
}

export function ClassScheduleSection({ classId }: ClassScheduleSectionProps) {
  const { schedules, loading, isError } = useClassTimetable(classId);

  return (
    <div className="glass-card border border-border-main p-6 rounded-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-border-main pb-3">
        <div>
          <h2 className="text-sm font-semibold text-text-main">
            Weekly Schedule
          </h2>
          <p className="text-[11px] text-text-muted mt-0.5">
            Class slots and assigned teachers.
          </p>
        </div>
        <button
          type="button"
          onClick={() => console.log("Add slot for class:", classId)}
          className="bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-all shadow-md shadow-brand-primary/20 border border-brand-primary/30 cursor-pointer shrink-0"
        >
          + Add Slot
        </button>
      </div>

      {loading ? (
        <div className="p-6 text-center text-xs text-text-muted">
          Loading schedule...
        </div>
      ) : isError ? (
        <div className="p-6 text-center text-xs text-status-danger border border-status-danger/20 rounded-xl bg-status-danger/5">
          Failed to load schedule.
        </div>
      ) : schedules.length === 0 ? (
        <div className="p-6 text-center text-xs text-text-muted border border-dashed border-border-main rounded-xl">
          No schedule slots configured yet.
        </div>
      ) : (
        /* Stack schedule slots neatly in 1 column in sidebar */
        <div className="grid grid-cols-1 gap-3">
          {schedules.map((slot) => (
            <ClassTimetableCard key={slot.id} item={slot} />
          ))}
        </div>
      )}
    </div>
  );
}
