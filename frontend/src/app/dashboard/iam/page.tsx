"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Users, 
  Search, 
  ShieldAlert, 
  ArrowUpRight, 
  Lock, 
  RotateCcw, 
  AlertTriangle,
  UserX,
  UserCheck,
  Globe
} from "lucide-react";
import { api } from "@/lib/api";
import { getStatusBadge, formatDate } from "@/lib/utils";

export default function IAMPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [filterRole, setFilterRole] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSuspend = async (userId: string, email: string) => {
    try {
      await api.suspendUser(userId);
      await loadUsers();
      alert(`User ${email} has been suspended.`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetRisk = async (userId: string) => {
    try {
      await api.resetUserRisk(userId);
      await loadUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = users.filter((u) => {
    const matchRole = filterRole === "ALL" || u.role === filterRole;
    const matchSearch = !search || 
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-sky-400" />
              Identity & Access Management (IAM)
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
              BEHAVIORAL RISK PROFILER
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Zero-trust identity intelligence detecting impossible travel, credential compromise, and privilege escalation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">ROLE:</span>
          {["ALL", "ADMIN", "SECURITY_ANALYST", "CLOUD_OPERATOR", "VIEWER"].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                filterRole === r
                  ? "bg-sky-500 text-slate-950 font-bold"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by user name, corporate email, department, or location..."
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
        />
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] bg-slate-900/80">
              <th className="py-3 px-4">Identity / Name</th>
              <th className="py-3 px-4">Role & Privilege</th>
              <th className="py-3 px-4">Risk Score</th>
              <th className="py-3 px-4">Behavioral Flags</th>
              <th className="py-3 px-4">Simulated Location</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Last Active</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
            {filtered.map((u) => {
              const isHigh = u.risk_score >= 40;
              return (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white text-xs">{u.full_name}</div>
                    <div className="text-[10px] text-slate-400">{u.email} • {u.department}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sky-300 font-bold">{u.role}</div>
                    <div className="text-[10px] text-slate-400">{u.privilege_level}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className={`font-bold font-mono text-xs ${isHigh ? "text-red-400" : "text-emerald-400"}`}>
                      {u.risk_score} / 100
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {u.is_compromised && (
                        <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 border border-red-500/30 text-[9px]">
                          COMPROMISED
                        </span>
                      )}
                      {u.travel_anomaly && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px]">
                          IMPOSSIBLE TRAVEL
                        </span>
                      )}
                      {u.failed_login_attempts >= 3 && (
                        <span className="px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[9px]">
                          {u.failed_login_attempts} FAILED LOGINS
                        </span>
                      )}
                      {!u.is_compromised && !u.travel_anomaly && u.failed_login_attempts < 3 && (
                        <span className="text-slate-500 text-[10px]">Normal Baseline</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-slate-500" />
                    <span>{u.simulated_location}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${getStatusBadge(u.status)}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{formatDate(u.last_login)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/iam/${u.id}`}
                        className="p-1 rounded text-slate-400 hover:text-sky-300 hover:bg-slate-800"
                        title="View Profile"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                      {u.status !== "SUSPENDED" ? (
                        <button
                          onClick={() => handleSuspend(u.id, u.email)}
                          className="px-2 py-0.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-300 text-[10px] border border-red-500/30"
                          title="Suspend User"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleResetRisk(u.id)}
                          className="px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/30"
                          title="Reactivate"
                        >
                          Reactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
