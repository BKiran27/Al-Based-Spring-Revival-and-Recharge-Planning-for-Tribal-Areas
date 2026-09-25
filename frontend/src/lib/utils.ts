import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSeverityBadge(severity: string) {
  switch (severity?.toUpperCase()) {
    case "CRITICAL":
      return "bg-red-500/10 text-red-400 border-red-500/30";
    case "HIGH":
      return "bg-orange-500/10 text-orange-400 border-orange-500/30";
    case "MEDIUM":
      return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    case "LOW":
      return "bg-sky-500/10 text-sky-400 border-sky-500/30";
    case "INFO":
    default:
      return "bg-slate-500/10 text-slate-400 border-slate-500/30";
  }
}

export function getStatusBadge(status: string) {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
    case "OPEN":
    case "UNCONTAINED":
      return "bg-red-500/10 text-red-400 border-red-500/30";
    case "INVESTIGATING":
    case "ACKNOWLEDGED":
      return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    case "CONTAINED":
      return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
    case "RESOLVED":
    case "PASSED":
    case "SAFE":
    case "ONLINE":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    case "SUSPENDED":
    case "OFFLINE":
    default:
      return "bg-slate-500/10 text-slate-400 border-slate-500/30";
  }
}

export function formatDate(dateStr?: string | null) {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + 
           ' (' + d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ')';
  } catch {
    return dateStr;
  }
}
