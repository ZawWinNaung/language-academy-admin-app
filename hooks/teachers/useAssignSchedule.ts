"use client";

import { useState, useEffect, useCallback } from "react";
import {
  fetchUnassignedSchedules,
  assignTimetableSchedule,
} from "@/services/timetableService";
import { TimetableOption } from "@/types/timetable";

export function useAssignSchedule(isOpen: boolean) {
  const [availableSchedules, setAvailableSchedules] = useState<
    TimetableOption[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadUnassigned = useCallback(async () => {
    if (!isOpen) return;
    setLoading(true);
    try {
      const result = await fetchUnassignedSchedules();
      if (result.success && Array.isArray(result.data)) {
        setAvailableSchedules(result.data);
      } else {
        setAvailableSchedules([]);
      }
    } catch (err) {
      console.error("Error fetching unassigned schedules:", err);
      setAvailableSchedules([]);
    } finally {
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      loadUnassigned();
    } else {
      setAvailableSchedules([]);
    }
  }, [isOpen, loadUnassigned]);

  const assignSchedule = async (scheduleId: number, teacherId: number) => {
    setSubmitting(true);
    try {
      const result = await assignTimetableSchedule(scheduleId, teacherId);
      return result;
    } catch (err: any) {
      return {
        success: false,
        message: err.message || "Failed to assign schedule.",
      };
    } finally {
      setSubmitting(false);
    }
  };

  return {
    availableSchedules,
    loading,
    submitting,
    assignSchedule,
  };
}
