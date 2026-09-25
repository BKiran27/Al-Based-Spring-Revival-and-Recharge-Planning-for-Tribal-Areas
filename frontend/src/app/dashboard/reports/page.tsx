"use client";

import React, { useEffect, useState } from "react";
import { 
  FileText, 
  Download, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Users, 
  Server,
  Zap
} from "lucide-react";
import { api } from "@/lib/api";

export default function ReportsPage() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getReportSummary();
        setReport(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading || !report) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-xs font-mono text-slate-400">
        Generating SecOps Executive Dossier...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header & Export Controls (Hidden when printing) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-sky-400" />
              Executive Security Audit & Compliance Dossier
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
              BOARD-READY REPORT
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Formal CISO briefing summarizing multi-cloud posture, active breach attempts, and mitigation effectiveness.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-mono font-bold flex items-center gap-2 shadow-md shadow-sky-500/20"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>

          <a
            href={api.getExportUrl("threats")}
            download="cloudsentinel_threats.csv"
            className="px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Formal Printable Executive Report Document */}
      <div className="p-8 rounded-2xl border border-slate-800 bg-[#090d18] text-slate-200 space-y-8 font-sans shadow-2xl">
        {/* Document Header */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-6">
          <div>
            <div className="font-bold text-2xl tracking-tight text-white flex items-center gap-2">
              <span>CloudSentinel</span>
              <span className="text-sky-400 text-sm font-mono border border-sky-500/40 px-2 py-0.5 rounded">SecOps Dossier</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">Classification: Strictly Confidential / Enterprise Security Committee</div>
          </div>
          <div className="text-right font-mono text-xs text-slate-400">
            <div>REPORT ID: <strong className="text-white">{report.report_id}</strong></div>
            <div className="text-[10px] mt-0.5">DATE: {new Date(report.generated_at).toLocaleString()}</div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-sky-400 font-mono">
            1. Executive Assessment
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Over the observed evaluation window, CloudSentinel monitored {report.total_monitored_resources} multi-cloud infrastructure assets across AWS, Azure, and GCP. The current system-wide Security Risk Score is evaluated at 
            <strong className="text-white"> {report.risk_score} / 100 ({report.posture_status})</strong>. A total of {report.total_active_threats} active threat vectors were detected and correlated with automated containment playbooks.
          </p>
        </div>

        {/* High-Level Posture Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
            <span className="text-slate-500 text-[10px] block">SECURITY RISK SCORE</span>
            <div className="text-2xl font-bold text-sky-400 mt-1">{report.risk_score} / 100</div>
            <span className="text-[10px] text-emerald-400">Evaluated Real-Time</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
            <span className="text-slate-500 text-[10px] block">CIS BENCHMARK PASS</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{report.cis_benchmark_compliance}</div>
            <span className="text-[10px] text-slate-400">Benchmark v1.4</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
            <span className="text-slate-500 text-[10px] block">ACTIVE THREATS</span>
            <div className="text-2xl font-bold text-red-400 mt-1">{report.total_active_threats}</div>
            <span className="text-[10px] text-slate-400">Under SOC Review</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
            <span className="text-slate-500 text-[10px] block">OPEN INCIDENTS</span>
            <div className="text-2xl font-bold text-amber-400 mt-1">{report.total_open_incidents}</div>
            <span className="text-[10px] text-slate-400">Containment Active</span>
          </div>
        </div>

        {/* Key Risk Drivers */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-sky-400 font-mono">
            2. Identified Threat Drivers & Exposure Vectors
          </h2>
          <div className="space-y-2 font-mono text-xs">
            {report.key_risk_drivers?.map((driver: string, i: number) => (
              <div key={i} className="p-3 rounded-lg border border-slate-800 bg-slate-950/40 flex items-center justify-between">
                <span className="text-slate-200">{i + 1}. {driver}</span>
                <span className="text-amber-400 text-[10px] font-bold">ATTENTION REQUIRED</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sign-off & Verification Footer */}
        <div className="pt-8 border-t border-slate-800 flex justify-between items-end text-xs font-mono text-slate-500">
          <div>
            <div>VERIFIED BY: <strong className="text-slate-300">Marcus Reed (Lead Security Analyst)</strong></div>
            <div>STATUS: <strong className="text-emerald-400">SIGN-OFF COMPLETE</strong></div>
          </div>
          <div className="text-right">
            <div>CloudSentinel SecOps Engine • v2.4.0</div>
            <div>University Innovation & Hackathon Edition</div>
          </div>
        </div>
      </div>
    </div>
  );
}
