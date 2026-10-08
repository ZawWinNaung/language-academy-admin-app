"use client";

import AddCourseModal from "@/components/courses/AddCourseModal";
import CourseCard from "@/components/courses/CourseCard";
import ConfirmModal from "@/components/ui/ConfirmModal";
import DataGrid from "@/components/ui/DataGrid";
import { FilterBar } from "@/components/ui/FilterBar";
import HeaderBar from "@/components/ui/HeaderBar";
import Pagination from "@/components/ui/Pagination";
import { useCourses } from "@/hooks/useCourses";
import { Course, CourseFormData } from "@/types/course";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CoursesPage() {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("active");

  const {
    courses,
    pagination,
    loading,
    submitting,
    handleCreateCourse,
    handleArchiveCourse,
    handleUnarchiveCourse,
  } = useCourses({
    page: currentPage,
    limit: 20,
    search: searchQuery,
    status: activeTab,
  });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<CourseFormData>({
    code: "",
    title: "",
    description: "",
  });

  // Archive & Unarchive States
  const [selectedCourseToArchive, setSelectedCourseToArchive] =
    useState<Course | null>(null);
  const [isArchiving, setIsArchiving] = useState<boolean>(false);

  const [selectedCourseToUnarchive, setSelectedCourseToUnarchive] =
    useState<Course | null>(null);
  const [isUnarchiving, setIsUnarchiving] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleCreateCourse(formData);
    if (success) {
      setIsModalOpen(false);
      setFormData({ code: "", title: "", description: "" });
    }
  };

  const handleConfirmArchive = async () => {
    if (!selectedCourseToArchive) return;

    setIsArchiving(true);
    const success = await handleArchiveCourse(selectedCourseToArchive.id);
    setIsArchiving(false);

    if (success) {
      setSelectedCourseToArchive(null);
    }
  };

  const handleConfirmUnarchive = async () => {
    if (!selectedCourseToUnarchive) return;

    setIsUnarchiving(true);
    const success = await handleUnarchiveCourse(selectedCourseToUnarchive.id);
    setIsUnarchiving(false);

    if (success) {
      setSelectedCourseToUnarchive(null);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <HeaderBar
        title="Course Catalog"
        description="Manage academic courses, syllabus details, and course codes."
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-brand-primary/20 transition-all border border-brand-primary/30 cursor-pointer"
        >
          <span className="text-base leading-none">+</span> Add New Course
        </button>
      </HeaderBar>

      <FilterBar>
        <FilterBar.Search
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by code, title, or description..."
        />

        <FilterBar.Group>
          <FilterBar.Tabs
            value={activeTab === "archived" ? "1" : "0"}
            onChange={(val) =>
              handleTabChange(val === "1" ? "archived" : "active")
            }
            options={[
              { label: "Active Courses", value: "0" },
              { label: "Archived Courses", value: "1" },
            ]}
          />
          <FilterBar.Counter
            filteredCount={courses.length}
            totalCount={pagination.totalItems}
            entityName="Courses"
          />
        </FilterBar.Group>
      </FilterBar>

      <DataGrid
        data={courses}
        loading={loading}
        keyExtractor={(course) => course.id}
        emptyMessage={
          activeTab === "archived"
            ? "No archived courses found."
            : "No active courses found matching your search."
        }
        renderCard={(course) => (
          <CourseCard
            course={course}
            onView={(c) => router.push(`/courses/${c.id}`)}
            onArchive={(c) => setSelectedCourseToArchive(c)}
            onUnarchive={(c) => setSelectedCourseToUnarchive(c)}
          />
        )}
      />

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        pageSize={pagination.pageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <AddCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        submitting={submitting}
      />

      {/* Archive Modal */}
      <ConfirmModal
        isOpen={Boolean(selectedCourseToArchive)}
        title="Archive Course"
        message={
          selectedCourseToArchive
            ? `Are you sure you want to archive "${selectedCourseToArchive.title}"? This course will no longer be available for assigning to new classes.`
            : ""
        }
        confirmLabel="Archive Course"
        cancelLabel="Cancel"
        variant="warning"
        isLoading={isArchiving}
        onConfirm={handleConfirmArchive}
        onClose={() => setSelectedCourseToArchive(null)}
      />

      {/* Unarchive Modal */}
      <ConfirmModal
        isOpen={Boolean(selectedCourseToUnarchive)}
        title="Unarchive Course"
        message={
          selectedCourseToUnarchive
            ? `Are you sure you want to restore "${selectedCourseToUnarchive.title}"? It will become active and available for creating new classes.`
            : ""
        }
        confirmLabel="Unarchive Course"
        cancelLabel="Cancel"
        variant="info"
        isLoading={isUnarchiving}
        onConfirm={handleConfirmUnarchive}
        onClose={() => setSelectedCourseToUnarchive(null)}
      />
    </div>
  );
}
