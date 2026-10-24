"use client";

import React from "react";
import { FaLock } from "react-icons/fa";
import StatusMessageCard from "@/components/common/StatusMessageBox";
import { AdminPasswordFormData } from "@/types/admin";

interface AdminPasswordCardProps {
  passwordData: AdminPasswordFormData;
  setPasswordData: React.Dispatch<React.SetStateAction<AdminPasswordFormData>>;
  updating: boolean;
  message: { type: "success" | "error"; text: string } | null;
  setMessage: (msg: { type: "success" | "error"; text: string } | null) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AdminPasswordCard({
  passwordData,
  setPasswordData,
  updating,
  message,
  setMessage,
  onSubmit,
}: AdminPasswordCardProps) {
  return (
    <div className="flex flex-col space-y-3">
      <form
        onSubmit={onSubmit}
        className="glass-card border border-border-main p-6 rounded-2xl flex flex-col justify-between space-y-4"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border-main pb-3 text-text-main font-bold text-sm">
            <FaLock className="text-brand-primary" />
            <span>Change Password</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label
                htmlFor="current-password"
                className="block text-text-muted font-medium mb-1.5 uppercase tracking-wider text-[10px]"
              >
                Current Password
              </label>
              <input
                id="current-password"
                type="password"
                required
                placeholder="••••••••"
                value={passwordData.current_password}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    current_password: e.target.value,
                  })
                }
                className="w-full bg-surface-hover border border-border-main rounded-xl px-3.5 py-2.5 text-text-main focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label
                htmlFor="new-password"
                className="block text-text-muted font-medium mb-1.5 uppercase tracking-wider text-[10px]"
              >
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                required
                placeholder="••••••••"
                value={passwordData.new_password}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    new_password: e.target.value,
                  })
                }
                className="w-full bg-surface-hover border border-border-main rounded-xl px-3.5 py-2.5 text-text-main focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label
                htmlFor="confirm-new-password"
                className="block text-text-muted font-medium mb-1.5 uppercase tracking-wider text-[10px]"
              >
                Confirm New Password
              </label>
              <input
                id="confirm-new-password"
                type="password"
                required
                placeholder="••••••••"
                value={passwordData.confirm_password}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirm_password: e.target.value,
                  })
                }
                className="w-full bg-surface-hover border border-border-main rounded-xl px-3.5 py-2.5 text-text-main focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={updating}
            className="px-5 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold text-xs rounded-xl shadow-md shadow-brand-primary/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {updating ? "Updating Password..." : "Update Password"}
          </button>
        </div>
      </form>

      <StatusMessageCard message={message} onClear={() => setMessage(null)} />
    </div>
  );
}
