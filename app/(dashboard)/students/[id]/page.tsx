"use client";

import React, { useEffect, useState, use } from "react";
import {
  FaUserGraduate,
  FaEnvelope,
  FaPhone,
  FaSave,
  FaArrowLeft,
  FaBookOpen,
  FaCalendarAlt,
  FaHistory,
  FaExchangeAlt,
  FaPlus,
} from "react-icons/fa";
import Link from "next/link";
import EnrollClassModal from "@/components/students/EnrollClassModal";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface StudentProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  joined_date: string;
}

interface EnrollmentRecord {
  enrollment_id: number;
  class_id: number;
  class_name: string;
  course_title: string;
  class_status: "Upcoming" | "Ongoing" | "Completed";
  enrollment_status:
    | "Active"
    | "Graduated"
    | "Promoted"
    | "Demoted"
    | "Dropped"
    | "enrolled";
  enrolled_date: string;
}

interface AvailableClass {
  id: number;
  name: string;
  course_title: string;
}

export default function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const studentId = resolvedParams?.id;

  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [enrollments, setEnrollments] = useState<EnrollmentRecord[]>([]);
  const [availableClasses, setAvailableClasses] = useState<AvailableClass[]>(
    [],
  );

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  // Modal States
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);

  const fetchStudentDetails = async () => {
    if (!studentId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/students/${studentId}`);
      const result = await res.json();
      if (result.success && result.data) {
        setStudent(result.data.student);
        setEnrollments(result.data.enrolled_classes || []);
        setAvailableClasses(result.data.available_classes || []);
      } else {
        setStudent(null);
      }
    } catch (err) {
      console.error("Error fetching student details:", err);
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentDetails();
  }, [studentId]);

  // ✅ CRITICAL FIX: Handle both 'Active' (DB Schema ENUM) and 'enrolled' legacy strings
  const activeEnrollment = enrollments.find(
    (e) =>
      e.enrollment_status === "Active" || e.enrollment_status === "enrolled",
  );

  // ✅ CRITICAL FIX: Exclude active enrollment from past history list
  const pastEnrollments = enrollments.filter(
    (e) =>
      e.enrollment_status !== "Active" && e.enrollment_status !== "enrolled",
  );

  const handleProfileSubmitPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;
    setShowSaveConfirmModal(true);
  };

  const handleConfirmSaveProfile = async () => {
    if (!student || !studentId) return;
    setSavingProfile(true);
    try {
      const res = await fetch(`/api/students/${studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      });
      const result = await res.json();
      if (result.success) {
        setShowSaveConfirmModal(false);
        fetchStudentDetails();
      } else {
        alert(result.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Failed to update student profile", err);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleEnrollClass = async (classId: number) => {
    if (!studentId) return;
    setEnrolling(true);
    try {
      const res = await fetch(`/api/students/${studentId}/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ class_id: classId }),
      });
      const result = await res.json();
      if (result.success) {
        setIsEnrollModalOpen(false);
        fetchStudentDetails();
      } else {
        alert(result.message || "Failed to enroll student.");
      }
    } catch (err) {
      console.error("Failed to enroll in class:", err);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400">
        Loading student profile...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-8 text-center text-slate-400">Student not found.</div>
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
        {/* Profile Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
            <FaUserGraduate className="text-indigo-400" /> Student Profile
            Details
          </h2>

          <form
            onSubmit={handleProfileSubmitPrompt}
            className="space-y-4 text-xs"
          >
            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={student.name || ""}
                onChange={(e) =>
                  setStudent({ ...student, name: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={student.email || ""}
                  onChange={(e) =>
                    setStudent({ ...student, email: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Phone Number
              </label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={student.phone || ""}
                  onChange={(e) =>
                    setStudent({ ...student, phone: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Joined Date
              </label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="date"
                  value={
                    student.joined_date
                      ? student.joined_date.substring(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    setStudent({ ...student, joined_date: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl transition-all inline-flex items-center justify-center gap-2"
            >
              <FaSave /> {savingProfile ? "Saving..." : "Save Profile Changes"}
            </button>
          </form>
        </div>

        {/* Enrollments Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Enrollment */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FaBookOpen className="text-emerald-400" /> Active Enrollment
              </h2>
              <button
                onClick={() => setIsEnrollModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all"
              >
                {activeEnrollment ? (
                  <FaExchangeAlt className="text-[10px]" />
                ) : (
                  <FaPlus className="text-[10px]" />
                )}
                {activeEnrollment ? "Change Class" : "Enroll in Class"}
              </button>
            </div>

            {activeEnrollment ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">
                      {activeEnrollment.class_name}
                    </span>
                    <span className="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                      {activeEnrollment.course_title}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px] mt-1">
                    Enrolled on: {activeEnrollment.enrolled_date}
                  </div>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 font-semibold px-2.5 py-1 rounded-md text-[11px]">
                  Active
                </span>
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                No active class enrollment currently.
              </div>
            )}
          </div>

          {/* Past Class History */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <FaHistory className="text-indigo-400" /> Past Class History
            </h2>

            {pastEnrollments.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                No past enrollments found.
              </div>
            ) : (
              <div className="space-y-3">
                {pastEnrollments.map((item) => (
                  <div
                    key={item.enrollment_id}
                    className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-300">
                        {item.class_name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {item.course_title}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md capitalize ${
                        item.enrollment_status === "Promoted"
                          ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      {item.enrollment_status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
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
