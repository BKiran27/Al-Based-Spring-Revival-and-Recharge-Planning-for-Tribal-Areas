"use client";

import React, { useEffect, useState } from "react";
import { 
  Network, 
  ArrowDownRight, 
  ArrowUpRight, 
  AlertTriangle, 
  ShieldCheck, 
  Lock, 
  Activity, 
  Globe, 
  RefreshCw,
  Search,
  Filter
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar 
} from "recharts";
import { api } from "@/lib/api";
import { getSeverityBadge, formatDate } from "@/lib/utils";

export default function TrafficPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [selectedAnomaly, setSelectedAnomaly] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [hist, anom] = await Promise.all([
        api.getTrafficHistory(),
        api.getTrafficAnomalies()
      ]);
      setHistory(hist);
      setAnomalies(anom);
      if (anom.length > 0 && !selectedAnomaly) {
        setSelectedAnomaly(anom[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBlockIp = async (id: string) => {
    try {
      await api.blockTrafficAnomaly(id);
      await loadData();
      if (selectedAnomaly?.id === id) {
        setSelectedAnomaly((prev: any) => ({ ...prev, is_blocked: true }));
      }
      alert(`Firewall rule deployed: IP has been blocked at cloud edge.`);
    } catch (e) {
      console.error(e);
    }
  };

  const chartData = history.map((h) => ({
    time: new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    inbound: h.incoming_mbps,
    outbound: h.outgoing_mbps,
    reqSec: h.requests_per_sec,
    isAnomaly: h.anomalous_traffic
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Network className="w-6 h-6 text-sky-400" />
              Cloud Network & Perimeter Traffic Visualizer
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
              VPC FLOW TELEMETRY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time ingress/egress analysis, volumetric DDoS detection, and automated edge firewall blocking.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>FIREWALL ACLS: ACTIVE</span>
        </div>
      </div>

      {/* Traffic Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur">
          <div className="text-[10px] uppercase font-mono text-slate-400">Total Throughput In</div>
          <div className="text-2xl font-bold font-mono text-sky-400 mt-1">112.4 <span className="text-xs text-slate-500 font-normal">MB/s</span></div>
          <div className="text-[10px] text-slate-400 mt-1">8,420 pkts/sec</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur">
          <div className="text-[10px] uppercase font-mono text-slate-400">Total Throughput Out</div>
          <div className="text-2xl font-bold font-mono text-indigo-400 mt-1">68.2 <span className="text-xs text-slate-500 font-normal">MB/s</span></div>
          <div className="text-[10px] text-slate-400 mt-1">Nominal baseline</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur">
          <div className="text-[10px] uppercase font-mono text-slate-400">Active Sockets</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">1,940</div>
          <div className="text-[10px] text-slate-400 mt-1">Global load balancer</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur">
          <div className="text-[10px] uppercase font-mono text-slate-400">Active Anomalies</div>
          <div className="text-2xl font-bold font-mono text-red-400 mt-1">{anomalies.filter(a => !a.is_blocked).length}</div>
          <div className="text-[10px] text-slate-400 mt-1">Unmitigated Streams</div>
        </div>
      </div>

      {/* Live Chart: Throughput (MB/s) */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-400" />
              24-Hour Bandwidth Ingress & Egress (MB/s)
            </h2>
            <p className="text-[11px] text-slate-400">Continuous network socket analysis with automatic anomaly demarcation</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-sky-400">
              <span className="w-2.5 h-2.5 rounded bg-sky-500/80" /> Ingress
            </span>
            <span className="flex items-center gap-1.5 text-indigo-400">
              <span className="w-2.5 h-2.5 rounded bg-indigo-500/80" /> Egress
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#475569" fontSize={11} tickLine={false} />
              <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
              />
              <Area type="monotone" dataKey="inbound" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorIn)" />
              <Area type="monotone" dataKey="outbound" stroke="#6366f1" fillOpacity={1} fill="url(#colorOut)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Anomalies Table & Investigation Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Anomalies List */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            Active Network Anomalies & Suspicious Streams
          </h2>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] bg-slate-900/80">
                  <th className="py-3 px-4">Anomaly ID</th>
                  <th className="py-3 px-4">Source IP</th>
                  <th className="py-3 px-4">Target Resource</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Rate</th>
                  <th className="py-3 px-4">State</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {anomalies.map((an) => (
                  <tr 
                    key={an.id}
                    onClick={() => setSelectedAnomaly(an)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 text-sky-400 font-bold">{an.id}</td>
                    <td className="py-3 px-4 text-white font-bold">{an.source_ip}</td>
                    <td className="py-3 px-4 text-indigo-300">{an.target_resource}</td>
                    <td className="py-3 px-4 text-amber-400">{an.anomaly_type}</td>
                    <td className="py-3 px-4 text-slate-300">{an.request_rate} rps</td>
                    <td className="py-3 px-4">
                      {an.is_blocked ? (
                        <span className="text-emerald-400 font-bold">BLOCKED</span>
                      ) : (
                        <span className="text-red-400 font-bold animate-pulse">ACTIVE</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {!an.is_blocked ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBlockIp(an.id);
                          }}
                          className="px-2.5 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[10px] font-mono border border-red-500/30"
                        >
                          Block IP
                        </button>
                      ) : (
                        <span className="text-slate-500 text-[10px]">Mitigated</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Anomaly Forensics Panel */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-[#080d1a] space-y-4 flex flex-col justify-between">
          {selectedAnomaly ? (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="font-mono text-xs text-sky-400 font-bold">{selectedAnomaly.id}</span>
                <h3 className="text-base font-bold text-white mt-1">{selectedAnomaly.anomaly_type}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Origin: {selectedAnomaly.source_ip}</p>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/60">
                  <span className="text-slate-400 block text-[10px] uppercase">Reason Flagged</span>
                  <span className="text-slate-200 block mt-1 leading-relaxed text-[11px]">{selectedAnomaly.flag_reason}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Peak Request Rate:</span>
                  <span className="text-red-400 font-bold">{selectedAnomaly.request_rate} req/s</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Destination Resource:</span>
                  <span className="text-white font-bold">{selectedAnomaly.target_resource}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Firewall Perimeter Status:</span>
                  <span className={selectedAnomaly.is_blocked ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                    {selectedAnomaly.is_blocked ? "BLOCKED AT EDGE" : "TRAFFIC PASSING"}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                {!selectedAnomaly.is_blocked ? (
                  <button
                    onClick={() => handleBlockIp(selectedAnomaly.id)}
                    className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-mono text-xs font-bold shadow-md shadow-red-500/20"
                  >
                    Deploy Immediate Edge Firewall Block
                  </button>
                ) : (
                  <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-center font-mono text-xs text-emerald-400 font-bold">
                    ✓ IP 45.142.182.99 Quarantined in Security Gateway
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 font-mono text-center py-12">
              Select an anomaly stream on the left to inspect socket forensics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
