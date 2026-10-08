"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-app-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-brand-primary-light rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full text-center space-y-8 glass-card p-10 rounded-3xl border border-border-main shadow-xs relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-primary text-white font-black text-3xl shadow-xs border border-brand-primary-hover/20">
          C
        </div>

        <div className="space-y-3">
          <span className="px-3 py-1 rounded-full bg-brand-primary-light border border-brand-primary/20 text-brand-primary text-xs font-semibold tracking-wide uppercase">
            Internal Portal
          </span>
          <h1 className="text-3xl font-extrabold text-text-main tracking-tight sm:text-4xl">
            Cambridge Qualifications
          </h1>
          <p className="text-sm text-text-muted leading-relaxed max-w-md mx-auto font-medium">
            Centralized administration system for academic course schedules,
            faculty directory, and student management.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold px-6 py-3.5 rounded-xl text-xs shadow-xs transition-all border border-brand-primary-hover/30"
          >
            Access Admin Portal →
          </Link>
        </div>

        <div className="pt-6 border-t border-border-main flex items-center justify-center text-[11px] text-text-dim font-mono">
          <p>v1.0.0 • Restricted Access</p>
        </div>
      </div>
    </main>
  );
}
