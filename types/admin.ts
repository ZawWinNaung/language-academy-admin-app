import { RowDataPacket } from "mysql2";

export interface AdminProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  user?: Pick<AdminProfile, "id" | "name" | "email">;
}

export interface UpdateProfilePayload {
  name: string;
  phone: string;
}

export interface UpdatePasswordPayload {
  current_password: string;
  new_password: string;
}

export interface AdminPasswordFormData extends UpdatePasswordPayload {
  confirm_password: string;
}

export interface AdminRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface InviteAdminPayload {
  email: string;
  name: string;
}
