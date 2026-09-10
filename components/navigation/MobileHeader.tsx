"use client";

import React from "react";
import { HiMenu, HiX } from "react-icons/hi";

interface MobileHeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function MobileHeader({
  isSidebarOpen,
  onToggleSidebar,
}: MobileHeaderProps) {
  return (
    <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0F172A] border-b border-slate-800/80 z-20 shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-500/20">
          C
        </div>
        <div>
          <h2 className="font-bold text-white text-xs tracking-tight leading-none">
            Cambridge
          </h2>
          <p className="text-[10px] font-mono text-cyan-400">ADMIN PANEL</p>
        </div>
      </div>

      <button
        onClick={onToggleSidebar}
        aria-label="Toggle Navigation Menu"
        className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/50 border border-slate-700/60 focus:outline-none"
      >
        {isSidebarOpen ? (
          <HiX className="text-xl" />
        ) : (
          <HiMenu className="text-xl" />
        )}
      </button>
    </div>
  );
}
