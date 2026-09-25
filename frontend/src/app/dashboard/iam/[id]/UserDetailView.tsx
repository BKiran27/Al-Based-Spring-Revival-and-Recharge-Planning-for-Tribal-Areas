"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  Users, 
  ArrowLeft, 
  ShieldAlert, 
  Lock, 
  Globe, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import { api } from "@/lib/api";
import { getStatusBadge, formatDate } from "@/lib/utils";

export default function UserDetailView({ id: propId }: { id?: string }) {
  const params = useParams();
  const id = propId || (params?.id as string);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const data = await api.getUser(id);
      setUser(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadUser();
    }
  }, [id]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-xs font-mono text-slate-400">
        Loading IAM User Intelligence...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/iam"
            className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-sky-400 font-bold">{user.id}</span>
              <span className={`px-2 py-0.2 rounded text-[10px] font-mono border ${getStatusBadge(user.status)}`}>
                {user.status}
              </span>
            </div>
            <h1 className="text-xl font-bold text-white mt-0.5">{user.full_name}</h1>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs font-mono text-slate-400">CALCULATED USER RISK:</div>
          <div className={`text-2xl font-black font-mono ${user.risk_score >= 40 ? "text-red-400" : "text-emerald-400"}`}>
            {user.risk_score} <span className="text-xs font-normal text-slate-500">/ 100</span>
          </div>
        </div>
      </div>

      {/* Identity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Organizational Identity</span>
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span className="text-slate-400">Email:</span>
            <span className="text-white font-bold">{user.email}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span className="text-slate-400">Department:</span>
            <span className="text-slate-200">{user.department}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span className="text-slate-400">RBAC Role:</span>
            <span className="text-sky-300 font-bold">{user.role}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">Privilege Level:</span>
            <span className="text-amber-400 font-bold">{user.privilege_level}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Authentication & Security Posture</span>
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span className="text-slate-400">MFA Enforced:</span>
            <span className="text-emerald-400 font-bold">{user.mfa_enabled ? "ENFORCED (FIDO2)" : "DISABLED"}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span className="text-slate-400">Failed Consecutive Logins:</span>
            <span className={user.failed_login_attempts >= 3 ? "text-red-400 font-bold" : "text-slate-300"}>
              {user.failed_login_attempts} attempts
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span className="text-slate-400">Impossible Travel Anomaly:</span>
            <span className={user.travel_anomaly ? "text-red-400 font-bold" : "text-emerald-400"}>
              {user.travel_anomaly ? "TRIGGERED (Frankfurt / SF)" : "CLEAN"}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">Active Geolocation:</span>
            <span className="text-slate-200">{user.simulated_location}</span>
          </div>
        </div>
      </div>

      {/* Forensic Rationale */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur space-y-3">
        <h3 className="text-xs font-mono uppercase text-slate-400 font-bold">
          Behavioral Risk Model Breakdown
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          User risk score is updated in real time based on session geolocation delta, consecutive failed password spray velocity, and RBAC policy deviation.
        </p>

        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={async () => {
              await api.resetUserRisk(user.id);
              await loadUser();
              alert("User risk cleared to baseline.");
            }}
            className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200"
          >
            Clear User Risk Penalties
          </button>
        </div>
      </div>
    </div>
  );
}
