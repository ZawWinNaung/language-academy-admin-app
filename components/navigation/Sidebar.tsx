"use client";

import React from "react";
import UserProfile, { User } from "./UserProfile";
import SidebarHeader from "./SidebarHeader";
import SidebarNav from "./SidebarNav";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogoutModal: () => void;
  currentUser?: User;
}

export default function Sidebar({
  isOpen,
  onClose,
  onOpenLogoutModal,
  currentUser,
}: SidebarProps) {
  const handleLogoutClick = () => {
    onClose();
    onOpenLogoutModal();
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed md:static top-0 left-0 bottom-0 z-40 w-64 bg-[#0F172A]/95 md:bg-[#0F172A]/80 backdrop-blur-xl border-r border-slate-800/80 flex flex-col justify-between shrink-0 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          <SidebarHeader onClose={onClose} />
          <SidebarNav onClose={onClose} />
        </div>

        <UserProfile
          currentUser={currentUser}
          onLogoutClick={handleLogoutClick}
        />
      </aside>
    </>
  );
}
