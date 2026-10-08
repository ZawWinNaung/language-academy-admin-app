"use client";

import React, { useEffect, useState, use } from "react";
import {
  FaUserGraduate,
  FaEnvelope,
  FaPhone,
  FaAward,
  FaClock,
  FaPlus,
  FaTimesCircle,
  FaSave,
  FaCalendarAlt,
} from "react-icons/fa";
import AssignScheduleModal from "@/components/teachers/AssignScheduleMoal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import DetailFrame from "@/components/ui/DetailFrame";

interface TeacherProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  qualification: string;
  is_active: boolean;
}

interface ScheduleItem {
  schedule_id: number;
  class_id: number;
  class_name: string;
  course_title: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  room_number: string;
}

export default function TeacherDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const [unassignScheduleId, setUnassignScheduleId] = useState<number | null>(
    null,
  );
  const [unassigning, setUnassigning] = useState(false);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);

  const fetchTeacherDetails = async () => {
    try {
      const res = await fetch(`/api/teachers/${id}`);
      const result = await res.json();
      if (result.success) {
        setTeacher(result.data.teacher);
        setSchedules(result.data.schedules);
      }
    } catch (err) {
      console.error("Error fetching teacher details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherDetails();
  }, [id]);

  // Form submit interceptor: prevents default browser submit and triggers modal
  const handleProfileSubmitPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacher) return;
    setShowSaveConfirmModal(true);
  };

  // Actual Save Profile Handler
  const handleConfirmSaveProfile = async () => {
    if (!teacher) return;
    setSavingProfile(true);

    try {
      const res = await fetch(`/api/teachers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teacher),
      });
      const result = await res.json();
      if (result.success) {
        setShowSaveConfirmModal(false);
        fetchTeacherDetails();
      }
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setSavingProfile(false);
    }
  };

  const promptUnassignSchedule = (scheduleId: number) => {
    setUnassignScheduleId(scheduleId);
  };

  const handleConfirmUnassign = async () => {
    if (!unassignScheduleId) return;
    setUnassigning(true);

    try {
      const res = await fetch(`/api/timetable/${unassignScheduleId}/assign`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacher_id: null }),
      });

      if (res.ok) {
        await fetchTeacherDetails();
        setUnassignScheduleId(null);
      }
    } catch (err) {
      console.error("Failed to unassign schedule slot", err);
    } finally {
      setUnassigning(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-text-muted">
        Loading teacher details...
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="p-8 text-center text-text-muted">Teacher not found.</div>
    );
  }

  return (
    <DetailFrame
      backHref="/teachers"
      title={teacher.name}
      description="Faculty Profile & Timetable Assignments"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Edit Teacher Profile */}
        <div className="glass-card border border-border-main rounded-2xl p-5">
          <h2 className="text-sm font-bold text-text-main mb-4 flex items-center gap-2 border-b border-border-main pb-3">
            <FaUserGraduate className="text-brand-primary" /> Edit Profile Details
          </h2>

          <form
            onSubmit={handleProfileSubmitPrompt}
            className="space-y-4 text-xs"
          >
            <div>
              <label className="block text-text-muted font-semibold mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={teacher.name}
                onChange={(e) =>
                  setTeacher({ ...teacher, name: e.target.value })
                }
                className="w-full bg-surface-hover border border-border-main rounded-xl px-3 py-2 text-text-main focus:outline-none focus:border-brand-primary"
                required
              />
            </div>

            <div>
              <label className="block text-text-muted font-semibold mb-1">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
                <input
                  type="email"
                  value={teacher.email}
                  onChange={(e) =>
                    setTeacher({ ...teacher, email: e.target.value })
                  }
                  className="w-full bg-surface-hover border border-border-main rounded-xl pl-9 pr-3 py-2 text-text-main focus:outline-none focus:border-brand-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-text-muted font-semibold mb-1">
                Phone Number
              </label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
                <input
                  type="text"
                  value={teacher.phone}
                  onChange={(e) =>
                    setTeacher({ ...teacher, phone: e.target.value })
                  }
                  className="w-full bg-surface-hover border border-border-main rounded-xl pl-9 pr-3 py-2 text-text-main focus:outline-none focus:border-brand-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-text-muted font-semibold mb-1">
                Qualification
              </label>
              <div className="relative">
                <FaAward className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
                <input
                  type="text"
                  value={teacher.qualification}
                  onChange={(e) =>
                    setTeacher({ ...teacher, qualification: e.target.value })
                  }
                  className="w-full bg-surface-hover border border-border-main rounded-xl pl-9 pr-3 py-2 text-text-main focus:outline-none focus:border-brand-primary"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="is_active"
                checked={teacher.is_active}
                onChange={(e) =>
                  setTeacher({ ...teacher, is_active: e.target.checked })
                }
                className="rounded border-border-main bg-surface-hover text-brand-primary focus:ring-0 cursor-pointer"
              />
              <label
                htmlFor="is_active"
                className="text-text-muted font-medium cursor-pointer"
              >
                Active Faculty Member
              </label>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="w-full mt-2 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold py-2.5 rounded-xl transition-all inline-flex items-center justify-center gap-2"
            >
              <FaSave /> {savingProfile ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>

        {/* Right Column: Assigned Timetables */}
        <div className="lg:col-span-2 glass-card border border-border-main rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border-main pb-3">
            <h2 className="text-sm font-bold text-text-main flex items-center gap-2">
              <FaCalendarAlt className="text-brand-primary" /> Assigned Schedules
            </h2>
            <button
              onClick={() => setIsAssignModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold rounded-xl transition-all"
            >
              <FaPlus className="text-[10px]" /> Assign Schedule
            </button>
          </div>

          {schedules.length === 0 ? (
            <div className="text-center py-12 text-xs text-text-dim border border-dashed border-border-main rounded-xl">
              No timetable schedules assigned to this teacher yet.
            </div>
          ) : (
            <div className="space-y-3">
              {schedules.map((item) => (
                <div
                  key={item.schedule_id}
                  className="bg-surface-hover border border-border-main rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text-main">
                        {item.class_name}
                      </span>
                      <span className="text-[10px] text-brand-primary bg-brand-primary-light border border-brand-primary/20 px-2 py-0.5 rounded-md">
                        {item.course_title}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-text-muted text-[11px]">
                      <span className="font-medium text-text-main">
                        {item.day_of_week}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaClock className="text-brand-primary" />{" "}
                        {item.start_time} - {item.end_time}
                      </span>
                      {item.room_number && (
                        <span className="bg-border-subtle px-2 py-0.5 rounded text-text-muted">
                          Room: {item.room_number}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => promptUnassignSchedule(item.schedule_id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-status-danger hover:text-status-danger/80 bg-status-danger/10 hover:bg-status-danger/20 border border-status-danger/20 rounded-lg transition-all self-end sm:self-auto text-[11px]"
                  >
                    <FaTimesCircle /> Unassign
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AssignScheduleModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        teacherId={teacher.id}
        existingSchedules={schedules}
        onAssignSuccess={fetchTeacherDetails}
      />

      {/* Confirm Modal for Unassigning Schedule Slot */}
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

      {/* Confirm Modal for Saving Profile Changes */}
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
