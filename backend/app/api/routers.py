import csv
import io
import uuid
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models import (
    User, CloudResource, SecurityEvent, ProactiveAlert, 
    ThreatDetection, Incident, IncidentAction, TrafficRecord, 
    TrafficAnomaly, MalwareScanResult, SecurityPostureCheck, AuditLog
)
from app.schemas import (
    LoginRequest, TokenResponse, UserOut, ResourceOut, EventOut, 
    AlertOut, AlertStatusUpdate, ThreatOut, IncidentOut, 
    IncidentActionRequest, IncidentCreateRequest, TrafficRecordOut, 
    TrafficAnomalyOut, MalwareScanOut, MalwareScanRequest, 
    PostureCheckOut, AuditLogOut, RiskBreakdown, DashboardSummary
)
from app.core.security import verify_password, create_access_token, decode_access_token
from app.services.risk_engine import calculate_system_risk
from app.services.detection_engine import evaluate_event
from app.services.simulation_engine import execute_simulation_step, reset_simulation, SCENARIOS

api_router = APIRouter()

# -------------------------------------------------------------
# 1. AUTHENTICATION & RBAC
# -------------------------------------------------------------
@api_router.post("/auth/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials.")
    if not verify_password(req.password, user.hashed_password):
        user.failed_login_attempts += 1
        db.commit()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials.")
    
    user.failed_login_attempts = 0
    user.last_login = datetime.now(timezone.utc)
    db.commit()

    token = create_access_token(subject=user.email, role=user.role)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user={
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "privilege_level": user.privilege_level,
            "risk_score": user.risk_score,
            "status": user.status,
            "department": user.department
        }
    )

@api_router.get("/auth/me")
def get_current_user(token: Optional[str] = Query(None), db: Session = Depends(get_db)):
    if not token:
        # Default fallback user for convenient demo mode
        user = db.query(User).filter(User.role == "ADMIN").first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.email == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# -------------------------------------------------------------
# 2. COMMAND CENTER DASHBOARD
# -------------------------------------------------------------
@api_router.get("/dashboard/summary", response_model=DashboardSummary)
def get_dashboard_summary(db: Session = Depends(get_db)):
    risk_breakdown = calculate_system_risk(db)
    active_threats = db.query(ThreatDetection).filter(ThreatDetection.status == "ACTIVE").count()
    critical_alerts = db.query(ProactiveAlert).filter(ProactiveAlert.severity == "CRITICAL", ProactiveAlert.status == "OPEN").count()
    suspicious_users = db.query(User).filter((User.risk_score >= 35) | (User.is_compromised == True) | (User.travel_anomaly == True)).count()
    monitored_resources = db.query(CloudResource).count()
    security_events_count = db.query(SecurityEvent).count()
    open_incidents = db.query(Incident).filter(Incident.status.in_(["DETECTED", "INVESTIGATING", "CONTAINED"])).count()
    protected_assets = db.query(CloudResource).filter(CloudResource.risk_level.in_(["CLEAN", "LOW"])).count()

    # Severity distribution of alerts
    severity_dist = {
        "CRITICAL": db.query(ProactiveAlert).filter(ProactiveAlert.severity == "CRITICAL").count(),
        "HIGH": db.query(ProactiveAlert).filter(ProactiveAlert.severity == "HIGH").count(),
        "MEDIUM": db.query(ProactiveAlert).filter(ProactiveAlert.severity == "MEDIUM").count(),
        "LOW": db.query(ProactiveAlert).filter(ProactiveAlert.severity == "LOW").count(),
        "INFO": db.query(ProactiveAlert).filter(ProactiveAlert.severity == "INFO").count()
    }

    # Events timeline aggregation (past 12 hours)
    now = datetime.now(timezone.utc)
    events_timeline = []
    for h in range(12, 0, -1):
        slot_start = now - timedelta(hours=h)
        slot_end = now - timedelta(hours=h-1)
        count = db.query(SecurityEvent).filter(SecurityEvent.timestamp >= slot_start, SecurityEvent.timestamp < slot_end).count()
        anom_count = db.query(SecurityEvent).filter(SecurityEvent.timestamp >= slot_start, SecurityEvent.timestamp < slot_end, SecurityEvent.is_anomaly == True).count()
        events_timeline.append({
            "time": slot_end.strftime("%H:%M"),
            "events": count + (h % 3 * 2),  # realistic density
            "anomalies": anom_count + (1 if h in [2, 7] else 0)
        })

    top_risky_users = db.query(User).order_by(desc(User.risk_score)).limit(5).all()
    top_affected_resources = db.query(CloudResource).filter(CloudResource.risk_level.in_(["CRITICAL", "HIGH", "MEDIUM"])).limit(5).all()
    recent_events = db.query(SecurityEvent).order_by(desc(SecurityEvent.timestamp)).limit(10).all()

    return DashboardSummary(
        security_risk_score=risk_breakdown.total_score,
        active_threats=active_threats,
        critical_alerts=critical_alerts,
        suspicious_users=suspicious_users,
        monitored_resources=monitored_resources,
        security_events_count=security_events_count,
        open_incidents=open_incidents,
        protected_assets=protected_assets,
        severity_distribution=severity_dist,
        events_timeline=events_timeline,
        top_risky_users=top_risky_users,
        top_affected_resources=top_affected_resources,
        recent_events=recent_events,
        risk_breakdown=risk_breakdown
    )

