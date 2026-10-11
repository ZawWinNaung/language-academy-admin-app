"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaClock, FaTimesCircle } from "react-icons/fa";
import AssignScheduleModal from "@/components/teachers/AssignScheduleMoal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import DetailFrame from "@/components/ui/DetailFrame";
import { TeacherProfileCard } from "@/components/teachers/TeacherProfileCard";
import DataTable, { Column } from "@/components/ui/DataTable";
import { useTeacherDetail } from "@/hooks/teachers/useTeacherDetail";
import { useTeacherSchedules } from "@/hooks/teachers/useTeacherSchedules";

export default function TeacherDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const {
    teacher,
    loading: loadingTeacher,
    isError: isTeacherError,
    savingProfile,
    saveProfile,
    refreshTeacher,
  } = useTeacherDetail(id);

  const {
    schedules,
    pagination,
    setCurrentPage,
    unassigning,
    unassignSchedule,
    refreshSchedules,
  } = useTeacherSchedules(id);

  const [editableTeacher, setEditableTeacher] = useState<any | null>(null);

  useEffect(() => {
    if (teacher) {
      setEditableTeacher(teacher);
    }
  }, [teacher]);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [unassignScheduleId, setUnassignScheduleId] = useState<number | null>(
    null,
  );
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);

  const handleProfileSubmitPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editableTeacher) return;
    setShowSaveConfirmModal(true);
  };

  const handleConfirmSaveProfile = async () => {
    if (!editableTeacher) return;
    const res = await saveProfile(editableTeacher);
    if (res.success) {
      setShowSaveConfirmModal(false);
    } else {
      alert(res.message || "Failed to update profile.");
    }
  };

  const handleConfirmUnassign = async () => {
    if (!unassignScheduleId) return;
    const res = await unassignSchedule(unassignScheduleId);
    if (res.success) {
      setUnassignScheduleId(null);
    } else {
      alert(res.message || "Failed to unassign schedule slot.");
    }
  };

  const handleAssignSuccess = () => {
    refreshTeacher();
    refreshSchedules();
  };

  if (loadingTeacher) {
    return (
      <div className="p-8 text-center text-text-muted">
        Loading teacher details...
      </div>
    );
  }

  if (isTeacherError || !teacher) {
    return (
      <div className="p-8 text-center text-text-muted">Teacher not found.</div>
    );
  }

  const currentFormValues = editableTeacher || teacher;

  const scheduleColumns: Column<any>[] = [
    {
      header: "Class & Course",
      render: (item) => (
        <div className="space-y-1">
          <span className="font-bold text-text-main block">
            {item.class_name}
          </span>
          <span className="text-[10px] text-brand-primary bg-brand-primary-light border border-brand-primary/20 px-2 py-0.5 rounded-md inline-block">
            {item.course_title}
          </span>
        </div>
      ),
    },
    {
      header: "Day of Week",
      accessorKey: "day_of_week",
      className: "font-medium text-text-main",
    },
    {
      header: "Time Slot",
      render: (item) => (
        <span className="flex items-center gap-1 text-text-muted">
          <FaClock className="text-brand-primary" /> {item.start_time} -{" "}
          {item.end_time}
        </span>
      ),
    },
    {
      header: "Action",
      className: "text-right",
      render: (item) => (
        <div className="text-right">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setUnassignScheduleId(item.schedule_id);
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-status-danger hover:text-status-danger/80 bg-status-danger/10 hover:bg-status-danger/20 border border-status-danger/20 rounded-lg transition-all text-[11px] cursor-pointer"
          >
            <FaTimesCircle /> Unassign
          </button>
        </div>
      ),
    },
  ];

  return (
    <DetailFrame
      backHref="/teachers"
      title={teacher.name}
      description="Faculty Profile & Timetable Assignments"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="w-full">
          <TeacherProfileCard
            editableTeacher={currentFormValues}
            onChange={setEditableTeacher}
            onSubmit={handleProfileSubmitPrompt}
            saving={savingProfile}
          />
        </div>

        <div className="lg:col-span-2 w-full">
          <DataTable
            data={schedules}
            columns={scheduleColumns}
            keyExtractor={(item) => item.schedule_id}
            emptyMessage="No timetable schedules assigned to this teacher yet."
            title="Assigned Schedules"
            actionButton={{
              label: "Assign Schedule",
              onClick: () => setIsAssignModalOpen(true),
              icon: <FaPlus className="text-[10px]" />,
            }}
            pagination={{
              currentPage: pagination.currentPage,
              totalPages: pagination.totalPages,
              onPageChange: (page) => setCurrentPage(page),
              totalItems: pagination.totalItems,
              pageSize: pagination.pageSize,
            }}
            onItemClick={(item) =>
              router.push(`/classes/${item.class_id}?from=/teachers/${id}`)
            }
          />
        </div>
      </div>

      <AssignScheduleModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        teacherId={teacher.id}
        existingSchedules={schedules}
        onAssignSuccess={handleAssignSuccess}
      />

      <ConfirmModal
        isOpen={unassignScheduleId !== null}
        title="Unassign Schedule Slot"
        message="Are you sure you want to unassign this schedule slot from this teacher? The slot will become available for reassignment."
        confirmLabel="Unassign"
        cancelLabel="Cancel"
        variant="danger"
        isLoading={unassigning}
        onConfirm={handleConfirmUnassign}
        onClose={() => setUnassignScheduleId(null)}
      />

      <ConfirmModal
        isOpen={showSaveConfirmModal}
        title="Save Profile Changes"
        message="Are you sure you want to save the updated details for this teacher profile?"
        confirmLabel="Save Changes"
        cancelLabel="Cancel"
        variant="info"
        isLoading={savingProfile}
        onConfirm={handleConfirmSaveProfile}
        onClose={() => setShowSaveConfirmModal(false)}
      />
    </DetailFrame>
  );
}
