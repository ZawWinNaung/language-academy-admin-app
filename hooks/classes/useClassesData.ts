"use client";

import { useMemo, useRef } from "react";
import useSWR from "swr";
import { fetchClasses } from "@/services/classService";
import { fetchCourses } from "@/services/courseService";

interface UseClassesDataOptions {
  currentPage: number;
  pageSize: number;
  searchQuery: string;
  statusFilter: string;
}

export function useClassesData({
  currentPage,
  pageSize,
  searchQuery,
  statusFilter,
}: UseClassesDataOptions) {
  const classesKey = [
    "classes",
    currentPage,
    pageSize,
    searchQuery,
    statusFilter,
  ];

  const {
    data: classesRes,
    error: classesError,
    isLoading: classesLoading,
    mutate: mutateClasses,
  } = useSWR(classesKey, () =>
    fetchClasses({
      page: currentPage,
      limit: pageSize,
      search: searchQuery,
      status: statusFilter,
    }),
  );

  const {
    data: coursesRes,
    error: coursesError,
    isLoading: coursesLoading,
  } = useSWR("courses", fetchCourses);

  const classes = classesRes?.data ?? [];
  const courses = coursesRes?.data ?? [];
  const pagination = classesRes?.pagination ?? {
    page: 1,
    limit: pageSize,
    totalItems: 0,
    totalPages: 1,
  };

  const grandTotalRef = useRef<number>(0);
  if (!searchQuery && !statusFilter && classesRes?.pagination?.totalItems) {
    grandTotalRef.current = classesRes.pagination.totalItems;
  }

  const statusCounts = useMemo(() => {
    return classes.reduce(
      (acc, c) => {
        const st = (c.class_status || "Upcoming").toLowerCase();
        if (st in acc) {
          acc[st as keyof typeof acc] += 1;
        }
        return acc;
      },
      { upcoming: 0, ongoing: 0, completed: 0 },
    );
  }, [classes]);

  return {
    classes,
    courses,
    pagination,
    totalCount: grandTotalRef.current || pagination.totalItems,
    statusCounts,
    loading: classesLoading || coursesLoading,
    isError: Boolean(classesError || coursesError),
    mutateClasses,
  };
}
