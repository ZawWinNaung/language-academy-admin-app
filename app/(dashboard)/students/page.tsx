"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DataGrid from "@/components/ui/DataGrid";
import StudentCard from "@/components/students/StudentCard";
import AddStudentModal from "@/components/students/AddStudentModal";
import { FilterBar } from "@/components/ui/FilterBar";
import HeaderBar from "@/components/ui/HeaderBar";
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
      <HeaderBar
        title="Student Directory"
        description="Manage student registrations and academic profiles for Cambridge qualifications."
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-xs transition-all cursor-pointer"
        >
          <span className="text-base leading-none">+</span> Add New Student
        </button>
      </HeaderBar>

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
