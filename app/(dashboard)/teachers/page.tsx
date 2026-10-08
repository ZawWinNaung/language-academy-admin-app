"use client";

import { useEffect, useState } from "react";
import DataGrid from "@/components/ui/DataGrid";
import TeacherCard, { Teacher } from "@/components/teachers/TeacherCard";
import AddTeacherModal from "@/components/teachers/AddTeacherModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Pagination from "@/components/ui/Pagination";
import { FilterBar } from "@/components/ui/FilterBar";
import { useRouter } from "next/navigation";

export default function TeachersPage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  //pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  //modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    qualification: "",
  });

  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  const loadTeachers = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/teachers?page=${page}&limit=20&search=${encodeURIComponent(search)}`,
      );
      const json = await res.json();
      if (json.success) {
        setTeachers(json.data);
        if (json.pagination) {
          setCurrentPage(json.pagination.currentPage);
          setTotalPages(json.pagination.totalPages);
          setTotalItems(json.pagination.totalItems);
        }
      }
    } catch (err) {
      console.error("Failed to load teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        setFormData({ name: "", email: "", phone: "", qualification: "" });
        setIsModalOpen(false);
        loadTeachers(currentPage, searchQuery);
      } else {
        alert(result.message || "Failed to add teacher");
      }
    } catch (err) {
      console.error("Error creating teacher:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!teacherToDelete) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/teachers/${teacherToDelete.id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (result.success) {
        setTeacherToDelete(null);
        loadTeachers(currentPage, searchQuery);
      } else {
        alert(result.message || "Failed to remove teacher");
      }
    } catch (err) {
      console.error("Error removing teacher:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border-main">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">
            Teachers Directory
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Manage certified Cambridge Teachers, qualifications, and active
            status.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-brand-primary/20 transition-all border border-brand-primary/30"
        >
          <span className="text-base leading-none">+</span> Add New Teacher
        </button>
      </div>

      <FilterBar>
        <FilterBar.Search
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search teachers by name or email..."
        />

        <FilterBar.Group>
          <FilterBar.Counter
            filteredCount={teachers.length}
            totalCount={totalItems}
            entityName="Faculty"
          />
        </FilterBar.Group>
      </FilterBar>

      <DataGrid
        data={teachers}
        loading={loading}
        keyExtractor={(teacher) => teacher.id}
        emptyMessage="No teachers found matching your criteria."
        renderCard={(teacher) => (
          <TeacherCard
            teacher={teacher}
            onEdit={(t) => router.push(`/teachers/${t.id}`)}
            onRemove={(t) => setTeacherToDelete(t)}
          />
        )}
      />

      {/* Shared Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={20}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <AddTeacherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        submitting={submitting}
      />

      <ConfirmModal
        isOpen={teacherToDelete !== null}
        title="Remove Teacher Profile"
        message={`Are you sure you want to remove ${teacherToDelete?.name}? This action will deactivate their profile and unassign all current class schedules.`}
        confirmLabel="Remove Teacher"
        cancelLabel="Cancel"
        variant="danger"
        isLoading={deleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setTeacherToDelete(null)}
      />
    </div>
  );
}
