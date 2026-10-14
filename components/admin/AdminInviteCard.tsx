"use client";

import React from "react";
import { FaUserPlus, FaEnvelope, FaUser } from "react-icons/fa";
import StatusMessageCard from "@/components/common/StatusMessageBox";

interface AdminInviteCardProps {
  inviteData: {
    name: string;
    email: string;
  };
  setInviteData: (data: any) => void;
  updating: boolean;
  message: { type: "success" | "error"; text: string } | null;
  setMessage: (msg: { type: "success" | "error"; text: string } | null) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AdminInviteCard({
  inviteData,
  setInviteData,
  updating,
  message,
  setMessage,
  onSubmit,
}: AdminInviteCardProps) {
  return (
    <div className="flex flex-col space-y-3">
      <form
        onSubmit={onSubmit}
        className="glass-card border border-border-main p-6 rounded-2xl flex flex-col justify-between space-y-4"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border-main pb-3 text-text-main font-bold text-sm">
            <FaUserPlus className="text-brand-primary" />
            <span>Invite New Admin</span>
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
                  placeholder="e.g. John Doe"
                  value={inviteData.name}
                  onChange={(e) =>
                    setInviteData({ ...inviteData, name: e.target.value })
                  }
                  className="w-full bg-surface-hover border border-border-main rounded-xl pl-10 pr-3.5 py-2.5 text-text-main focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-text-muted font-medium mb-1.5 uppercase tracking-wider text-[10px]">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-3 text-text-dim text-xs" />
                <input
                  type="email"
                  required
                  placeholder="e.g. john@academy.edu"
                  value={inviteData.email}
                  onChange={(e) =>
                    setInviteData({ ...inviteData, email: e.target.value })
                  }
                  className="w-full bg-surface-hover border border-border-main rounded-xl pl-10 pr-3.5 py-2.5 text-text-main focus:outline-none focus:border-brand-primary"
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
            {updating ? "Processing..." : "Send Invitation"}
          </button>
        </div>
      </form>

      <StatusMessageCard message={message} onClear={() => setMessage(null)} />
    </div>
  );
}
