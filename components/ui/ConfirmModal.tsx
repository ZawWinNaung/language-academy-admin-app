"use client";

import React from "react";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  isOpen,
  title = "Confirm Action",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: "bg-status-danger hover:bg-status-danger/90 text-white",
    warning: "bg-status-warning hover:bg-status-warning/90 text-white",
    info: "bg-brand-primary hover:bg-brand-primary-hover text-white",
  };

  const iconStyles = {
    danger: "text-status-danger bg-status-danger/10 border-status-danger/20",
    warning: "text-status-warning bg-status-warning/10 border-status-warning/20",
    info: "text-brand-primary bg-brand-primary-light border-brand-primary/20",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-surface border border-border-main rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-sm animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-border-main pb-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-lg border ${iconStyles[variant]} text-xs`}
            >
              <FaExclamationTriangle />
            </div>
            <h3 className="text-sm font-bold text-text-main">{title}</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-text-dim hover:text-text-muted text-xs disabled:opacity-50 cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>

        <p className="text-xs text-text-muted leading-relaxed">{message}</p>

        <div className="flex justify-end gap-2 pt-2 border-t border-border-main">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-xs border border-border-main text-text-muted rounded-xl hover:bg-surface-hover transition-all disabled:opacity-50 cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all disabled:opacity-50 cursor-pointer ${variantStyles[variant]}`}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
