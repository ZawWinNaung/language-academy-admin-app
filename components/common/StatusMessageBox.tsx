"use client";

import React from "react";
import { FaTimes } from "react-icons/fa";

interface StatusMessageCardProps {
  message: { type: "success" | "error"; text: string } | null;
  onClear: () => void;
}

export default function StatusMessageCard({
  message,
  onClear,
}: StatusMessageCardProps) {
  if (!message) return null;

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold border shadow-sm ${
        message.type === "success"
          ? "bg-emerald-50 border-emerald-200 text-status-success"
          : "bg-rose-50 border-rose-200 text-status-danger"
      }`}
    >
      <span>{message.text}</span>
      <button
        type="button"
        onClick={onClear}
        className="p-1 text-text-dim hover:text-text-main rounded-md transition-colors cursor-pointer ml-2"
        title="Clear message"
      >
        <FaTimes className="text-xs" />
      </button>
    </div>
  );
}
