"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  Server, 
  ArrowLeft, 
  ShieldAlert, 
  Lock, 
  Globe, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import { api } from "@/lib/api";
import { getSeverityBadge, getStatusBadge, formatDate } from "@/lib/utils";

export default function ResourceDetailView({ id: propId }: { id?: string }) {
  const params = useParams();
  const id = propId || (params?.id as string);
  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadResource = async () => {
    try {
      const data = await api.getResource(id);
      setResource(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadResource();
    }
  }, [id]);

  if (loading || !resource) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-xs font-mono text-slate-400">
        Loading Cloud Resource Configuration...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/resources"
            className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-sky-400 font-bold">{resource.id}</span>
              <span className={`px-2 py-0.2 rounded text-[10px] font-mono border ${getStatusBadge(resource.status)}`}>
                {resource.status}
              </span>
              <span className={`px-2 py-0.2 rounded text-[10px] font-mono border ${getSeverityBadge(resource.risk_level)}`}>
                {resource.risk_level}
              </span>
            </div>
            <h1 className="text-xl font-bold text-white mt-0.5">{resource.name}</h1>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs font-mono text-slate-400">SECURITY POSTURE SCORE:</div>
          <div className={`text-2xl font-black font-mono ${resource.security_score >= 80 ? "text-emerald-400" : "text-amber-400"}`}>
            {resource.security_score} <span className="text-xs font-normal text-slate-500">/ 100</span>
          </div>
        </div>
      </div>

      {/* Metadata Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Cloud Infrastructure</span>
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span className="text-slate-400">Provider:</span>
            <span className="text-white font-bold">{resource.provider}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span className="text-slate-400">Resource Type:</span>
            <span className="text-sky-300 font-bold">{resource.resource_type}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span className="text-slate-400">Region:</span>
            <span className="text-slate-200">{resource.region}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">Owner:</span>
            <span className="text-slate-200">{resource.owner}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Perimeter & Encryption</span>
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span className="text-slate-400">Public Ingress:</span>
            <span className={resource.public_access ? "text-red-400 font-bold" : "text-emerald-400"}>
              {resource.public_access ? "0.0.0.0/0 (EXPOSED)" : "VPC RESTRICTED"}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span className="text-slate-400">At-Rest Encryption:</span>
            <span className={resource.encryption_enabled ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
              {resource.encryption_enabled ? "AWS KMS / AES-256" : "NOT ENCRYPTED"}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span className="text-slate-400">Network Containment:</span>
            <span className={resource.is_contained ? "text-cyan-400 font-bold" : "text-slate-300"}>
              {resource.is_contained ? "ISOLATED" : "CONNECTED"}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">Last Telemetry Ping:</span>
            <span className="text-slate-300">{formatDate(resource.last_activity)}</span>
          </div>
        </div>
      </div>

      {/* Raw Configuration Inspection */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur space-y-3">
        <h3 className="text-xs font-mono uppercase text-slate-400 font-bold">
          Cloud Configuration JSON Snapshot
        </h3>
        <pre className="p-4 rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs text-sky-300 overflow-x-auto">
          {JSON.stringify(resource, null, 2)}
        </pre>
      </div>
    </div>
  );
}