# -------------------------------------------------------------
# 3. IAM - USERS & ACCESS MANAGEMENT
# -------------------------------------------------------------
@api_router.get("/users", response_model=List[UserOut])
def get_users(
    role: Optional[str] = None,
    min_risk: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    if min_risk is not None:
        query = query.filter(User.risk_score >= min_risk)
    if search:
        s = f"%{search}%"
        query = query.filter((User.email.ilike(s)) | (User.full_name.ilike(s)) | (User.department.ilike(s)))
    return query.order_by(desc(User.risk_score)).all()

@api_router.get("/users/{user_id}", response_model=UserOut)
def get_user_detail(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@api_router.post("/users/{user_id}/suspend")
def suspend_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.status = "SUSPENDED"
    db.add(AuditLog(
        id=f"AUD-{uuid.uuid4().hex[:6].upper()}",
        actor="Security Analyst Lead",
        action="USER_SUSPENDED",
        target=user.email,
        ip_address="10.0.2.14",
        status="SUCCESS",
        details=f"User {user.email} suspended via IAM management console."
    ))
    db.commit()
    return {"status": "SUCCESS", "message": f"User {user.email} successfully suspended."}

@api_router.post("/users/{user_id}/reset-risk")
def reset_user_risk(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.risk_score = 10
    user.is_compromised = False
    user.travel_anomaly = False
    user.failed_login_attempts = 0
    user.status = "ACTIVE"
    db.commit()
    return {"status": "SUCCESS", "message": f"Risk factors cleared for {user.email}."}

# -------------------------------------------------------------
# 4. CLOUD RESOURCE INVENTORY
# -------------------------------------------------------------
@api_router.get("/resources", response_model=List[ResourceOut])
def get_resources(
    resource_type: Optional[str] = None,
    provider: Optional[str] = None,
    risk_level: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(CloudResource)
    if resource_type:
        query = query.filter(CloudResource.resource_type == resource_type)
    if provider:
        query = query.filter(CloudResource.provider.ilike(f"%{provider}%"))
    if risk_level:
        query = query.filter(CloudResource.risk_level == risk_level)
    return query.all()

@api_router.get("/resources/{resource_id}", response_model=ResourceOut)
def get_resource(resource_id: str, db: Session = Depends(get_db)):
    res = db.query(CloudResource).filter(CloudResource.id == resource_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Resource not found")
    return res

@api_router.post("/resources/{resource_id}/contain")
def contain_resource(resource_id: str, db: Session = Depends(get_db)):
    res = db.query(CloudResource).filter(CloudResource.id == resource_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Resource not found")
    res.is_contained = not res.is_contained
    res.status = "CONTAINED" if res.is_contained else "ONLINE"
    db.add(AuditLog(
        id=f"AUD-{uuid.uuid4().hex[:6].upper()}",
        actor="SecOps Operator",
        action="CONTAIN_RESOURCE_TOGGLE",
        target=res.id,
        ip_address="10.0.1.15",
        status="SUCCESS",
        details=f"Resource {res.id} containment toggled to {res.is_contained}."
    ))
    db.commit()
    return {"status": "SUCCESS", "is_contained": res.is_contained, "resource_status": res.status}

# -------------------------------------------------------------
# 5. SECURITY EVENTS HUB
# -------------------------------------------------------------
@api_router.get("/events", response_model=List[EventOut])
def get_events(
    event_type: Optional[str] = None,
    severity: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    query = db.query(SecurityEvent)
    if event_type:
        query = query.filter(SecurityEvent.event_type == event_type)
    if severity:
        query = query.filter(SecurityEvent.severity == severity)
    if search:
        s = f"%{search}%"
        query = query.filter(
            (SecurityEvent.actor_user.ilike(s)) | 
            (SecurityEvent.target_resource.ilike(s)) | 
            (SecurityEvent.details.ilike(s)) |
            (SecurityEvent.source_ip.ilike(s))
        )
    return query.order_by(desc(SecurityEvent.timestamp)).offset(offset).limit(limit).all()

# -------------------------------------------------------------
# 6. PROACTIVE ALERT SYSTEM
# -------------------------------------------------------------
@api_router.get("/alerts", response_model=List[AlertOut])
def get_alerts(
    status: Optional[str] = None,
    severity: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(ProactiveAlert)
    if status:
        query = query.filter(ProactiveAlert.status == status)
    if severity:
        query = query.filter(ProactiveAlert.severity == severity)
    return query.order_by(desc(ProactiveAlert.timestamp)).all()

@api_router.post("/alerts/{alert_id}/status")
def update_alert_status(alert_id: str, req: AlertStatusUpdate, db: Session = Depends(get_db)):
    alert = db.query(ProactiveAlert).filter(ProactiveAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.status = req.status
    db.commit()
    return {"status": "SUCCESS", "alert_id": alert.id, "new_status": alert.status}

@api_router.post("/alerts/{alert_id}/escalate-to-incident")
def escalate_alert_to_incident(alert_id: str, db: Session = Depends(get_db)):
    alert = db.query(ProactiveAlert).filter(ProactiveAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    inc_id = f"INC-2026-{uuid.uuid4().hex[:3].upper()}"
    incident = Incident(
        id=inc_id,
        title=f"Escalation: {alert.title}",
        severity=alert.severity,
        status="INVESTIGATING",
        affected_user=alert.affected_entity if "@" in alert.affected_entity else None,
        affected_resource=alert.affected_entity if "@" not in alert.affected_entity else None,
        assigned_analyst="SecOps Lead Analyst",
        summary=f"Automated incident created from proactive alert {alert.id}. Evidence: {alert.evidence}",
        root_cause="Triggered by heuristic rule: " + alert.rule_triggered,
        containment_status="UNCONTAINED",
        created_at=datetime.now(timezone.utc)
    )
    db.add(incident)
    
    action = IncidentAction(
        incident_id=inc_id,
        action_type="DETECTION",
        description=f"Auto-escalated from Proactive Alert {alert.id}.",
        performed_by="CloudSentinel AI Engine",
        timestamp=datetime.now(timezone.utc)
    )
    db.add(action)
    alert.status = "ACKNOWLEDGED"
    db.commit()
    return {"status": "SUCCESS", "incident_id": inc_id, "message": "Incident opened and assigned to SecOps."}

# -------------------------------------------------------------
# 7. THREAT DETECTION & RELATIONSHIP GRAPH
# -------------------------------------------------------------
@api_router.get("/threats", response_model=List[ThreatOut])
def get_threats(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(ThreatDetection)
    if status:
        query = query.filter(ThreatDetection.status == status)
    return query.order_by(desc(ThreatDetection.detection_time)).all()

@api_router.get("/threats/graph")
def get_relationship_graph(db: Session = Depends(get_db)):
    """
    Returns nodes and links for the Visual Security Relationship Graph:
    USER -> ROLE -> API -> RESOURCE -> EVENT -> THREAT -> INCIDENT
    """
    nodes = [
        {"id": "usr-alex", "name": "alex.chen@cloudsentinel.io", "type": "USER", "status": "COMPROMISED", "risk": 75},
        {"id": "usr-sarah", "name": "sarah.jenkins@cloudsentinel.io", "type": "USER", "status": "RISKY", "risk": 45},
        {"id": "role-dev", "name": "CloudProductionDeployerRole", "type": "ROLE", "status": "ELEVATED", "risk": 68},
        {"id": "api-sso", "name": "OAuth2 / SSO Endpoint", "type": "API", "status": "ATTACKED", "risk": 80},
        {"id": "api-gateway", "name": "kong-api-gateway-edge", "type": "API", "status": "ONLINE", "risk": 50},
        {"id": "res-vm-01", "name": "prod-api-worker-01", "type": "RESOURCE", "status": "HIGH_RISK", "risk": 72},
        {"id": "res-s3", "name": "customer-pii-storage-primary", "type": "RESOURCE", "status": "CRITICAL", "risk": 90},
        {"id": "evt-login", "name": "EVT-10001: Geolocation Anomaly", "type": "EVENT", "status": "ANOMALY", "risk": 85},
        {"id": "evt-iam", "name": "EVT-10002: Policy Attach Inject", "type": "EVENT", "status": "ANOMALY", "risk": 90},
        {"id": "thr-ato", "name": "THR-2026-01: Account Takeover", "type": "THREAT", "status": "ACTIVE", "risk": 96},
        {"id": "thr-priv", "name": "THR-2026-02: Privilege Escalation", "type": "THREAT", "status": "ACTIVE", "risk": 94},
        {"id": "inc-001", "name": "INC-2026-001: Prod Privilege Escalation", "type": "INCIDENT", "status": "INVESTIGATING", "risk": 95}
    ]

    links = [
        {"source": "usr-alex", "target": "api-sso", "label": "Authenticates via"},
        {"source": "api-sso", "target": "evt-login", "label": "Generates Event"},
        {"source": "evt-login", "target": "thr-ato", "label": "Triggers Threat"},
        {"source": "thr-ato", "target": "res-vm-01", "label": "Targets Host"},
        {"source": "usr-sarah", "target": "role-dev", "label": "Assigned Role"},
        {"source": "role-dev", "target": "evt-iam", "label": "Executes API"},
        {"source": "evt-iam", "target": "thr-priv", "label": "Pattern Matches"},
        {"source": "thr-priv", "target": "inc-001", "label": "Escalated to"},
        {"source": "inc-001", "target": "res-s3", "label": "Affects Data Asset"}
    ]

    return {"nodes": nodes, "links": links}

# -------------------------------------------------------------
# 8. INCIDENT RESPONSE CENTER
# -------------------------------------------------------------
@api_router.get("/incidents", response_model=List[IncidentOut])
def get_incidents(
    status: Optional[str] = None,
    severity: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Incident)
    if status:
        query = query.filter(Incident.status == status)
    if severity:
        query = query.filter(Incident.severity == severity)
    return query.order_by(desc(Incident.created_at)).all()

@api_router.get("/incidents/{incident_id}", response_model=IncidentOut)
def get_incident(incident_id: str, db: Session = Depends(get_db)):
    inc = db.query(Incident).filter(Incident.id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    return inc

@api_router.post("/incidents/{incident_id}/actions")
def perform_incident_action(
    incident_id: str,
    req: IncidentActionRequest,
    db: Session = Depends(get_db)
):
    inc = db.query(Incident).filter(Incident.id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    now = datetime.now(timezone.utc)
    action = IncidentAction(
        incident_id=incident_id,
        action_type=req.action_type,
        description=req.description,
        performed_by=req.performed_by or "SecOps Analyst",
        timestamp=now
    )
    db.add(action)

    # State transitions based on action
    if req.action_type in ["CONTAIN_RESOURCE", "DISABLE_USER", "REVOKE_SESSION", "BLOCK_IP"]:
        inc.status = "CONTAINED"
        inc.containment_status = "CONTAINED"
        # If user affected, suspend user
        if inc.affected_user:
            u = db.query(User).filter(User.email == inc.affected_user).first()
            if u:
                u.status = "SUSPENDED"
                u.is_compromised = False
        # If resource affected, contain resource
        if inc.affected_resource:
            r = db.query(CloudResource).filter(CloudResource.id == inc.affected_resource).first()
            if r:
                r.is_contained = True
                r.status = "CONTAINED"

    elif req.action_type == "RESOLVE":
        inc.status = "RESOLVED"
        inc.resolved_at = now

    db.add(AuditLog(
        id=f"AUD-{uuid.uuid4().hex[:6].upper()}",
        actor=req.performed_by or "SecOps Analyst",
        action=f"INCIDENT_ACTION_{req.action_type}",
        target=inc.id,
        ip_address="10.0.2.14",
        status="SUCCESS",
        details=req.description
    ))
    db.commit()
    return {"status": "SUCCESS", "message": f"Action {req.action_type} executed successfully on {inc.id}."}

# -------------------------------------------------------------
# 9. TRAFFIC MONITORING
# -------------------------------------------------------------
@api_router.get("/traffic/history", response_model=List[TrafficRecordOut])
def get_traffic_history(db: Session = Depends(get_db)):
    return db.query(TrafficRecord).order_by(TrafficRecord.timestamp).all()

@api_router.get("/traffic/anomalies", response_model=List[TrafficAnomalyOut])
def get_traffic_anomalies(db: Session = Depends(get_db)):
    return db.query(TrafficAnomaly).order_by(desc(TrafficAnomaly.timestamp)).all()

@api_router.post("/traffic/anomalies/{anomaly_id}/block")
def block_traffic_anomaly(anomaly_id: str, db: Session = Depends(get_db)):
    anom = db.query(TrafficAnomaly).filter(TrafficAnomaly.id == anomaly_id).first()
    if not anom:
        raise HTTPException(status_code=404, detail="Anomaly not found")
    anom.is_blocked = True
    db.add(AuditLog(
        id=f"AUD-{uuid.uuid4().hex[:6].upper()}",
        actor="SecOps Operator",
        action="BLOCK_ANOMALOUS_IP",
        target=anom.source_ip,
        ip_address="10.0.1.5",
        status="SUCCESS",
        details=f"Firewall perimeter ACL rule deployed: DROP traffic from {anom.source_ip}."
    ))
    db.commit()
    return {"status": "SUCCESS", "message": f"IP {anom.source_ip} successfully blocked."}

# -------------------------------------------------------------
# 10. MALWARE & THREAT ANALYSIS SANDBOX
# -------------------------------------------------------------
@api_router.get("/malware/scans", response_model=List[MalwareScanOut])
def get_malware_scans(db: Session = Depends(get_db)):
    return db.query(MalwareScanResult).order_by(desc(MalwareScanResult.scan_timestamp)).all()

@api_router.post("/malware/scan", response_model=MalwareScanOut)
def scan_file_sample(req: MalwareScanRequest, db: Session = Depends(get_db)):
    """
    Safe simulated heuristic sandbox scanner.
    """
    import hashlib
    content_bytes = (req.sample_content or req.file_name).encode("utf-8")
    sha256_hash = hashlib.sha256(content_bytes).hexdigest()

    lower_name = req.file_name.lower()
    is_malicious = any(bad in lower_name for bad in ["malware", "reverse", "mimikatz", "payload", "trojan", "shell", "c2", "ransomware"])
    is_suspicious = any(susp in lower_name for susp in ["probe", "patch", "hook", "inject", "unsigned", "eval"])

    if is_malicious:
        verdict = "MALICIOUS"
        risk_score = 98
        signatures = '["YARA.CloudSec.GenericRansomwarePrecursor", "Signature.TrojanBeacon.X64"]'
        behavior = '["Process Hollowing", "Memory Decryption Loop", "Outbound Port 4444 Connection"]'
        remedy = "Block hash globally in EDR, trigger host quarantine, and invoke IR playbook."
    elif is_suspicious:
        verdict = "SUSPICIOUS"
        risk_score = 65
        signatures = '["Heuristic.SuspiciousEntropy", "UnverifiedPublisher"]'
        behavior = '["Dynamic Library Injection", "Suspicious Process Spawning"]'
        remedy = "Submit sample for full hypervisor isolation run and restrict executable permissions."
    else:
        verdict = "SAFE"
        risk_score = 4
        signatures = '["Verified Internal Enterprise Developer Certificate"]'
        behavior = '["Standard System Calls", "Benign File Read"]'
        remedy = "Sample is safe. Permit deployment to fleet."

    result = MalwareScanResult(
        id=f"SCAN-{uuid.uuid4().hex[:6].upper()}",
        file_name=req.file_name,
        file_hash_sha256=sha256_hash,
        file_type=req.file_type or "Executable",
        file_size_kb=round(len(content_bytes) / 1024.0 + 12.4, 1),
        verdict=verdict,
        risk_score=risk_score,
        matched_signatures=signatures,
        behavioral_indicators=behavior,
        recommended_action=remedy,
        scan_timestamp=datetime.now(timezone.utc)
    )
    db.add(result)
    db.commit()
    return result

# -------------------------------------------------------------
# 11. CLOUD PROTECTION & POSTURE CHECKS
# -------------------------------------------------------------
@api_router.get("/posture/checks", response_model=List[PostureCheckOut])
def get_posture_checks(db: Session = Depends(get_db)):
    return db.query(SecurityPostureCheck).all()

@api_router.post("/posture/remediate/{check_id}")
def remediate_posture_check(check_id: str, db: Session = Depends(get_db)):
    check = db.query(SecurityPostureCheck).filter(SecurityPostureCheck.id == check_id).first()
    if not check:
        raise HTTPException(status_code=404, detail="Check not found")
    check.status = "PASSED"
    check.affected_resource_count = 0
    db.add(AuditLog(
        id=f"AUD-{uuid.uuid4().hex[:6].upper()}",
        actor="Security Posture Automation",
        action="1_CLICK_REMEDIATION",
        target=check.check_code,
        ip_address="127.0.0.1",
        status="SUCCESS",
        details=f"Automated compliance remediation applied for {check.check_code} ({check.title})."
    ))
    db.commit()
    return {"status": "SUCCESS", "message": f"Check {check.check_code} successfully remediated to PASSED."}

# -------------------------------------------------------------
# 12. RISK ANALYTICS BREAKDOWN
# -------------------------------------------------------------
@api_router.get("/risk/breakdown", response_model=RiskBreakdown)
def get_risk_breakdown(db: Session = Depends(get_db)):
    return calculate_system_risk(db)

# -------------------------------------------------------------
# 13. AUDIT LOGS
# -------------------------------------------------------------
@api_router.get("/audit-logs", response_model=List[AuditLogOut])
def get_audit_logs(
    actor: Optional[str] = None,
    action: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(AuditLog)
    if actor:
        query = query.filter(AuditLog.actor.ilike(f"%{actor}%"))
    if action:
        query = query.filter(AuditLog.action.ilike(f"%{action}%"))
    if search:
        s = f"%{search}%"
        query = query.filter((AuditLog.target.ilike(s)) | (AuditLog.details.ilike(s)))
    return query.order_by(desc(AuditLog.timestamp)).limit(limit).all()

# -------------------------------------------------------------
# 14. DEMO ATTACK SIMULATION RUNNER
# -------------------------------------------------------------
@api_router.get("/simulation/scenarios")
def get_simulation_scenarios():
    return list(SCENARIOS.values())

@api_router.post("/simulation/run-step")
def run_simulation_step(scenario_id: str = "credential_abuse", step: int = 1, db: Session = Depends(get_db)):
    result = execute_simulation_step(db, scenario_id, step)
    return result

@api_router.post("/simulation/reset")
def reset_simulation_state(db: Session = Depends(get_db)):
    return reset_simulation(db)

# -------------------------------------------------------------
# 15. REPORTS & EXPORTS
# -------------------------------------------------------------
@api_router.get("/reports/summary")
def get_report_summary(db: Session = Depends(get_db)):
    risk = calculate_system_risk(db)
    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "report_id": f"REP-2026-{uuid.uuid4().hex[:4].upper()}",
        "organization": "Enterprise Cloud Fleet",
        "executive_summary": "CloudSentinel SecOps platform comprehensive audit & risk assessment.",
        "risk_score": risk.total_score,
        "posture_status": risk.posture_status,
        "total_monitored_resources": db.query(CloudResource).count(),
        "total_active_threats": db.query(ThreatDetection).filter(ThreatDetection.status == "ACTIVE").count(),
        "total_open_incidents": db.query(Incident).filter(Incident.status != "RESOLVED").count(),
        "cis_benchmark_compliance": "82%",
        "key_risk_drivers": [f.factor for f in risk.factors]
    }

@api_router.get("/reports/export-csv")
def export_csv_report(entity: str = "events", db: Session = Depends(get_db)):
    output = io.StringIO()
    writer = csv.writer(output)

    if entity == "alerts":
        writer.writerow(["Alert ID", "Title", "Rule Triggered", "Severity", "Affected Entity", "Status", "Timestamp"])
        alerts = db.query(ProactiveAlert).all()
        for a in alerts:
            writer.writerow([a.id, a.title, a.rule_triggered, a.severity, a.affected_entity, a.status, a.timestamp.isoformat()])
        filename = "cloudsentinel_alerts_export.csv"
    elif entity == "threats":
        writer.writerow(["Threat ID", "Threat Type", "Severity", "Confidence", "Affected Asset", "Status", "Detection Time"])
        threats = db.query(ThreatDetection).all()
        for t in threats:
            writer.writerow([t.id, t.threat_type, t.severity, t.confidence, t.affected_asset, t.status, t.detection_time.isoformat()])
        filename = "cloudsentinel_threats_export.csv"
    else:
        writer.writerow(["Event ID", "Type", "Severity", "Actor User", "Source IP", "Target Resource", "Timestamp"])
        events = db.query(SecurityEvent).limit(200).all()
        for e in events:
            writer.writerow([e.id, e.event_type, e.severity, e.actor_user or "N/A", e.source_ip or "N/A", e.target_resource or "N/A", e.timestamp.isoformat()])
        filename = "cloudsentinel_events_export.csv"

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
