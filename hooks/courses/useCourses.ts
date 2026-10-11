"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  createCourse,
  fetchCourses,
  archiveCourse,
  unarchiveCourse,
} from "@/services/courseService";
import { CreateCourseInput } from "@/types/course";

export function useCourses({ page = 1, limit = 20, search = "", status = "" }) {
  const cacheKey = ["courses", page, limit, search, status];

  const { data, error, isLoading, mutate } = useSWR(cacheKey, () =>
    fetchCourses(page, limit, search, status),
  );

  const [submitting, setSubmitting] = useState(false);

  const handleCreateCourse = async (
    course: CreateCourseInput,
  ): Promise<boolean> => {
    setSubmitting(true);
    try {
      const result = await createCourse(course);
      if (!result.success) {
        alert(result.message || "Failed to create course");
        return false;
      }

      await mutate();
      return true;
    } catch (err) {
      console.error("Error adding course:", err);
      alert("An unexpected error occurred while creating the course.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleArchiveCourse = async (id: number): Promise<boolean> => {
    try {
      const result = await archiveCourse(id);
      if (!result.success) {
        alert(result.message || "Failed to archive course.");
        return false;
      }
      await mutate();
      return true;
    } catch (err) {
      console.error("Error archiving course:", err);
      alert("An unexpected error occurred while archiving the course.");
      return false;
    }
  };

  const handleUnarchiveCourse = async (id: number): Promise<boolean> => {
    try {
      const result = await unarchiveCourse(id);
      if (!result.success) {
        alert(result.message || "Failed to unarchive course.");
        return false;
      }
      await mutate();
      return true;
    } catch (err) {
      console.error("Error unarchiving course:", err);
      alert("An unexpected error occurred while unarchiving the course.");
      return false;
    }
  };

  return {
    courses: data?.data ?? [],
    pagination: data?.pagination ?? {
      currentPage: 1,
      pageSize: limit,
      totalItems: 0,
      totalPages: 1,
    },
    loading: isLoading,
    isError: Boolean(error),
    submitting,
    handleCreateCourse,
    handleArchiveCourse,
    handleUnarchiveCourse,
  };
}
