"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ShieldAlert, 
  Flame, 
  AlertTriangle, 
  Users, 
  Server, 
  FileText, 
  Zap, 
  ShieldCheck, 
  ArrowUpRight, 
  TrendingUp, 
  RefreshCw,
  PlayCircle,
  Activity,
  Globe,
  Radio
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from "recharts";
import { api } from "@/lib/api";
import { getSeverityBadge, getStatusBadge, formatDate } from "@/lib/utils";

export default function DashboardOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setRefreshing(true);
      const res = await api.getDashboardSummary();
      setData(res);
    } catch (err) {
      console.error("Failed to load dashboard summary", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // Live poll every 10s
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
          <span className="text-xs font-mono text-slate-400">Loading SecOps telemetry...</span>
        </div>
      </div>
    );
  }

  const riskScore = data?.security_risk_score ?? 18;
  const isHighRisk = riskScore >= 70;
  const isElevated = riskScore >= 35 && riskScore < 70;

  return (
    <div className="space-y-6">
      {/* Top Header & Simulation Trigger */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Security Command Center</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              LIVE MONITORING
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-cloud telemetry, heuristic anomaly detection, and automated containment orchestrator.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/demo"
            className="px-3.5 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/20 transition-colors flex items-center gap-2 shadow-sm"
          >
            <PlayCircle className="w-4 h-4 text-amber-400" />
            Judges 3-Min Flow
          </Link>
          <Link
            href="/dashboard/simulation"
            className="px-3.5 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-bold hover:bg-red-500/20 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Flame className="w-4 h-4 text-red-400" />
            Simulate Attack
          </Link>
          <button
            onClick={loadData}
            disabled={refreshing}
            className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-colors"
            title="Refresh Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-sky-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Top 8 Key SecOps Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* Metric 1: Risk Score */}
        <Link 
          href="/dashboard/risk"
          className={`p-3.5 rounded-xl border bg-slate-900/60 backdrop-blur hover:border-slate-700 transition-all ${
            isHighRisk ? "border-red-500/40 glow-red" : isElevated ? "border-amber-500/40 glow-amber" : "border-emerald-500/40 glow-cyan"
          }`}
        >
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center justify-between">
            <span>Risk Score</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" />
          </div>
          <div className={`text-2xl font-black font-mono mt-1 ${isHighRisk ? "text-red-400" : isElevated ? "text-amber-400" : "text-emerald-400"}`}>
            {riskScore}<span className="text-xs font-normal opacity-60">/100</span>
          </div>
          <div className="text-[10px] font-mono mt-1 text-slate-400 capitalize">
            {data?.risk_breakdown?.posture_status || "SECURE"}
          </div>
        </Link>

        {/* Metric 2: Active Threats */}
        <Link 
          href="/dashboard/threats"
          className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur hover:border-slate-700 transition-all"
        >
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center justify-between">
            <span>Threats</span>
            <Flame className="w-3 h-3 text-red-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-red-400 mt-1">
            {data?.active_threats ?? 0}
          </div>
          <div className="text-[10px] font-mono mt-1 text-slate-400">Active Vectors</div>
        </Link>

        {/* Metric 3: Critical Alerts */}
        <Link 
          href="/dashboard/alerts"
          className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur hover:border-slate-700 transition-all"
        >
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center justify-between">
            <span>Alerts</span>
            <AlertTriangle className="w-3 h-3 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
            {data?.critical_alerts ?? 0}
          </div>
          <div className="text-[10px] font-mono mt-1 text-slate-400">Critical Open</div>
        </Link>

        {/* Metric 4: Suspicious Users */}
        <Link 
          href="/dashboard/iam"
          className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur hover:border-slate-700 transition-all"
        >
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center justify-between">
            <span>Risky IAM</span>
            <Users className="w-3 h-3 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-sky-400 mt-1">
            {data?.suspicious_users ?? 0}
          </div>
          <div className="text-[10px] font-mono mt-1 text-slate-400">Flagged Users</div>
        </Link>

        {/* Metric 5: Monitored Resources */}
        <Link 
          href="/dashboard/resources"
          className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur hover:border-slate-700 transition-all"
        >
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center justify-between">
            <span>Resources</span>
            <Server className="w-3 h-3 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {data?.monitored_resources ?? 0}
          </div>
          <div className="text-[10px] font-mono mt-1 text-slate-400">Multi-Cloud Fleet</div>
        </Link>

        {/* Metric 6: Security Events */}
        <Link 
          href="/dashboard/events"
          className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur hover:border-slate-700 transition-all"
        >
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center justify-between">
            <span>Events</span>
            <FileText className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {data?.security_events_count ?? 0}
          </div>
          <div className="text-[10px] font-mono mt-1 text-slate-400">Total Ingested</div>
        </Link>

        {/* Metric 7: Open Incidents */}
        <Link 
          href="/dashboard/incidents"
          className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur hover:border-slate-700 transition-all"
        >
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center justify-between">
            <span>Incidents</span>
            <Zap className="w-3 h-3 text-red-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-red-400 mt-1">
            {data?.open_incidents ?? 0}
          </div>
          <div className="text-[10px] font-mono mt-1 text-slate-400">Open War Rooms</div>
        </Link>

        {/* Metric 8: Protected Assets */}
        <Link 
          href="/dashboard/protection"
          className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur hover:border-slate-700 transition-all"
        >
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center justify-between">
            <span>Protected</span>
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {data?.protected_assets ?? 0}
          </div>
          <div className="text-[10px] font-mono mt-1 text-slate-400">Clean Baselines</div>
        </Link>
      </div>

      {/* Row 2: Charts & Explainable Risk Drivers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events Over Time Area Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-400" />
                Security Ingestion & Anomaly Timeline (12h)
              </h2>
              <p className="text-[11px] text-slate-400">Aggregated heuristic triggers and baseline cloud noise</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-sky-400">
                <span className="w-2.5 h-2.5 rounded bg-sky-500/80" /> Events
              </span>
              <span className="flex items-center gap-1.5 text-red-400">
                <span className="w-2.5 h-2.5 rounded bg-red-500/80" /> Anomalies
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.events_timeline || []}>
                <defs>
                  <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAnom" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#475569" fontSize={11} tickLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                />
                <Area type="monotone" dataKey="events" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorEvents)" />
                <Area type="monotone" dataKey="anomalies" stroke="#ef4444" fillOpacity={1} fill="url(#colorAnom)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Explainable Risk Drivers Card */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                Explainable Risk Engine
              </h2>
              <Link href="/dashboard/risk" className="text-xs text-sky-400 hover:underline font-mono">
                Formula &rarr;
              </Link>
            </div>
            <p className="text-[11px] text-slate-400 mb-4">
              Real-time formula: Identity ({data?.risk_breakdown?.identity_risk}) + Threats ({data?.risk_breakdown?.threat_severity_risk}) + Traffic ({data?.risk_breakdown?.traffic_risk}) + Posture ({data?.risk_breakdown?.posture_risk})
            </p>

            <div className="space-y-2.5 overflow-y-auto max-h-56 pr-1">
              {data?.risk_breakdown?.factors?.map((f: any, idx: number) => (
                <div key={idx} className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 text-xs flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-slate-200">{f.factor}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">{f.description}</div>
                  </div>
                  <span className="font-mono font-bold text-red-400 shrink-0 text-xs">
                    +{f.points} pts
                  </span>
                </div>
              ))}
              {(!data?.risk_breakdown?.factors || data?.risk_breakdown?.factors.length === 0) && (
                <div className="text-center py-8 text-xs text-slate-400 font-mono">
                  Clean baseline. No anomalous risk penalties active.
                </div>
              )}
            </div>
          </div>

          <Link
            href="/dashboard/risk"
            className="w-full py-2 rounded-lg border border-slate-700 bg-slate-800/60 text-slate-300 hover:text-white text-xs font-mono text-center block mt-3"
          >
            Inspect Detailed Risk Decomposition
          </Link>
        </div>
      </div>

      {/* Row 3: Risky IAM Users & Top Affected Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risky IAM Users */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-400" />
              Highest-Risk IAM Identities
            </h2>
            <Link href="/dashboard/iam" className="text-xs text-sky-400 hover:underline font-mono">
              View all 25 users &rarr;
            </Link>
          </div>

          <div className="divide-y divide-slate-800/80">
            {data?.top_risky_users?.map((u: any) => (
              <div key={u.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="truncate">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="truncate">{u.full_name}</span>
                    {u.is_compromised && (
                      <span className="text-[9px] font-mono px-1 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                        COMPROMISED
                      </span>
                    )}
                    {u.travel_anomaly && (
                      <span className="text-[9px] font-mono px-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        TRAVEL ANOMALY
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">{u.email} • {u.department}</div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs font-mono font-bold ${u.risk_score >= 40 ? "text-red-400" : "text-amber-400"}`}>
                    Risk: {u.risk_score}
                  </span>
                  <Link
                    href={`/dashboard/iam/${u.id}`}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Affected Cloud Resources */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-400" />
              Exposed & High-Risk Cloud Assets
            </h2>
            <Link href="/dashboard/resources" className="text-xs text-sky-400 hover:underline font-mono">
              View all 20 assets &rarr;
            </Link>
          </div>

          <div className="divide-y divide-slate-800/80">
            {data?.top_affected_resources?.map((r: any) => (
              <div key={r.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="truncate">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="truncate">{r.name}</span>
                    <span className="text-[9px] font-mono px-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {r.resource_type}
                    </span>
                    {r.is_contained && (
                      <span className="text-[9px] font-mono px-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        CONTAINED
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">{r.provider} • Region: {r.region}</div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${getSeverityBadge(r.risk_level)}`}>
                    {r.risk_level}
                  </span>
                  <Link
                    href={`/dashboard/resources/${r.id}`}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Recent Security Events Feed */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h2 className="text-sm font-bold text-white">Live Ingestion Event Feed</h2>
          </div>
          <Link href="/dashboard/events" className="text-xs text-sky-400 hover:underline font-mono">
            View full event archive (120+) &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <th className="py-2 px-3">Event ID</th>
                <th className="py-2 px-3">Type</th>
                <th className="py-2 px-3">Severity</th>
                <th className="py-2 px-3">Actor / Principal</th>
                <th className="py-2 px-3">Source IP & Location</th>
                <th className="py-2 px-3">Target Resource</th>
                <th className="py-2 px-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {data?.recent_events?.map((e: any) => (
                <tr key={e.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2 px-3 text-sky-400 font-bold">{e.id}</td>
                  <td className="py-2 px-3 text-slate-300">{e.event_type}</td>
                  <td className="py-2 px-3">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] border ${getSeverityBadge(e.severity)}`}>
                      {e.severity}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-200 truncate max-w-[140px]">{e.actor_user || "System"}</td>
                  <td className="py-2 px-3 text-slate-400 truncate max-w-[150px]">{e.source_ip} ({e.location})</td>
                  <td className="py-2 px-3 text-slate-300 truncate max-w-[130px]">{e.target_resource || "SSO"}</td>
                  <td className="py-2 px-3 text-slate-400">{formatDate(e.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
