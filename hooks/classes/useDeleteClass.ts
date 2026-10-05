"use client";

import { useState } from "react";
import { deleteClass } from "@/services/classService";
import { ClassDetail } from "@/types/class";

export function useDeleteClass(onSuccess?: () => Promise<unknown>) {
  const [classToDelete, setClassToDelete] = useState<ClassDetail | null>(null);
  const [deleting, setDeleting] = useState(false);

  const initiateDelete = (classItem: ClassDetail) => {
    setClassToDelete(classItem);
  };

  const cancelDelete = () => {
    setClassToDelete(null);
  };

  const confirmDeleteClass = async (): Promise<boolean> => {
    if (!classToDelete?.id) {
      alert("Invalid class ID.");
      return false;
    }

    setDeleting(true);
    try {
      const json = await deleteClass(classToDelete.id);
      if (json.success) {
        if (onSuccess) await onSuccess();
        setClassToDelete(null);
        return true;
      } else {
        alert(json.message || "Failed to delete class.");
        return false;
      }
    } catch (err) {
      console.error("Error deleting class:", err);
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return {
    classToDelete,
    deleting,
    initiateDelete,
    cancelDelete,
    confirmDeleteClass,
  };
}
