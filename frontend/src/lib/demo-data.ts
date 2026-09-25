export interface UserData {
  id: string;
  email: string;
  full_name: string;
  role: string;
  privilege_level: string;
  risk_score: number;
  status: string;
  department: string;
  mfa_enabled: boolean;
  failed_login_attempts: number;
  is_compromised: boolean;
  travel_anomaly: boolean;
  simulated_location: string;
  last_login: string;
}

export interface ResourceData {
  id: string;
  name: string;
  resource_type: string;
  provider: string;
  region: string;
  status: string;
  owner: string;
  risk_level: string;
  security_score: number;
  public_access: boolean;
  encryption_enabled: boolean;
  is_contained: boolean;
  tags: string;
  last_activity: string;
}

export const INITIAL_USERS: UserData[] = [
  { id: "usr-admin-demo", email: "admin@cloudsentinel.io", full_name: "Sarah Vance (Admin)", role: "ADMIN", privilege_level: "SUPERADMIN", risk_score: 10, status: "ACTIVE", department: "Security Operations", mfa_enabled: true, failed_login_attempts: 0, is_compromised: false, travel_anomaly: false, simulated_location: "San Francisco, US", last_login: new Date().toISOString() },
  { id: "usr-analyst-demo", email: "analyst@cloudsentinel.io", full_name: "Marcus Reed (Lead Analyst)", role: "SECURITY_ANALYST", privilege_level: "ELEVATED", risk_score: 12, status: "ACTIVE", department: "SOC Operations", mfa_enabled: true, failed_login_attempts: 0, is_compromised: false, travel_anomaly: false, simulated_location: "San Francisco, US", last_login: new Date().toISOString() },
  { id: "usr-operator-demo", email: "operator@cloudsentinel.io", full_name: "Elena Rostova (DevOps Lead)", role: "CLOUD_OPERATOR", privilege_level: "ELEVATED", risk_score: 18, status: "ACTIVE", department: "Infrastructure", mfa_enabled: true, failed_login_attempts: 0, is_compromised: false, travel_anomaly: false, simulated_location: "London, UK", last_login: new Date().toISOString() },
  { id: "usr-viewer-demo", email: "viewer@cloudsentinel.io", full_name: "Priyah Patel (Executive)", role: "VIEWER", privilege_level: "RESTRICTED", risk_score: 5, status: "ACTIVE", department: "Executive Leadership", mfa_enabled: true, failed_login_attempts: 0, is_compromised: false, travel_anomaly: false, simulated_location: "New York, US", last_login: new Date().toISOString() },
  { id: "usr-alex-chen", email: "alex.chen@cloudsentinel.io", full_name: "Alex Chen (Staff Engineer)", role: "CLOUD_OPERATOR", privilege_level: "STANDARD", risk_score: 45, status: "ACTIVE", department: "Platform Engineering", mfa_enabled: true, failed_login_attempts: 3, is_compromised: false, travel_anomaly: true, simulated_location: "Seattle, US", last_login: new Date().toISOString() },
  { id: "usr-sarah-jenkins", email: "sarah.jenkins@cloudsentinel.io", full_name: "Sarah Jenkins (Senior Developer)", role: "CLOUD_OPERATOR", privilege_level: "STANDARD", risk_score: 38, status: "ACTIVE", department: "Backend Services", mfa_enabled: true, failed_login_attempts: 2, is_compromised: false, travel_anomaly: false, simulated_location: "Austin, US", last_login: new Date().toISOString() },
  { id: "usr-david-ross", email: "david.ross@cloudsentinel.io", full_name: "David Ross (Data Scientist)", role: "VIEWER", privilege_level: "STANDARD", risk_score: 22, status: "ACTIVE", department: "AI & Analytics", mfa_enabled: true, failed_login_attempts: 0, is_compromised: false, travel_anomaly: false, simulated_location: "Boston, US", last_login: new Date().toISOString() },
  { id: "usr-wei-zhang", email: "wei.zhang@cloudsentinel.io", full_name: "Wei Zhang (Kubernetes Architect)", role: "CLOUD_OPERATOR", privilege_level: "ELEVATED", risk_score: 15, status: "ACTIVE", department: "Cloud Architecture", mfa_enabled: true, failed_login_attempts: 0, is_compromised: false, travel_anomaly: false, simulated_location: "Singapore, SG", last_login: new Date().toISOString() },
  { id: "usr-carlos-mendez", email: "carlos.mendez@cloudsentinel.io", full_name: "Carlos Mendez (Frontend Lead)", role: "VIEWER", privilege_level: "STANDARD", risk_score: 10, status: "ACTIVE", department: "UI Engineering", mfa_enabled: true, failed_login_attempts: 0, is_compromised: false, travel_anomaly: false, simulated_location: "Madrid, ES", last_login: new Date().toISOString() },
  { id: "usr-aisha-mansoor", email: "aisha.mansoor@cloudsentinel.io", full_name: "Aisha Al-Mansoor (SecOps Analyst)", role: "SECURITY_ANALYST", privilege_level: "ELEVATED", risk_score: 8, status: "ACTIVE", department: "SOC Operations", mfa_enabled: true, failed_login_attempts: 0, is_compromised: false, travel_anomaly: false, simulated_location: "Dubai, AE", last_login: new Date().toISOString() }
];

