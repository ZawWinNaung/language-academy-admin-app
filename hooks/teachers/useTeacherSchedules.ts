"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  fetchTeacherSchedules,
  unassignScheduleSlot,
} from "@/services/teacherService";

export function useTeacherSchedules(teacherId: string | number | undefined) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [unassigning, setUnassigning] = useState(false);

  const { data, error, isLoading, mutate } = useSWR(
    teacherId ? ["teacher-schedules", String(teacherId), currentPage] : null,
    () => fetchTeacherSchedules(teacherId!, currentPage, pageSize),
  );

  const schedules = data?.data ?? [];
  const pagination = data?.data?.pagination ?? {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const unassignSchedule = async (
    scheduleId: number,
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setUnassigning(true);
      const res = await unassignScheduleSlot(scheduleId);

      if (res.success) {
        await mutate();
        return { success: true };
      }
      return {
        success: false,
        message: res.message || "Failed to unassign schedule.",
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || "An unexpected error occurred.",
      };
    } finally {
      setUnassigning(false);
    }
  };

  return {
    schedules,
    pagination,
    currentPage,
    setCurrentPage: handlePageChange,
    loading: schedules.length === 0 && isLoading,
    isError: Boolean(error),
    unassigning,
    unassignSchedule,
    refreshSchedules: mutate,
  };
}
