import { 
  INITIAL_USERS, 
  INITIAL_RESOURCES, 
  INITIAL_ALERTS, 
  INITIAL_THREATS, 
  INITIAL_INCIDENTS, 
  INITIAL_POSTURE 
} from "./demo-data";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

// Client-side Local State Engine for Standalone / GitHub Pages Hosting
function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const item = localStorage.getItem(`cs_${key}`);
  if (!item) {
    localStorage.setItem(`cs_${key}`, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(item);
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T) {
  if (typeof window !== "undefined") {
    localStorage.setItem(`cs_${key}`, JSON.stringify(data));
  }
}

export const api = {
  // Auth
  login: async (data: { email: string; password: string }) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch {}
    
    // Client-side fallback for GitHub Pages
    const users = getLocal("users", INITIAL_USERS);
    const user = users.find(u => u.email.toLowerCase() === data.email.toLowerCase()) || users[0];
    return {
      access_token: "mock-jwt-token-gh-pages",
      token_type: "bearer",
      user
    };
  },

  getMe: async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`);
      if (res.ok) return await res.json();
    } catch {}
    return getLocal("users", INITIAL_USERS)[0];
  },

  // Dashboard
  getDashboardSummary: async () => {
    try {
      const res = await fetch(`${API_BASE}/dashboard/summary`);
      if (res.ok) return await res.json();
    } catch {}

    const users = getLocal("users", INITIAL_USERS);
    const resources = getLocal("resources", INITIAL_RESOURCES);
    const alerts = getLocal("alerts", INITIAL_ALERTS);
    const threats = getLocal("threats", INITIAL_THREATS);
    const incidents = getLocal("incidents", INITIAL_INCIDENTS);

    // Calculate explainable score
    const hasCompromised = users.some(u => u.is_compromised);
    const hasTravel = users.some(u => u.travel_anomaly);
    const activeThreats = threats.filter(t => t.status === "ACTIVE").length;

    let totalScore = 18;
    const factors: any[] = [];
    if (hasCompromised) {
      totalScore += 35;
      factors.push({ factor: "Compromised Identities", category: "Identity", points: 35, description: "Active credential stuffing matching Tor Exit Node observed.", severity: "CRITICAL" });
    }
    if (hasTravel) {
      totalScore += 25;
      factors.push({ factor: "Impossible Travel Velocity", category: "Identity", points: 25, description: "Session in Frankfurt initiated 14 minutes after active SF activity.", severity: "HIGH" });
    }
    if (activeThreats > 0) {
      totalScore += activeThreats * 15;
      factors.push({ factor: "Uncontained Threat Vectors", category: "Threats", points: activeThreats * 15, description: `${activeThreats} active lateral attack vectors targeting cloud fleet.`, severity: "HIGH" });
    }
    totalScore = Math.min(totalScore, 100);

    return {
      security_risk_score: totalScore,
      active_threats: activeThreats,
      critical_alerts: alerts.filter(a => a.severity === "CRITICAL" && a.status === "OPEN").length,
      suspicious_users: users.filter(u => u.risk_score >= 35 || u.is_compromised).length,
      monitored_resources: resources.length,
      security_events_count: 124,
      open_incidents: incidents.filter(i => i.status !== "RESOLVED").length,
      protected_assets: resources.filter(r => r.risk_level === "CLEAN" || r.risk_level === "LOW").length,
      severity_distribution: { CRITICAL: 4, HIGH: 6, MEDIUM: 8, LOW: 5, INFO: 2 },
      events_timeline: [
        { time: "02:00", events: 12, anomalies: 0 },
        { time: "04:00", events: 18, anomalies: 1 },
        { time: "06:00", events: 14, anomalies: 0 },
        { time: "08:00", events: 28, anomalies: 2 },
        { time: "10:00", events: 35, anomalies: 1 },
        { time: "12:00", events: 42, anomalies: 4 }
      ],
      top_risky_users: users.slice(0, 5),
      top_affected_resources: resources.slice(0, 5),
      recent_events: [
        { id: "EVT-10001", event_type: "LOGIN", severity: "CRITICAL", actor_user: "alex.chen@cloudsentinel.io", source_ip: "185.220.101.5", location: "Tor Exit Node", target_resource: "SSO Portal", timestamp: new Date().toISOString() },
        { id: "EVT-10002", event_type: "PRIVILEGE_ESCALATION", severity: "CRITICAL", actor_user: "sarah.jenkins@cloudsentinel.io", source_ip: "194.26.29.112", location: "Frankfurt, DE", target_resource: "iam-prod-deployer", timestamp: new Date().toISOString() }
      ],
      risk_breakdown: {
        total_score: totalScore,
        posture_status: totalScore >= 70 ? "CRITICAL" : totalScore >= 35 ? "ELEVATED" : "SECURE",
        identity_risk: hasCompromised ? 35 : 5,
        traffic_risk: 15,
        resource_risk: 18,
        threat_severity_risk: activeThreats * 15,
        posture_risk: 10,
        factors
      }
    };
  },

  // IAM
  getUsers: async (params?: { role?: string; min_risk?: number; search?: string }) => {
    try {
      const q = new URLSearchParams(params as any).toString();
      const res = await fetch(`${API_BASE}/users?${q}`);
      if (res.ok) return await res.json();
    } catch {}

    let users = getLocal("users", INITIAL_USERS);
    if (params?.role && params.role !== "ALL") users = users.filter(u => u.role === params.role);
    if (params?.search) {
      const s = params.search.toLowerCase();
      users = users.filter(u => u.full_name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
    }
    return users;
  },

  getUser: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/users/${id}`);
      if (res.ok) return await res.json();
    } catch {}
    const users = getLocal("users", INITIAL_USERS);
    return users.find(u => u.id === id) || users[0];
  },

  suspendUser: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/users/${id}/suspend`, { method: "POST" });
      if (res.ok) return await res.json();
    } catch {}
    const users = getLocal("users", INITIAL_USERS);
    const updated = users.map(u => u.id === id ? { ...u, status: "SUSPENDED" } : u);
    setLocal("users", updated);
    return { status: "SUCCESS" };
  },

  resetUserRisk: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/users/${id}/reset-risk`, { method: "POST" });
      if (res.ok) return await res.json();
    } catch {}
    const users = getLocal("users", INITIAL_USERS);
    const updated = users.map(u => u.id === id ? { ...u, risk_score: 10, is_compromised: false, travel_anomaly: false, status: "ACTIVE" } : u);
    setLocal("users", updated);
    return { status: "SUCCESS" };
  },

  // Resources
  getResources: async (params?: { resource_type?: string; provider?: string }) => {
    try {
      const q = new URLSearchParams(params as any).toString();
      const res = await fetch(`${API_BASE}/resources?${q}`);
      if (res.ok) return await res.json();
    } catch {}
    let resources = getLocal("resources", INITIAL_RESOURCES);
    if (params?.resource_type && params.resource_type !== "ALL") {
      resources = resources.filter(r => r.resource_type === params.resource_type);
    }
    return resources;
  },

  getResource: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/resources/${id}`);
      if (res.ok) return await res.json();
    } catch {}
    const resources = getLocal("resources", INITIAL_RESOURCES);
    return resources.find(r => r.id === id) || resources[0];
  },

  containResource: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/resources/${id}/contain`, { method: "POST" });
      if (res.ok) return await res.json();
    } catch {}
    const resources = getLocal("resources", INITIAL_RESOURCES);
    let isContained = false;
    const updated = resources.map(r => {
      if (r.id === id) {
        isContained = !r.is_contained;
        return { ...r, is_contained: isContained, status: isContained ? "CONTAINED" : "ONLINE" };
      }
      return r;
    });
    setLocal("resources", updated);
    return { status: "SUCCESS", is_contained: isContained };
  },

  // Events
  getEvents: async (params?: { event_type?: string; severity?: string; search?: string; limit?: number }) => {
    try {
      const q = new URLSearchParams(params as any).toString();
      const res = await fetch(`${API_BASE}/events?${q}`);
      if (res.ok) return await res.json();
    } catch {}
    return [
      { id: "EVT-10001", event_type: "LOGIN", severity: "CRITICAL", actor_user: "alex.chen@cloudsentinel.io", source_ip: "185.220.101.5", location: "Tor Exit Node", target_resource: "SSO Portal", action_taken: "FLAGGED_FOR_AUDIT", timestamp: new Date(Date.now() - 14 * 60000).toISOString() },
      { id: "EVT-10002", event_type: "PRIVILEGE_ESCALATION", severity: "CRITICAL", actor_user: "sarah.jenkins@cloudsentinel.io", source_ip: "194.26.29.112", location: "Frankfurt, DE", target_resource: "iam-prod-deployer", action_taken: "ALERT_GENERATED", timestamp: new Date(Date.now() - 28 * 60000).toISOString() },
      { id: "EVT-10003", event_type: "DATA_ACCESS", severity: "CRITICAL", actor_user: "service.account.ci@cloudsentinel.io", source_ip: "45.142.182.99", location: "Amsterdam, NL", target_resource: "s3-customer-vault-prod", action_taken: "RATE_LIMITED", timestamp: new Date(Date.now() - 42 * 60000).toISOString() },
      { id: "EVT-10004", event_type: "API_CALL", severity: "LOW", actor_user: "admin@cloudsentinel.io", source_ip: "10.0.1.45", location: "San Francisco, US", target_resource: "api-gateway-public", action_taken: "ALLOWED", timestamp: new Date(Date.now() - 60 * 60000).toISOString() },
      { id: "EVT-10005", event_type: "CONFIGURATION_CHANGE", severity: "MEDIUM", actor_user: "operator@cloudsentinel.io", source_ip: "10.0.2.14", location: "London, UK", target_resource: "res-vm-02", action_taken: "LOGGED", timestamp: new Date(Date.now() - 95 * 60000).toISOString() }
    ];
  },

  // Alerts
  getAlerts: async () => {
    try {
      const res = await fetch(`${API_BASE}/alerts`);
      if (res.ok) return await res.json();
    } catch {}
    return getLocal("alerts", INITIAL_ALERTS);
  },

  updateAlertStatus: async (id: string, status: string) => {
    try {
      const res = await fetch(`${API_BASE}/alerts/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) return await res.json();
    } catch {}
    const alerts = getLocal("alerts", INITIAL_ALERTS);
    const updated = alerts.map(a => a.id === id ? { ...a, status } : a);
    setLocal("alerts", updated);
    return { status: "SUCCESS" };
  },

  escalateAlert: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/alerts/${id}/escalate-to-incident`, { method: "POST" });
      if (res.ok) return await res.json();
    } catch {}
    return { status: "SUCCESS", incident_id: "INC-2026-091", message: "Escalated to P1 Incident War Room" };
  },

  // Threats & Relationship Graph
  getThreats: async () => {
    try {
      const res = await fetch(`${API_BASE}/threats`);
      if (res.ok) return await res.json();
    } catch {}
    return getLocal("threats", INITIAL_THREATS);
  },

  getThreatGraph: async () => {
    try {
      const res = await fetch(`${API_BASE}/threats/graph`);
      if (res.ok) return await res.json();
    } catch {}
    return {
      nodes: [
        { id: "usr-alex", name: "alex.chen@cloudsentinel.io", type: "USER", status: "COMPROMISED", risk: 75 },
        { id: "usr-sarah", name: "sarah.jenkins@cloudsentinel.io", type: "USER", status: "RISKY", risk: 45 },
        { id: "role-dev", name: "CloudProductionDeployerRole", type: "ROLE", status: "ELEVATED", risk: 68 },
        { id: "api-sso", name: "OAuth2 / SSO Endpoint", type: "API", status: "ATTACKED", risk: 80 },
        { id: "res-vm-01", name: "prod-api-worker-01", type: "RESOURCE", status: "HIGH_RISK", risk: 72 },
        { id: "res-s3", name: "customer-pii-storage-primary", type: "RESOURCE", status: "CRITICAL", risk: 90 },
        { id: "evt-login", name: "EVT-10001: Geolocation Anomaly", type: "EVENT", status: "ANOMALY", risk: 85 },
        { id: "thr-ato", name: "THR-2026-01: Account Takeover", type: "THREAT", status: "ACTIVE", risk: 96 },
        { id: "inc-001", name: "INC-2026-001: Prod Privilege Escalation", type: "INCIDENT", status: "INVESTIGATING", risk: 95 }
      ],
      links: [
        { source: "usr-alex", target: "api-sso", label: "Authenticates via" },
        { source: "api-sso", target: "evt-login", label: "Generates Event" },
        { source: "evt-login", target: "thr-ato", label: "Triggers Threat" },
        { source: "thr-ato", target: "res-vm-01", label: "Targets Host" },
        { source: "thr-ato", target: "inc-001", label: "Escalated to" }
      ]
    };
  },

  // Incidents
  getIncidents: async () => {
    try {
      const res = await fetch(`${API_BASE}/incidents`);
      if (res.ok) return await res.json();
    } catch {}
    return getLocal("incidents", INITIAL_INCIDENTS);
  },

  getIncident: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/incidents/${id}`);
      if (res.ok) return await res.json();
    } catch {}
    const incidents = getLocal("incidents", INITIAL_INCIDENTS);
    return incidents.find(i => i.id === id) || incidents[0];
  },

  performIncidentAction: async (id: string, action: { action_type: string; description: string; performed_by?: string }) => {
    try {
      const res = await fetch(`${API_BASE}/incidents/${id}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action),
      });
      if (res.ok) return await res.json();
    } catch {}

    const incidents = getLocal("incidents", INITIAL_INCIDENTS);
    const updated = incidents.map(inc => {
      if (inc.id === id) {
        const isResolve = action.action_type === "RESOLVE";
        return {
          ...inc,
          status: isResolve ? "RESOLVED" : "CONTAINED",
          containment_status: isResolve ? "RESOLVED" : "CONTAINED",
          actions: [
            ...inc.actions,
            { id: Date.now(), action_type: action.action_type, description: action.description, performed_by: action.performed_by || "SecOps Analyst", timestamp: new Date().toISOString() }
          ]
        };
      }
      return inc;
    });
    setLocal("incidents", updated);
    return { status: "SUCCESS" };
  },

  // Traffic
  getTrafficHistory: async () => {
    try {
      const res = await fetch(`${API_BASE}/traffic/history`);
      if (res.ok) return await res.json();
    } catch {}
    return [
      { id: 1, timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), requests_per_sec: 450, incoming_mbps: 45.2, outgoing_mbps: 18.4, anomalous_traffic: false },
      { id: 2, timestamp: new Date(Date.now() - 4 * 3600000).toISOString(), requests_per_sec: 680, incoming_mbps: 62.1, outgoing_mbps: 24.8, anomalous_traffic: false },
      { id: 3, timestamp: new Date(Date.now() - 3 * 3600000).toISOString(), requests_per_sec: 1420, incoming_mbps: 110.5, outgoing_mbps: 85.0, anomalous_traffic: true },
      { id: 4, timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), requests_per_sec: 950, incoming_mbps: 88.3, outgoing_mbps: 42.1, anomalous_traffic: false },
      { id: 5, timestamp: new Date(Date.now() - 1 * 3600000).toISOString(), requests_per_sec: 1120, incoming_mbps: 94.0, outgoing_mbps: 51.2, anomalous_traffic: false }
    ];
  },

  getTrafficAnomalies: async () => {
    try {
      const res = await fetch(`${API_BASE}/traffic/anomalies`);
      if (res.ok) return await res.json();
    } catch {}
    return [
      { id: "ANOM-101", source_ip: "185.220.101.5", target_resource: "api-gateway-public", anomaly_type: "BRUTE_FORCE", severity: "HIGH", request_rate: 4200, flag_reason: "150 authentication attempts per second targeting /api/auth/login.", is_blocked: true },
      { id: "ANOM-102", source_ip: "45.142.182.99", target_resource: "s3-customer-vault-prod", anomaly_type: "DATA_BURST", severity: "CRITICAL", request_rate: 8900, flag_reason: "Outbound transfer sustained at 2.4 Gbps to unknown offshore endpoint.", is_blocked: false }
    ];
  },

  blockTrafficAnomaly: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/traffic/anomalies/${id}/block`, { method: "POST" });
      if (res.ok) return await res.json();
    } catch {}
    return { status: "SUCCESS" };
  },

  // Malware Sandbox
  getMalwareScans: async () => {
    try {
      const res = await fetch(`${API_BASE}/malware/scans`);
      if (res.ok) return await res.json();
    } catch {}
    return [
      { id: "SCAN-001", file_name: "aws_ec2_management_agent.sh", file_hash_sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", file_type: "Bash Script", file_size_kb: 14.2, verdict: "SAFE", risk_score: 5, matched_signatures: '["AWS Verified Signature"]', behavioral_indicators: '["Normal System Monitoring", "Standard Cron"]', recommended_action: "Approve binary for deployment fleet.", scan_timestamp: new Date().toISOString() },
      { id: "SCAN-002", file_name: "powershell_reverse_beacon.ps1", file_hash_sha256: "8f3b6c2018a1a9e88b4ef2134517b6a1e9487b41e3451b6972412b1928371928", file_type: "PowerShell", file_size_kb: 24.8, verdict: "MALICIOUS", risk_score: 98, matched_signatures: '["Trojan.PowerShell.ReverseTCP", "YARA_AMSI_BYPASS"]', behavioral_indicators: '["Base64 Payload", "AMSI Memory Patching"]', recommended_action: "Quarantine file and isolate invoking machine.", scan_timestamp: new Date().toISOString() }
    ];
  },

  scanMalware: async (data: { file_name: string; sample_content?: string; file_type?: string }) => {
    try {
      const res = await fetch(`${API_BASE}/malware/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch {}

    const isMal = data.file_name.toLowerCase().includes("reverse") || data.file_name.toLowerCase().includes("mimikatz") || data.file_name.toLowerCase().includes("malware");
    return {
      id: `SCAN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      file_name: data.file_name,
      file_hash_sha256: "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
      file_type: data.file_type || "Executable",
      file_size_kb: 24.5,
      verdict: isMal ? "MALICIOUS" : "SAFE",
      risk_score: isMal ? 96 : 8,
      matched_signatures: isMal ? '["YARA.GenericThreatBeacon", "Signature.Trojan"]' : '["Verified Clean"]',
      behavioral_indicators: isMal ? '["Outbound socket beaconing", "Memory injection"]' : '["Standard system calls"]',
      recommended_action: isMal ? "Immediate EDR quarantine" : "Permitted to run",
      scan_timestamp: new Date().toISOString()
    };
  },

  // Security Posture
  getPostureChecks: async () => {
    try {
      const res = await fetch(`${API_BASE}/posture/checks`);
      if (res.ok) return await res.json();
    } catch {}
    return getLocal("posture", INITIAL_POSTURE);
  },

  remediatePostureCheck: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/posture/remediate/${id}`, { method: "POST" });
      if (res.ok) return await res.json();
    } catch {}
    const checks = getLocal("posture", INITIAL_POSTURE);
    const updated = checks.map(c => c.id === id ? { ...c, status: "PASSED" } : c);
    setLocal("posture", updated);
    return { status: "SUCCESS" };
  },

  // Risk Breakdown
  getRiskBreakdown: async () => {
    const summary = await api.getDashboardSummary();
    return summary.risk_breakdown;
  },

  // Audit Logs
  getAuditLogs: async (params?: { actor?: string; action?: string; search?: string; limit?: number }) => {
    try {
      const q = new URLSearchParams(params as any).toString();
      const res = await fetch(`${API_BASE}/audit-logs?${q}`);
      if (res.ok) return await res.json();
    } catch {}
    return [
      { id: "AUD-101", timestamp: new Date(Date.now() - 5 * 60000).toISOString(), actor: "Marcus Reed", action: "CONTAIN_HOST", target: "res-vm-01", status: "SUCCESS", details: "Attached quarantine security group." },
      { id: "AUD-102", timestamp: new Date(Date.now() - 15 * 60000).toISOString(), actor: "CloudSentinel AI", action: "PROACTIVE_ALERT_DISPATCH", target: "alex.chen@cloudsentinel.io", status: "SUCCESS", details: "Rule RULE-IAM-004 triggered." },
      { id: "AUD-103", timestamp: new Date(Date.now() - 25 * 60000).toISOString(), actor: "Sarah Vance", action: "USER_SUSPENDED", target: "alex.chen@cloudsentinel.io", status: "SUCCESS", details: "Revoked active JWT tokens." }
    ];
  },

  // Attack Simulation Engine
  getSimulationScenarios: async () => {
    return [
      {
        id: "credential_abuse",
        title: "Scenario 1: Credential Abuse & Impossible Travel",
        category: "Identity Threat",
        description: "Simulates credential spray, impossible travel geolocation anomaly, proactive alerting, automated incident response, and credential quarantine."
      },
      {
        id: "privilege_escalation",
        title: "Scenario 2: Privilege Escalation & IAM Backdoor",
        category: "Privilege Abuse",
        description: "Simulates an attacker abusing a developer API key to escalate privileges to Cloud SuperAdmin, triggering policy violation detection and IAM containment."
      },
      {
        id: "data_exfiltration",
        title: "Scenario 3: S3 Storage Enumeration & Data Exfiltration",
        category: "Data Leakage / Exfiltration",
        description: "Detects high-throughput anomalous outbound data transfer from production financial storage bucket, triggers perimeter IP blocking and bucket lockdown."
      }
    ];
  },

  runSimulationStep: async (scenario_id: string, step: number) => {
    try {
      const res = await fetch(`${API_BASE}/simulation/run-step?scenario_id=${scenario_id}&step=${step}`, { method: "POST" });
      if (res.ok) return await res.json();
    } catch {}

    const users = getLocal("users", INITIAL_USERS);
    if (step <= 2) {
      const updated = users.map(u => u.email === "alex.chen@cloudsentinel.io" ? { ...u, is_compromised: true, travel_anomaly: true, risk_score: 75 } : u);
      setLocal("users", updated);
      return { step, title: "Impossible Travel Velocity Anomaly", status: "ALERTED", message: "Impossible travel flagged for alex.chen@cloudsentinel.io (Frankfurt session 14m after SF session).", risk_impact: "+35 Risk Score" };
    } else if (step <= 4) {
      return { step, title: "Threat Correlated & P1 Incident Created", status: "INCIDENT_OPEN", message: "Threat Engine correlated ATO (Confidence: 98%). Incident INC-2026-091 created.", risk_impact: "Incident Room Activated" };
    } else {
      const updated = users.map(u => u.email === "alex.chen@cloudsentinel.io" ? { ...u, is_compromised: false, travel_anomaly: false, status: "ACTIVE", risk_score: 12 } : u);
      setLocal("users", updated);
      return { step, title: "Containment Playbook Executed & Resolved", status: "RESOLVED", message: "User suspended, active JWT tokens revoked, host quarantined. Risk score restored to baseline.", risk_impact: "Risk Score: 18 (SECURE)" };
    }
  },

  resetSimulation: async () => {
    try {
      const res = await fetch(`${API_BASE}/simulation/reset`, { method: "POST" });
      if (res.ok) return await res.json();
    } catch {}
    setLocal("users", INITIAL_USERS);
    setLocal("resources", INITIAL_RESOURCES);
    setLocal("alerts", INITIAL_ALERTS);
    setLocal("threats", INITIAL_THREATS);
    setLocal("incidents", INITIAL_INCIDENTS);
    return { status: "SUCCESS", message: "CloudSentinel telemetry reset to pristine baseline security state." };
  },

  // Reports
  getReportSummary: async () => {
    try {
      const res = await fetch(`${API_BASE}/reports/summary`);
      if (res.ok) return await res.json();
    } catch {}
    return {
      generated_at: new Date().toISOString(),
      report_id: "REP-2026-CISO-01",
      organization: "Enterprise Cloud Fleet",
      executive_summary: "CloudSentinel SecOps platform comprehensive audit & risk assessment.",
      risk_score: 18,
      posture_status: "SECURE",
      total_monitored_resources: 20,
      total_active_threats: 4,
      total_open_incidents: 2,
      cis_benchmark_compliance: "82%",
      key_risk_drivers: [
        "Uncontained High-Risk Cloud Assets (res-vm-01)",
        "Compromised Identities (alex.chen@cloudsentinel.io)",
        "Unencrypted Critical Storage (s3-customer-vault-prod)"
      ]
    };
  },

  getExportUrl: (entity: string) => `${API_BASE}/reports/export-csv?entity=${entity}`,
};
