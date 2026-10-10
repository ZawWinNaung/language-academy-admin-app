"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  fetchClassTimetable,
  createClassTimetable,
  updateClassTimetable,
  deleteClassTimetable,
} from "@/services/timetableService";
import { TimetableEntry, AddTimetablePayload } from "@/types/timetable";

export function useClassTimetable(classId: string | number | undefined) {
  const cacheKey = classId ? ["class-timetable", String(classId)] : null;
  const [savingSlot, setSavingSlot] = useState(false);

  const { data, error, isLoading, mutate } = useSWR(cacheKey, () =>
    classId ? fetchClassTimetable(classId) : null,
  );

  const addSlot = async (
    payload: Omit<AddTimetablePayload, "class_id">,
  ): Promise<{ success: boolean; message?: string }> => {
    if (!classId) return { success: false, message: "Class ID is missing." };

    try {
      setSavingSlot(true);
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
      setSavingSlot(false);
    }
  };

  const updateSlot = async (
    slotId: number,
    payload: Omit<AddTimetablePayload, "class_id">,
  ): Promise<{ success: boolean; message?: string }> => {
    if (!classId) return { success: false, message: "Class ID is missing." };

    try {
      setSavingSlot(true);
      const response = await updateClassTimetable({
        ...payload,
        slot_id: slotId,
        class_id: Number(classId),
      });

      if (response.success) {
        await mutate();
        return { success: true };
      }

      return {
        success: false,
        message: response.message || "Failed to update schedule slot.",
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || "An unexpected error occurred.",
      };
    } finally {
      setSavingSlot(false);
    }
  };

  const [deletingSlot, setDeletingSlot] = useState(false);

  const removeSlot = async (
    slotId: number,
  ): Promise<{ success: boolean; message?: string }> => {
    if (!classId) return { success: false, message: "Class ID is missing." };

    try {
      setDeletingSlot(true);
      const response = await deleteClassTimetable(classId, slotId);

      if (response.success) {
        await mutate(); // Refresh schedule list
        return { success: true };
      }

      return {
        success: false,
        message: response.message || "Failed to delete schedule slot.",
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || "An unexpected error occurred.",
      };
    } finally {
      setDeletingSlot(false);
    }
  };

  return {
    schedules: (data?.data || []) as TimetableEntry[],
    loading: isLoading,
    isError: Boolean(error),
    savingSlot,
    addSlot,
    updateSlot,
    refreshTimetable: mutate,
    removeSlot,
    deletingSlot,
  };
}
