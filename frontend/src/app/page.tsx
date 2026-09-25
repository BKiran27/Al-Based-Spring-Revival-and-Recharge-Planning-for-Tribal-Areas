"use client";

import Link from "next/link";
import { 
  ShieldAlert, 
  Terminal, 
  Activity, 
  Lock, 
  Eye, 
  Zap, 
  ArrowRight, 
  Cpu, 
  Server, 
  Network, 
  CheckCircle2, 
  AlertTriangle,
  PlayCircle,
  Award,
  Layers,
  ChevronRight
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#050811] text-slate-100 cyber-grid overflow-hidden">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-sky-500/10 blur-[140px] pointer-events-none rounded-full" />
      
      {/* Navigation */}
      <nav className="relative z-20 border-b border-slate-800/80 bg-[#080d1a]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
                Cloud<span className="text-sky-400">Sentinel</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">AI Ops</span>
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#lifecycle" className="hover:text-sky-400 transition-colors">Lifecycle</a>
            <a href="#capabilities" className="hover:text-sky-400 transition-colors">Capabilities</a>
            <a href="#architecture" className="hover:text-sky-400 transition-colors">Architecture</a>
            <Link href="/dashboard/demo" className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium">
              <Award className="w-4 h-4" /> Judges Demo Mode
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href="/login" 
              className="text-sm font-medium px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors border border-slate-800"
            >
              Sign In
            </Link>
            <Link 
              href="/dashboard" 
              className="text-sm font-semibold px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 transition-all shadow-md shadow-sky-500/25 flex items-center gap-2"
            >
              Launch Console
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Telemetry Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-300 text-xs font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Autonomous Cloud Threat Intelligence & Incident Response Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            See the Threat. <br />
            Understand the Risk. <br />
            <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              Respond Before It Escalates.
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-300 font-light leading-relaxed">
            An intelligent cloud security command center for monitoring identities, resources, 
            network traffic, and security events in real time with automated containment playbooks.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link 
              href="/dashboard" 
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-bold text-base shadow-xl shadow-sky-500/20 flex items-center gap-3 transition-transform hover:-translate-y-0.5"
            >
              Launch Security Console
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </Link>

            <Link 
              href="/dashboard/demo" 
              className="px-6 py-3.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-base flex items-center gap-3 transition-transform hover:-translate-y-0.5"
            >
              <PlayCircle className="w-5 h-5 text-amber-400" />
              Judges Demo Mode (3-Min Flow)
            </Link>

            <Link 
              href="/dashboard/simulation" 
              className="px-6 py-3.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 font-bold text-base flex items-center gap-3 transition-transform hover:-translate-y-0.5"
            >
              <Zap className="w-5 h-5 text-red-400" />
              Run Threat Simulation
            </Link>
          </div>

          {/* Key Stat Cards Banner */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-4xl mx-auto">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur">
              <div className="text-2xl font-bold font-mono text-emerald-400">18 / 100</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-mono mt-1">Baseline Risk Score</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur">
              <div className="text-2xl font-bold font-mono text-sky-400">&lt; 350 ms</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-mono mt-1">Detection Latency</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur">
              <div className="text-2xl font-bold font-mono text-indigo-400">100% Explainable</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-mono mt-1">Formulaic Scoring</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur">
              <div className="text-2xl font-bold font-mono text-amber-400">1-Click</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-mono mt-1">Host/Token Containment</div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Lifecycle Walkthrough */}
      <section id="lifecycle" className="relative z-10 py-20 border-t border-slate-800/80 bg-slate-950/60 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs uppercase font-mono text-sky-400 tracking-wider">Competition Architecture</span>
            <h2 className="text-3xl font-bold text-white tracking-tight">The 5-Stage Security Lifecycle</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              How CloudSentinel transforms ambiguous multi-cloud telemetry into proactive containment before catastrophic exfiltration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: "01", name: "PROBLEM", desc: "Dispersed assets, credential sprays, unencrypted buckets, impossible travel anomalies.", color: "text-red-400 border-red-500/30" },
              { step: "02", name: "DETECTION", desc: "Continuous event evaluation matching YARA rules, CIS checks, and heuristic velocity triggers.", color: "text-amber-400 border-amber-500/30" },
              { step: "03", name: "ANALYSIS", desc: "Explainable Risk formula aggregates Identity + Network + Resource + Threat indicators.", color: "text-sky-400 border-sky-500/30" },
              { step: "04", name: "RESPONSE", desc: "Automated P1 incident creation, token revocation, firewall IP drops, host network quarantine.", color: "text-cyan-400 border-cyan-500/30" },
              { step: "05", name: "PREVENTION", desc: "Audit trail logging, CIS benchmark remediation, baseline security score restored.", color: "text-emerald-400 border-emerald-500/30" }
            ].map((item, idx) => (
              <div key={idx} className={`p-5 rounded-xl border bg-slate-900/50 backdrop-blur flex flex-col justify-between ${item.color}`}>
                <div>
                  <span className="text-xs font-mono font-bold opacity-60">PHASE {item.step}</span>
                  <h3 className="text-lg font-bold text-white mt-1 mb-2">{item.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
                <div className="pt-4 flex items-center text-xs font-mono opacity-70">
                  <span>Verified Ops</span>
                  <ChevronRight className="w-3 h-3 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section id="capabilities" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs uppercase font-mono text-indigo-400 tracking-wider">Enterprise Modules</span>
            <h2 className="text-3xl font-bold text-white tracking-tight">Full-Spectrum Cloud SecOps Capabilities</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Every major module backed by real database records, deterministic risk calculations, and live containment controls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Activity,
                title: "Command Center Dashboard",
                desc: "Live aggregated risk score, severity distributions, real-time threat timelines, and active incident queue."
              },
              {
                icon: Lock,
                title: "IAM & Identity Profiler",
                desc: "Heuristic user risk scoring, impossible travel velocity detection, dormant account awakening, and token revocation."
              },
              {
                icon: Server,
                title: "Cloud Resource Inventory",
                desc: "Real-time visibility over virtual machines, storage buckets, relational databases, containers, and API gateways."
              },
              {
                icon: ShieldAlert,
                title: "Proactive Alert Engine",
                desc: "Pre-incident rule triggering detecting credential stuffing, unauthorized policy edits, and abnormal data egress."
              },
              {
                icon: Network,
                title: "Traffic & Anomaly Visualizer",
                desc: "Real-time network flow telemetry, SYN flood flags, suspicious subnet tracking, and 1-click firewall IP blocking."
              },
              {
                icon: Zap,
                title: "Incident Response Room",
                desc: "End-to-end incident management: containment buttons, analyst investigation timeline, notes, and resolution audit."
              },
              {
                icon: Cpu,
                title: "Simulated Threat Sandbox",
                desc: "Safe heuristic file scanner calculating SHA-256 hashes, YARA signature matches, and behavior threat classifications."
              },
              {
                icon: Layers,
                title: "Security Relationship Graph",
                desc: "Interactive visual node-link topology linking Users -> Roles -> APIs -> Resources -> Events -> Threats -> Incidents."
              },
              {
                icon: CheckCircle2,
                title: "Cloud Protection & CIS Posture",
                desc: "Continuous CIS Benchmark v1.4 compliance evaluation with 1-click automated security remediations."
              }
            ].map((cap, i) => {
              const Icon = cap.icon;
              return (
                <div key={i} className="p-6 rounded-xl border border-slate-800 bg-[#0c1222]/70 hover:border-sky-500/50 transition-all hover:-translate-y-1">
                  <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-4 text-sky-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{cap.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{cap.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* System Architecture */}
      <section id="architecture" className="relative z-10 py-20 border-t border-slate-800 bg-[#070b16] px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs uppercase font-mono text-emerald-400 tracking-wider">Engineering Architecture</span>
            <h2 className="text-3xl font-bold text-white tracking-tight">Enterprise Production Stack</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Built with Next.js 14, TypeScript, Tailwind CSS, FastAPI, and SQLAlchemy relational storage.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 font-mono text-xs text-slate-300 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-sky-400 font-bold">COMPONENT</span>
              <span className="text-slate-400 font-bold">IMPLEMENTATION DETAILS</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/40">
              <span className="text-white">Frontend Web Client</span>
              <span className="text-slate-400">Next.js 14 (App Router) + TypeScript + Tailwind CSS + Lucide Icons + Recharts</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/40">
              <span className="text-white">Backend REST API</span>
              <span className="text-slate-400">FastAPI (Python 3.11) + Pydantic v2 + JWT Authentication + RBAC</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/40">
              <span className="text-white">Database & Persistence</span>
              <span className="text-slate-400">SQLAlchemy Relational ORM (Zero-setup SQLite WAL mode / PostgreSQL ready)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/40">
              <span className="text-white">Detection & Risk Engine</span>
              <span className="text-slate-400">Explainable Multi-factor Risk Scoring (Identity + Threat + Network + Resource)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-white">Simulation Engine</span>
              <span className="text-slate-400">Deterministic Multi-Step Attack Scenarios with Instant Baseline Reset</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <footer className="relative z-10 py-16 border-t border-slate-800 bg-[#04060d] text-center px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-extrabold text-white">Ready for Technical Judging?</h2>
          <p className="text-slate-400 text-sm">
            Launch the interactive command center or trigger the 3-minute guided presentation scenario.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <Link 
              href="/dashboard" 
              className="px-6 py-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm shadow-lg shadow-sky-500/20"
            >
              Open Command Center
            </Link>
            <Link 
              href="/dashboard/demo" 
              className="px-6 py-3 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300 font-bold text-sm hover:bg-amber-500/20"
            >
              Open Judges Demo Mode
            </Link>
          </div>
          <div className="pt-8 text-xs text-slate-400 font-mono">
            CloudSentinel AI • Hackathon / University Technical Competition Submission • 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
