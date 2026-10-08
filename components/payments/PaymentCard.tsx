"use client";

import React from "react";
import { FaCalendarAlt, FaReceipt, FaUserGraduate } from "react-icons/fa";
import { MdOutlinePayments } from "react-icons/md";

export interface Payment {
  id: number;
  enrollment_id: number;
  amount: string;
  payment_month: string;
  paid_date: string;
  status: "Paid" | "Refunded";
  student_name?: string;
  course_name?: string;
}

interface PaymentCardProps {
  payment: Payment;
  onUpdateStatus?: (payment: Payment) => void;
}

export default function PaymentCard({
  payment,
  onUpdateStatus,
}: PaymentCardProps) {
  const isPaid = payment.status === "Paid";

  return (
    <div className="glass-card border border-border-main hover:border-brand-primary/40 rounded-2xl p-5 transition-all shadow-md flex flex-col justify-between space-y-4">
      {/* Card Header: Amount & Status */}
      <div className="flex items-start justify-between gap-2 border-b border-border-main pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary-light border border-brand-primary/20 flex items-center justify-center text-brand-primary text-lg">
            <MdOutlinePayments />
          </div>
          <div>
            <span className="text-xl font-bold text-text-main tracking-tight">
              ${parseFloat(payment.amount).toFixed(2)}
            </span>
            <p className="text-[10px] font-mono text-brand-primary">
              MONTH: {payment.payment_month}
            </p>
          </div>
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
            isPaid
              ? "bg-status-success/10 text-status-success border-status-success/20"
              : "bg-status-danger/10 text-status-danger border-status-danger/20"
          }`}
        >
          {payment.status}
        </span>
      </div>

      {/* Card Body: Details */}
      <div className="space-y-2 text-xs text-text-muted">
        <div className="flex items-center gap-2">
          <FaUserGraduate className="text-text-dim shrink-0" />
          <span className="font-semibold text-text-main truncate">
            {payment.student_name || "Unknown Student"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-text-muted">
          <FaReceipt className="text-text-dim shrink-0" />
          <span className="truncate">
            Enrollment ID: #{payment.enrollment_id}
            {payment.course_name ? ` (${payment.course_name})` : ""}
          </span>
        </div>

        <div className="flex items-center gap-2 text-text-muted">
          <FaCalendarAlt className="text-text-dim shrink-0" />
          <span>
            Paid Date:{" "}
            {payment.paid_date
              ? new Date(payment.paid_date).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
      </div>

      {/* Card Footer: Actions */}
      {onUpdateStatus && (
        <div className="pt-2 border-t border-border-main flex justify-end">
          <button
            onClick={() => onUpdateStatus(payment)}
            className="text-[11px] font-medium text-text-muted hover:text-text-main px-2.5 py-1 rounded-lg hover:bg-surface-hover transition-all"
          >
            Mark as {isPaid ? "Refunded" : "Paid"}
          </button>
        </div>
      )}
    </div>
  );
}
