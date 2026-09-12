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
    <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition-all shadow-md flex flex-col justify-between space-y-4">
      {/* Card Header: Amount & Status */}
      <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-lg">
            <MdOutlinePayments />
          </div>
          <div>
            <span className="text-xl font-bold text-white tracking-tight">
              ${parseFloat(payment.amount).toFixed(2)}
            </span>
            <p className="text-[10px] font-mono text-cyan-400">
              MONTH: {payment.payment_month}
            </p>
          </div>
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
            isPaid
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
          }`}
        >
          {payment.status}
        </span>
      </div>

      {/* Card Body: Details */}
      <div className="space-y-2 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <FaUserGraduate className="text-slate-500 shrink-0" />
          <span className="font-semibold text-slate-200 truncate">
            {payment.student_name || "Unknown Student"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <FaReceipt className="text-slate-500 shrink-0" />
          <span className="truncate">
            Enrollment ID: #{payment.enrollment_id}
            {payment.course_name ? ` (${payment.course_name})` : ""}
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <FaCalendarAlt className="text-slate-500 shrink-0" />
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
        <div className="pt-2 border-t border-slate-800/80 flex justify-end">
          <button
            onClick={() => onUpdateStatus(payment)}
            className="text-[11px] font-medium text-slate-400 hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-all"
          >
            Mark as {isPaid ? "Refunded" : "Paid"}
          </button>
        </div>
      )}
    </div>
  );
}
