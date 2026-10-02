"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DataGrid from "@/components/ui/DataGrid";
import ClassCard from "@/components/classes/ClassCard";
import CreateClassModal from "@/components/classes/CreateClassModal";
import { FilterBar } from "@/components/ui/FilterBar";
import { useClasses } from "@/hooks/useClasses";
import { ClassFormData } from "@/types/class";
import { ClassDetail } from "@/types/class";

export default function ClassesPage() {
  const router = useRouter();
  const {
    classes,
    filteredClasses,
    courses,
    loading,
    searchQuery,
    setSearchQuery,
    submitting,
    handleCreateClass,
    handleDeleteClass,
  } = useClasses();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<ClassFormData>({
    name: "",
    course_id: "",
    start_date: "",
    end_date: "",
  });

  // Keep modal course option default synced with courses list
  useEffect(() => {
    if (courses.length > 0 && !formData.course_id) {
      setFormData((prev) => ({
        ...prev,
        course_id: String(courses[0].id),
      }));
    }
  }, [courses, formData.course_id]);

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
          placeholder="Search class name, course, or status..."
        />

        <FilterBar.Group>
          <FilterBar.Counter
            filteredCount={filteredClasses.length}
            totalCount={classes.length}
            entityName="Classes"
          />
        </FilterBar.Group>
      </FilterBar>

      {/* Data Grid */}
      <DataGrid
        data={filteredClasses}
        loading={loading}
        keyExtractor={(item: ClassDetail, index: number) =>
          item.id ?? (item as { class_id?: number }).class_id ?? index
        }
        emptyMessage="No classes found matching your query."
        renderCard={(item: ClassDetail) => (
          <ClassCard
            item={item}
            onManage={handleManage}
            onDelete={handleDeleteClass}
          />
        )}
      />

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
    </div>
  );
}