export const INITIAL_RESOURCES: ResourceData[] = [
  { id: "res-vm-01", name: "prod-api-cluster-worker-01", resource_type: "VM", provider: "AWS (Simulated)", region: "us-east-1", status: "ONLINE", owner: "Elena Rostova", risk_level: "HIGH", security_score: 72, public_access: true, encryption_enabled: true, is_contained: false, tags: '{"env":"prod"}', last_activity: new Date().toISOString() },
  { id: "res-vm-02", name: "prod-api-cluster-worker-02", resource_type: "VM", provider: "AWS (Simulated)", region: "us-east-1", status: "ONLINE", owner: "Elena Rostova", risk_level: "LOW", security_score: 92, public_access: false, encryption_enabled: true, is_contained: false, tags: '{"env":"prod"}', last_activity: new Date().toISOString() },
  { id: "res-vm-03", name: "payment-service-vault-node", resource_type: "VM", provider: "AWS (Simulated)", region: "us-east-2", status: "ONLINE", owner: "Sarah Vance", risk_level: "CLEAN", security_score: 98, public_access: false, encryption_enabled: true, is_contained: false, tags: '{"env":"prod","pci":"true"}', last_activity: new Date().toISOString() },
  { id: "res-vm-04", name: "analytics-spark-master-01", resource_type: "VM", provider: "GCP (Simulated)", region: "us-central1", status: "ONLINE", owner: "David Ross", risk_level: "MEDIUM", security_score: 80, public_access: false, encryption_enabled: true, is_contained: false, tags: '{"env":"prod"}', last_activity: new Date().toISOString() },
  { id: "s3-customer-vault-prod", name: "customer-pii-storage-primary", resource_type: "BUCKET", provider: "AWS (Simulated)", region: "us-east-1", status: "ONLINE", owner: "Sarah Vance", risk_level: "CRITICAL", security_score: 55, public_access: true, encryption_enabled: false, is_contained: false, tags: '{"tier":"critical"}', last_activity: new Date().toISOString() },
  { id: "s3-finance-ledger-backup", name: "finance-immutable-ledger-archive", resource_type: "BUCKET", provider: "AWS (Simulated)", region: "us-west-2", status: "ONLINE", owner: "Priyah Patel", risk_level: "CLEAN", security_score: 99, public_access: false, encryption_enabled: true, is_contained: false, tags: '{"tier":"critical"}', last_activity: new Date().toISOString() },
  { id: "rds-postgres-primary", name: "aurora-pg-ecommerce-cluster", resource_type: "DATABASE", provider: "AWS (Simulated)", region: "us-east-1", status: "ONLINE", owner: "Elena Rostova", risk_level: "LOW", security_score: 91, public_access: false, encryption_enabled: true, is_contained: false, tags: '{"db":"primary"}', last_activity: new Date().toISOString() },
  { id: "cosmos-db-sessions", name: "azure-cosmos-global-user-sessions", resource_type: "DATABASE", provider: "AZURE (Simulated)", region: "westeurope", status: "ONLINE", owner: "Sarah Jenkins", risk_level: "CLEAN", security_score: 93, public_access: false, encryption_enabled: true, is_contained: false, tags: '{"db":"sessions"}', last_activity: new Date().toISOString() },
  { id: "api-gateway-public", name: "kong-api-gateway-edge-proxy", resource_type: "API_GATEWAY", provider: "AWS (Simulated)", region: "us-east-1", status: "ONLINE", owner: "Elena Rostova", risk_level: "MEDIUM", security_score: 78, public_access: true, encryption_enabled: true, is_contained: false, tags: '{"tier":"edge"}', last_activity: new Date().toISOString() },
  { id: "iam-prod-deployer", name: "role/CloudProductionDeployerRole", resource_type: "IAM_ROLE", provider: "AWS (Simulated)", region: "global", status: "ONLINE", owner: "Sarah Vance", risk_level: "HIGH", security_score: 68, public_access: false, encryption_enabled: true, is_contained: false, tags: '{"iam":"admin"}', last_activity: new Date().toISOString() }
];

