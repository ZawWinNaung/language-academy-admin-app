"use client";

import { useState } from "react";
import { createClass } from "@/services/classService";
import { ClassFormData } from "@/types/class";

export function useCreateClass(onSuccess?: () => Promise<unknown>) {
  const [submitting, setSubmitting] = useState(false);

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
        if (onSuccess) await onSuccess();
        return true;
      } else {
        alert(json.message || "Failed to create class.");
        return false;
      }
    } catch (err) {
      console.error("Error adding class:", err);
      alert("An unexpected error occurred while creating class.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    handleCreateClass,
  };
}
