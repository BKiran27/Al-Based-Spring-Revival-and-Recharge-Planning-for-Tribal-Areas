"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldAlert, 
  Activity, 
  AlertTriangle, 
  Flame, 
  Zap, 
  FileText, 
  Network, 
  Users, 
  Server, 
  ShieldCheck, 
  Bug, 
  PieChart, 
  FileCode, 
  Settings, 
  Layers, 
  Award,
  LogOut,
  PlayCircle
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: Activity },
  { label: "Threats & Graph", href: "/dashboard/threats", icon: Flame },
  { label: "Proactive Alerts", href: "/dashboard/alerts", icon: AlertTriangle },
  { label: "Incident Response", href: "/dashboard/incidents", icon: Zap },
  { label: "Security Events", href: "/dashboard/events", icon: FileText },
  { label: "Traffic Monitor", href: "/dashboard/traffic", icon: Network },
  { label: "IAM & Users", href: "/dashboard/iam", icon: Users },
  { label: "Cloud Resources", href: "/dashboard/resources", icon: Server },
  { label: "Protection Posture", href: "/dashboard/protection", icon: ShieldCheck },
  { label: "Malware Sandbox", href: "/dashboard/malware", icon: Bug },
  { label: "Risk Analytics", href: "/dashboard/risk", icon: PieChart },
  { label: "Audit Logs", href: "/dashboard/audit", icon: FileCode },
  { label: "Reports & Dossier", href: "/dashboard/reports", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-[#070b16] flex flex-col justify-between h-screen sticky top-0 shrink-0 z-30 select-none">
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-800/80">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-500/20">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              Cloud<span className="text-sky-400">Sentinel</span>
              <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">Ops</span>
            </span>
          </div>
        </div>

        {/* Competition Action Buttons */}
        <div className="p-3 space-y-2 border-b border-slate-800/60 bg-slate-900/30">
          <Link
            href="/dashboard/demo"
            className={cn(
              "w-full px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-all shadow-sm",
              pathname === "/dashboard/demo"
                ? "bg-amber-500 text-slate-950 shadow-amber-500/20"
                : "border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
            )}
          >
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="flex flex-col text-left">
              <span className="leading-tight">Judges Demo Mode</span>
              <span className="text-[10px] font-normal opacity-80">3-Min Guided Flow</span>
            </div>
          </Link>

          <Link
            href="/dashboard/simulation"
            className={cn(
              "w-full px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-all shadow-sm",
              pathname === "/dashboard/simulation"
                ? "bg-red-500 text-white shadow-red-500/20"
                : "border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20"
            )}
          >
            <PlayCircle className="w-4 h-4 text-red-400 shrink-0" />
            <div className="flex flex-col text-left">
              <span className="leading-tight">Attack Simulation</span>
              <span className="text-[10px] font-normal opacity-80">Live Scenario Runner</span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-0.5 overflow-y-auto max-h-[calc(100vh-270px)]">
          <div className="px-2 pb-1.5 pt-1 text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
            SecOps Command
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  isActive
                    ? "bg-sky-500/15 text-sky-300 border border-sky-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-sky-400" : "text-slate-400")} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="px-2 pb-1.5 pt-3 text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
            System & Reference
          </div>
          <Link
            href="/dashboard/architecture"
            className={cn(
              "flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
              pathname === "/dashboard/architecture"
                ? "bg-sky-500/15 text-sky-300 border border-sky-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            )}
          >
            <Layers className="w-4 h-4" />
            <span>Architecture</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
              pathname === "/dashboard/settings"
                ? "bg-sky-500/15 text-sky-300 border border-sky-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            )}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
        </nav>
      </div>

      {/* User Session Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-sky-400 shrink-0">
              {user?.full_name?.charAt(0) || "U"}
            </div>
            <div className="truncate text-left">
              <div className="text-xs font-bold text-white truncate">{user?.full_name || "Analyst"}</div>
              <div className="text-[10px] text-slate-400 font-mono truncate">{user?.role || "ADMIN"}</div>
            </div>
          </div>
          <button 
            onClick={logout}
            title="Log Out"
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
