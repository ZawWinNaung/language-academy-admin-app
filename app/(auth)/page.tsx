"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);

    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="w-full glass-card rounded-2xl p-8 shadow-2xl relative z-10 border border-slate-800/80">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-black text-xl shadow-lg shadow-indigo-500/20 mb-4">
          C
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Admin Portal
        </h1>
        <p className="text-xs text-slate-400 mt-1.5 font-medium">
          Cambridge Qualifications Academy Management
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              required
              placeholder="admin@cambridge-academy.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            <span className="absolute right-3.5 top-3.5 text-slate-500 text-sm">
              ✉
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            <span className="absolute right-3.5 top-3.5 text-slate-500 text-sm">
              🔒
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isAuthenticating}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/25 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
        >
          {isAuthenticating ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Signing In...
            </>
          ) : (
            "Login →"
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
        <p className="text-[11px] text-slate-500 font-mono">
          Restrictive Access
        </p>
      </div>
    </div>
  );
}
