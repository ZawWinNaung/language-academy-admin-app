"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "📊" },
  { name: "Students", href: "/students", icon: "🎓" },
  { name: "Teachers", href: "/teachers", icon: "👨‍🏫" },
  { name: "Classes", href: "/classes", icon: "🏫" },
  { name: "Courses", href: "/courses", icon: "📚" },
  { name: "Timetable Schedule", href: "/timetable", icon: "📅" },
  { name: "Payment", href: "/payment", icon: "💳" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Sidebar Menu */}
      <aside className="w-64 bg-[#0F172A]/80 backdrop-blur-xl border-r border-slate-800/80 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-500/20">
              C
            </div>
            <div>
              <h2 className="font-bold text-white text-sm tracking-tight leading-tight">
                Cambridge
              </h2>
              <p className="text-[11px] font-mono text-cyan-400">L5DC ADMIN</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/20 border border-indigo-400/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <span className="text-base leading-none">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-900/50 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-xs">
                AD
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-slate-200 truncate">
                  Administrator
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  admin@academy.edu
                </p>
              </div>
            </div>
            <Link
              href="/login"
              title="Logout"
              className="text-slate-500 hover:text-rose-400 text-sm p-1 transition-colors"
            >
              🚪
            </Link>
          </div>
        </div>
      </aside>

      {/* Dashboard Main Content View */}
      <main className="flex-1 overflow-y-auto bg-[#090D16] p-8">
        {children}
      </main>
    </div>
  );
}
