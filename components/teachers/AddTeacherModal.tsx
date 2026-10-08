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
      <div className="glass-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-border-main relative z-10">
        <div className="px-6 py-4 border-b border-border-main flex justify-between items-center bg-surface-hover">
          <h3 className="font-bold text-text-main text-sm">Add New Teacher</h3>
          <button
            onClick={onClose}
            className="text-text-dim hover:text-text-main text-base"
          >
            ✕
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">
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
              className="w-full bg-surface-hover border border-border-main rounded-xl px-3.5 py-2.5 text-xs text-text-main placeholder-text-dim focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">
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
              className="w-full bg-surface-hover border border-border-main rounded-xl px-3.5 py-2.5 text-xs text-text-main placeholder-text-dim focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">
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
              className="w-full bg-surface-hover border border-border-main rounded-xl px-3.5 py-2.5 text-xs text-text-main placeholder-text-dim focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">
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
              className="w-full bg-surface-hover border border-border-main rounded-xl px-3.5 py-2.5 text-xs text-text-main placeholder-text-dim focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-border-main">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border-main text-text-muted text-xs font-semibold rounded-xl hover:bg-surface-hover transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-brand-primary text-white text-xs font-semibold rounded-xl hover:bg-brand-primary-hover shadow-lg shadow-brand-primary/20 disabled:opacity-50 transition-all"
            >
              {submitting ? "Adding..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
