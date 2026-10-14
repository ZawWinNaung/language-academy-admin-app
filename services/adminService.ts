import {
  AdminProfile,
  UpdateProfilePayload,
  UpdatePasswordPayload,
} from "@/types/admin";
import { InviteAdminPayload } from "@/types/admin";

export const adminService = {
  async getProfile(): Promise<{
    success: boolean;
    user?: AdminProfile;
    message?: string;
  }> {
    const res = await fetch("/api/auth/profile");
    return res.json();
  },

  async updateProfile(
    payload: UpdateProfilePayload,
  ): Promise<{ success: boolean; message?: string }> {
    const res = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async updatePassword(
    payload: UpdatePasswordPayload,
  ): Promise<{ success: boolean; message?: string }> {
    const res = await fetch("/api/auth/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async inviteAdmin(payload: InviteAdminPayload) {
    const res = await fetch("/api/auth/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },
};
