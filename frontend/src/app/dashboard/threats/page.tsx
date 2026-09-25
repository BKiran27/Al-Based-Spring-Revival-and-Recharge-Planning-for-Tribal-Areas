"use client";

import React, { useEffect, useState } from "react";
import { 
  Flame, 
  Layers, 
  Search, 
  Filter, 
  ShieldAlert, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle,
  Network,
  Users,
  Server,
  Zap,
  Radio
} from "lucide-react";
import { api } from "@/lib/api";
import { getSeverityBadge, getStatusBadge, formatDate } from "@/lib/utils";

export default function ThreatsPage() {
  const [threats, setThreats] = useState<any[]>([]);
  const [graphData, setGraphData] = useState<{ nodes: any[]; links: any[] } | null>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"table" | "graph">("graph");

  useEffect(() => {
    async function loadData() {
      try {
        const [thList, grList] = await Promise.all([
          api.getThreats(),
          api.getThreatGraph()
        ]);
        setThreats(thList);
        setGraphData(grList);
        if (grList.nodes.length > 0) {
          setSelectedNode(grList.nodes[0]);
        }
      } catch (e) {
        console.error("Threats load error", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredThreats = threats.filter((t) => {
    const matchSev = filterSeverity === "ALL" || t.severity === filterSeverity;
    const matchSearch = !search || 
      t.threat_type.toLowerCase().includes(search.toLowerCase()) ||
      t.affected_asset.toLowerCase().includes(search.toLowerCase()) ||
      (t.affected_user && t.affected_user.toLowerCase().includes(search.toLowerCase()));
    return matchSev && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Flame className="w-6 h-6 text-red-400" />
              Threat Detection & Correlation Engine
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30">
              HEURISTIC + MITRE ATT&CK
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Correlated multi-cloud attack signals, lateral propagation vectors, and relationship topology graph.
          </p>
        </div>

        {/* Tab Toggle: Graph View vs List View */}
        <div className="flex items-center p-1 rounded-xl border border-slate-800 bg-slate-900/80">
          <button
            onClick={() => setActiveTab("graph")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-colors ${
              activeTab === "graph"
                ? "bg-sky-500 text-slate-950 shadow-sm shadow-sky-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Relationship Graph</span>
          </button>
          <button
            onClick={() => setActiveTab("table")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-colors ${
              activeTab === "table"
                ? "bg-sky-500 text-slate-950 shadow-sm shadow-sky-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Threat Records ({threats.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: Visual Security Relationship Graph */}
      {activeTab === "graph" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur text-xs flex flex-wrap items-center justify-between gap-3 font-mono">
            <div className="flex items-center gap-4 text-slate-400">
              <span className="text-white font-bold">NODE LEGEND:</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> USER</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-400" /> ROLE</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> API</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> RESOURCE</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> EVENT</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400" /> THREAT</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> INCIDENT</span>
            </div>
            <span className="text-sky-400">Click any node to inspect blast radius</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Interactive SVG / Graph Canvas */}
            <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-800 bg-[#060a14] relative overflow-hidden min-h-[480px] flex items-center justify-center">
              <div className="absolute inset-0 cyber-grid opacity-40 pointer-events-none" />

              <div className="relative z-10 w-full max-w-xl space-y-4">
                <div className="text-center mb-6">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    ATTACK PROPAGATION TOPOLOGY
                  </span>
                  <p className="text-xs text-slate-400 mt-1">Showing how compromised identity propagated into incident INC-2026-001</p>
                </div>

                {/* Nodes Representation Layout */}
                <div className="grid grid-cols-4 gap-4">
                  {graphData?.nodes.map((node) => {
                    const isSelected = selectedNode?.id === node.id;
                    const nodeColor = 
                      node.type === "USER" ? "border-sky-500 bg-sky-500/10 text-sky-300" :
                      node.type === "ROLE" ? "border-indigo-500 bg-indigo-500/10 text-indigo-300" :
                      node.type === "API" ? "border-cyan-500 bg-cyan-500/10 text-cyan-300" :
                      node.type === "RESOURCE" ? "border-emerald-500 bg-emerald-500/10 text-emerald-300" :
                      node.type === "EVENT" ? "border-amber-500 bg-amber-500/10 text-amber-300" :
                      node.type === "THREAT" ? "border-red-500 bg-red-500/10 text-red-300" :
                      "border-purple-500 bg-purple-500/10 text-purple-300";

                    return (
                      <button
                        key={node.id}
                        onClick={() => setSelectedNode(node)}
                        className={`p-3 rounded-xl border text-left transition-all ${nodeColor} ${
                          isSelected ? "ring-2 ring-white scale-105 shadow-xl" : "hover:scale-[1.02] opacity-85 hover:opacity-100"
                        }`}
                      >
                        <div className="text-[9px] font-mono uppercase font-bold opacity-75">{node.type}</div>
                        <div className="text-xs font-bold truncate mt-0.5 text-white">{node.name}</div>
                        <div className="flex items-center justify-between mt-2 text-[10px] font-mono">
                          <span>{node.status}</span>
                          <span className="font-bold">Risk: {node.risk}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Node Inspector Panel */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-[#080d1a] flex flex-col justify-between space-y-4">
              {selectedNode ? (
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-3">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      {selectedNode.type} INSPECTOR
                    </span>
                    <h3 className="text-base font-bold text-white mt-2">{selectedNode.name}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {selectedNode.id}</p>
                  </div>

                  <div className="space-y-3 text-xs font-mono">
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Current Health/State:</span>
                      <span className="text-white font-bold">{selectedNode.status}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Calculated Entity Risk:</span>
                      <span className="text-red-400 font-bold">{selectedNode.risk} / 100</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Isolation Status:</span>
                      <span className="text-emerald-400 font-bold">Quarantine Ready</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-300 space-y-1">
                    <div className="font-bold text-slate-200">Mitigation Recommendation:</div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Entity is part of active attack chain. Execute containment workflow to isolate blast radius from customer data storage.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 font-mono text-center py-12">
                  Select a node on the left to inspect relationship metadata.
                </div>
              )}

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => alert(`Containment playbook dispatched for ${selectedNode?.name}`)}
                  className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-mono text-xs font-bold shadow-md shadow-red-500/20 transition-colors"
                >
                  Contain Entity In Blast Radius
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Full Threat Records Table */}
      {activeTab === "table" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search threats, vectors, affected assets..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">SEVERITY:</span>
              {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                    filterSeverity === sev
                      ? "bg-slate-700 text-white font-bold"
                      : "text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] bg-slate-900/80">
                  <th className="py-3 px-4">Threat ID</th>
                  <th className="py-3 px-4">Classification & Vector</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Affected Asset / User</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Detected</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {filteredThreats.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-sky-400 font-bold">{t.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-xs">{t.threat_type}</div>
                      <div className="text-[10px] text-slate-400">{t.attack_vector}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${getSeverityBadge(t.severity)}`}>
                        {t.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div 
                            className={`h-full ${t.confidence >= 90 ? "bg-red-400" : "bg-amber-400"}`}
                            style={{ width: `${t.confidence}%` }}
                          />
                        </div>
                        <span>{t.confidence}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-200">{t.affected_asset}</div>
                      {t.affected_user && <div className="text-[10px] text-slate-400">{t.affected_user}</div>}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${getStatusBadge(t.status)}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{formatDate(t.detection_time)}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => alert(`Playbook executed: ${t.recommended_action}`)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 text-[10px] font-mono border border-slate-700"
                      >
                        Playbook
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
