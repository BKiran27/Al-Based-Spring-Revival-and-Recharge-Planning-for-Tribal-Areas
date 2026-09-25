"use client";

import React, { useEffect, useState } from "react";
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Wrench, 
  RefreshCw,
  Search,
  Filter
} from "lucide-react";
import { api } from "@/lib/api";
import { getSeverityBadge, getStatusBadge } from "@/lib/utils";

export default function ProtectionPage() {
  const [checks, setChecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>("ALL");

  const loadChecks = async () => {
    try {
      const data = await api.getPostureChecks();
      setChecks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChecks();
  }, []);

  const handleRemediate = async (id: string, code: string) => {
    try {
      await api.remediatePostureCheck(id);
      await loadChecks();
      alert(`Remediation applied: ${code} has been resolved to PASSED.`);
    } catch (e) {
      console.error(e);
    }
  };

  const passedCount = checks.filter(c => c.status === "PASSED").length;
  const warningCount = checks.filter(c => c.status === "WARNING").length;
  const criticalCount = checks.filter(c => c.status === "CRITICAL").length;
  const postureScore = checks.length > 0 ? Math.round((passedCount / checks.length) * 100) : 82;

  const filtered = checks.filter(c => filterCategory === "ALL" || c.category === filterCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              Cloud Protection & Security Posture Center
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              CIS BENCHMARK v1.4
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Continuous configuration auditing, CSPM hardening checks, and 1-click automated security remediations.
          </p>
        </div>
      </div>

      {/* Posture Score Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 backdrop-blur flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-mono font-black text-2xl text-emerald-400">
            {postureScore}%
          </div>
          <div>
            <div className="text-xs font-mono uppercase text-slate-400">Posture Score</div>
            <div className="text-sm font-bold text-white mt-0.5">CIS Compliance</div>
            <div className="text-[10px] text-emerald-400 font-mono">Benchmark v1.4</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur">
          <div className="text-[10px] uppercase font-mono text-slate-400">Passed Checks</div>
          <div className="text-3xl font-bold font-mono text-emerald-400 mt-1">{passedCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">Secure configurations</div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur">
          <div className="text-[10px] uppercase font-mono text-slate-400">Warnings</div>
          <div className="text-3xl font-bold font-mono text-amber-400 mt-1">{warningCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">Sub-optimal policies</div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur">
          <div className="text-[10px] uppercase font-mono text-slate-400">Critical Findings</div>
          <div className="text-3xl font-bold font-mono text-red-400 mt-1">{criticalCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">Requires immediate remediation</div>
        </div>
      </div>

      {/* Checks Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">CATEGORY:</span>
          {["ALL", "IAM", "STORAGE", "NETWORK", "ENCRYPTION", "DATABASE", "AUDITING"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                filterCategory === cat
                  ? "bg-emerald-500 text-slate-950 font-bold"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((chk) => (
            <div
              key={chk.id}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-sky-400">{chk.check_code}</span>
                  <span className={`px-2 py-0.2 rounded text-[10px] font-mono border ${getSeverityBadge(chk.severity)}`}>
                    {chk.severity}
                  </span>
                  <span className={`px-2 py-0.2 rounded text-[10px] font-mono border ${getStatusBadge(chk.status)}`}>
                    {chk.status}
                  </span>
                  <span className="text-slate-400 text-xs font-mono">• {chk.category}</span>
                </div>

                {chk.status !== "PASSED" ? (
                  <button
                    onClick={() => handleRemediate(chk.id, chk.check_code)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Apply 1-Click Fix</span>
                  </button>
                ) : (
                  <span className="text-emerald-400 font-mono text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Passed Compliance
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-white">{chk.title}</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono pt-1">
                <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/60">
                  <span className="text-slate-400 block text-[10px] uppercase">Problem / Violation</span>
                  <p className="text-slate-300 mt-1 text-[11px] leading-relaxed">{chk.problem}</p>
                </div>

                <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/60">
                  <span className="text-slate-400 block text-[10px] uppercase">Threat Impact</span>
                  <p className="text-red-300 mt-1 text-[11px] leading-relaxed">{chk.impact}</p>
                </div>

                <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-950/20">
                  <span className="text-emerald-400 block text-[10px] uppercase font-bold">Automated Fix</span>
                  <p className="text-emerald-200 mt-1 text-[11px] leading-relaxed">{chk.remediation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
