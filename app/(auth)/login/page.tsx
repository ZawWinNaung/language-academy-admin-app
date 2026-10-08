"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/dashboard");
      } else {
        setErrorMessage(data.message || "Invalid credentials provided.");
      }
    } catch (err) {
      setErrorMessage("Network error occurred. Please try again.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="w-full glass-card rounded-2xl p-8 shadow-xs relative z-10 border border-border-main max-w-md mx-auto bg-surface">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-primary text-white font-black text-xl shadow-xs mb-4">
          C
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-text-main">
          Admin Portal
        </h1>
        <p className="text-xs text-text-muted mt-1.5 font-medium">
          Cambridge Qualifications Academy Management
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-status-danger text-xs text-center font-medium">
          ⚠️ {errorMessage}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              required
              placeholder="admin@cambridge-academy.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-hover border border-border-main rounded-xl px-4 py-3 text-sm text-text-main placeholder-text-dim focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
            />
            <span className="absolute right-3.5 top-3.5 text-text-dim text-sm">
              ✉
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-hover border border-border-main rounded-xl px-4 py-3 text-sm text-text-main placeholder-text-dim focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
            />
            <span className="absolute right-3.5 top-3.5 text-text-dim text-sm">
              🔒
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isAuthenticating}
          className="w-full py-3.5 px-4 bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-semibold rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2 cursor-pointer"
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

      <div className="mt-8 pt-6 border-t border-border-main text-center">
        <p className="text-[11px] text-text-dim font-mono">
          Restricted Access • School Staff Only
        </p>
      </div>
    </div>
  );
}
