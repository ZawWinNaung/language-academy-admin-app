"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DataGrid from "@/components/ui/DataGrid";
import ClassCard from "@/components/classes/ClassCard";
import CreateClassModal from "@/components/classes/CreateClassModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Pagination from "@/components/ui/Pagination";
import { FilterBar } from "@/components/ui/FilterBar";
import HeaderBar from "@/components/ui/HeaderBar";
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

  const statusTabOptions = [
    { label: "All", value: "", count: pagination.totalItems },
    { label: "Ongoing", value: "Ongoing", count: statusCounts.ongoing },
    { label: "Upcoming", value: "Upcoming", count: statusCounts.upcoming },
    { label: "Completed", value: "Completed", count: statusCounts.completed },
  ];

  const onSubmitModal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.course_id) {
      alert("Please select a course.");
      return;
    }

    const success = await handleCreateClass(formData);
    if (success) {
      setIsModalOpen(false);
      setFormData({
        name: "",
        course_id: "",
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
      <HeaderBar
        title="Class Management"
        description="Track active academic batches, schedules, and calculated class statuses."
      >
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-brand-primary/20 transition-all border border-brand-primary/30"
        >
          <span className="text-base leading-none">+</span> Create New Class
        </button>
      </HeaderBar>

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

      <DataGrid
        data={classes}
        loading={loading}
        keyExtractor={(item: ClassDetail, index: number) =>
          item.id ?? (item as { class_id?: number }).class_id ?? index
        }
        emptyMessage="No classes found matching your query."
        renderCard={(item: ClassDetail) => (
          <ClassCard
            item={item}
            onManage={handleManage}
            onDelete={initiateDelete}
          />
        )}
      />

      {!loading && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={(page) => setCurrentPage(page, pagination.totalPages)}
          totalItems={pagination.totalItems}
          pageSize={pagination.limit}
        />
      )}

      {/* Creation Modal using isolated CourseCombobox */}
      <CreateClassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={onSubmitModal}
        formData={formData}
        setFormData={setFormData}
        submitting={submitting}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(classToDelete)}
        title="Delete Class"
        message={`Are you sure you want to delete "${
          classToDelete?.name || classToDelete?.class_name || "this class"
        }"? This action cannot be undone.`}
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
