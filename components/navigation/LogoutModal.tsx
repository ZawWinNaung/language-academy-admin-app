"use client";

interface LogoutModalProps {
  isOpen: boolean;
  isLoggingOut: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({
  isOpen,
  isLoggingOut,
  onClose,
  onConfirm,
}: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm glass-card bg-surface border border-border-main rounded-2xl p-6 shadow-sm text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-status-danger flex items-center justify-center mx-auto text-xl">
          🚪
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-text-main">Sign Out?</h3>
          <p className="text-xs text-text-muted">
            Are you sure you want to end your current admin session?
          </p>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={onClose}
            disabled={isLoggingOut}
            className="flex-1 py-2.5 px-4 rounded-xl border border-border-main bg-surface-hover hover:bg-surface text-text-muted text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoggingOut}
            className="flex-1 py-2.5 px-4 rounded-xl bg-status-danger hover:bg-red-600 text-white text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isLoggingOut ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing Out...
              </>
            ) : (
              "Confirm Logout"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
