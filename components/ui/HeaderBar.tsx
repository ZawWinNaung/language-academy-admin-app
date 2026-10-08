"use client";

import { ReactNode } from "react";

interface HeaderBarProps {
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}

export default function HeaderBar({
  title,
  description,
  children,
}: HeaderBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border-main">
      <div>
        <h1 className="text-2xl font-bold text-text-main tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-xs text-text-muted mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
