"use client";

import React from "react";
import {
  FaUserGraduate,
  FaEnvelope,
  FaPhone,
  FaAward,
  FaSave,
} from "react-icons/fa";

interface TeacherProfileCardProps {
  editableTeacher: {
    name: string;
    email: string;
    phone: string;
    qualification: string;
    is_active: boolean;
  };
  onChange: (updated: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
}

export function TeacherProfileCard({
  editableTeacher,
  onChange,
  onSubmit,
  saving,
}: TeacherProfileCardProps) {
  return (
    <div className="glass-card border border-border-main rounded-2xl p-5">
      <h2 className="text-sm font-bold text-text-main mb-4 flex items-center gap-2 border-b border-border-main pb-3">
        <FaUserGraduate className="text-brand-primary" /> Edit Profile Details
      </h2>

      <form onSubmit={onSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-text-muted font-semibold mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={editableTeacher.name}
            onChange={(e) =>
              onChange({ ...editableTeacher, name: e.target.value })
            }
            className="w-full bg-surface-hover border border-border-main rounded-xl px-3 py-2 text-text-main focus:outline-none focus:border-brand-primary"
            required
          />
        </div>

        <div>
          <label className="block text-text-muted font-semibold mb-1">
            Email Address
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
            <input
              type="email"
              value={editableTeacher.email}
              onChange={(e) =>
                onChange({ ...editableTeacher, email: e.target.value })
              }
              className="w-full bg-surface-hover border border-border-main rounded-xl pl-9 pr-3 py-2 text-text-main focus:outline-none focus:border-brand-primary"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-text-muted font-semibold mb-1">
            Phone Number
          </label>
          <div className="relative">
            <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
            <input
              type="text"
              value={editableTeacher.phone}
              onChange={(e) =>
                onChange({ ...editableTeacher, phone: e.target.value })
              }
              className="w-full bg-surface-hover border border-border-main rounded-xl pl-9 pr-3 py-2 text-text-main focus:outline-none focus:border-brand-primary"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-text-muted font-semibold mb-1">
            Qualification
          </label>
          <div className="relative">
            <FaAward className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
            <input
              type="text"
              value={editableTeacher.qualification}
              onChange={(e) =>
                onChange({ ...editableTeacher, qualification: e.target.value })
              }
              className="w-full bg-surface-hover border border-border-main rounded-xl pl-9 pr-3 py-2 text-text-main focus:outline-none focus:border-brand-primary"
              required
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="is_active"
            checked={editableTeacher.is_active}
            onChange={(e) =>
              onChange({ ...editableTeacher, is_active: e.target.checked })
            }
            className="rounded border-border-main bg-surface-hover text-brand-primary focus:ring-0 cursor-pointer"
          />
          <label
            htmlFor="is_active"
            className="text-text-muted font-medium cursor-pointer"
          >
            Active Faculty Member
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full mt-2 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold py-2.5 rounded-xl transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
        >
          <FaSave /> {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
