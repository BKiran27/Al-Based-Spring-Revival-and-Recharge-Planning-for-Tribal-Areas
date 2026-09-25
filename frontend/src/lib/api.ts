const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("cloudsentinel_token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorText = await res.text();
    let msg = errorText;
    try {
      const parsed = JSON.parse(errorText);
      msg = parsed.detail || parsed.message || errorText;
    } catch {}
    throw new Error(msg || `HTTP Error ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  login: (data: { email: string; password: string }) => 
    request<{ access_token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getMe: () => request<any>("/auth/me"),

  // Dashboard
  getDashboardSummary: () => request<any>("/dashboard/summary"),

  // IAM
  getUsers: (params?: { role?: string; min_risk?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.role) query.append("role", params.role);
    if (params?.min_risk !== undefined) query.append("min_risk", String(params.min_risk));
    if (params?.search) query.append("search", params.search);
    return request<any[]>(`/users?${query.toString()}`);
  },
  getUser: (id: string) => request<any>(`/users/${id}`),
  suspendUser: (id: string) => request<any>(`/users/${id}/suspend`, { method: "POST" }),
  resetUserRisk: (id: string) => request<any>(`/users/${id}/reset-risk`, { method: "POST" }),

  // Resources
  getResources: (params?: { resource_type?: string; provider?: string; risk_level?: string }) => {
    const query = new URLSearchParams();
    if (params?.resource_type) query.append("resource_type", params.resource_type);
    if (params?.provider) query.append("provider", params.provider);
    if (params?.risk_level) query.append("risk_level", params.risk_level);
    return request<any[]>(`/resources?${query.toString()}`);
  },
  getResource: (id: string) => request<any>(`/resources/${id}`),
  containResource: (id: string) => request<any>(`/resources/${id}/contain`, { method: "POST" }),

  // Events
  getEvents: (params?: { event_type?: string; severity?: string; search?: string; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.event_type) query.append("event_type", params.event_type);
    if (params?.severity) query.append("severity", params.severity);
    if (params?.search) query.append("search", params.search);
    if (params?.limit) query.append("limit", String(params.limit));
    return request<any[]>(`/events?${query.toString()}`);
  },

  // Alerts
  getAlerts: (params?: { status?: string; severity?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append("status", params.status);
    if (params?.severity) query.append("severity", params.severity);
    return request<any[]>(`/alerts?${query.toString()}`);
  },
  updateAlertStatus: (id: string, status: string) => 
    request<any>(`/alerts/${id}/status`, {
      method: "POST",
      body: JSON.stringify({ status }),
    }),
  escalateAlert: (id: string) => request<any>(`/alerts/${id}/escalate-to-incident`, { method: "POST" }),

  // Threats & Relationship Graph
  getThreats: (status?: string) => {
    const q = status ? `?status=${status}` : "";
    return request<any[]>(`/threats${q}`);
  },
  getThreatGraph: () => request<{ nodes: any[]; links: any[] }>("/threats/graph"),

  // Incidents
  getIncidents: (params?: { status?: string; severity?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append("status", params.status);
    if (params?.severity) query.append("severity", params.severity);
    return request<any[]>(`/incidents?${query.toString()}`);
  },
  getIncident: (id: string) => request<any>(`/incidents/${id}`),
  performIncidentAction: (id: string, action: { action_type: string; description: string; performed_by?: string }) =>
    request<any>(`/incidents/${id}/actions`, {
      method: "POST",
      body: JSON.stringify(action),
    }),

  // Traffic
  getTrafficHistory: () => request<any[]>("/traffic/history"),
  getTrafficAnomalies: () => request<any[]>("/traffic/anomalies"),
  blockTrafficAnomaly: (id: string) => request<any>(`/traffic/anomalies/${id}/block`, { method: "POST" }),

  // Malware Sandbox
  getMalwareScans: () => request<any[]>("/malware/scans"),
  scanMalware: (data: { file_name: string; sample_content?: string; file_type?: string }) =>
    request<any>("/malware/scan", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Security Posture
  getPostureChecks: () => request<any[]>("/posture/checks"),
  remediatePostureCheck: (id: string) => request<any>(`/posture/remediate/${id}`, { method: "POST" }),

  // Risk Breakdown
  getRiskBreakdown: () => request<any>("/risk/breakdown"),

  // Audit Logs
  getAuditLogs: (params?: { actor?: string; action?: string; search?: string; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.actor) query.append("actor", params.actor);
    if (params?.action) query.append("action", params.action);
    if (params?.search) query.append("search", params.search);
    if (params?.limit) query.append("limit", String(params.limit));
    return request<any[]>(`/audit-logs?${query.toString()}`);
  },

  // Attack Simulation
  getSimulationScenarios: () => request<any[]>("/simulation/scenarios"),
  runSimulationStep: (scenario_id: string, step: number) =>
    request<any>(`/simulation/run-step?scenario_id=${scenario_id}&step=${step}`, { method: "POST" }),
  resetSimulation: () => request<any>("/simulation/reset", { method: "POST" }),

  // Reports
  getReportSummary: () => request<any>("/reports/summary"),
  getExportUrl: (entity: string) => `${API_BASE}/reports/export-csv?entity=${entity}`,
};
