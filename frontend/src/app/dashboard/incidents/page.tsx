"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Zap, 
  Search, 
  Filter, 
  ShieldAlert, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Users, 
  Server,
  Plus
} from "lucide-react";
import { api } from "@/lib/api";
import { getSeverityBadge, getStatusBadge, formatDate } from "@/lib/utils";

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getIncidents();
        setIncidents(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = incidents.filter((inc) => {
    const matchSev = filterSeverity === "ALL" || inc.severity === filterSeverity;
    const matchStat = filterStatus === "ALL" || inc.status === filterStatus;
    const matchSearch = !search || 
      inc.id.toLowerCase().includes(search.toLowerCase()) ||
      inc.title.toLowerCase().includes(search.toLowerCase()) ||
      (inc.affected_user && inc.affected_user.toLowerCase().includes(search.toLowerCase())) ||
      (inc.affected_resource && inc.affected_resource.toLowerCase().includes(search.toLowerCase()));
    return matchSev && matchStat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-red-400" />
              Incident Response War Room
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30">
              NIST SP 800-61 ALIGNED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            End-to-end cloud incident lifecycle: Detection &rarr; Investigation &rarr; Containment &rarr; Recovery &rarr; Closure.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/demo"
            className="px-3.5 py-2 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs font-mono font-bold hover:bg-amber-500/20"
          >
            Launch Demo Attack
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search incidents by ID, title, user, or asset..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">STATUS:</span>
          {["ALL", "INVESTIGATING", "CONTAINED", "RESOLVED"].map((stat) => (
            <button
              key={stat}
              onClick={() => setFilterStatus(stat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                filterStatus === stat
                  ? "bg-sky-500 text-slate-950 font-bold"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              {stat}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] bg-slate-900/80">
              <th className="py-3 px-4">Incident ID</th>
              <th className="py-3 px-4">Title & Blast Radius</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Containment</th>
              <th className="py-3 px-4">Lead Analyst</th>
              <th className="py-3 px-4">Created</th>
              <th className="py-3 px-4">War Room</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
            {filtered.map((inc) => (
              <tr key={inc.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 text-sky-400 font-bold">{inc.id}</td>
                <td className="py-3 px-4">
                  <div className="font-bold text-white text-xs">{inc.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Target: {inc.affected_resource || "Fleet"} • Identity: {inc.affected_user || "System"}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] border ${getSeverityBadge(inc.severity)}`}>
                    {inc.severity}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] border ${getStatusBadge(inc.status)}`}>
                    {inc.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`text-[10px] ${inc.containment_status === "CONTAINED" ? "text-cyan-400" : "text-amber-400"}`}>
                    {inc.containment_status}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-300">{inc.assigned_analyst || "Unassigned"}</td>
                <td className="py-3 px-4 text-slate-400">{formatDate(inc.created_at)}</td>
                <td className="py-3 px-4">
                  <Link
                    href={`/dashboard/incidents/${inc.id}`}
                    className="px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-mono font-bold flex items-center gap-1 inline-flex"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
