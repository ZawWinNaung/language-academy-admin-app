"use client";

import { ReactNode } from "react";

export interface Column<T> {
  header: string;
  className?: string;
  render?: (item: T) => ReactNode;
  accessorKey?: keyof T;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  keyExtractor: (item: T) => string | number;
}

export default function DataTable<T>({
  data,
  columns,
  loading = false,
  emptyMessage = "No records found matching your search.",
  keyExtractor,
}: DataTableProps<T>) {
  return (
    <div className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden">
      {loading ? (
        <div className="p-12 text-center text-slate-500 text-xs font-mono">
          Loading records...
        </div>
      ) : data.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-xs">
          {emptyMessage}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 border-b border-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className={`py-4 px-6 ${col.className || ""}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {data.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`py-4 px-6 ${col.className || ""}`}
                    >
                      {col.render
                        ? col.render(item)
                        : col.accessorKey
                          ? String(item[col.accessorKey] ?? "")
                          : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
