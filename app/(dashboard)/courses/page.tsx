"use client";

import AddCourseModal from "@/components/courses/AddCourseModal";
import CourseCard, { Course } from "@/components/courses/CourseCard";
import DataGrid from "@/components/ui/DataGrid";
import { FilterBar } from "@/components/ui/FilterBar";
import HeaderBar from "@/components/ui/HeaderBar";
import { useEffect, useState } from "react";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
  });

  const loadCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/courses");
      const json = await res.json();
      if (json.success) setCourses(json.data);
    } catch (err) {
      console.error("Failed to load courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        setIsModalOpen(false);
        setFormData({ code: "", title: "", description: "" });
        loadCourses();
      } else {
        alert(json.message || "Failed to create course");
      }
    } catch (err) {
      console.error("Error adding course:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCourses = courses.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <HeaderBar
        title="Course Catalog"
        description="Manage academic courses, syllabus details, and course codes."
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-brand-primary/20 transition-all border border-brand-primary/30"
        >
          <span className="text-base leading-none">+</span> Add New Course
        </button>
      </HeaderBar>

      <FilterBar>
        <FilterBar.Search
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by code, title, or description..."
        />

        <FilterBar.Group>
          <FilterBar.Counter
            filteredCount={filteredCourses.length}
            totalCount={courses.length}
            entityName="Courses"
          />
        </FilterBar.Group>
      </FilterBar>

      <DataGrid
        data={filteredCourses}
        loading={loading}
        keyExtractor={(course) => course.id}
        emptyMessage="No courses found matching your search."
        renderCard={(course) => (
          <CourseCard
            course={course}
            onEdit={(c) => console.log("Edit course:", c)}
            onDelete={(c) => console.log("Delete course:", c)}
          />
        )}
      />

      <AddCourseModal
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
