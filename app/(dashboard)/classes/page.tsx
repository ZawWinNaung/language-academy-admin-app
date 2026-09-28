"use client";

import React, { useEffect, useState } from "react";
import DataGrid from "@/components/ui/DataGrid";
import ClassCard, { ClassDetail } from "@/components/classes/ClassCard";
import CreateClassModal, {
  Course,
} from "@/components/classes/CreateClassModal";
import { FilterBar } from "@/components/ui/FilterBar";

export interface ClassFormData {
  name: string;
  course_id: string;
  start_date: string;
  end_date: string;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassDetail[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [formData, setFormData] = useState<ClassFormData>({
    name: "",
    course_id: "",
    start_date: "",
    end_date: "",
  });

  const loadData = async (): Promise<void> => {
    try {
      setLoading(true);
      const [classRes, courseRes] = await Promise.all([
        fetch("/api/classes"),
        fetch("/api/courses"),
      ]);

      const classJson = await classRes.json();
      const courseJson = await courseRes.json();

      if (classJson.success) {
        setClasses(classJson.data);
      }

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

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
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

  const handleSoftDelete = async (classItem: ClassDetail): Promise<void> => {
    if (
      !confirm(`Are you sure you want to delete "${classItem.class_name}"?`)
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/classes/${classItem.id}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (json.success) {
        loadData();
      } else {
        alert(json.message || "Failed to delete class.");
      }
    } catch (err) {
      console.error("Error deleting class:", err);
    }
  };

  const filteredClasses = classes.filter((c: ClassDetail) => {
    const query = searchQuery.toLowerCase();
    const className = (c.class_name || "").toLowerCase();
    const courseCode = (c.course_code || "").toLowerCase();
    const courseTitle = (c.course_title || "").toLowerCase();
    const computedStatus = (c.status || "").toLowerCase();

    return (
      className.includes(query) ||
      courseCode.includes(query) ||
      courseTitle.includes(query) ||
      computedStatus.includes(query)
    );
  });

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
            onManage={(c: ClassDetail) => console.log("Manage class:", c)}
            onDelete={handleSoftDelete}
          />
        )}
      />

      {/* Creation Modal */}
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
