"use client";

import { useEffect, useState } from "react";
import ControlBar from "@/components/ui/ControlBar";
import DataGrid from "@/components/ui/DataGrid";
import TeacherCard, { Teacher } from "@/components/teachers/TeacherCard";
import AddTeacherModal from "@/components/teachers/AddTeacherModal";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    qualification: "CELTA / Delta",
  });

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/teachers");
      const json = await res.json();
      if (json.success) setTeachers(json.data);
    } catch (err) {
      console.error("Failed to load teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        setIsModalOpen(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          qualification: "CELTA / Delta",
        });
        loadTeachers();
      } else {
        alert(json.message || "Failed to add teacher");
      }
    } catch (err) {
      console.error("Error adding teacher:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.qualification.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Teachers Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage certified Cambridge instructors, qualifications, and active
            status.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-indigo-600/20 transition-all border border-indigo-400/30"
        >
          <span className="text-base leading-none">+</span> Add New Instructor
        </button>
      </div>

      <ControlBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search by instructor name, email, or credential..."
        filteredCount={filteredTeachers.length}
        totalCount={teachers.length}
        entityName="Teachers"
      />

      <DataGrid
        data={filteredTeachers}
        loading={loading}
        keyExtractor={(teacher) => teacher.id}
        emptyMessage="No instructors found matching your criteria."
        renderCard={(teacher) => (
          <TeacherCard
            teacher={teacher}
            onEdit={(t) => console.log("Edit teacher:", t)}
            onRemove={(t) => console.log("Remove teacher:", t)}
          />
        )}
      />

      <AddTeacherModal
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
