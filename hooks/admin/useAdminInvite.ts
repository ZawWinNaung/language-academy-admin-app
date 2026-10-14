"use client";

import { useState } from "react";
import { adminService } from "@/services/adminService";

export function useAdminInvite() {
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setUpdating(true);

    try {
      const result = await adminService.inviteAdmin(formData);

      if (result.success) {
        setMessage({
          type: "success",
          text: `Admin created! Opening Gmail compose tab for ${formData.email}...`,
        });

        const subject = encodeURIComponent(
          "You've Been Invited as an Administrator",
        );
        const body = encodeURIComponent(
          `Hello ${formData.name},\n\nYou have been invited to join the platform as an Administrator. Here are your temporary login credentials:\n\nEmail: ${formData.email}\nTemporary Password: ${result.temp_password}\n\nPlease log in and change your password immediately.`,
        );

        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
          formData.email,
        )}&su=${subject}&body=${body}`;

        window.open(gmailUrl, "_blank");

        setFormData({
          name: "",
          email: "",
        });
      } else {
        setMessage({
          type: "error",
          text: result.message || "Failed to invite admin.",
        });
      }
    } catch (err) {
      console.error("Error inviting admin:", err);
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
    handleInvite,
  };
}
