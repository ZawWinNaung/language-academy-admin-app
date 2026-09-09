"use client";

import { ReactNode } from "react";

interface DataGridProps<T> {
  data: T[];
  renderCard: (item: T) => ReactNode;
  loading?: boolean;
  emptyMessage?: string;
  keyExtractor: (item: T) => string | number;
  gridClassName?: string;
}

export default function DataGrid<T>({
  data,
  renderCard,
  loading = false,
  emptyMessage = "No records found matching your search.",
  keyExtractor,
  gridClassName = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
}: DataGridProps<T>) {
  if (loading) {
    return (
      <div className="glass-card rounded-2xl border border-slate-800/80 p-12 text-center text-slate-500 text-xs font-mono">
        Loading items...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="glass-card rounded-2xl border border-slate-800/80 p-12 text-center text-slate-400 text-xs">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={gridClassName}>
      {data.map((item) => (
        <div key={keyExtractor(item)}>{renderCard(item)}</div>
      ))}
    </div>
  );
}
