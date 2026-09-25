from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # ADMIN, SECURITY_ANALYST, CLOUD_OPERATOR, VIEWER
    privilege_level = Column(String, default="STANDARD")  # SUPERADMIN, ELEVATED, STANDARD, RESTRICTED
    risk_score = Column(Integer, default=15)  # 0 to 100
    status = Column(String, default="ACTIVE")  # ACTIVE, SUSPENDED, DORMANT, INVESTIGATING
    department = Column(String, default="Engineering")
    mfa_enabled = Column(Boolean, default=True)
    failed_login_attempts = Column(Integer, default=0)
    is_compromised = Column(Boolean, default=False)
    travel_anomaly = Column(Boolean, default=False)
    simulated_location = Column(String, default="San Francisco, US")
    last_login = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class RolePermission(Base):
    __tablename__ = "role_permissions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    role = Column(String, index=True, nullable=False)
    permission = Column(String, nullable=False)
    description = Column(String, nullable=True)

class CloudResource(Base):
    __tablename__ = "cloud_resources"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    resource_type = Column(String, nullable=False)  # VM, BUCKET, DATABASE, API_GATEWAY, CONTAINER, IAM_ROLE
    provider = Column(String, default="AWS (Simulated)")  # AWS, AZURE, GCP
    region = Column(String, default="us-east-1")
    status = Column(String, default="ONLINE")  # ONLINE, DEGRADED, CONTAINED, OFFLINE
    owner = Column(String, nullable=False)
    risk_level = Column(String, default="LOW")  # CRITICAL, HIGH, MEDIUM, LOW, CLEAN
    security_score = Column(Integer, default=90)  # 0 - 100
    public_access = Column(Boolean, default=False)
    encryption_enabled = Column(Boolean, default=True)
    tags = Column(Text, default="{}")
    is_contained = Column(Boolean, default=False)
    config_details = Column(Text, default="{}")
    last_activity = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class SecurityEvent(Base):
    __tablename__ = "security_events"

    id = Column(String, primary_key=True, index=True)
    event_type = Column(String, index=True, nullable=False)  # LOGIN, API_CALL, PERMISSION_CHANGE, PRIVILEGE_ESCALATION, etc.
    severity = Column(String, index=True, nullable=False)  # CRITICAL, HIGH, MEDIUM, LOW, INFO
    actor_user = Column(String, index=True, nullable=True)
    source_ip = Column(String, nullable=True)
    location = Column(String, default="Unknown")
    target_resource = Column(String, nullable=True)
    action_taken = Column(String, nullable=True)
    details = Column(Text, default="")
    is_anomaly = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

class ProactiveAlert(Base):
    __tablename__ = "proactive_alerts"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    rule_triggered = Column(String, nullable=False)
    severity = Column(String, index=True, nullable=False)  # CRITICAL, HIGH, MEDIUM, LOW, INFO
    affected_entity = Column(String, nullable=False)
    evidence = Column(Text, default="")
    risk_score_impact = Column(Integer, default=10)
    status = Column(String, default="OPEN", index=True)  # OPEN, ACKNOWLEDGED, RESOLVED, SUPPRESSED
    recommended_action = Column(Text, default="")
    assigned_to = Column(String, nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

class ThreatDetection(Base):
    __tablename__ = "threat_detections"

    id = Column(String, primary_key=True, index=True)
    threat_type = Column(String, index=True, nullable=False)
    severity = Column(String, index=True, nullable=False)  # CRITICAL, HIGH, MEDIUM, LOW
    confidence = Column(Integer, default=85)  # 0 to 100
    affected_asset = Column(String, nullable=False)
    affected_user = Column(String, nullable=True)
    detection_time = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    evidence = Column(Text, default="")
    attack_vector = Column(String, default="Cloud API / Network")
    recommended_action = Column(Text, default="")
    status = Column(String, default="ACTIVE", index=True)  # ACTIVE, CONTAINED, MITIGATED, INVESTIGATING

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String, primary_key=True, index=True)  # e.g., INC-2026-001
    title = Column(String, nullable=False)
    severity = Column(String, index=True, nullable=False)  # CRITICAL, HIGH, MEDIUM, LOW
    status = Column(String, default="DETECTED", index=True)  # DETECTED, INVESTIGATING, CONTAINED, ERADICATED, RECOVERED, RESOLVED
    affected_user = Column(String, nullable=True)
    affected_resource = Column(String, nullable=True)
    assigned_analyst = Column(String, nullable=True)
    summary = Column(Text, default="")
    root_cause = Column(Text, default="")
    containment_status = Column(String, default="UNCONTAINED")
    threat_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    resolved_at = Column(DateTime, nullable=True)

    actions = relationship("IncidentAction", back_populates="incident", cascade="all, delete-orphan")

