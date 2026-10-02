"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  fetchClasses,
  fetchCourses,
  createClass,
  deleteClass,
} from "@/services/classService";
import { ClassDetail, ClassFormData } from "@/types/class";

export function useClasses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    data: classesRes,
    error: classesError,
    isLoading: classesLoading,
    mutate: mutateClasses,
  } = useSWR("/api/classes", fetchClasses);

  const {
    data: coursesRes,
    error: coursesError,
    isLoading: coursesLoading,
  } = useSWR("/api/courses", fetchCourses);

  const classes = classesRes?.data ?? [];
  const courses = coursesRes?.data ?? [];

  const filteredClasses = classes.filter((c: ClassDetail) => {
    const query = searchQuery.toLowerCase();
    const className = (c.class_name || c.name || "").toLowerCase();
    const courseCode = (c.course_code || "").toLowerCase();
    const courseTitle = (c.course_title || "").toLowerCase();
    const computedStatus = (c.status || c.class_status || "").toLowerCase();

    return (
      className.includes(query) ||
      courseCode.includes(query) ||
      courseTitle.includes(query) ||
      computedStatus.includes(query)
    );
  });

  const handleCreateClass = async (
    formData: ClassFormData,
  ): Promise<boolean> => {
    if (!formData.course_id) {
      alert("Please select a course.");
      return false;
    }

    setSubmitting(true);
    try {
      const json = await createClass(formData);
      if (json.success) {
        await mutateClasses();
        return true;
      } else {
        alert(json.message || "Failed to create class.");
        return false;
      }
    } catch (err) {
      console.error("Error adding class:", err);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClass = async (
    classItem: ClassDetail,
  ): Promise<boolean> => {
    if (!classItem.id) {
      alert("Invalid class ID.");
      return false;
    }

    if (
      !confirm(
        `Are you sure you want to delete "${classItem.class_name || classItem.name}"?`,
      )
    ) {
      return false;
    }

    try {
      const json = await deleteClass(classItem.id);
      if (json.success) {
        await mutateClasses();
        return true;
      } else {
        alert(json.message || "Failed to delete class.");
        return false;
      }
    } catch (err) {
      console.error("Error deleting class:", err);
      return false;
    }
  };

  return {
    classes,
    filteredClasses,
    courses,
    loading: classesLoading || coursesLoading,
    isError: Boolean(classesError || coursesError),
    searchQuery,
    setSearchQuery,
    submitting,
    handleCreateClass,
    handleDeleteClass,
  };
}
