"use client";

import React, { useEffect, useState } from "react";

export interface User {
  name: string;
  email: string;
  role?: string;
}

interface UserProfileProps {
  currentUser?: User;
  onLogoutClick: () => void;
}

export default function UserProfile({
  currentUser,
  onLogoutClick,
}: UserProfileProps) {
  const [user, setUser] = useState<User | null>(currentUser || null);
  const [loading, setLoading] = useState(!currentUser);

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      setLoading(false);
      return;
    }

    const fetchAdminUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user || data);
        }
      } catch (error) {
        console.error("Failed to fetch logged-in user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminUser();
  }, [currentUser]);

  const getInitials = (name?: string) => {
    if (!name) return "AD";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="p-4 border-t border-slate-800/80">
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 transition-all">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-xs shrink-0">
            {getInitials(user?.name)}
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-slate-200 truncate">
              {loading ? (
                <span className="inline-block w-20 h-3 bg-slate-800 animate-pulse rounded" />
              ) : (
                user?.name || "Administrator"
              )}
            </p>
            <p className="text-[10px] text-slate-500 truncate font-mono">
              {loading ? (
                <span className="inline-block w-24 h-2.5 bg-slate-800 animate-pulse rounded mt-1" />
              ) : (
                user?.email || "admin@academy.edu"
              )}
            </p>
          </div>
        </div>

        {/* Logout Trigger Button */}
        <button
          onClick={onLogoutClick}
          title="Sign Out"
          aria-label="Sign Out"
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all shrink-0 ml-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H2.25"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
