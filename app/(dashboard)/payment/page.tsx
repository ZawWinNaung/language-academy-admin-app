"use client";

import React, { useEffect, useState } from "react";
import PaymentCard, { Payment } from "@/components/payments/PaymentCard";
import { FilterBar } from "@/components/ui/FilterBar";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (selectedStatus) params.append("status", selectedStatus);
      if (selectedMonth) params.append("payment_month", selectedMonth);

      const res = await fetch(`/api/payments?${params.toString()}`);
      const result = await res.json();

      if (result.success) {
        setPayments(result.data);
      }
    } catch (error) {
      console.error("Failed to load payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const isFiltered = Boolean(searchQuery || selectedStatus || selectedMonth);
  const handleReset = () => {
    setSearchQuery("");
    setSelectedStatus("");
    setSelectedMonth("");
  };

  useEffect(() => {
    fetchPayments();
  }, [searchQuery, selectedStatus, selectedMonth]);

  // Toggle status between 'Paid' and 'Refunded'
  const handleUpdateStatus = async (payment: Payment) => {
    const newStatus = payment.status === "Paid" ? "Refunded" : "Paid";

    try {
      const res = await fetch("/api/payments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: payment.id, status: newStatus }),
      });

      if (res.ok) {
        fetchPayments();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border-main">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">
            Payment Management
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Track student tuition fees, transaction records, and refund status.
          </p>
        </div>
      </div>

      <FilterBar>
        <FilterBar.Search
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search student or enrollment ID..."
        />

        <FilterBar.Group>
          <FilterBar.Select
            value={selectedStatus}
            onChange={setSelectedStatus}
            placeholder="All Statuses"
            options={[
              { label: "Paid", value: "Paid" },
              { label: "Refunded", value: "Refunded" },
            ]}
          />

          <FilterBar.MonthPicker
            value={selectedMonth}
            onChange={setSelectedMonth}
          />

          {isFiltered && <FilterBar.Reset onReset={handleReset} />}

          <FilterBar.Counter
            filteredCount={payments.length}
            totalCount={payments.length}
          />
        </FilterBar.Group>
      </FilterBar>

      {/* Grid View */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-44 bg-surface-hover border border-border-main rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-12 bg-surface border border-border-main rounded-2xl">
          <p className="text-text-muted text-sm">
            No payment records found matching your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {payments.map((payment) => (
            <PaymentCard
              key={payment.id}
              payment={payment}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
