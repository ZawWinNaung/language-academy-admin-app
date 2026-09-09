"use client";

import { useEffect, useState } from "react";
import ControlBar from "@/components/ui/ControlBar";
import DataGrid from "@/components/ui/DataGrid";
import ClassCard, { ClassDetail } from "@/components/classes/ClassCard";
import CreateClassModal, {
  Course,
} from "@/components/classes/CreateClassModal";

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassDetail[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    course_id: "",
    start_date: "",
    end_date: "",
    status: "Ongoing",
  });
  const [submitting, setSubmitting] = useState<boolean>(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [classRes, courseRes] = await Promise.all([
        fetch("/api/classes"),
        fetch("/api/courses"),
      ]);

      const classJson = await classRes.json();
      const courseJson = await courseRes.json();

      if (classJson.success) setClasses(classJson.data);
      if (courseJson.success) {
        setCourses(courseJson.data);
        if (courseJson.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            course_id: String(courseJson.data[0].id),
          }));
        }
      }
    } catch (err) {
      console.error("Failed to load initial data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.course_id) {
      alert("Please select a course.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        setIsModalOpen(false);
        setFormData({
          name: "",
          course_id: courses.length > 0 ? String(courses[0].id) : "",
          start_date: "",
          end_date: "",
          status: "Ongoing",
        });
        loadData();
      } else {
        alert(json.message || "Failed to create class");
      }
    } catch (err) {
      console.error("Error adding class:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredClasses = classes.filter(
    (c) =>
      c.class_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.course_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.course_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.status.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Class Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track active academic batches, schedules, and student enrollment
            totals.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-indigo-600/20 transition-all border border-indigo-400/30"
        >
          <span className="text-base leading-none">+</span> Create New Class
        </button>
      </div>

      {/* Shared Control Bar */}
      <ControlBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search class name, course, or status..."
        filteredCount={filteredClasses.length}
        totalCount={classes.length}
        entityName="Class Batches"
      />

      {/* Shared Data Grid */}
      <DataGrid
        data={filteredClasses}
        loading={loading}
        keyExtractor={(item) => item.id}
        emptyMessage="No classes found matching your query."
        renderCard={(item) => (
          <ClassCard
            item={item}
            onManage={(c) => console.log("Manage class:", c)}
            onDelete={(c) => console.log("Delete class:", c)}
          />
        )}
      />

      {/* Extracted Creation Modal */}
      <CreateClassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        courses={courses}
        formData={formData}
        setFormData={setFormData}
        submitting={submitting}
      />
    </div>
  );
}
