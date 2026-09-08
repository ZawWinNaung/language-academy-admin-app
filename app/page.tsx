"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full text-center space-y-8 glass-card p-10 rounded-3xl border border-slate-800/80 shadow-2xl relative z-10 backdrop-blur-xl">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-black text-3xl shadow-xl shadow-indigo-500/25 border border-white/20">
          C
        </div>

        <div className="space-y-3">
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide uppercase">
            Internal Portal
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Cambridge Qualifications
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-md mx-auto font-medium">
            Centralized administration system for academic course schedules,
            faculty directory, and student management.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold px-6 py-3.5 rounded-xl text-xs shadow-lg shadow-indigo-600/25 transition-all border border-indigo-400/30"
          >
            Access Admin Portal →
          </Link>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex items-center justify-center text-[11px] text-slate-500 font-mono">
          <p>v1.0.0 • Restricted Access</p>
        </div>
      </div>
    </main>
  );
}
