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
    <div className="md:hidden flex items-center justify-between px-4 py-3 bg-surface border-b border-border-main z-20 shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-brand-primary flex items-center justify-center text-white font-black text-sm shadow-xs">
          C
        </div>
        <div>
          <h2 className="font-bold text-text-main text-xs tracking-tight leading-none">
            Cambridge
          </h2>
          <p className="text-[10px] font-mono text-brand-primary font-semibold">
            ADMIN PANEL
          </p>
        </div>
      </div>

      <button
        onClick={onToggleSidebar}
        aria-label="Toggle Navigation Menu"
        className="p-2 rounded-xl text-text-muted hover:text-text-main bg-surface-hover border border-border-main focus:outline-none cursor-pointer"
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
