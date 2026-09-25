"use client";

import React from "react";
import { 
  Layers, 
  ArrowDown, 
  ArrowRight, 
  ShieldCheck, 
  Database, 
  Lock, 
  Cpu, 
  Server, 
  Zap, 
  Flame, 
  Activity,
  FileCode
} from "lucide-react";

export default function ArchitecturePage() {
  const layers = [
    {
      step: "01",
      name: "Frontend Presentation & Telemetry Deck",
      tech: "Next.js 14 App Router • TypeScript • Tailwind CSS • Lucide Icons • Recharts",
      desc: "Delivers a responsive, dark-first cybersecurity command center with a 10-step Judges Demo Mode, live SVG relationship graphs, and real-time polling.",
      icon: Activity,
      color: "border-sky-500/40 bg-sky-500/10 text-sky-400"
    },
    {
      step: "02",
      name: "REST API Gateway & RBAC Layer",
      tech: "FastAPI • Pydantic v2 • JWT (PyJWT) • Bcrypt • CORS Middleware",
      desc: "Enforces fine-grained role-based access control across Admin, Security Analyst, Cloud Operator, and Viewer roles with token-based authentication.",
      icon: Lock,
      color: "border-indigo-500/40 bg-indigo-500/10 text-indigo-400"
    },
    {
      step: "03",
      name: "Security Engine & Ingestion Filter",
      tech: "Event Ingestion Pipeline • Normalization • Anomaly Heuristics",
      desc: "Ingests raw telemetry across compute instances, storage buckets, and IAM events, classifying signals into standardized SecOps schemas.",
      icon: Cpu,
      color: "border-cyan-500/40 bg-cyan-500/10 text-cyan-400"
    },
    {
      step: "04",
      name: "Real-Time Threat Detection & Correlation",
      tech: "Rule Evaluator • Behavioral Anomaly Detector • Confidence Scorer",
      desc: "Correlates multi-source events to identify Account Takeover, Impossible Travel, Privilege Escalation, and Data Exfiltration with 90%+ confidence.",
      icon: Flame,
      color: "border-red-500/40 bg-red-500/10 text-red-400"
    },
    {
      step: "05",
      name: "Explainable Risk Scoring Engine",
      tech: "Deterministic Mathematical Formulation (Identity + Threat + Network + Asset)",
      desc: "Calculates real-time risk scores from 0-100 without black-box obscurity, itemizing exact positive and negative point deltas for evaluators.",
      icon: ShieldCheck,
      color: "border-amber-500/40 bg-amber-500/10 text-amber-400"
    },
    {
      step: "06",
      name: "Incident Response & Containment Orchestrator",
      tech: "NIST SP 800-61 Workflow • Automated Host & Token Quarantine",
      desc: "Executes 1-click containment playbooks: terminating active JWTs, isolating compromised VMs into quarantine subnets, and dropping firewall IPs.",
      icon: Zap,
      color: "border-purple-500/40 bg-purple-500/10 text-purple-400"
    },
    {
      step: "07",
      name: "Relational Persistence & Audit Trail",
      tech: "SQLAlchemy 2.0 ORM • SQLite (WAL Mode) / PostgreSQL Dual Support",
      desc: "14 relational tables storing users, resources, events, proactive alerts, threats, war room actions, malware scans, and immutable audit logs.",
      icon: Database,
      color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-sky-400" />
              Technical System Architecture & Data Flow
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
              JUDGING REFERENCE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete technical blueprint illustrating how signals flow from cloud telemetry to automated incident containment.
          </p>
        </div>
      </div>

      {/* Visual Pipeline Stack */}
      <div className="space-y-3">
        {layers.map((layer, idx) => {
          const Icon = layer.icon;
          return (
            <div key={layer.step} className="space-y-2">
              <div className={`p-5 rounded-2xl border backdrop-blur transition-all hover:scale-[1.01] ${layer.color}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-950/80 border border-current flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="font-bold opacity-70">LAYER {layer.step}</span>
                        <span>•</span>
                        <span className="font-bold text-white">{layer.name}</span>
                      </div>
                      <div className="text-xs font-mono text-slate-300 mt-0.5">{layer.tech}</div>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-3xl">{layer.desc}</p>
                    </div>
                  </div>
                </div>
              </div>

              {idx < layers.length - 1 && (
                <div className="flex justify-center py-0.5">
                  <ArrowDown className="w-4 h-4 text-slate-600 animate-bounce" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lifecycle Flowchart */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur space-y-4">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
          End-to-End Telemetry Lifecycle
        </h3>
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs text-sky-300 text-center leading-loose">
          NORMAL CLOUD &rarr; SUSPICIOUS ACTIVITY &rarr; DETECTION ENGINE &rarr; PROACTIVE ALERT &rarr; THREAT CORRELATION &rarr; INCIDENT WAR ROOM &rarr; CONTAINMENT ACTION &rarr; RISK DECREASE &rarr; SECURE BASELINE
        </div>
      </div>
    </div>
  );
}
