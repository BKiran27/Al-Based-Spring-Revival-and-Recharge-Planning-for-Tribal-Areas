"use client";

import React, { useEffect, useState } from "react";
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Radio, 
  ArrowUpRight,
  Eye,
  X
} from "lucide-react";
import { api } from "@/lib/api";
import { getSeverityBadge, formatDate } from "@/lib/utils";

const EVENT_TYPES = [
  "ALL",
  "LOGIN",
  "API_CALL",
  "FILE_ACCESS",
  "PERMISSION_CHANGE",
  "NETWORK_ANOMALY",
  "MALWARE_DETECTED",
  "CONFIGURATION_CHANGE",
  "PRIVILEGE_ESCALATION",
  "DATA_ACCESS"
];

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [filterType, setFilterType] = useState<string>("ALL");
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    try {
      const data = await api.getEvents({ limit: 120 });
      setEvents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const filtered = events.filter((e) => {
    const matchType = filterType === "ALL" || e.event_type === filterType;
    const matchSev = filterSeverity === "ALL" || e.severity === filterSeverity;
    const matchSearch = !search || 
      e.id.toLowerCase().includes(search.toLowerCase()) ||
      (e.actor_user && e.actor_user.toLowerCase().includes(search.toLowerCase())) ||
      (e.target_resource && e.target_resource.toLowerCase().includes(search.toLowerCase())) ||
      (e.details && e.details.toLowerCase().includes(search.toLowerCase())) ||
      (e.source_ip && e.source_ip.toLowerCase().includes(search.toLowerCase()));
    return matchType && matchSev && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-sky-400" />
              Centralized Security Event Hub
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
              120+ TELEMETRY RECORDS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Normalized cloud audit trails across IAM, compute nodes, API gateways, and storage buckets.
          </p>
        </div>

        <a
          href={api.getExportUrl("events")}
          download="cloudsentinel_events.csv"
          className="px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </a>
      </div>

      {/* Filter Ribbon */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by event ID, actor email, IP address, resource, or details..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Type pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-mono text-slate-400 mr-2">TYPE:</span>
          {EVENT_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                filterType === t
                  ? "bg-sky-500 text-slate-950 font-bold"
                  : "text-slate-400 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Events Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] bg-slate-900/80">
              <th className="py-3 px-4">Event ID</th>
              <th className="py-3 px-4">Event Type</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Actor / Identity</th>
              <th className="py-3 px-4">Source IP & Location</th>
              <th className="py-3 px-4">Target Resource</th>
              <th className="py-3 px-4">Action Recorded</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
            {filtered.map((e) => (
              <tr key={e.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 text-sky-400 font-bold">{e.id}</td>
                <td className="py-3 px-4 font-bold text-white">{e.event_type}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] border ${getSeverityBadge(e.severity)}`}>
                    {e.severity}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-200 truncate max-w-[150px]">{e.actor_user || "System Service"}</td>
                <td className="py-3 px-4 text-slate-400">
                  <div>{e.source_ip || "Internal"}</div>
                  <div className="text-[10px] text-slate-500">{e.location}</div>
                </td>
                <td className="py-3 px-4 text-indigo-300 font-bold truncate max-w-[130px]">{e.target_resource || "SSO"}</td>
                <td className="py-3 px-4 text-slate-300">{e.action_taken || "RECORDED"}</td>
                <td className="py-3 px-4 text-slate-400">{formatDate(e.timestamp)}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => setSelectedEvent(e)}
                    className="p-1 rounded text-slate-400 hover:text-sky-300 hover:bg-slate-800"
                    title="View JSON Payload"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* JSON Modal Drawer */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-xl w-full rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs text-sky-400 font-bold">{selectedEvent.id}</span>
                <h3 className="text-base font-bold text-white mt-0.5">Raw Telemetry Payload</h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <pre className="p-4 rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs text-sky-300 overflow-x-auto max-h-80">
              {JSON.stringify(selectedEvent, null, 2)}
            </pre>

            <div className="text-right">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
