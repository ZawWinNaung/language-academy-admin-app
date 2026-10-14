"use client";

import { useState } from "react";
import { adminService } from "@/services/adminService";

export function useAdminPassword() {
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (formData.new_password !== formData.confirm_password) {
      setMessage({
        type: "error",
        text: "New passwords do not match.",
      });
      return;
    }

    setUpdating(true);

    try {
      const result = await adminService.updatePassword({
        current_password: formData.current_password,
        new_password: formData.new_password,
      });

      if (result.success) {
        setMessage({
          type: "success",
          text: "Password updated successfully!",
        });
        setFormData({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
      } else {
        setMessage({
          type: "error",
          text: result.message || "Failed to update password.",
        });
      }
    } catch (err) {
      console.error("Error updating password", err);
      setMessage({
        type: "error",
        text: "An unexpected error occurred.",
      });
    } finally {
      setUpdating(false);
    }
  };

  return {
    formData,
    setFormData,
    updating,
    message,
    setMessage,
    handleUpdate,
  };
}
