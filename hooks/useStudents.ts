"use client";

import { useState } from "react";
import useSWR from "swr";
import { fetchStudentsList, createStudent } from "@/services/studentService";

const INITIAL_FORM_DATA = {
  name: "",
  email: "",
  phone: "",
  joined_date: "",
};

export function useStudents() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/students",
    fetchStudentsList,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const students = data?.data ?? [];

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery),
  );

  const handleCreateStudent = async (): Promise<boolean> => {
    setSubmitting(true);
    try {
      const result = await createStudent(formData);
      if (result.success) {
        setFormData(INITIAL_FORM_DATA);
        await mutate();
        return true;
      }
      alert(result.message || "Failed to create student");
      return false;
    } catch (err) {
      console.error("Error adding student:", err);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    students,
    filteredStudents,
    searchQuery,
    setSearchQuery,
    loading: isLoading,
    isError: Boolean(error),
    formData,
    setFormData,
    submitting,
    handleCreateStudent,
  };
}
