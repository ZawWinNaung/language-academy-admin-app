"use client";

import React, { useState } from "react";
import { FaUserPlus, FaTimes, FaSearch } from "react-icons/fa";
import { useAvailableStudents } from "@/hooks/useAvailableStudents";
import { bulkEnrollStudents } from "@/services/classService";

interface EnrollStudentsModalProps {
  classId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EnrollStudentsModal({
  classId,
  isOpen,
  onClose,
  onSuccess,
}: EnrollStudentsModalProps) {
  const { availableStudents, loading } = useAvailableStudents(isOpen);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const filteredStudents = availableStudents.filter(
    (st: any) =>
      st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map((st: any) => st.id));
    }
  };

  const toggleStudent = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSubmit = async () => {
    if (selectedIds.length === 0) return;
    setSubmitting(true);
    try {
      const res = await bulkEnrollStudents(classId, selectedIds);
      if (res.success) {
        onSuccess();
        onClose();
        setSelectedIds([]);
      } else {
        alert(res.message || "Failed to enroll students.");
      }
    } catch (err) {
      console.error(err);
      alert("Error enrolling students.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-card border border-border-main w-full max-w-xl rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b border-border-main pb-3">
          <h3 className="text-base font-semibold text-text-main flex items-center gap-2">
            <FaUserPlus className="text-brand-primary" /> Enroll Students
          </h3>
          <button
            onClick={onClose}
            className="text-text-dim hover:text-text-main transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Search & Select All */}
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-3 text-text-dim text-xs" />
            <input
              type="text"
              placeholder="Search available students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-hover border border-border-main rounded-xl pl-9 pr-3 py-2 text-xs text-text-main placeholder-text-dim focus:outline-none focus:border-brand-primary"
            />
          </div>
          <button
            type="button"
            onClick={toggleSelectAll}
            className="text-xs bg-surface-hover hover:bg-border-subtle text-text-muted px-3 py-2 rounded-xl border border-border-main transition-all"
          >
            {selectedIds.length === filteredStudents.length &&
            filteredStudents.length > 0
              ? "Deselect All"
              : "Select All"}
          </button>
        </div>

        {/* List of Available Students */}
        <div className="max-h-60 overflow-y-auto divide-y divide-border-main border border-border-main rounded-xl bg-surface-hover p-2">
          {loading ? (
            <p className="text-xs text-text-dim text-center py-6">
              Loading students...
            </p>
          ) : filteredStudents.length === 0 ? (
            <p className="text-xs text-text-dim text-center py-6">
              No unassigned students found.
            </p>
          ) : (
            filteredStudents.map((st: any) => (
              <label
                key={st.id}
                className="flex items-center justify-between p-2.5 hover:bg-brand-primary-light rounded-lg cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(st.id)}
                    onChange={() => toggleStudent(st.id)}
                    className="accent-brand-primary rounded cursor-pointer"
                  />
                  <div>
                    <p className="text-xs font-medium text-text-main">{st.name}</p>
                    <p className="text-[11px] text-text-muted">
                      {st.email} • {st.phone}
                    </p>
                  </div>
                </div>
              </label>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-xs text-text-muted">
            Selected:{" "}
            <strong className="text-brand-primary">{selectedIds.length}</strong>
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-surface-hover hover:bg-border-subtle text-xs text-text-muted rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={selectedIds.length === 0 || submitting}
              onClick={handleSubmit}
              className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 text-xs text-white font-medium rounded-xl transition-all"
            >
              {submitting ? "Enrolling..." : "Enroll Selected"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
