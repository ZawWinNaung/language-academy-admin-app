"use client";

import { ReactNode } from "react";

interface DataGridProps<T> {
  data: T[];
  renderCard: (item: T) => ReactNode;
  loading?: boolean;
  emptyMessage?: string;
  keyExtractor: (item: T, index: number) => string | number;
  gridClassName?: string;
}

export default function DataGrid<T>({
  data,
  renderCard,
  loading = false,
  emptyMessage = "No records found matching your search.",
  keyExtractor,
  gridClassName = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
}: DataGridProps<T>) {
  if (loading) {
    return (
      <div className="glass-card rounded-2xl border border-border-main bg-surface p-12 text-center text-text-dim text-xs font-mono shadow-xs">
        Loading items...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="glass-card rounded-2xl border border-border-main bg-surface p-12 text-center text-text-muted text-xs shadow-xs">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={gridClassName}>
      {data.map((item, index) => {
        const key = keyExtractor(item, index) ?? index;
        return <div key={key}>{renderCard(item)}</div>;
      })}
    </div>
  );
}
