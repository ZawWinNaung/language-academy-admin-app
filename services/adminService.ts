import {
  AdminProfile,
  UpdateProfilePayload,
  UpdatePasswordPayload,
  InviteAdminPayload,
  LoginCredentials,
  LoginResponse,
} from "@/types/admin";

export const adminService = {
  async login(payload: LoginCredentials): Promise<LoginResponse> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data: LoginResponse = await res.json();
    return { ...data, success: res.ok && data.success };
  },

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
