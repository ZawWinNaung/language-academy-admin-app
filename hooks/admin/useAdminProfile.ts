"use client";

import { useState, useEffect } from "react";
import { adminService } from "@/services/adminService";

export function useAdminProfile() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await adminService.getProfile();
      if (result.success && result.user) {
        setFormData({
          name: result.user.name || "",
          email: result.user.email || "",
          phone: result.user.phone || "",
        });
      }
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setUpdating(true);

    try {
      const result = await adminService.updateProfile({
        name: formData.name,
        phone: formData.phone,
      });

      if (result.success) {
        setMessage({
          type: "success",
          text: "Profile updated successfully!",
        });
      } else {
        setMessage({
          type: "error",
          text: result.message || "Failed to update profile.",
        });
      }
    } catch (err) {
      console.error("Error updating profile", err);
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
    loading,
    updating,
    message,
    setMessage,
    handleUpdate,
  };
}
