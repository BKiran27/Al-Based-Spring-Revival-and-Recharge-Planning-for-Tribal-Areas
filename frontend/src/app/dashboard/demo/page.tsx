"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Award, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  ChevronRight, 
  Sparkles, 
  ShieldAlert, 
  Users, 
  Server, 
  Activity,
  Terminal,
  Volume2
} from "lucide-react";
import { api } from "@/lib/api";

const DEMO_STEPS = [
  {
    step: 1,
    phase: "NORMAL STATE",
    title: "Step 1: Baseline Security Posture",
    narrative: "Our multi-cloud fleet is operating normally. All CIS Benchmark checks pass, identities are verified, and the Security Risk Score is at a clean baseline of 18/100.",
    judgeScript: "Judges, notice the clean baseline. All microservices and IAM identities are operating within normal parameters. Our Explainable Risk Engine calculates a low baseline score of 18.",
    riskScore: 18,
    status: "SECURE",
    activeIncident: null,
    alertCount: 0,
    actionLabel: "Start Attack Simulation"
  },
  {
    step: 2,
    phase: "ATTACK TRIGGERED",
    title: "Step 2: Adversary Launches Credential Spray",
    narrative: "An external attacker originating from a Tor exit node begins rapid credential stuffing against Staff Engineer Alex Chen's SSO account.",
    judgeScript: "Now, an adversary initiates a distributed credential stuffing attack. Notice how our event ingestion engine immediately flags repeated authentication failures from an unrecognized IP.",
    riskScore: 35,
    status: "MONITORING",
    activeIncident: null,
    alertCount: 1,
    actionLabel: "Advance to Geolocation Anomaly"
  },
  {
    step: 3,
    phase: "SUSPICIOUS ACTIVITY",
    title: "Step 3: Impossible Travel Geolocation Anomaly",
    narrative: "Attacker successfully replays a stolen session cookie in Frankfurt, DE just 14 minutes after Alex Chen's legitimate session in San Francisco.",
    judgeScript: "Notice here: The user authenticates from Frankfurt only 14 minutes after active activity in San Francisco. A flight takes 11 hours. CloudSentinel classifies this as an Impossible Travel Velocity Anomaly.",
    riskScore: 68,
    status: "ELEVATED",
    activeIncident: null,
    alertCount: 2,
    actionLabel: "Trigger Threat Classifier"
  },
  {
    step: 4,
    phase: "DETECTION",
    title: "Step 4: Threat Engine Confirms Account Takeover",
    narrative: "CloudSentinel's Threat Detection Engine correlates the failed logins, stolen cookie, and lateral API calls, confirming an Active Account Takeover with 98% confidence.",
    judgeScript: "Unlike noisy legacy SIEMs, our Threat Engine correlates multi-dimensional signals into high-confidence detections. It confirms Account Takeover with 98% confidence.",
    riskScore: 82,
    status: "CRITICAL_THREAT",
    activeIncident: null,
    alertCount: 3,
    actionLabel: "Dispatch Proactive Alert"
  },
  {
    step: 5,
    phase: "PROACTIVE ALERT",
    title: "Step 5: Proactive Alert Generated Before Exfiltration",
    narrative: "Proactive Alert ALT-SIM-01 is dispatched before the adversary can exfiltrate sensitive data or destroy production infrastructure.",
    judgeScript: "This is our proactive alert engine. Notice that the alert fires BEFORE data exfiltration happens. It provides human-readable evidence and recommended containment actions.",
    riskScore: 88,
    status: "PROACTIVE_ALERT",
    activeIncident: null,
    alertCount: 4,
    actionLabel: "Auto-Instantiate P1 Incident"
  },
  {
    step: 6,
    phase: "INCIDENT CREATION",
    title: "Step 6: P1 Security Incident Automatically Created",
    narrative: "Incident INC-2026-091 ('Account Takeover - Alex Chen') is created and assigned immediately to the SecOps Lead Analyst on-call.",
    judgeScript: "CloudSentinel automatically escalates critical alerts into structured Incident War Rooms, linking the affected user, target host res-vm-01, and MITRE ATT&CK technique.",
    riskScore: 92,
    status: "INCIDENT_OPEN",
    activeIncident: "INC-2026-091",
    alertCount: 4,
    actionLabel: "Open Analyst Investigation"
  },
  {
    step: 7,
    phase: "INVESTIGATION",
    title: "Step 7: SecOps Analyst Investigates Attack Vector",
    narrative: "The security analyst inspects the Visual Relationship Graph, identifying that the compromised account targeted production server res-vm-01.",
    judgeScript: "Our visual relationship graph reveals the attack blast radius: compromised user -> stolen OAuth token -> targeted EC2 cluster node -> customer vault.",
    riskScore: 92,
    status: "INVESTIGATING",
    activeIncident: "INC-2026-091",
    alertCount: 4,
    actionLabel: "Execute 1-Click Containment"
  },
  {
    step: 8,
    phase: "CONTAINMENT",
    title: "Step 8: Automated Containment Playbook Executed",
    narrative: "Analyst clicks 'Contain Threat': User Alex Chen is suspended, active JWT sessions are revoked, and host res-vm-01 is isolated into quarantine security group.",
    judgeScript: "Now we execute containment with a single click. Watch the system instantly terminate active JWT tokens, suspend the user, and quarantine the production VM.",
    riskScore: 30,
    status: "CONTAINED",
    activeIncident: "INC-2026-091",
    alertCount: 1,
    actionLabel: "Observe Risk Score Reduction"
  },
  {
    step: 9,
    phase: "RECOVERY",
    title: "Step 9: Real-Time Risk Score Decreases to Safe Level",
    narrative: "With the active threat vector severed, the Explainable Risk Engine recalculates the posture score, dropping risk from 92 back down to 24.",
    judgeScript: "Notice how the risk score immediately drops from 92 down to 24. Our Explainable Risk Engine shows judges exactly why: active threats removed and credentials quarantined.",
    riskScore: 24,
    status: "RECOVERING",
    activeIncident: "INC-2026-091",
    alertCount: 0,
    actionLabel: "Resolve Incident & Close"
  },
  {
    step: 10,
    phase: "SECURE BASELINE",
    title: "Step 10: Incident Resolved & System Fully Restored",
    narrative: "Incident INC-2026-091 marked RESOLVED. Password rotated with FIDO2 MFA enforcement. Full audit trail logged to immutable storage.",
    judgeScript: "The entire security lifecycle is complete: Problem -> Detection -> Proactive Alert -> Incident -> Containment -> Recovery. The cloud environment is 100% secure.",
    riskScore: 18,
    status: "SECURE",
    activeIncident: "INC-2026-091 (RESOLVED)",
    alertCount: 0,
    actionLabel: "Reset Demo for Next Judge"
  }
];

