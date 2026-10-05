"use client";

import useSWR from "swr";
import { fetchAvailableStudents } from "@/services/classService";

export function useAvailableStudents(isOpen: boolean) {
  const apiEndpoint = isOpen ? "/api/enrollments/available-students" : null;

  const { data, error, isLoading, mutate } = useSWR(
    apiEndpoint,
    fetchAvailableStudents,
  );

  return {
    availableStudents: data?.data ?? [],
    loading: isLoading,
    isError: Boolean(error),
    refreshAvailableStudents: mutate,
  };
}
