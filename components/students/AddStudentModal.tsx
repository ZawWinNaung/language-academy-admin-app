"use client";

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: {
    name: string;
    email: string;
    phone: string;
    joined_date: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
      phone: string;
      joined_date: string;
    }>
  >;
  submitting: boolean;
}

export default function AddStudentModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  submitting,
}: AddStudentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="glass-card rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-border-main bg-surface relative z-10">
        <div className="px-6 py-4 border-b border-border-main flex justify-between items-center bg-surface-hover">
          <h3 className="font-bold text-text-main text-sm">
            Register New Student
          </h3>
          <button
            onClick={onClose}
            className="text-text-dim hover:text-text-main text-base cursor-pointer"
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
              placeholder="e.g. Aung Kyaw Thu"
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
              placeholder="e.g. student@gmail.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full bg-surface-hover border border-border-main rounded-xl px-3.5 py-2.5 text-xs text-text-main placeholder-text-dim focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">
              Phone Number
            </label>
            <input
              type="text"
              required
              placeholder="e.g. +959450011223"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full bg-surface-hover border border-border-main rounded-xl px-3.5 py-2.5 text-xs text-text-main placeholder-text-dim focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">
              Joined Date
            </label>
            <input
              type="date"
              required
              value={formData.joined_date}
              onChange={(e) =>
                setFormData({ ...formData, joined_date: e.target.value })
              }
              className="w-full bg-surface-hover border border-border-main rounded-xl px-3.5 py-2.5 text-xs text-text-main focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary [color-scheme:light]"
            />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-border-main">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border-main text-text-muted text-xs font-semibold rounded-xl hover:bg-surface-hover transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold rounded-xl shadow-xs disabled:opacity-50 transition-all cursor-pointer"
            >
              {submitting ? "Saving..." : "Save Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
