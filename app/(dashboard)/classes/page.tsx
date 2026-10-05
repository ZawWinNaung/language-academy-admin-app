"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DataGrid from "@/components/ui/DataGrid";
import ClassCard from "@/components/classes/ClassCard";
import CreateClassModal from "@/components/classes/CreateClassModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Pagination from "@/components/ui/Pagination";
import { FilterBar } from "@/components/ui/FilterBar";
import { usePagination } from "@/hooks/usePagination";
import {
  useClassFilters,
  useClassesData,
  useCreateClass,
  useDeleteClass,
} from "@/hooks/classes";
import { ClassFormData, ClassDetail } from "@/types/class";

export default function ClassesPage() {
  const router = useRouter();
  const pageSize = 20;
  const { currentPage, setCurrentPage, resetPage } = usePagination(1);
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    resetFilters,
    isFiltered,
  } = useClassFilters({
    onFilterChange: resetPage,
  });

  const {
    classes,
    courses,
    pagination,
    totalCount,
    statusCounts,
    loading,
    mutateClasses,
  } = useClassesData({
    currentPage,
    pageSize,
    searchQuery,
    statusFilter,
  });

  const { submitting, handleCreateClass } = useCreateClass(mutateClasses);
  const {
    classToDelete,
    deleting,
    initiateDelete,
    cancelDelete,
    confirmDeleteClass,
  } = useDeleteClass(mutateClasses);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<ClassFormData>({
    name: "",
    course_id: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    if (courses.length > 0 && !formData.course_id) {
      setFormData((prev) => ({
        ...prev,
        course_id: String(courses[0].id),
      }));
    }
  }, [courses, formData.course_id]);

  const statusTabOptions = [
    { label: "All", value: "", count: pagination.totalItems },
    { label: "Ongoing", value: "Ongoing", count: statusCounts.ongoing },
    { label: "Upcoming", value: "Upcoming", count: statusCounts.upcoming },
    { label: "Completed", value: "Completed", count: statusCounts.completed },
  ];

  const onSubmitModal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await handleCreateClass(formData);
    if (success) {
      setIsModalOpen(false);
      setFormData({
        name: "",
        course_id: courses.length > 0 ? String(courses[0].id) : "",
        start_date: "",
        end_date: "",
      });
    }
  };

  const handleManage = (classItem: ClassDetail) => {
    router.push(`/classes/${classItem.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Class Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track active academic batches, schedules, and calculated class
            statuses.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-indigo-600/20 transition-all border border-indigo-400/30"
        >
          <span className="text-base leading-none">+</span> Create New Class
        </button>
      </div>

      <FilterBar>
        <FilterBar.Search
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search class name or course..."
        />

        <FilterBar.Group>
          <FilterBar.Tabs
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusTabOptions}
          />

          {isFiltered && <FilterBar.Reset onReset={resetFilters} />}

          <FilterBar.Counter
            filteredCount={pagination.totalItems}
            totalCount={totalCount}
            entityName="Classes"
          />
        </FilterBar.Group>
      </FilterBar>

      {/* Data Grid */}
      <DataGrid
        data={classes}
        loading={loading}
        keyExtractor={(item: ClassDetail, index: number) =>
          item.id ?? (item as { class_id?: number }).class_id ?? index
        }
        emptyMessage="No classes found matching your query."
        gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        renderCard={(item: ClassDetail) => (
          <ClassCard
            item={item}
            onManage={handleManage}
            onDelete={initiateDelete}
          />
        )}
      />

      {/* Pagination Component */}
      {!loading && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={(page) => setCurrentPage(page, pagination.totalPages)}
          totalItems={pagination.totalItems}
          pageSize={pagination.limit}
        />
      )}

      {/* Creation Modal */}
      <CreateClassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={onSubmitModal}
        courses={courses}
        formData={formData}
        setFormData={setFormData}
        submitting={submitting}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(classToDelete)}
        title="Delete Class"
        message={`Are you sure you want to delete "${classToDelete?.name || classToDelete?.class_name || "this class"}"? This action cannot be undone.`}
        confirmLabel="Delete Class"
        cancelLabel="Cancel"
        variant="danger"
        isLoading={deleting}
        onConfirm={confirmDeleteClass}
        onClose={cancelDelete}
      />
    </div>
  );
}
