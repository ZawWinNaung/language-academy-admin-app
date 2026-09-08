"use client";

import { useEffect, useState } from "react";

interface Course {
  id: number;
  code: string;
  title: string;
  description: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal & Form state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Fetch courses from API
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

  // Handle course creation
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

  // Filtered course list
  const filteredCourses = courses.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Course Catalog
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage academic courses, syllabus details, and course codes.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-indigo-600/20 transition-all border border-indigo-400/30"
        >
          <span className="text-base leading-none">+</span> Add New Course
        </button>
      </div>

      {/* Control Bar: Search & Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 glass-card p-4 rounded-2xl border border-slate-800/80">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by code, title, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          <span className="absolute left-3.5 top-3 text-slate-500 text-xs">
            🔍
          </span>
        </div>
        <div className="text-xs text-slate-400 font-medium">
          Showing{" "}
          <span className="text-indigo-400 font-bold">
            {filteredCourses.length}
          </span>{" "}
          of <span className="text-white font-bold">{courses.length}</span>{" "}
          Courses
        </div>
      </div>

      {/* Courses Data Table */}
      <div className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs font-mono">
            Loading course catalog...
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No courses found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/60 border-b border-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                <tr>
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Course Code</th>
                  <th className="py-4 px-6">Course Title</th>
                  <th className="py-4 px-6">Description</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredCourses.map((course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-4 px-6 font-mono text-[11px] text-cyan-400">
                      #{String(course.id).padStart(3, "0")}
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-indigo-400">
                      <span className="px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20">
                        {course.code}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-white">
                      {course.title}
                    </td>
                    <td className="py-4 px-6 text-slate-400 max-w-xs truncate">
                      {course.description || "No description provided."}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2.5 py-1 rounded-lg hover:bg-indigo-500/10 transition-colors">
                        Edit
                      </button>
                      <button className="text-xs text-rose-400 hover:text-rose-300 font-medium px-2.5 py-1 rounded-lg hover:bg-rose-500/10 transition-colors">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Course Dark Glass Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="glass-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-800 relative z-10">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/40">
              <h3 className="font-bold text-white text-sm">Add New Course</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-base"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Course Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ENG-101"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Academic English"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief summary of the course syllabus and goals..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-700 text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-800/60 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-xs font-semibold rounded-xl hover:from-indigo-500 hover:to-indigo-400 shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all"
                >
                  {submitting ? "Saving..." : "Save Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
