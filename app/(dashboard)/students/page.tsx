"use client";

import { useEffect, useState } from "react";
import ControlBar from "@/components/ui/ControlBar";
import DataGrid from "@/components/ui/DataGrid";
import StudentCard, { Student } from "@/components/students/StudentCard";
import AddStudentModal from "@/components/students/AddStudentModal";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    joined_date: "",
  });

  const loadStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/students");
      const json = await res.json();
      if (json.success) setStudents(json.data);
    } catch (err) {
      console.error("Failed to load students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        setIsModalOpen(false);
        setFormData({ name: "", email: "", phone: "", joined_date: "" });
        loadStudents();
      } else {
        alert(json.message || "Failed to create student");
      }
    } catch (err) {
      console.error("Error adding student:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery),
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
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
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-indigo-600/20 transition-all border border-indigo-400/30"
        >
          <span className="text-base leading-none">+</span> Add New Student
        </button>
      </div>

      {/* Control Bar */}
      <ControlBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search by name, email, or phone..."
        filteredCount={filteredStudents.length}
        totalCount={students.length}
        entityName="Active Students"
      />

      {/* Card Grid View */}
      <DataGrid
        data={filteredStudents}
        loading={loading}
        keyExtractor={(student) => student.id}
        emptyMessage="No active students found matching your search."
        renderCard={(student) => (
          <StudentCard
            student={student}
            onView={(st) => console.log("View student:", st)}
            onRemove={(st) => console.log("Remove student:", st)}
          />
        )}
      />

      {/* Extracted Registration Modal */}
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
