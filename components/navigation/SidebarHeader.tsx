"use client";

import React from "react";
import { HiX } from "react-icons/hi";

interface SidebarHeaderProps {
  onClose: () => void;
}

export default function SidebarHeader({ onClose }: SidebarHeaderProps) {
  return (
    <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-500/20">
          C
        </div>
        <div>
          <h2 className="font-bold text-white text-sm tracking-tight leading-tight">
            Cambridge
          </h2>
          <p className="text-[11px] font-mono text-cyan-400">ADMIN PANEL</p>
        </div>
      </div>

      {/* Mobile Close Button */}
      <button
        onClick={onClose}
        className="md:hidden text-slate-400 hover:text-white p-1"
        aria-label="Close Sidebar"
      >
        <HiX className="text-xl" />
      </button>
    </div>
  );
}
