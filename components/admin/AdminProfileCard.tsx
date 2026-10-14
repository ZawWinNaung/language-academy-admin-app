"use client";

import React from "react";
import { FaUserShield, FaEnvelope, FaPhone, FaUser } from "react-icons/fa";
import StatusMessageCard from "@/components/common/StatusMessageBox";

interface AdminProfileCardProps {
  profileData: {
    name: string;
    email: string;
    phone: string;
  };
  setProfileData: (data: any) => void;
  updating: boolean;
  message: { type: "success" | "error"; text: string } | null;
  setMessage: (msg: { type: "success" | "error"; text: string } | null) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AdminProfileCard({
  profileData,
  setProfileData,
  updating,
  message,
  setMessage,
  onSubmit,
}: AdminProfileCardProps) {
  return (
    <div className="flex flex-col space-y-3">
      <form
        onSubmit={onSubmit}
        className="glass-card border border-border-main p-6 rounded-2xl flex flex-col justify-between space-y-4"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border-main pb-3 text-text-main font-bold text-sm">
            <FaUserShield className="text-brand-primary" />
            <span>Personal Information</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-text-muted font-medium mb-1.5 uppercase tracking-wider text-[10px]">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-3.5 top-3 text-text-dim text-xs" />
                <input
                  type="text"
                  required
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  className="w-full bg-surface-hover border border-border-main rounded-xl pl-10 pr-3.5 py-2.5 text-text-main focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-text-muted font-medium mb-1.5 uppercase tracking-wider text-[10px]">
                Phone Number
              </label>
              <div className="relative">
                <FaPhone className="absolute left-3.5 top-3 text-text-dim text-xs" />
                <input
                  type="text"
                  placeholder="update your phone number"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                  className="w-full bg-surface-hover border border-border-main rounded-xl pl-10 pr-3.5 py-2.5 text-text-main focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-text-muted font-medium mb-1.5 uppercase tracking-wider text-[10px]">
                Email Address{" "}
                <span className="text-text-dim font-normal lowercase">
                  (locked - email updates disabled)
                </span>
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-3 text-text-dim text-xs" />
                <input
                  type="email"
                  disabled
                  value={profileData.email}
                  className="w-full bg-surface-hover/50 border border-border-main rounded-xl pl-10 pr-3.5 py-2.5 text-text-dim cursor-not-allowed opacity-75 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={updating}
            className="px-5 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold text-xs rounded-xl shadow-md shadow-brand-primary/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {updating ? "Saving Profile..." : "Save Profile"}
          </button>
        </div>
      </form>

      <StatusMessageCard message={message} onClear={() => setMessage(null)} />
    </div>
  );
}
