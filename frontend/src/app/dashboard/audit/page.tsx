"use client";

import React, { useEffect, useState } from "react";
import { 
  FileCode, 
  Search, 
  Download, 
  ShieldCheck, 
  UserCheck, 
  Clock,
  Terminal
} from "lucide-react";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    try {
      const data = await api.getAuditLogs({ limit: 50 });
      setLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filtered = logs.filter((l) => {
    return !search ||
      l.id.toLowerCase().includes(search.toLowerCase()) ||
      l.actor.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.target.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <FileCode className="w-6 h-6 text-sky-400" />
              Immutable Administrative Audit Logs
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
              TAMPER-EVIDENT TRAIL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Chronological cryptographic ledger tracking all operator containment actions, role elevations, and threat mitigations.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter audit entries by actor, action name, target entity, or IP..."
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
        />
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] bg-slate-900/80">
              <th className="py-3 px-4">Audit ID</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Actor</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Target Entity</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Forensic Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 text-sky-400 font-bold">{log.id}</td>
                <td className="py-3 px-4 text-slate-400">{formatDate(log.timestamp)}</td>
                <td className="py-3 px-4 text-white font-bold">{log.actor}</td>
                <td className="py-3 px-4 text-amber-300">{log.action}</td>
                <td className="py-3 px-4 text-slate-200 font-bold">{log.target}</td>
                <td className="py-3 px-4">
                  <span className="text-emerald-400 font-bold">{log.status}</span>
                </td>
                <td className="py-3 px-4 text-slate-300 max-w-sm truncate">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
