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
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const { data, error, isLoading, mutate } = useSWR(
    `/api/students?page=${currentPage}&limit=${pageSize}`,
    fetchStudentsList,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const students = data?.data ?? [];
  const pagination = data?.pagination ?? {
    currentPage: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 1,
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery),
  );

  const handleCreateStudent = async (): Promise<{
    success: boolean;
    message?: string;
  }> => {
    setSubmitting(true);
    try {
      const result = await createStudent(formData);
      if (result.success) {
        setFormData(INITIAL_FORM_DATA);
        await mutate();
        return { success: true };
      }
      return {
        success: false,
        message: result.message || "Failed to create student",
      };
    } catch (err) {
      console.error("Error adding student:", err);
      return {
        success: false,
        message: "An unexpected error occurred while saving the student.",
      };
    } finally {
      setSubmitting(false);
    }
  };
  return {
    students,
    filteredStudents,
    pagination,
    currentPage,
    setCurrentPage,
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
