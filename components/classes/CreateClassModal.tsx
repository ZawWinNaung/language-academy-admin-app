"use client";

export interface Course {
  id: number;
  code: string;
  title: string;
}

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  courses: Course[];
  formData: {
    name: string;
    course_id: string;
    start_date: string;
    end_date: string;
    status: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      course_id: string;
      start_date: string;
      end_date: string;
      status: string;
    }>
  >;
  submitting: boolean;
}

export default function CreateClassModal({
  isOpen,
  onClose,
  onSubmit,
  courses,
  formData,
  setFormData,
  submitting,
}: CreateClassModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="glass-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-800 relative z-10">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/40">
          <h3 className="font-bold text-white text-sm">
            Create New Class Batch
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-base"
          >
            ✕
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
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
              onClick={onClose}
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
  );
}
