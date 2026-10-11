"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  fetchCourseById,
  fetchCourseClasses,
  updateCourse,
} from "@/services/courseService";
import { CourseFormData } from "@/types/course";

export function useCourseDetail(courseId: string | number) {
  const [classPage, setClassPage] = useState<number>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Fetch course details
  const {
    data: courseRes,
    error: courseError,
    isLoading: courseLoading,
    mutate: mutateCourse,
  } = useSWR(courseId ? `course-${courseId}` : null, () =>
    fetchCourseById(courseId),
  );

  // Fetch paginated classes
  const {
    data: classesRes,
    error: classesError,
    isLoading: classesLoading,
    mutate: mutateClasses,
  } = useSWR(
    courseId ? `course-${courseId}-classes-page-${classPage}` : null,
    () => fetchCourseClasses(courseId, classPage),
  );

  const handleUpdateCourse = async (
    formData: CourseFormData,
  ): Promise<boolean> => {
    setSubmitting(true);
    try {
      const result = await updateCourse(courseId, formData);
      if (!result.success) {
        alert(result.message || "Failed to update course.");
        return false;
      }
      await mutateCourse();
      return true;
    } catch (err) {
      console.error("Error updating course:", err);
      alert("An unexpected error occurred while updating the course.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    course: courseRes?.data ?? null,
    courseLoading,
    isCourseError: Boolean(courseError),

    classes: classesRes?.data ?? [],
    pagination: classesRes?.pagination ?? {
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 1,
    },
    classesLoading,
    isClassesError: Boolean(classesError),

    classPage,
    setClassPage,
    submitting,
    handleUpdateCourse,
  };
}
