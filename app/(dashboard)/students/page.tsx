"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DataGrid from "@/components/ui/DataGrid";
import StudentCard from "@/components/students/StudentCard";
import AddStudentModal from "@/components/students/AddStudentModal";
import { FilterBar } from "@/components/ui/FilterBar";
import { useStudents } from "@/hooks/useStudents";

export default function StudentsPage() {
  const router = useRouter();

  const {
    students,
    filteredStudents,
    searchQuery,
    setSearchQuery,
    loading,
    formData,
    setFormData,
    submitting,
    handleCreateStudent,
  } = useStudents();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleCreateStudent();
    if (success) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Student Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage student registrations and academic profiles for Cambridge
            qualifications.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-indigo-600/20 transition-all border border-indigo-400/30"
        >
          <span className="text-base leading-none">+</span> Add New Student
        </button>
      </div>

      <FilterBar>
        <FilterBar.Search
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name, email, or phone..."
        />

        <FilterBar.Group>
          <FilterBar.Counter
            filteredCount={filteredStudents.length}
            totalCount={students.length}
            entityName="Students"
          />
        </FilterBar.Group>
      </FilterBar>

      <DataGrid
        data={filteredStudents}
        loading={loading}
        keyExtractor={(student) => student.id}
        emptyMessage="No active students found matching your search."
        gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        renderCard={(student) => (
          <StudentCard
            student={student}
            onView={(st) => router.push(`/students/${st.id}`)}
            onRemove={(st) => console.log("Remove student:", st)}
          />
        )}
      />

      <AddStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        submitting={submitting}
      />
    </div>
  );
}
