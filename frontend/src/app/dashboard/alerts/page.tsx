"use client";

import React, { useEffect, useState } from "react";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Filter, 
  Zap, 
  ShieldAlert, 
  Clock, 
  ArrowUpRight,
  BellOff
} from "lucide-react";
import { api } from "@/lib/api";
import { getSeverityBadge, getStatusBadge, formatDate } from "@/lib/utils";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadAlerts = async () => {
    try {
      const data = await api.getAlerts();
      setAlerts(data);
      if (data.length > 0 && !selectedAlert) {
        setSelectedAlert(data[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await api.updateAlertStatus(id, newStatus);
      await loadAlerts();
      if (selectedAlert?.id === id) {
        setSelectedAlert((prev: any) => ({ ...prev, status: newStatus }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEscalate = async (id: string) => {
    try {
      const res = await api.escalateAlert(id);
      alert(`Success: ${res.message} (Incident ID: ${res.incident_id})`);
      await loadAlerts();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    const matchStat = filterStatus === "ALL" || a.status === filterStatus;
    const matchSev = filterSeverity === "ALL" || a.severity === filterSeverity;
    const matchSearch = !search || 
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.rule_triggered.toLowerCase().includes(search.toLowerCase()) ||
      a.affected_entity.toLowerCase().includes(search.toLowerCase());
    return matchStat && matchSev && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              Proactive Alert Engine
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
              PRE-INCIDENT TRIGGERS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Detects suspicious deviations and compromised patterns before they escalate into major breaches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">STATUS:</span>
          {["ALL", "OPEN", "ACKNOWLEDGED", "RESOLVED"].map((stat) => (
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

      {/* Main Grid: Alert List + Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Alerts List */}
        <div className="lg:col-span-2 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by rule, affected user, entity, or keyword..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="space-y-2 max-h-[calc(100vh-270px)] overflow-y-auto pr-1">
            {filteredAlerts.map((alert) => {
              const isSelected = selectedAlert?.id === alert.id;
              return (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "border-sky-500/80 bg-slate-900/90 shadow-md shadow-sky-500/10"
                      : "border-slate-800 bg-slate-900/40 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-sky-400 font-bold">{alert.id}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono border ${getSeverityBadge(alert.severity)}`}>
                          {alert.severity}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono border ${getStatusBadge(alert.status)}`}>
                          {alert.status}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-white leading-snug">{alert.title}</h3>
                      <div className="text-[11px] font-mono text-slate-400">
                        Rule: <span className="text-slate-300">{alert.rule_triggered}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-bold text-red-400">+{alert.risk_score_impact} pts</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-1">{formatDate(alert.timestamp)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Detail & Action Drawer */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-[#080d1a] space-y-4 flex flex-col justify-between">
          {selectedAlert ? (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-sky-400 font-bold">{selectedAlert.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${getSeverityBadge(selectedAlert.severity)}`}>
                    {selectedAlert.severity}
                  </span>
                </div>
                <h2 className="text-base font-bold text-white mt-1">{selectedAlert.title}</h2>
                <div className="text-[11px] font-mono text-slate-400 mt-1">
                  Triggered: {formatDate(selectedAlert.timestamp)}
                </div>
              </div>

              {/* Alert Metadata */}
              <div className="space-y-2.5 text-xs font-mono">
                <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60">
                  <span className="text-slate-400 block text-[10px] uppercase">Rule Triggered</span>
                  <span className="text-white font-bold">{selectedAlert.rule_triggered}</span>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60">
                  <span className="text-slate-400 block text-[10px] uppercase">Affected Target</span>
                  <span className="text-sky-300 font-bold">{selectedAlert.affected_entity}</span>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60">
                  <span className="text-slate-400 block text-[10px] uppercase">Telemetry Evidence</span>
                  <span className="text-slate-300 leading-relaxed text-[11px] block mt-0.5">{selectedAlert.evidence}</span>
                </div>

                <div className="p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-950/20">
                  <span className="text-emerald-400 block text-[10px] uppercase font-bold">Recommended Response</span>
                  <span className="text-emerald-200 leading-relaxed text-[11px] block mt-0.5">{selectedAlert.recommended_action}</span>
                </div>
              </div>

              {/* Triage Action Controls */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => handleEscalate(selectedAlert.id)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-400 hover:to-amber-400 text-slate-950 font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-md shadow-red-500/20"
                >
                  <Zap className="w-4 h-4" />
                  Escalate to P1 Security Incident
                </button>

                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <button
                    onClick={() => handleStatusUpdate(selectedAlert.id, "ACKNOWLEDGED")}
                    className="py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200"
                  >
                    Acknowledge
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedAlert.id, "RESOLVED")}
                    className="py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300"
                  >
                    Resolve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedAlert.id, "SUPPRESSED")}
                    className="py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400"
                  >
                    Suppress
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 font-mono text-center py-12">
              Select an alert from the left panel to inspect forensic details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
