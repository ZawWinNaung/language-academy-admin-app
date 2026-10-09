"use client";

import useSWR from "swr";
import { fetchClassTimetable } from "@/services/classService";
import { TimetableEntry } from "@/types/timetable";

export function useClassTimetable(classId: string | number | undefined) {
  const cacheKey = classId ? ["class-timetable", classId] : null;

  const { data, error, isLoading, mutate } = useSWR(cacheKey, () =>
    classId ? fetchClassTimetable(classId) : null,
  );

  return {
    schedules: (data?.data || []) as TimetableEntry[],
    loading: isLoading,
    isError: Boolean(error),
    refreshTimetable: mutate,
  };
}
