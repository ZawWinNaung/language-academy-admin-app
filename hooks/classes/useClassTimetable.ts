"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  fetchClassTimetable,
  createClassTimetable,
} from "@/services/classService";
import { TimetableEntry, AddTimetablePayload } from "@/types/timetable";

export function useClassTimetable(classId: string | number | undefined) {
  const cacheKey = classId ? ["class-timetable", String(classId)] : null;
  const [addingSlot, setAddingSlot] = useState(false);

  const { data, error, isLoading, mutate } = useSWR(cacheKey, () =>
    classId ? fetchClassTimetable(classId) : null,
  );

  const addSlot = async (
    payload: Omit<AddTimetablePayload, "class_id">,
  ): Promise<{ success: boolean; message?: string }> => {
    if (!classId) return { success: false, message: "Class ID is missing." };

    try {
      setAddingSlot(true);
      const response = await createClassTimetable({
        ...payload,
        class_id: Number(classId),
      });

      if (response.success) {
        await mutate();
        return { success: true };
      }

      return {
        success: false,
        message: response.message || "Failed to add schedule slot.",
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || "An unexpected error occurred.",
      };
    } finally {
      setAddingSlot(false);
    }
  };

  return {
    schedules: (data?.data || []) as TimetableEntry[],
    loading: isLoading,
    isError: Boolean(error),
    addingSlot,
    addSlot,
    refreshTimetable: mutate,
  };
}