export const INITIAL_ALERTS = [
  { id: "ALT-801", title: "CRITICAL: Potential Credential Compromise & Impossible Travel", rule_triggered: "RULE-IAM-004", severity: "CRITICAL", affected_entity: "alex.chen@cloudsentinel.io", evidence: "Concurrent sessions in Seattle, US and St. Petersburg, RU within 14 minutes.", risk_score_impact: 35, status: "OPEN", recommended_action: "Suspend active session and force password change.", assigned_to: "Marcus Reed", timestamp: new Date(Date.now() - 15 * 60000).toISOString() },
  { id: "ALT-802", title: "CRITICAL: S3 Public Access & Unencrypted Sensitive Bucket", rule_triggered: "RULE-STORAGE-001", severity: "CRITICAL", affected_entity: "s3-customer-vault-prod", evidence: "Bucket policy allows s3:GetObject to Principal: * without SSL requirement.", risk_score_impact: 30, status: "OPEN", recommended_action: "Enable S3 Block Public Access and apply KMS encryption.", assigned_to: "Sarah Vance", timestamp: new Date(Date.now() - 35 * 60000).toISOString() },
  { id: "ALT-803", title: "HIGH: Out-of-Band Admin Policy Attached to Role", rule_triggered: "RULE-IAM-009", severity: "HIGH", affected_entity: "iam-prod-deployer", evidence: "AdministratorAccess attached by developer API key.", risk_score_impact: 25, status: "OPEN", recommended_action: "Revert policy attachment and inspect CloudTrail logs.", assigned_to: "Aisha Al-Mansoor", timestamp: new Date(Date.now() - 55 * 60000).toISOString() },
  { id: "ALT-804", title: "HIGH: Excessive Outbound Network Bandwidth Spike", rule_triggered: "RULE-NET-003", severity: "HIGH", affected_entity: "res-vm-01", evidence: "Egress traffic peaked at 2.1 Gbps for 18 consecutive minutes.", risk_score_impact: 20, status: "ACKNOWLEDGED", recommended_action: "Inspect network flow logs and isolate host if anomalous.", assigned_to: "Marcus Reed", timestamp: new Date(Date.now() - 80 * 60000).toISOString() }
];

export const INITIAL_THREATS = [
  { id: "THR-2026-01", threat_type: "Credential Abuse & Account Takeover (ATO)", severity: "CRITICAL", confidence: 96, affected_asset: "Cloud SSO Identity Provider", affected_user: "alex.chen@cloudsentinel.io", evidence: "Tor exit node password spray matching known breach databases.", attack_vector: "Credential Stuffing", recommended_action: "Quarantine identity and enforce hardware token reset.", status: "ACTIVE", detection_time: new Date(Date.now() - 25 * 60000).toISOString() },
  { id: "THR-2026-02", threat_type: "Unauthorized IAM Privilege Escalation", severity: "CRITICAL", confidence: 94, affected_asset: "iam-prod-deployer", affected_user: "sarah.jenkins@cloudsentinel.io", evidence: "Developer role escalated to AdministratorAccess without approval.", attack_vector: "IAM Policy Abuse", recommended_action: "Roll back IAM policy attachment and revoke session credentials.", status: "ACTIVE", detection_time: new Date(Date.now() - 45 * 60000).toISOString() },
  { id: "THR-2026-03", threat_type: "Data Exfiltration & S3 Storage Harvesting", severity: "CRITICAL", confidence: 91, affected_asset: "s3-customer-vault-prod", affected_user: "service.account.ci@cloudsentinel.io", evidence: "Multi-part download burst of 45GB encrypted customer backups.", attack_vector: "Cloud Storage Exfiltration", recommended_action: "Attach explicit Deny bucket policy and terminate active connections.", status: "INVESTIGATING", detection_time: new Date(Date.now() - 65 * 60000).toISOString() },
  { id: "THR-2026-04", threat_type: "External Port Sweep & Reconnaissance Probe", severity: "HIGH", confidence: 88, affected_asset: "api-gateway-public", affected_user: null, evidence: "Rapid SYN scans probing ports 22, 80, 443, 8080, and 9200.", attack_vector: "Port Scanning & Network Recon", recommended_action: "Update Gateway rate limiter and blacklist scanning subnet.", status: "ACTIVE", detection_time: new Date(Date.now() - 110 * 60000).toISOString() }
];

