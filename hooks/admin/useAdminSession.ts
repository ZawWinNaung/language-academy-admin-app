"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import { AdminProfile } from "@/types/admin";

export function useAdminSession(initialUser?: Partial<AdminProfile>) {
  const [user, setUser] = useState<Partial<AdminProfile> | null>(
    initialUser || null,
  );
  const [loading, setLoading] = useState(!initialUser);

  useEffect(() => {
    if (initialUser && initialUser.name) {
      setUser(initialUser);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const result = await adminService.getProfile();
        if (result.success && result.user) {
          setUser(result.user);
        }
      } catch (error) {
        console.error("Failed to fetch logged-in user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [initialUser]);

  const getInitials = (name?: string) => {
    if (!name) return "AD";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return {
    user,
    loading,
    getInitials,
  };
}
