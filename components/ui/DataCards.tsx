"use client";

import { ReactNode } from "react";

interface DataCardsProps<T> {
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  keyExtractor: (item: T) => string | number;
  renderCard: (item: T) => ReactNode;
}

export default function DataCards<T>({
  data,
  loading = false,
  emptyMessage = "No records found matching your search.",
  keyExtractor,
  renderCard,
}: DataCardsProps<T>) {
  if (loading) {
    return (
      <div className="glass-card p-12 text-center text-slate-500 text-xs font-mono rounded-2xl border border-slate-800/80">
        Loading records...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="glass-card p-12 text-center text-slate-400 text-xs rounded-2xl border border-slate-800/80">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((item) => (
        <div key={keyExtractor(item)}>{renderCard(item)}</div>
      ))}
    </div>
  );
}
