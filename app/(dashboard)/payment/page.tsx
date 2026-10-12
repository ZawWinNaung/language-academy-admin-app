"use client";

import React, { useState } from "react";
import { FilterBar } from "@/components/ui/FilterBar";
import HeaderBar from "@/components/ui/HeaderBar";
import DataTable, { Column } from "@/components/ui/DataTable";
import { usePayments } from "@/hooks/payments/usePayments";
import { usePaymentMutations } from "@/hooks/payments/usePaymentMutations";
import { PaymentItem } from "@/types/payment";

export default function PaymentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const pageSize = 20;

  const { payments, pagination, loading, refreshPayments } = usePayments({
    page: currentPage,
    limit: pageSize,
    status: statusFilter,
    payment_month: monthFilter,
    search: searchQuery,
  });

  const { updatePaymentStatus } = usePaymentMutations(refreshPayments);

  const isFiltered = Boolean(searchQuery || statusFilter || monthFilter);
  const handleReset = () => {
    setSearchQuery("");
    setStatusFilter("");
    setMonthFilter("");
    setCurrentPage(1);
  };

  const handleUpdateStatus = async (payment: PaymentItem) => {
    const newStatus = payment.status === "Paid" ? "Refunded" : "Paid";
    await updatePaymentStatus(payment.id, newStatus);
  };

  const columns: Column<PaymentItem>[] = [
    {
      header: "Student",
      className: "text-center",
      render: (item) => (
        <span className="font-semibold text-text-main">
          {item.student_name || "Unknown Student"}
        </span>
      ),
    },
    {
      header: "Course",
      className: "text-center",
      render: (item) => (
        <div className="text-center">
          <span className="font-medium text-text-main">
            {item.course_title || "N/A"}
          </span>
        </div>
      ),
    },
    {
      header: "Class",
      className: "text-center",
      render: (item) => (
        <div className="text-center">
          <span className="text-text-muted">{item.class_name || "N/A"}</span>
        </div>
      ),
    },
    {
      header: "Month",
      className: "text-center",
      render: (item) => (
        <div className="text-center">
          <span className="font-mono text-xs text-brand-primary">
            {item.payment_month}
          </span>
        </div>
      ),
    },
    {
      header: "Amount",
      className: "text-center",
      render: (item) => (
        <div className="text-center">
          <span className="font-bold text-text-main">
            {Math.round(parseFloat(item.amount || "0")).toLocaleString()} MMK
          </span>
        </div>
      ),
    },
    {
      header: "Paid Date",
      className: "text-center",
      render: (item) => (
        <div className="text-center">
          <span className="text-text-muted">
            {item.paid_date
              ? new Date(item.paid_date).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      className: "text-center",
      render: (item) => {
        const isPaid = item.status === "Paid";
        return (
          <div className="text-center">
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider inline-block ${
                isPaid
                  ? "bg-status-success/10 text-status-success border-status-success/20"
                  : "bg-status-danger/10 text-status-danger border-status-danger/20"
              }`}
            >
              {item.status}
            </span>
          </div>
        );
      },
    },
    {
      header: "Actions",
      className: "text-center",
      render: (item) => {
        const isPaid = item.status === "Paid";
        return (
          <div className="text-center">
            <button
              onClick={() => handleUpdateStatus(item)}
              className={`text-[11px] font-semibold bg-transparent border-none cursor-pointer transition-all hover:underline ${
                isPaid
                  ? "text-status-danger hover:opacity-80"
                  : "text-status-success hover:opacity-80"
              }`}
            >
              {isPaid ? "Mark as Refunded" : "Mark as Paid"}
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <HeaderBar
        title="Payment Management"
        description="Track student tuition fees, transaction records, and refund status."
      />

      <FilterBar>
        <FilterBar.Search
          value={searchQuery}
          onChange={(val) => {
            setSearchQuery(val);
            setCurrentPage(1);
          }}
          placeholder="Search student or enrollment ID..."
        />

        <FilterBar.Group>
          <FilterBar.Select
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
            placeholder="All Statuses"
            options={[
              { label: "Paid", value: "Paid" },
              { label: "Refunded", value: "Refunded" },
            ]}
          />

          <FilterBar.MonthPicker
            value={monthFilter}
            onChange={(val) => {
              setMonthFilter(val);
              setCurrentPage(1);
            }}
          />

          {isFiltered && <FilterBar.Reset onReset={handleReset} />}

          <FilterBar.Counter
            filteredCount={pagination.totalRecords}
            totalCount={pagination.totalRecords}
          />
        </FilterBar.Group>
      </FilterBar>

      <DataTable<PaymentItem>
        data={payments}
        columns={columns}
        loading={loading}
        emptyMessage="No payment records found matching your filters."
        keyExtractor={(item) => item.id}
        pagination={{
          currentPage,
          totalPages: pagination.totalPages,
          onPageChange: (page) => setCurrentPage(page),
          totalItems: pagination.totalRecords,
          pageSize,
        }}
      />
    </div>
  );
}
