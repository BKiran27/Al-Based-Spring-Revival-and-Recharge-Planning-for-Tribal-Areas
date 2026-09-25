from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr

# Auth
class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    privilege_level: str
    risk_score: int
    status: str
    department: str
    mfa_enabled: bool
    failed_login_attempts: int
    is_compromised: bool
    travel_anomaly: bool
    simulated_location: str
    last_login: Optional[datetime]

    class Config:
        from_attributes = True

# Cloud Resource
class ResourceOut(BaseModel):
    id: str
    name: str
    resource_type: str
    provider: str
    region: str
    status: str
    owner: str
    risk_level: str
    security_score: int
    public_access: bool
    encryption_enabled: bool
    is_contained: bool
    tags: Optional[str]
    config_details: Optional[str]
    last_activity: Optional[datetime]

    class Config:
        from_attributes = True

# Security Event
class EventOut(BaseModel):
    id: str
    event_type: str
    severity: str
    actor_user: Optional[str]
    source_ip: Optional[str]
    location: Optional[str]
    target_resource: Optional[str]
    action_taken: Optional[str]
    details: Optional[str]
    is_anomaly: bool
    timestamp: datetime

    class Config:
        from_attributes = True

# Alert
class AlertOut(BaseModel):
    id: str
    title: str
    rule_triggered: str
    severity: str
    affected_entity: str
    evidence: str
    risk_score_impact: int
    status: str
    recommended_action: str
    assigned_to: Optional[str]
    timestamp: datetime

    class Config:
        from_attributes = True

class AlertStatusUpdate(BaseModel):
    status: str  # OPEN, ACKNOWLEDGED, RESOLVED, SUPPRESSED

# Threat
class ThreatOut(BaseModel):
    id: str
    threat_type: str
    severity: str
    confidence: int
    affected_asset: str
    affected_user: Optional[str]
    detection_time: datetime
    evidence: str
    attack_vector: str
    recommended_action: str
    status: str

    class Config:
        from_attributes = True

# Incident
class IncidentActionOut(BaseModel):
    id: int
    incident_id: str
    action_type: str
    description: str
    performed_by: str
    timestamp: datetime

    class Config:
        from_attributes = True

class IncidentOut(BaseModel):
    id: str
    title: str
    severity: str
    status: str
    affected_user: Optional[str]
    affected_resource: Optional[str]
    assigned_analyst: Optional[str]
    summary: str
    root_cause: str
    containment_status: str
    threat_id: Optional[str]
    created_at: datetime
    resolved_at: Optional[datetime]
    actions: List[IncidentActionOut] = []

    class Config:
        from_attributes = True

class IncidentActionRequest(BaseModel):
    action_type: str  # CONTAIN_RESOURCE, DISABLE_USER, REVOKE_SESSION, BLOCK_IP, ADD_NOTE, RESOLVE
    description: str
    performed_by: Optional[str] = "Security Analyst"

class IncidentCreateRequest(BaseModel):
    title: str
    severity: str
    affected_user: Optional[str] = None
    affected_resource: Optional[str] = None
    summary: str
    threat_id: Optional[str] = None

# Traffic
class TrafficRecordOut(BaseModel):
    id: int
    timestamp: datetime
    requests_per_sec: int
    incoming_mbps: float
    outgoing_mbps: float
    failed_requests: int
    active_connections: int
    anomalous_traffic: bool

    class Config:
        from_attributes = True

class TrafficAnomalyOut(BaseModel):
    id: str
    timestamp: datetime
    source_ip: str
    target_resource: str
    anomaly_type: str
    severity: str
    request_rate: int
    flag_reason: str
    is_blocked: bool

    class Config:
        from_attributes = True

# Malware
class MalwareScanOut(BaseModel):
    id: str
    file_name: str
    file_hash_sha256: str
    file_type: str
    file_size_kb: float
    verdict: str
    risk_score: int
    matched_signatures: str
    behavioral_indicators: str
    recommended_action: str
    scan_timestamp: datetime

    class Config:
        from_attributes = True

class MalwareScanRequest(BaseModel):
    file_name: str
    sample_content: Optional[str] = None
    file_type: Optional[str] = "Executable"

# Posture
class PostureCheckOut(BaseModel):
    id: str
    check_code: str
    title: str
    category: str
    standard: str
    severity: str
    status: str
    problem: str
    impact: str
    remediation: str
    affected_resource_count: int

    class Config:
        from_attributes = True

# Audit
class AuditLogOut(BaseModel):
    id: str
    timestamp: datetime
    actor: str
    action: str
    target: str
    ip_address: str
    status: str
    details: str

    class Config:
        from_attributes = True

# Risk Breakdown
class RiskFactor(BaseModel):
    factor: str
    category: str
    points: int
    description: str
    severity: str

class RiskBreakdown(BaseModel):
    total_score: int
    posture_status: str  # SECURE, ELEVATED, HIGH_RISK, CRITICAL
    identity_risk: int
    traffic_risk: int
    resource_risk: int
    threat_severity_risk: int
    posture_risk: int
    factors: List[RiskFactor]

# Dashboard Summary
class DashboardSummary(BaseModel):
    security_risk_score: int
    active_threats: int
    critical_alerts: int
    suspicious_users: int
    monitored_resources: int
    security_events_count: int
    open_incidents: int
    protected_assets: int
    severity_distribution: Dict[str, int]
    events_timeline: List[Dict[str, Any]]
    top_risky_users: List[UserOut]
    top_affected_resources: List[ResourceOut]
    recent_events: List[EventOut]
    risk_breakdown: RiskBreakdown
