"use client";

import React, { useState, use } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import EnrollClassModal from "@/components/students/EnrollClassModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import StudentProfileCard from "@/components/students/StudentProfileCard";
import ActiveEnrollmentCard from "@/components/students/ActiveEnrollmentCard";
import PastClassHistoryCard from "@/components/students/PastClassHistoryCard";
import { useStudentDetail } from "@/hooks/useStudentDetail";

export default function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const studentId = resolvedParams?.id;

  // Data & API Hook
  const {
    student,
    setStudent,
    activeEnrollment,
    pastEnrollments,
    availableClasses,
    loading,
    isError,
    savingProfile,
    enrolling,
    saveProfile,
    enrollClass,
  } = useStudentDetail(studentId);

  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);

  const handleProfileSubmitPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;
    setShowSaveConfirmModal(true);
  };

  const handleConfirmSaveProfile = async () => {
    const success = await saveProfile();
    if (success) {
      setShowSaveConfirmModal(false);
    }
  };

  const handleEnrollClass = async (classId: number) => {
    const success = await enrollClass(classId);
    if (success) {
      setIsEnrollModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400">
        Loading student profile...
      </div>
    );
  }

  if (isError || !student) {
    return (
      <div className="p-8 text-center text-slate-400">
        Error loading student profile.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex items-center gap-4">
        <Link
          href="/students"
          className="p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl transition-all"
        >
          <FaArrowLeft className="text-xs" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">{student.name}</h1>
          <p className="text-xs text-slate-400">
            Student Profile & Academic History
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StudentProfileCard
          student={student}
          setStudent={setStudent}
          savingProfile={savingProfile}
          onSubmit={handleProfileSubmitPrompt}
        />

        <div className="lg:col-span-2 space-y-6">
          <ActiveEnrollmentCard
            activeEnrollment={activeEnrollment}
            onOpenEnrollModal={() => setIsEnrollModalOpen(true)}
          />

          <PastClassHistoryCard pastEnrollments={pastEnrollments} />
        </div>
      </div>

      <EnrollClassModal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        onEnroll={handleEnrollClass}
        availableClasses={availableClasses}
        enrolling={enrolling}
      />

      <ConfirmModal
        isOpen={showSaveConfirmModal}
        title="Save Profile Changes"
        message="Are you sure you want to save the updated profile information for this student?"
        confirmLabel="Save Changes"
        cancelLabel="Cancel"
        variant="info"
        isLoading={savingProfile}
        onConfirm={handleConfirmSaveProfile}
        onClose={() => setShowSaveConfirmModal(false)}
      />
    </div>
  );
}