export const INITIAL_INCIDENTS = [
  {
    id: "INC-2026-001",
    title: "Suspicious Privilege Escalation in Prod Cluster",
    severity: "CRITICAL",
    status: "INVESTIGATING",
    affected_user: "sarah.jenkins@cloudsentinel.io",
    affected_resource: "iam-prod-deployer",
    assigned_analyst: "Marcus Reed",
    summary: "Unauthorized AdministratorAccess role injection detected on production deployment role.",
    root_cause: "Stolen CI/CD token used to execute iam:AttachRolePolicy API.",
    containment_status: "UNCONTAINED",
    threat_id: "THR-2026-02",
    created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    actions: [
      { id: 1, action_type: "DETECTION", description: "Incident opened automatically based on detection alert THR-2026-02.", performed_by: "CloudSentinel AI Engine", timestamp: new Date(Date.now() - 3 * 3600000).toISOString() }
    ]
  },
  {
    id: "INC-2026-002",
    title: "Anomalous S3 Bucket Access Pattern from Unrecognized Subnet",
    severity: "CRITICAL",
    status: "CONTAINED",
    affected_user: "alex.chen@cloudsentinel.io",
    affected_resource: "s3-customer-vault-prod",
    assigned_analyst: "Marcus Reed",
    summary: "Bulk download of customer financial blobs exceeding normal baseline.",
    root_cause: "Exposed API key in repository commit history.",
    containment_status: "CONTAINED",
    threat_id: "THR-2026-03",
    created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    actions: [
      { id: 2, action_type: "CONTAIN_RESOURCE", description: "SecOps analyst quarantined affected bucket and severed egress.", performed_by: "Marcus Reed", timestamp: new Date(Date.now() - 5 * 3600000).toISOString() }
    ]
  }
];

export const INITIAL_POSTURE = [
  { id: "CHK-CIS-1.1", check_code: "CIS-1.1", title: "Ensure Multi-Factor Authentication (MFA) is enabled for all IAM users", category: "IAM", severity: "CRITICAL", status: "PASSED", problem: "Accounts lacking MFA are highly vulnerable to credential stuffing.", impact: "Unauthorized access to cloud infrastructure via stolen passwords.", remediation: "Enforce MFA registration policy across all IAM identity pools." },
  { id: "CHK-CIS-2.3", check_code: "CIS-2.3", title: "Ensure S3 buckets enforce server-side encryption (SSE-KMS)", category: "STORAGE", severity: "CRITICAL", status: "CRITICAL", problem: "Storage bucket s3-customer-vault-prod is unencrypted.", impact: "Data exposure if physical media or storage metadata is intercepted.", remediation: "Apply default KMS encryption with customer-managed keys." },
  { id: "CHK-CIS-3.1", check_code: "CIS-3.1", title: "Ensure security groups do not allow ingress from 0.0.0.0/0 to port 22 (SSH)", category: "NETWORK", severity: "HIGH", status: "CRITICAL", problem: "Port 22 is exposed to the public internet on res-vm-04.", impact: "Susceptible to automated brute force and remote vulnerability exploits.", remediation: "Restrict ingress to internal bastion subnet or corporate VPN IP." },
  { id: "CHK-CIS-5.1", check_code: "CIS-5.1", title: "Ensure KMS Customer Managed Key rotation is enabled", category: "ENCRYPTION", severity: "MEDIUM", status: "WARNING", problem: "One legacy cryptographic key has not been rotated in 400 days.", impact: "Increased exposure window if key material is leaked.", remediation: "Toggle automated annual key rotation in KMS configuration." }
];
