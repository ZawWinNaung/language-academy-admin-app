"use client";

import React, { useState } from "react";
import Sidebar from "@/components/navigation/Sidebar";
import LogoutModal from "@/components/navigation/LogoutModal";
import MobileHeader from "@/components/navigation/MobileHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        window.location.replace("/login");
      } else {
        console.error("Logout API error:", await res.text());
        alert("Failed to sign out. Please check API route.");
        setIsLoggingOut(false);
      }
    } catch (error) {
      console.error("Logout network error:", error);
      alert("Network error during logout.");
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-[#090D16]">
      <MobileHeader
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenLogoutModal={() => setShowConfirmModal(true)}
      />

      <main className="flex-1 overflow-y-auto bg-[#090D16] p-4 sm:p-6 md:p-8">
        {children}
      </main>

      <LogoutModal
        isOpen={showConfirmModal}
        isLoggingOut={isLoggingOut}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
