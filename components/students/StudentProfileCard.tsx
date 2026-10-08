"use client";

import React from "react";
import {
  FaUserGraduate,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaSave,
} from "react-icons/fa";

interface StudentProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  joined_date: string;
}

interface StudentProfileCardProps {
  student: StudentProfile;
  setStudent: React.Dispatch<React.SetStateAction<StudentProfile | null>>;
  savingProfile: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function StudentProfileCard({
  student,
  setStudent,
  savingProfile,
  onSubmit,
}: StudentProfileCardProps) {
  return (
    <div className="glass-card border border-border-main rounded-2xl p-5">
      <h2 className="text-sm font-bold text-text-main mb-4 flex items-center gap-2 border-b border-border-main pb-3">
        <FaUserGraduate className="text-brand-primary" /> Student Profile Details
      </h2>

      <form onSubmit={onSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-text-muted font-semibold mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={student.name || ""}
            onChange={(e) => setStudent({ ...student, name: e.target.value })}
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
              value={student.email || ""}
              onChange={(e) =>
                setStudent({ ...student, email: e.target.value })
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
              value={student.phone || ""}
              onChange={(e) =>
                setStudent({ ...student, phone: e.target.value })
              }
              className="w-full bg-surface-hover border border-border-main rounded-xl pl-9 pr-3 py-2 text-text-main focus:outline-none focus:border-brand-primary"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-text-muted font-semibold mb-1">
            Joined Date
          </label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
            <input
              type="date"
              value={
                student.joined_date ? student.joined_date.substring(0, 10) : ""
              }
              onChange={(e) =>
                setStudent({ ...student, joined_date: e.target.value })
              }
              className="w-full bg-surface-hover border border-border-main rounded-xl pl-9 pr-3 py-2 text-text-main focus:outline-none focus:border-brand-primary"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={savingProfile}
          className="w-full mt-2 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold py-2.5 rounded-xl transition-all inline-flex items-center justify-center gap-2"
        >
          <FaSave /> {savingProfile ? "Saving..." : "Save Profile Changes"}
        </button>
      </form>
    </div>
  );
}
