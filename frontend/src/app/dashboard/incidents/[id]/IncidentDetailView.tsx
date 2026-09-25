"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  Zap, 
  ArrowLeft, 
  ShieldAlert, 
  Server, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Terminal, 
  Send,
  Lock,
  Network
} from "lucide-react";
import { api } from "@/lib/api";
import { getSeverityBadge, getStatusBadge, formatDate } from "@/lib/utils";

const LIFECYCLE_STAGES = [
  "DETECTION",
  "INVESTIGATION",
  "CONTAINMENT",
  "ERADICATION",
  "RECOVERY",
  "RESOLVED"
];

export default function IncidentDetailView({ id: propId }: { id?: string }) {
  const params = useParams();
  const id = propId || (params?.id as string);

  const [incident, setIncident] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState("");
  const [executing, setExecuting] = useState(false);

  const loadIncident = async () => {
    try {
      const data = await api.getIncident(id);
      setIncident(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadIncident();
    }
  }, [id]);

  const handleAction = async (actionType: string, description: string) => {
    setExecuting(true);
    try {
      await api.performIncidentAction(id, {
        action_type: actionType,
        description,
        performed_by: "SecOps Lead Analyst"
      });
      await loadIncident();
    } catch (e) {
      console.error(e);
    } finally {
      setExecuting(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    await handleAction("ADD_NOTE", noteText);
    setNoteText("");
  };

  if (loading || !incident) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-xs font-mono text-slate-400">
        Loading Incident War Room...
      </div>
    );
  }

  const currentStageIndex = LIFECYCLE_STAGES.indexOf(incident.status.toUpperCase());
  const activeIdx = currentStageIndex === -1 ? 1 : currentStageIndex;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/incidents"
            className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-sky-400">{incident.id}</span>
              <span className={`px-2 py-0.2 rounded text-[10px] font-mono border ${getSeverityBadge(incident.severity)}`}>
                {incident.severity}
              </span>
              <span className={`px-2 py-0.2 rounded text-[10px] font-mono border ${getStatusBadge(incident.status)}`}>
                {incident.status}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-white mt-0.5">{incident.title}</h1>
          </div>
        </div>

        <div className="text-right text-xs font-mono text-slate-400">
          <div>ASSIGNED ANALYST: <strong className="text-slate-200">{incident.assigned_analyst || "SecOps Lead"}</strong></div>
          <div className="text-[10px] text-slate-500 mt-0.5">OPENED: {formatDate(incident.created_at)}</div>
        </div>
      </div>

      {/* Incident Lifecycle Stepper */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur space-y-2">
        <div className="text-[10px] font-mono uppercase text-slate-400">Incident Lifecycle Progression</div>
        <div className="grid grid-cols-6 gap-2">
          {LIFECYCLE_STAGES.map((stg, i) => (
            <div
              key={stg}
              className={`p-2.5 rounded-lg border text-center font-mono text-[10px] font-bold transition-all ${
                i === activeIdx
                  ? "border-sky-500 bg-sky-500/20 text-sky-300 shadow-md shadow-sky-500/20"
                  : i < activeIdx
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-slate-800 bg-slate-950/40 text-slate-500"
              }`}
            >
              <span>{stg}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column War Room Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Root Cause + Containment Actions + Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Blast Radius & Root Cause Card */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur space-y-4">
            <h2 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
              Forensic Summary & Blast Radius
            </h2>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/60">
                <span className="text-slate-500 block text-[10px]">AFFECTED CLOUD RESOURCE</span>
                <span className="text-white font-bold">{incident.affected_resource || "Multi-Cloud Fleet"}</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/60">
                <span className="text-slate-500 block text-[10px]">COMPROMISED IDENTITY</span>
                <span className="text-sky-300 font-bold">{incident.affected_user || "System / Service Account"}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/60 text-xs space-y-1">
              <span className="font-mono text-slate-400 text-[10px] uppercase font-bold">Root Cause Analysis</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">{incident.root_cause || "Under forensic examination."}</p>
            </div>
          </div>

          {/* Containment Playbooks Actions */}
          <div className="p-5 rounded-2xl border border-red-500/30 bg-red-950/10 backdrop-blur space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase text-red-400 font-bold tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Active Containment Playbooks (1-Click Remediation)
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40">
                {incident.containment_status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => handleAction("CONTAIN_RESOURCE", "Isolated target host with quarantine security group.")}
                disabled={executing}
                className="p-3 rounded-xl border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-left text-xs font-mono transition-colors"
              >
                <div className="font-bold text-red-300 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5" />
                  <span>Isolate Cloud VM</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Detach public NIC & apply quarantine firewall</div>
              </button>

              <button
                onClick={() => handleAction("REVOKE_SESSION", "Forced revocation of active OAuth/JWT tokens across all microservices.")}
                disabled={executing}
                className="p-3 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-left text-xs font-mono transition-colors"
              >
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Revoke User Sessions</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Invalidate JWT tokens & terminate active cookies</div>
              </button>

              <button
                onClick={() => handleAction("DISABLE_USER", "Quarantined IAM user account and blocked console login.")}
                disabled={executing}
                className="p-3 rounded-xl border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-left text-xs font-mono transition-colors"
              >
                <div className="font-bold text-purple-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>Suspend IAM Identity</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Freeze IAM permissions & attach DenyAll policy</div>
              </button>

              <button
                onClick={() => handleAction("RESOLVE", "Incident resolved. Root cause eradicated, verified clean telemetry.")}
                disabled={executing}
                className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-left text-xs font-mono transition-colors"
              >
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Resolve & Close Incident</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Mark incident complete and log to immutable audit</div>
              </button>
            </div>
          </div>

          {/* Action History Timeline */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur space-y-4">
            <h2 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
              Chronological Incident Timeline & Audit Trail
            </h2>

            <div className="relative pl-6 border-l border-slate-800 space-y-4">
              {incident.actions?.map((act: any) => (
                <div key={act.id} className="relative">
                  <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-sky-500 border-2 border-slate-950" />
                  <div className="text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sky-400">{act.action_type}</span>
                      <span className="text-[10px] font-mono text-slate-500">• {formatDate(act.timestamp)}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] mt-0.5">{act.description}</p>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">By: {act.performed_by}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Analyst Notes Terminal */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-[#080d1a] space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-2">
              <h3 className="text-xs font-mono uppercase font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-sky-400" />
                Analyst Incident Journal
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Append forensic findings to immutable case log</p>
            </div>

            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Record memory dump hash, IP block rule, or forensic hypothesis..."
                className="w-full h-32 p-3 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
              />
              <button
                type="submit"
                disabled={executing || !noteText.trim()}
                className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono flex items-center justify-center gap-2 transition-colors disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Note to Case Record</span>
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-slate-800 text-center">
            <Link
              href="/dashboard/audit"
              className="text-xs text-sky-400 hover:underline font-mono"
            >
              Inspect Global Audit Trail &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
