"use client";

import React from "react";
import { HiX } from "react-icons/hi";

interface SidebarHeaderProps {
  onClose: () => void;
}

export default function SidebarHeader({ onClose }: SidebarHeaderProps) {
  return (
    <div className="p-6 border-b border-border-main flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center text-white font-black text-lg shadow-xs">
          C
        </div>
        <div>
          <h2 className="font-bold text-text-main text-sm tracking-tight leading-tight">
            Cambridge
          </h2>
          <p className="text-[11px] font-mono text-brand-primary font-semibold">
            ADMIN PANEL
          </p>
        </div>
      </div>

      {/* Mobile Close Button */}
      <button
        onClick={onClose}
        className="md:hidden text-text-dim hover:text-text-main p-1 cursor-pointer"
        aria-label="Close Sidebar"
      >
        <HiX className="text-xl" />
      </button>
    </div>
  );
}
