"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import {
  fetchStudentDetails,
  updateStudentProfile,
  enrollStudentInClass,
} from "@/services/studentService";
import { StudentProfile } from "@/types/student";

export function useStudentDetail(studentId: string | undefined) {
  const apiEndpoint = studentId ? `/api/students/${studentId}` : null;
  const { data, error, isLoading, mutate } = useSWR(
    apiEndpoint,
    fetchStudentDetails,
  );

  // Editable form state initialized from fetched student data
  const [editableStudent, setEditableStudent] = useState<StudentProfile | null>(
    null,
  );
  const [savingProfile, setSavingProfile] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (data?.data?.student) {
      setEditableStudent(data.data.student);
    }
  }, [data]);

  // Derived state
  const enrollments = data?.data?.enrolled_classes ?? [];
  const availableClasses = data?.data?.available_classes ?? [];

  const activeEnrollment = enrollments.find(
    (e) => e.class_status === "Ongoing" || e.class_status === "Upcoming",
  );
  const pastEnrollments = enrollments.filter(
    (e) => e.class_status === "Completed",
  );

  // API Mutators
  const saveProfile = async () => {
    if (!editableStudent || !studentId) return false;
    setSavingProfile(true);
    try {
      const result = await updateStudentProfile(studentId, editableStudent);
      if (result.success) {
        await mutate();
        return true;
      }
      alert(result.message || "Failed to update profile.");
      return false;
    } catch (err) {
      console.error("Failed to update student profile", err);
      return false;
    } finally {
      setSavingProfile(false);
    }
  };

  const enrollClass = async (classId: number) => {
    if (!studentId) return false;
    setEnrolling(true);
    try {
      const result = await enrollStudentInClass(studentId, classId);
      if (result.success) {
        await mutate();
        return true;
      }
      alert(result.message || "Failed to enroll student.");
      return false;
    } catch (err) {
      console.error("Failed to enroll in class:", err);
      return false;
    } finally {
      setEnrolling(false);
    }
  };

  return {
    student: editableStudent,
    setStudent: setEditableStudent,
    activeEnrollment,
    pastEnrollments,
    availableClasses,
    loading: isLoading,
    isError: Boolean(error),
    savingProfile,
    enrolling,
    saveProfile,
    enrollClass,
  };
}
