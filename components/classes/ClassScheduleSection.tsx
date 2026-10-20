"use client";

import React, { useState } from "react";
import ClassTimetableCard from "@/components/common/ClassTimetableCard";
import { ScheduleModal } from "@/components/classes/ScheduleModal";
import { TimetableExportModal } from "@/components/classes/TimetableExportModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useClassTimetable } from "@/hooks/classes";
import { ClassStatus, ClassDetail } from "@/types/class";
import { TimetableEntry } from "@/types/timetable";
import { FaImage } from "react-icons/fa";

interface ClassScheduleSectionProps {
  classId: string | number;
  classDetail: ClassDetail;
}

export function ClassScheduleSection({
  classId,
  classDetail,
}: ClassScheduleSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimetableEntry | null>(null);
  const [slotToDelete, setSlotToDelete] = useState<TimetableEntry | null>(null);

  const {
    schedules,
    loading,
    isError,
    removeSlot,
    deletingSlot,
    refreshTimetable,
  } = useClassTimetable(classId);

  const isCompleted = classDetail.class_status === "Completed";
  const showExportButton = schedules.length > 0 && !isCompleted;

  const handleConfirmDelete = async () => {
    if (!slotToDelete) return;
    const res = await removeSlot(slotToDelete.id);
    if (res.success) {
      setSlotToDelete(null);
      refreshTimetable?.();
    } else {
      alert(res.message || "Failed to delete slot.");
    }
  };

  return (
    <div className="glass-card border border-border-main p-4 sm:p-6 rounded-2xl h-auto lg:h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-border-main pb-3 shrink-0 gap-2">
        <h2 className="text-sm font-semibold text-text-main">
          Weekly Schedule
        </h2>

        <div className="flex items-center gap-2">
          {showExportButton && (
            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="bg-surface-hover hover:bg-border-main text-text-main text-xs font-semibold px-3 py-1.5 rounded-xl transition-all border border-border-main flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <FaImage className="text-brand-primary" /> Export Image
            </button>
          )}

          <button
            type="button"
            disabled={isCompleted}
            onClick={() => {
              setSelectedSlot(null);
              setIsModalOpen(true);
            }}
            className="bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-all shadow-md shadow-brand-primary/20 border border-brand-primary/30 cursor-pointer shrink-0"
          >
            + Add Slot
          </button>
        </div>
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
              <ClassTimetableCard
                key={slot.id}
                item={slot}
                onEdit={() => {
                  setSelectedSlot(slot);
                  setIsModalOpen(true);
                }}
                onRemove={() => setSlotToDelete(slot)}
              />
            ))}
          </div>
        )}
      </div>

      <ScheduleModal
        classId={Number(classId)}
        isOpen={isModalOpen && !isCompleted}
        initialData={selectedSlot}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSlot(null);
        }}
        onSuccess={() => refreshTimetable?.()}
      />

      <TimetableExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        className={classDetail.name ?? "Class Schedule"}
        courseTitle={classDetail.course_title}
        startDate={classDetail.start_date}
        endDate={classDetail.end_date}
        schedules={schedules}
      />

      <ConfirmModal
        isOpen={Boolean(slotToDelete)}
        title="Delete Schedule Slot"
        message={`Are you sure you want to remove the "${slotToDelete?.subject}" slot on ${slotToDelete?.day_of_week} (${slotToDelete?.start_time} - ${slotToDelete?.end_time})?`}
        confirmLabel="Delete Slot"
        variant="danger"
        isLoading={deletingSlot}
        onConfirm={handleConfirmDelete}
        onClose={() => setSlotToDelete(null)}
      />
    </div>
  );
}
