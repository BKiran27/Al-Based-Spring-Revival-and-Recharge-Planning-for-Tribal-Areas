"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  PieChart, 
  TrendingUp, 
  ShieldAlert, 
  Users, 
  Network, 
  Server, 
  Flame, 
  CheckCircle2, 
  ArrowRight,
  Info
} from "lucide-react";
import { api } from "@/lib/api";

export default function RiskAnalyticsPage() {
  const [breakdown, setBreakdown] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getRiskBreakdown();
        setBreakdown(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !breakdown) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-xs font-mono text-slate-400">
        Loading Explainable Risk Engine Model...
      </div>
    );
  }

  const totalScore = breakdown.total_score;
  const isHighRisk = totalScore >= 70;
  const isElevated = totalScore >= 35 && totalScore < 70;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <PieChart className="w-6 h-6 text-amber-400" />
              Explainable Risk Scoring Engine
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
              DETERMINISTIC & TRANSPARENT
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Zero black-box obscurity. Every point in the security risk score is mathematically linked to an active threat vector.
          </p>
        </div>

        <Link
          href="/dashboard/demo"
          className="px-3.5 py-2 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs font-mono font-bold hover:bg-amber-500/20"
        >
          Watch Score Change Live
        </Link>
      </div>

      {/* Primary Mathematical Formula Banner */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#070b16] space-y-4">
        <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
          Mathematical Formulation
        </span>
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 font-mono text-sm sm:text-base text-sky-300 overflow-x-auto text-center font-bold">
          Risk Score = Base (10) + Identity ({breakdown.identity_risk}) + Threats ({breakdown.threat_severity_risk}) + Network ({breakdown.traffic_risk}) + Resources ({breakdown.resource_risk}) + Compliance ({breakdown.posture_risk})
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-400">
            Current Evaluated State: <strong className="text-white uppercase">{breakdown.posture_status}</strong>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">TOTAL CALCULATED RISK:</span>
            <span className={`text-2xl font-black font-mono ${isHighRisk ? "text-red-400" : isElevated ? "text-amber-400" : "text-emerald-400"}`}>
              {totalScore} / 100
            </span>
          </div>
        </div>
      </div>

      {/* 5 Risk Sub-Dimensions */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
            <Users className="w-3 h-3 text-sky-400" />
            <span>IDENTITY RISK</span>
          </div>
          <div className="text-xl font-bold text-sky-400 mt-1">+{breakdown.identity_risk}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Compromised IAM</div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
            <Flame className="w-3 h-3 text-red-400" />
            <span>THREAT SEVERITY</span>
          </div>
          <div className="text-xl font-bold text-red-400 mt-1">+{breakdown.threat_severity_risk}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Active Criticals</div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
            <Network className="w-3 h-3 text-amber-400" />
            <span>TRAFFIC ANOMALY</span>
          </div>
          <div className="text-xl font-bold text-amber-400 mt-1">+{breakdown.traffic_risk}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">SYN Floods / Spikes</div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
            <Server className="w-3 h-3 text-indigo-400" />
            <span>RESOURCE EXPOSURE</span>
          </div>
          <div className="text-xl font-bold text-indigo-400 mt-1">+{breakdown.resource_risk}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Public & Unencrypted</div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>POSTURE GAP</span>
          </div>
          <div className="text-xl font-bold text-emerald-400 mt-1">+{breakdown.posture_risk}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">CIS Deficiencies</div>
        </div>
      </div>

      {/* Itemized Explainability Cards */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-sky-400" />
            Itemized Risk Contributors (Why the Score Changed)
          </h2>
          <span className="text-xs text-slate-400 font-mono">Real-time Telemetry Drivers</span>
        </div>

        <div className="space-y-3">
          {breakdown.factors?.map((f: any, idx: number) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400">[{f.category}]</span>
                  <h3 className="text-xs font-bold text-white">{f.factor}</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{f.description}</p>
              </div>

              <div className="shrink-0 text-right font-mono">
                <span className="text-sm font-bold text-red-400">+{f.points} pts</span>
                <div className="text-[10px] text-slate-500 mt-0.5">{f.severity}</div>
              </div>
            </div>
          ))}

          {(!breakdown.factors || breakdown.factors.length === 0) && (
            <div className="text-center py-12 text-xs font-mono text-slate-400">
              Pristine baseline. All multi-cloud security checks satisfied.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