class IncidentAction(Base):
    __tablename__ = "incident_actions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    incident_id = Column(String, ForeignKey("incidents.id"), nullable=False)
    action_type = Column(String, nullable=False)  # CONTAIN_RESOURCE, DISABLE_USER, REVOKE_SESSION, BLOCK_IP, ADD_NOTE, RESOLVE
    description = Column(Text, nullable=False)
    performed_by = Column(String, nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    incident = relationship("Incident", back_populates="actions")

class TrafficRecord(Base):
    __tablename__ = "traffic_records"

    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    requests_per_sec = Column(Integer, default=120)
    incoming_mbps = Column(Float, default=45.2)
    outgoing_mbps = Column(Float, default=18.4)
    failed_requests = Column(Integer, default=2)
    active_connections = Column(Integer, default=580)
    anomalous_traffic = Column(Boolean, default=False)

class TrafficAnomaly(Base):
    __tablename__ = "traffic_anomalies"

    id = Column(String, primary_key=True, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    source_ip = Column(String, nullable=False)
    target_resource = Column(String, nullable=False)
    anomaly_type = Column(String, nullable=False)  # SYN_FLOOD, DATA_BURST, BRUTE_FORCE, PORT_SCAN
    severity = Column(String, default="HIGH")
    request_rate = Column(Integer, default=4500)
    flag_reason = Column(Text, nullable=False)
    is_blocked = Column(Boolean, default=False)

class MalwareScanResult(Base):
    __tablename__ = "malware_scans"

    id = Column(String, primary_key=True, index=True)
    file_name = Column(String, nullable=False)
    file_hash_sha256 = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    file_size_kb = Column(Float, default=12.5)
    verdict = Column(String, nullable=False)  # SAFE, SUSPICIOUS, MALICIOUS
    risk_score = Column(Integer, default=0)
    matched_signatures = Column(Text, default="[]")
    behavioral_indicators = Column(Text, default="[]")
    recommended_action = Column(Text, default="")
    scan_timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class SecurityPostureCheck(Base):
    __tablename__ = "posture_checks"

    id = Column(String, primary_key=True, index=True)
    check_code = Column(String, nullable=False)  # e.g., CIS-1.1, CIS-2.4
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)  # IAM, ENCRYPTION, NETWORK, STORAGE, AUDITING
    standard = Column(String, default="CIS Benchmark v1.4")
    severity = Column(String, default="HIGH")  # CRITICAL, HIGH, MEDIUM, LOW
    status = Column(String, default="PASSED")  # PASSED, WARNING, CRITICAL
    problem = Column(Text, nullable=False)
    impact = Column(Text, nullable=False)
    remediation = Column(Text, nullable=False)
    affected_resource_count = Column(Integer, default=0)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    actor = Column(String, nullable=False)
    action = Column(String, nullable=False)
    target = Column(String, nullable=False)
    ip_address = Column(String, default="127.0.0.1")
    status = Column(String, default="SUCCESS")  # SUCCESS, BLOCKED, WARNING
    details = Column(Text, default="")
