"use client";

import { useEffect, useState } from "react";

interface ClassDetail {
  id: number;
  class_name: string;
  course_code: string;
  course_title: string;
  start_date: string;
  end_date: string;
  status: string;
  active_students: number;
}

interface Course {
  id: number;
  code: string;
  title: string;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassDetail[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal & Form state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    course_id: "",
    start_date: "",
    end_date: "",
    status: "Ongoing",
  });
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Fetch classes and courses from API
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
        // Pre-select the first course in dropdown if available
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

  // Handle class creation
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

  // Filtered class list
  const filteredClasses = classes.filter(
    (c) =>
      c.class_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.course_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.course_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.status.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Helper for dynamic status badges
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "ongoing":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Ongoing
          </span>
        );
      case "completed":
      case "finished":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-semibold">
            Completed
          </span>
        );
      case "upcoming":
      case "scheduled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-semibold">
            Upcoming
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-semibold">
            {status}
          </span>
        );
    }
  };

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

      {/* Control Bar: Search & Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 glass-card p-4 rounded-2xl border border-slate-800/80">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search class name, course, or status..."
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
            {filteredClasses.length}
          </span>{" "}
          of <span className="text-white font-bold">{classes.length}</span>{" "}
          Class Batches
        </div>
      </div>

      {/* Classes Data Table */}
      <div className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs font-mono">
            Loading class schedules...
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No classes found matching your query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/60 border-b border-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                <tr>
                  <th className="py-4 px-6">Class Name</th>
                  <th className="py-4 px-6">Course</th>
                  <th className="py-4 px-6">Schedule Duration</th>
                  <th className="py-4 px-6">Active Students</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredClasses.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-4 px-6 font-bold text-white">
                      {item.class_name}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-slate-200">
                          {item.course_title}
                        </span>
                        <span className="font-mono text-[10px] text-indigo-400">
                          {item.course_code}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-400 font-mono text-[11px]">
                      {item.start_date} → {item.end_date}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono text-[11px]">
                        👥 {item.active_students} Enrolled
                      </span>
                    </td>
                    <td className="py-4 px-6">{getStatusBadge(item.status)}</td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2.5 py-1 rounded-lg hover:bg-indigo-500/10 transition-colors">
                        Manage
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

      {/* Create Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="glass-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-800 relative z-10">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/40">
              <h3 className="font-bold text-white text-sm">
                Create New Class Batch
              </h3>
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
                  Class Name / Batch Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Batch 2026 - A"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Dynamic Course Select Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Select Course
                </label>
                <select
                  required
                  value={formData.course_id}
                  onChange={(e) =>
                    setFormData({ ...formData, course_id: e.target.value })
                  }
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  {courses.length === 0 ? (
                    <option value="" disabled>
                      No courses available. Please create a course first.
                    </option>
                  ) : (
                    courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        [{course.code}] {course.title}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 [color-scheme:dark]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Initial Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Ongoing">Ongoing</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                </select>
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
                  disabled={submitting || courses.length === 0}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-xs font-semibold rounded-xl hover:from-indigo-500 hover:to-indigo-400 shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all"
                >
                  {submitting ? "Saving..." : "Create Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
