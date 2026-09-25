"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShieldAlert, 
  Lock, 
  Mail, 
  ArrowRight, 
  UserCheck, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const QUICK_ROLES = [
  { role: "ADMIN", label: "Security Admin", email: "admin@cloudsentinel.io", color: "border-sky-500/40 text-sky-300" },
  { role: "SECURITY_ANALYST", label: "Lead Analyst", email: "analyst@cloudsentinel.io", color: "border-indigo-500/40 text-indigo-300" },
  { role: "CLOUD_OPERATOR", label: "Cloud Operator", email: "operator@cloudsentinel.io", color: "border-cyan-500/40 text-cyan-300" },
  { role: "VIEWER", label: "Executive Viewer", email: "viewer@cloudsentinel.io", color: "border-emerald-500/40 text-emerald-300" }
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@cloudsentinel.io");
  const [password, setPassword] = useState("Password123!");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid authentication credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFill = (targetEmail: string) => {
    setEmail(targetEmail);
    setPassword("Password123!");
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex items-center justify-center p-6 cyber-grid relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">
              Cloud<span className="text-sky-400">Sentinel</span>
            </span>
          </Link>
          <p className="text-xs text-slate-400 font-mono">Autonomous Cloud Security Operations Command</p>
        </div>

        {/* 1-Click Quick Demo Switcher */}
        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur space-y-2">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
            Competition 1-Click Demo Profiles (Auto-Fills):
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {QUICK_ROLES.map((r) => (
              <button
                key={r.role}
                type="button"
                onClick={() => handleQuickFill(r.email)}
                className={`p-2 rounded-lg border bg-slate-950/60 hover:bg-slate-900 text-left transition-colors ${r.color}`}
              >
                <div className="font-bold">{r.label}</div>
                <div className="text-[9px] text-slate-500 truncate">{r.email}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Login Card */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#080d1a] shadow-2xl space-y-5">
          {error && (
            <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 text-xs font-mono">
              <label className="text-slate-400">Security Principal / Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <label className="text-slate-400">Access Key / Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              <span>{submitting ? "Authenticating Principal..." : "Access Security Console"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="text-center text-xs font-mono text-slate-500">
          Demo Default Password: <code className="text-sky-300">Password123!</code>
        </div>
      </div>
    </div>
  );
}
