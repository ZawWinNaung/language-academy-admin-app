"use client";

import { ReactNode } from "react";
import Pagination from "@/components/ui/Pagination";

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
  title?: string;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems?: number;
    pageSize?: number;
  };
  onItemClick?: (item: T) => void;
}

export default function DataTable<T>({
  data,
  columns,
  loading = false,
  emptyMessage = "No records found matching your search.",
  keyExtractor,
  title,
  actionButton,
  pagination,
  onItemClick,
}: DataTableProps<T>) {
  const showHeader = Boolean(title || actionButton);

  return (
    <div className="glass-card rounded-2xl border border-border-main bg-surface overflow-hidden shadow-xs flex flex-col h-full">
      {showHeader && (
        <div className="flex items-center justify-between p-5 border-b border-border-main shrink-0">
          {title ? (
            <h2 className="text-sm font-bold text-text-main flex items-center gap-2">
              {title}
            </h2>
          ) : (
            <div />
          )}
          {actionButton && (
            <button
              onClick={actionButton.onClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              {actionButton.icon} {actionButton.label}
            </button>
          )}
        </div>
      )}

      <div className="overflow-x-auto overflow-y-auto flex-1">
        {loading ? (
          <div className="p-12 text-center text-text-dim text-xs font-mono">
            Loading records...
          </div>
        ) : data.length === 0 ? (
          <div className="p-12 text-center text-text-muted text-xs">
            {emptyMessage}
          </div>
        ) : (
          <table className="w-full text-left text-xs text-text-main">
            <thead className="bg-surface-hover border-b border-border-main text-[11px] uppercase tracking-wider text-text-muted font-semibold sticky top-0 z-10">
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className={`py-3.5 px-4 ${col.className || ""}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {data.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  onClick={() => onItemClick?.(item)}
                  className={`hover:bg-surface-hover/60 transition-colors ${
                    onItemClick ? "cursor-pointer" : ""
                  }`}
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`py-3.5 px-4 ${col.className || ""}`}
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
        )}
      </div>

      {pagination && data.length > 0 && (
        <div className="p-4 border-t border-border-main bg-surface shrink-0">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onPageChange}
            totalItems={pagination.totalItems}
            pageSize={pagination.pageSize ?? 10}
          />
        </div>
      )}
    </div>
  );
}
