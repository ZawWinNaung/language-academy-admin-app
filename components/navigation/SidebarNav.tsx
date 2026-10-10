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
                ? "bg-brand-primary text-white shadow-xs"
                : "text-text-muted hover:text-text-main hover:bg-surface-hover"
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
