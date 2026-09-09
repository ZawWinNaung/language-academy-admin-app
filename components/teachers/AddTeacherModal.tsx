"use client";

interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: {
    name: string;
    email: string;
    phone: string;
    qualification: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
      phone: string;
      qualification: string;
    }>
  >;
  submitting: boolean;
}

export default function AddTeacherModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  submitting,
}: AddTeacherModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="glass-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-800 relative z-10">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/40">
          <h3 className="font-bold text-white text-sm">
            Add New Faculty Member
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
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Arthur Pendelton"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. arthur.p@cambridge-academy.edu"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Phone
            </label>
            <input
              type="text"
              required
              placeholder="e.g. +959790001122"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Qualification / Degree
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Cambridge DELTA / MA Linguistics"
              value={formData.qualification}
              onChange={(e) =>
                setFormData({ ...formData, qualification: e.target.value })
              }
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
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
              disabled={submitting}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-xs font-semibold rounded-xl hover:from-indigo-500 hover:to-indigo-400 shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all"
            >
              {submitting ? "Adding..." : "Save Instructor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
