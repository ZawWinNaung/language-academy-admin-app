"use client";

import useSWRInfinite from "swr/infinite";
import { fetchTeachers } from "@/services/teacherService";
import { Teacher } from "@/types/teacher";

const PAGE_SIZE = 15;

export function useTeacherInfinite(search = "") {
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (
      previousPageData &&
      (!previousPageData.data || !previousPageData.data.length)
    ) {
      return null;
    }
    return ["teachers-infinite", search, pageIndex + 1] as const;
  };

  const { data, error, isLoading, size, setSize, isValidating } =
    useSWRInfinite(
      getKey,
      ([, searchVal, pageVal]: readonly [string, string, number]) =>
        fetchTeachers(searchVal, pageVal, PAGE_SIZE),
    );

  const teachers: Teacher[] = data
    ? data.flatMap((page) => page?.data || [])
    : [];

  const isEmpty = data?.[0]?.data?.length === 0;
  const lastPage = data ? data[data.length - 1] : undefined;
  const isReachingEnd =
    isEmpty ||
    (Boolean(lastPage?.data) && (lastPage?.data?.length ?? 0) < PAGE_SIZE);

  return {
    teachers,
    loading: isLoading,
    isValidating,
    isReachingEnd,
    loadMore: () => setSize(size + 1),
    isError: Boolean(error),
  };
}
