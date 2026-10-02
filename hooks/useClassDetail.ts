"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import {
  fetchClassDetail,
  updateClassDetail,
  updateEnrollmentStatus,
} from "@/services/classService";
import { ClassDetail, EnrollmentStatus } from "@/types/class";
import { formatDateForInput } from "@/lib/utils/date";

export function useClassDetail(classId: string | undefined) {
  const apiEndpoint = classId ? `/api/classes/${classId}` : null;
  const { data, error, isLoading, mutate } = useSWR(
    apiEndpoint,
    fetchClassDetail,
  );

  const [editableClass, setEditableClass] = useState<ClassDetail | null>(null);
  const [savingClass, setSavingClass] = useState(false);
  const [updatingEnrollmentId, setUpdatingEnrollmentId] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (data?.data?.class_detail) {
      const detail = data.data.class_detail;
      setEditableClass({
        ...detail,
        start_date: formatDateForInput(detail.start_date),
        end_date: formatDateForInput(detail.end_date),
      });
    }
  }, [data]);

  const saveClassMeta = async (
    updatedData?: Partial<ClassDetail>,
  ): Promise<boolean> => {
    if (!classId) return false;

    const payload = updatedData
      ? { ...editableClass, ...updatedData }
      : editableClass;
    if (!payload) return false;

    setSavingClass(true);
    try {
      const result = await updateClassDetail(classId, payload);
      if (result.success) {
        setEditableClass((prev) => (prev ? { ...prev, ...payload } : null));
        await mutate();
        return true;
      }
      alert(result.message || "Failed to update class info.");
      return false;
    } catch (err) {
      console.error("Failed to save class detail:", err);
      return false;
    } finally {
      setSavingClass(false);
    }
  };

  // Change Student Enrollment Status
  const changeStudentStatus = async (
    enrollmentId: number,
    newStatus: EnrollmentStatus,
  ): Promise<boolean> => {
    setUpdatingEnrollmentId(enrollmentId);
    try {
      const result = await updateEnrollmentStatus(enrollmentId, newStatus);
      if (result.success) {
        await mutate();
        return true;
      }
      alert(result.message || "Failed to update enrollment status.");
      return false;
    } catch (err) {
      console.error("Failed to update enrollment status:", err);
      return false;
    } finally {
      setUpdatingEnrollmentId(null);
    }
  };

  return {
    classDetail: editableClass,
    setClassDetail: setEditableClass,
    students: data?.data?.class_detail?.students ?? [],
    loading: isLoading,
    isError: Boolean(error),
    savingClass,
    updatingEnrollmentId,
    saveClassMeta,
    changeStudentStatus,
  };
}
