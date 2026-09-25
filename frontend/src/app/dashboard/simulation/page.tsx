"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Flame, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Server, 
  Users, 
  Radio, 
  Clock, 
  ShieldAlert 
} from "lucide-react";
import { api } from "@/lib/api";

export default function SimulationPage() {
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string>("credential_abuse");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [lastResult, setLastResult] = useState<any>(null);
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const scs = await api.getSimulationScenarios();
        setScenarios(scs);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  const handleStep = async (stepNum: number) => {
    setExecuting(true);
    try {
      const res = await api.runSimulationStep(selectedScenario, stepNum);
      setLastResult(res);
      setCurrentStep(stepNum);
    } catch (e) {
      console.error(e);
    } finally {
      setExecuting(false);
    }
  };

  const handleReset = async () => {
    setExecuting(true);
    try {
      const res = await api.resetSimulation();
      setLastResult({ message: res.message, status: "CLEAN_BASELINE" });
      setCurrentStep(1);
      alert("Telemetry state restored to clean security baseline.");
    } catch (e) {
      console.error(e);
    } finally {
      setExecuting(false);
    }
  };

  const currentScenarioObj = scenarios.find(s => s.id === selectedScenario) || scenarios[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Flame className="w-6 h-6 text-red-400" />
              Multi-Scenario Threat & Attack Simulator
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30">
              SAFE SANDBOX ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate real adversary behavior inside the application's data model to demonstrate detection, alerting, and containment.
          </p>
        </div>

        <button
          onClick={handleReset}
          disabled={executing}
          className="px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Clean Baseline</span>
        </button>
      </div>

      {/* 3 Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((sc) => (
          <button
            key={sc.id}
            onClick={() => {
              setSelectedScenario(sc.id);
              setCurrentStep(1);
              setLastResult(null);
            }}
            className={`p-5 rounded-2xl border text-left transition-all ${
              selectedScenario === sc.id
                ? "border-red-500 bg-red-950/20 shadow-lg shadow-red-500/10 ring-1 ring-red-500"
                : "border-slate-800 bg-slate-900/40 hover:border-slate-700"
            }`}
          >
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">{sc.category}</span>
            <h3 className="text-sm font-bold text-white mt-1 mb-2">{sc.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{sc.description}</p>
          </button>
        ))}
      </div>

      {/* Interactive Step Execution Stage */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#080d1a] space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase text-red-400 font-bold">Active Scenario Runner</span>
            <h2 className="text-lg font-bold text-white mt-0.5">{currentScenarioObj?.title}</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">Step {currentStep} of 6</span>
        </div>

        {/* Step Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 font-mono text-xs">
          {[
            { num: 1, label: "01. Recon/Sprays" },
            { num: 2, label: "02. Anomaly Auth" },
            { num: 3, label: "03. Alert Trigger" },
            { num: 4, label: "04. P1 Incident" },
            { num: 5, label: "05. Containment" },
            { num: 6, label: "06. Recovery" }
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => handleStep(s.num)}
              disabled={executing}
              className={`p-3 rounded-xl border text-center transition-all ${
                currentStep === s.num
                  ? "border-red-500 bg-red-500 text-white font-bold shadow-md shadow-red-500/20"
                  : currentStep > s.num
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white"
              }`}
            >
              <div>{s.label}</div>
            </button>
          ))}
        </div>

        {/* Real-Time Result Console */}
        {lastResult && (
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-red-400 font-bold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                EXECUTION LOG: {lastResult.title || lastResult.status}
              </span>
              <span className="text-sky-300">{lastResult.risk_impact || "Baseline Normal"}</span>
            </div>
            <p className="text-slate-200 leading-relaxed text-[11px] pt-1">
              {lastResult.message}
            </p>
          </div>
        )}

        <div className="pt-2 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-xs text-sky-400 hover:underline font-mono"
          >
            &larr; View Live Telemetry In Command Center
          </Link>

          <Link
            href="/dashboard/demo"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-bold"
          >
            Launch Judges Demo Mode &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