export default function JudgesDemoMode() {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [executing, setExecuting] = useState(false);
  const currentStep = DEMO_STEPS[currentStepIdx];

  const handleNextStep = async () => {
    if (currentStepIdx < DEMO_STEPS.length - 1) {
      setExecuting(true);
      try {
        // Sync with backend simulation engine
        const backendStep = Math.min(Math.floor((currentStepIdx + 1) / 1.6) + 1, 6);
        await api.runSimulationStep("credential_abuse", backendStep);
      } catch (err) {
        console.error("Simulation step sync", err);
      } finally {
        setExecuting(false);
        setCurrentStepIdx((prev) => prev + 1);
      }
    } else {
      // Step 10: Reset back to step 1
      handleReset();
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  const handleReset = async () => {
    setExecuting(true);
    try {
      await api.resetSimulation();
    } catch (e) {
      console.error(e);
    } finally {
      setExecuting(false);
      setCurrentStepIdx(0);
      setIsPlaying(false);
    }
  };

  // Auto-play timer for competition judging walkthrough
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev < DEMO_STEPS.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-slate-900 to-sky-500/10 backdrop-blur flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-extrabold text-white tracking-tight">Judges Demo Mode</h1>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
              3-Minute Presentation Walkthrough
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            A guided interactive sequence demonstrating the complete cybersecurity lifecycle: 
            <strong className="text-white"> Normal &rarr; Detection &rarr; Alert &rarr; Incident &rarr; Containment &rarr; Secure</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all ${
              isPlaying
                ? "bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse"
                : "bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md shadow-sky-500/20"
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isPlaying ? "Pause Auto-Run" : "Auto-Run (5s per step)"}</span>
          </button>

          <button
            onClick={handleReset}
            disabled={executing}
            className="px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>
        </div>
      </div>

      {/* Progress Stepper Bar (1 - 10) */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
          <span>PROGRESSION: STEP {currentStep.step} OF 10</span>
          <span className="text-amber-400 font-bold uppercase">{currentStep.phase}</span>
        </div>
        <div className="grid grid-cols-10 gap-1.5">
          {DEMO_STEPS.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => setCurrentStepIdx(idx)}
              className={`h-2.5 rounded-full transition-all ${
                idx === currentStepIdx
                  ? "bg-amber-400 shadow-lg shadow-amber-400/50 scale-y-125"
                  : idx < currentStepIdx
                  ? "bg-emerald-500"
                  : "bg-slate-800"
              }`}
              title={s.title}
            />
          ))}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Stage Details & Live Script */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-800 bg-[#090e1c] space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-mono font-bold text-amber-400 tracking-wider uppercase">
                {currentStep.phase}
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">Step {currentStep.step} / 10</span>
          </div>

          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {currentStep.title}
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            {currentStep.narrative}
          </p>

          {/* Judges Script Box (Speaking Points for Competition) */}
          <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20 text-xs space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold font-mono">
              <Volume2 className="w-4 h-4" />
              <span>PRESENTER SPEAKING SCRIPT (FOR JUDGES):</span>
            </div>
            <p className="text-indigo-200/90 italic font-sans leading-relaxed text-[13px]">
              &ldquo;{currentStep.judgeScript}&rdquo;
            </p>
          </div>

          {/* Step Action Controls */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-800">
            <button
              onClick={handlePrevStep}
              disabled={currentStepIdx === 0}
              className="px-4 py-2 rounded-lg border border-slate-800 text-xs font-mono text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
            >
              &larr; Previous Step
            </button>

            <button
              onClick={handleNextStep}
              disabled={executing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-sky-500 hover:from-amber-400 hover:to-sky-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 shadow-lg shadow-sky-500/20 transition-transform hover:scale-[1.02]"
            >
              <span>{currentStep.actionLabel}</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </div>

        {/* Right Live Telemetry Simulator Widget */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#070b16] space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-xs font-mono uppercase text-slate-400 tracking-wider pb-2 border-b border-slate-800">
              Live State Telemetry
            </div>

            {/* Dynamic Risk Gauge */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 text-center space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400">Cloud Risk Score</span>
              <div className={`text-4xl font-black font-mono ${
                currentStep.riskScore >= 70 ? "text-red-400" : currentStep.riskScore >= 35 ? "text-amber-400" : "text-emerald-400"
              }`}>
                {currentStep.riskScore}
                <span className="text-xs font-normal text-slate-400">/100</span>
              </div>
              <div className="text-xs font-mono text-slate-300 font-bold">{currentStep.status}</div>
            </div>

            {/* Targeted Entities */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded bg-slate-900/40 border border-slate-800/80">
                <span className="text-slate-400">Affected User:</span>
                <span className="text-sky-300 font-bold">alex.chen@cloudsentinel.io</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900/40 border border-slate-800/80">
                <span className="text-slate-400">Target Host:</span>
                <span className="text-indigo-300 font-bold">res-vm-01 (Prod EC2)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900/40 border border-slate-800/80">
                <span className="text-slate-400">Active Incident:</span>
                <span className={currentStep.activeIncident ? "text-red-400 font-bold" : "text-slate-500"}>
                  {currentStep.activeIncident || "None (All Clean)"}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-center">
            <Link
              href="/dashboard"
              className="text-xs text-sky-400 hover:underline font-mono"
            >
              Verify in Main Dashboard &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
