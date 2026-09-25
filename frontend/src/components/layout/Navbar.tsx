"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Search, 
  Bell, 
  UserCheck, 
  Radio, 
  Zap, 
  Award,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export default function Navbar() {
  const { user, switchRole } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#080d1a]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Telemetry & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>ALL ENGINES LIVE</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>REGION: <strong className="text-slate-200">us-east-1</strong></span>
          <span>•</span>
          <span>AGENT: <strong className="text-sky-400">v2.4.0</strong></span>
        </div>
      </div>

      {/* Right: Quick Role Switcher (Crucial for Competition Demonstration) & Actions */}
      <div className="flex items-center gap-3">
        {/* Quick RBAC Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs font-mono text-slate-200 hover:border-sky-500/50 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>ROLE: <strong>{user?.role || "ADMIN"}</strong></span>
            <span className="text-[10px] text-sky-400">▼</span>
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-700 bg-slate-900 shadow-2xl p-2 z-50 text-xs space-y-1">
              <div className="px-2 py-1 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
                Switch Role (Demonstrates RBAC)
              </div>
              {(["ADMIN", "SECURITY_ANALYST", "CLOUD_OPERATOR", "VIEWER"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r);
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg font-mono flex items-center justify-between transition-colors ${
                    user?.role === r
                      ? "bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <span>{r}</span>
                  {user?.role === r && <span className="text-sky-400 text-xs">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Demo Mode Button */}
        <Link
          href="/dashboard/demo"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs font-bold hover:bg-amber-500/20 transition-colors"
        >
          <Award className="w-3.5 h-3.5" />
          <span>Judges Mode</span>
        </Link>

        {/* Notification Bell */}
        <Link
          href="/dashboard/alerts"
          className="relative p-2 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
        </Link>
      </div>
    </header>
  );
}
