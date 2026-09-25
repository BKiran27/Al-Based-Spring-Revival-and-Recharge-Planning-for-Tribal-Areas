"use client";

import React, { useState } from "react";
import { 
  Settings, 
  ShieldCheck, 
  Bell, 
  Key, 
  Save, 
  CheckCircle2,
  Lock,
  Globe
} from "lucide-react";

export default function SettingsPage() {
  const [bruteForceThreshold, setBruteForceThreshold] = useState("3");
  const [dataEgressThresholdGb, setDataEgressThresholdGb] = useState("50");
  const [sessionTimeoutMin, setSessionTimeoutMin] = useState("60");
  const [autoQuarantine, setAutoQuarantine] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Settings className="w-6 h-6 text-sky-400" />
              SecOps Engine Configuration & Thresholds
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
              POLICY STORE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Adjust detection engine heuristics, anomaly thresholds, and automated containment triggers.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Detection Rules Config */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            Detection Engine Thresholds
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="space-y-1.5">
              <label className="text-slate-400">Failed Login Brute-Force Trigger (Attempts):</label>
              <input
                type="number"
                value={bruteForceThreshold}
                onChange={(e) => setBruteForceThreshold(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400">Data Exfiltration Outbound Burst (GB / 10m):</label>
              <input
                type="number"
                value={dataEgressThresholdGb}
                onChange={(e) => setDataEgressThresholdGb(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400">JWT Session Inactivity Timeout (Minutes):</label>
              <input
                type="number"
                value={sessionTimeoutMin}
                onChange={(e) => setSessionTimeoutMin(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400">Automated Threat Containment:</label>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  checked={autoQuarantine}
                  onChange={(e) => setAutoQuarantine(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-500 bg-slate-950 border-slate-800"
                />
                <span className="text-slate-300">Automatically isolate host on Critical confidence</span>
              </div>
            </div>
          </div>
        </div>

        {/* API & Webhook Credentials */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider">
            <Key className="w-4 h-4 text-indigo-400" />
            Integrations & SIEM Forwarding
          </h2>

          <div className="space-y-3 text-xs font-mono">
            <div className="space-y-1">
              <label className="text-slate-400">Cloud SIEM Ingestion Webhook URL:</label>
              <input
                type="text"
                defaultValue="https://siem-collector.enterprise.cloudsentinel.io/v1/telemetry"
                className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {saved && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Configuration persisted to policy store.
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 shadow-md shadow-sky-500/20"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
