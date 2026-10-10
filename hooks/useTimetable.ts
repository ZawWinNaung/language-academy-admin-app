import useSWR from "swr";
import { fetchTimetable } from "@/services/timetableService";

interface UseTimetableProps {
  page?: number;
  limit?: number;
  search?: string;
  day?: string;
}

export function useTimetable({
  page = 1,
  limit = 20,
  search = "",
  day = "",
}: UseTimetableProps = {}) {
  const cacheKey = ["timetable", page, limit, search, day];

  const { data, error, isLoading, mutate } = useSWR(cacheKey, () =>
    fetchTimetable(page, limit, search, day),
  );

  return {
    schedules: data?.data || [],
    pagination: data?.pagination || {
      currentPage: 1,
      pageSize: limit,
      totalItems: 0,
      totalPages: 1,
    },
    loading: isLoading,
    error,
    mutate,
  };
}
