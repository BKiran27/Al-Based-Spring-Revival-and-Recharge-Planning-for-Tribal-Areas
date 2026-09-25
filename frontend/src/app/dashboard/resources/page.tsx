"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Server, 
  Search, 
  Filter, 
  ShieldAlert, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle, 
  Lock,
  Globe,
  Database
} from "lucide-react";
import { api } from "@/lib/api";
import { getSeverityBadge, getStatusBadge, formatDate } from "@/lib/utils";

const RESOURCE_TYPES = ["ALL", "VM", "BUCKET", "DATABASE", "API_GATEWAY", "CONTAINER", "IAM_ROLE"];

export default function ResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadResources = async () => {
    try {
      const data = await api.getResources();
      setResources(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleToggleContainment = async (resourceId: string) => {
    try {
      const res = await api.containResource(resourceId);
      await loadResources();
      alert(`Asset ${resourceId} containment state toggled: ${res.is_contained ? "CONTAINED" : "ONLINE"}`);
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = resources.filter((r) => {
    const matchType = filterType === "ALL" || r.resource_type === filterType;
    const matchSearch = !search || 
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.owner.toLowerCase().includes(search.toLowerCase()) ||
      r.region.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Server className="w-6 h-6 text-indigo-400" />
              Cloud Resource Inventory & Asset Posture
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              MULTI-CLOUD (AWS / AZURE / GCP SIMULATED)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Centralized inventory tracking configuration drift, public exposure, encryption state, and quarantine isolation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">TYPE:</span>
          {RESOURCE_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                filterType === t
                  ? "bg-indigo-500 text-white font-bold"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              {t}
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
          placeholder="Search by resource ID, name, owner, or cloud region..."
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Resources Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] bg-slate-900/80">
              <th className="py-3 px-4">Asset ID</th>
              <th className="py-3 px-4">Resource Name & Provider</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Risk Level</th>
              <th className="py-3 px-4">Security Score</th>
              <th className="py-3 px-4">Public Access</th>
              <th className="py-3 px-4">Encryption</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 text-sky-400 font-bold">{r.id}</td>
                <td className="py-3 px-4">
                  <div className="font-bold text-white text-xs">{r.name}</div>
                  <div className="text-[10px] text-slate-400">{r.provider} • {r.region}</div>
                </td>
                <td className="py-3 px-4 text-slate-300">{r.resource_type}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] border ${getSeverityBadge(r.risk_level)}`}>
                    {r.risk_level}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`font-bold ${r.security_score >= 80 ? "text-emerald-400" : "text-amber-400"}`}>
                    {r.security_score} / 100
                  </span>
                </td>
                <td className="py-3 px-4">
                  {r.public_access ? (
                    <span className="text-red-400 font-bold">PUBLIC (0.0.0.0/0)</span>
                  ) : (
                    <span className="text-slate-400">VPC Private</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {r.encryption_enabled ? (
                    <span className="text-emerald-400">KMS / AES-256</span>
                  ) : (
                    <span className="text-red-400 font-bold">UNENCRYPTED</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {r.is_contained ? (
                    <span className="text-cyan-400 font-bold">CONTAINED</span>
                  ) : (
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${getStatusBadge(r.status)}`}>
                      {r.status}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/resources/${r.id}`}
                      className="p-1 rounded text-slate-400 hover:text-sky-300 hover:bg-slate-800"
                      title="Inspect Configuration"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleToggleContainment(r.id)}
                      className={`px-2 py-0.5 rounded text-[10px] border font-mono transition-colors ${
                        r.is_contained
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
                          : "bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20"
                      }`}
                    >
                      {r.is_contained ? "Release" : "Quarantine"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
