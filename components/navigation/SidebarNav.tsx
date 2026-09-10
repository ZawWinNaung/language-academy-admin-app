"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  FaSchool,
  FaHome,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBookOpen,
} from "react-icons/fa";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { MdPayment } from "react-icons/md";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: <FaHome /> },
  { name: "Students", href: "/students", icon: <FaUserGraduate /> },
  { name: "Teachers", href: "/teachers", icon: <FaChalkboardTeacher /> },
  { name: "Courses", href: "/courses", icon: <FaBookOpen /> },
  { name: "Classes", href: "/classes", icon: <FaSchool /> },
  {
    name: "Timetable Schedule",
    href: "/timetable",
    icon: <RiCalendarScheduleFill />,
  },
  { name: "Payment", href: "/payment", icon: <MdPayment /> },
];

interface SidebarNavProps {
  onClose: () => void;
}

export default function SidebarNav({ onClose }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="p-4 space-y-1.5">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onClose}
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
  );
}
