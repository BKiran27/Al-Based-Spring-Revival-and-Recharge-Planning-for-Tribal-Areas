import uuid
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.models import (
    User, CloudResource, SecurityEvent, ProactiveAlert, 
    ThreatDetection, Incident, IncidentAction, TrafficAnomaly, AuditLog
)

SCENARIOS = {
    "credential_abuse": {
        "id": "credential_abuse",
        "title": "Scenario 1: Credential Abuse & Impossible Travel",
        "category": "Identity Threat",
        "description": "Demonstrates credential stuffing, impossible travel geolocation anomaly, proactive alerting, automated incident response, and credential quarantine.",
        "target_user": "alex.chen@cloudsentinel.io",
        "target_resource": "res-vm-01",
        "total_steps": 6
    },
    "privilege_escalation": {
        "id": "privilege_escalation",
        "title": "Scenario 2: Privilege Escalation & IAM Backdoor",
        "category": "Privilege Abuse",
        "description": "Simulates an attacker abusing a developer API key to escalate privileges to Cloud SuperAdmin, triggering policy violation detection and IAM containment.",
        "target_user": "sarah.jenkins@cloudsentinel.io",
        "target_resource": "iam-prod-deployer",
        "total_steps": 6
    },
    "data_exfiltration": {
        "id": "data_exfiltration",
        "title": "Scenario 3: S3 Storage Enumeration & Data Exfiltration",
        "category": "Data Leakage / Exfiltration",
        "description": "Detects high-throughput anomalous outbound data transfer from production financial storage bucket, triggers perimeter IP blocking and bucket lockdown.",
        "target_user": "david.ross@cloudsentinel.io",
        "target_resource": "s3-customer-vault-prod",
        "total_steps": 6
    }
}

def execute_simulation_step(db: Session, scenario_id: str, step: int) -> dict:
    now = datetime.now(timezone.utc)
    
    if scenario_id == "credential_abuse":
        user = db.query(User).filter(User.email == "alex.chen@cloudsentinel.io").first()
        if not user:
            user = db.query(User).first()
        
        if step == 1:
            # Step 1: Failed Logins
            user.failed_login_attempts = 4
            user.risk_score = 45
            evt1 = SecurityEvent(
                id=f"EVT-SIM-{uuid.uuid4().hex[:5].upper()}",
                event_type="LOGIN",
                severity="HIGH",
                actor_user=user.email,
                source_ip="185.220.101.5",
                location="Tor Exit Node / St. Petersburg, RU",
                target_resource="Cloud SSO Portal",
                action_taken="DENIED_AUTHENTICATION",
                details="4 consecutive failed password attempts with dictionary spray pattern.",
                is_anomaly=True,
                timestamp=now
            )
            db.add(evt1)
            db.commit()
            return {
                "step": 1,
                "title": "Credential Stuffing Attempt Detected",
                "status": "DETECTED",
                "message": f"4 consecutive failed logins recorded for {user.email} from Tor Exit Node IP 185.220.101.5.",
                "risk_impact": "+15 Risk Score"
            }
            
        elif step == 2:
            # Step 2: Successful Anomaly Login & Impossible Travel
            user.travel_anomaly = True
            user.is_compromised = True
            user.risk_score = 75
            user.simulated_location = "Frankfurt, DE"
            evt2 = SecurityEvent(
                id=f"EVT-SIM-{uuid.uuid4().hex[:5].upper()}",
                event_type="LOGIN",
                severity="CRITICAL",
                actor_user=user.email,
                source_ip="194.26.29.112",
                location="Frankfurt, DE",
                target_resource="AWS Management Console",
                action_taken="SESSION_ESTABLISHED",
                details="Successful authentication bypass via stolen session cookie. Travel velocity: 4,800 mph from last SF session.",
                is_anomaly=True,
                timestamp=now
            )
            db.add(evt2)
            db.commit()
            return {
                "step": 2,
                "title": "Impossible Travel Velocity Anomaly",
                "status": "ALERTED",
                "message": f"Impossible travel detected for {user.email}: Frankfurt, DE session initiated 12m after San Francisco active session.",
                "risk_impact": "+30 Risk Score (User marked COMPROMISED)"
            }

        elif step == 3:
            # Step 3: Proactive Alert & Threat Generation
            alt_id = f"ALT-SIM-{uuid.uuid4().hex[:5].upper()}"
            alert = ProactiveAlert(
                id=alt_id,
                title="CRITICAL: Verified Identity Hijack & Geographic Anomaly",
                rule_triggered="RULE-IAM-004: Infeasible Geolocation Velocity & Compromised Credential Match",
                severity="CRITICAL",
                affected_entity=user.email,
                evidence="Session cookie replay attack from Frankfurt, DE after brute force sequence from Tor Exit Node.",
                risk_score_impact=30,
                status="OPEN",
                recommended_action="Quarantine identity, terminate all active tokens, and initiate incident INC-2026-091.",
                timestamp=now
            )
            db.add(alert)
            
            thr_id = f"THR-SIM-{uuid.uuid4().hex[:5].upper()}"
            threat = ThreatDetection(
                id=thr_id,
                threat_type="Active Account Takeover (ATO) & Lateral Movement",
                severity="CRITICAL",
                confidence=98,
                affected_asset="Identity Provider & EC2 Production Fleet",
                affected_user=user.email,
                detection_time=now,
                evidence="Compromised credentials used to initiate API calls targeting res-vm-01 production server.",
                attack_vector="Credential Compromise / Session Replay",
                recommended_action="Execute Automated Playbook: Quarantined Identity + VM Security Group Revocation.",
                status="ACTIVE"
            )
            db.add(threat)
            db.commit()
            return {
                "step": 3,
                "title": "Threat & Proactive Alert Raised",
                "status": "THREAT_CONFIRMED",
                "message": f"CloudSentinel Threat Engine classified Account Takeover (Confidence: 98%). Proactive Alert {alt_id} generated.",
                "risk_impact": "+20 Risk Score (Overall System Risk: 85/100 - CRITICAL)"
            }

        elif step == 4:
            # Step 4: Automatic Incident Creation
            inc_id = "INC-2026-091"
            existing_inc = db.query(Incident).filter(Incident.id == inc_id).first()
            if not existing_inc:
                incident = Incident(
                    id=inc_id,
                    title="Account Takeover & Unauthorized Production Access - Alex Chen",
                    severity="CRITICAL",
                    status="INVESTIGATING",
                    affected_user=user.email,
                    affected_resource="res-vm-01",
                    assigned_analyst="Security Analyst Lead",
                    summary="Adversary obtained active session tokens following brute force spray and attempted EC2 enumeration.",
                    root_cause="Stolen session token via untrusted Wi-Fi or phishing vector, lack of hardware FIDO2 key enforcement.",
                    containment_status="UNCONTAINED",
                    threat_id="THR-SIM-ATO",
                    created_at=now
                )
                db.add(incident)
                
                act1 = IncidentAction(
                    incident_id=inc_id,
                    action_type="DETECTION",
                    description="Incident auto-created by CloudSentinel Detection Engine based on Alert ALT-SIM.",
                    performed_by="CloudSentinel AI Engine",
                    timestamp=now
                )
                db.add(act1)
                db.commit()
            return {
                "step": 4,
                "title": "P1 Security Incident Created",
                "status": "INCIDENT_OPEN",
                "message": f"Incident INC-2026-091 escalated to on-call SecOps analyst. Status: INVESTIGATING.",
                "risk_impact": "Incident Room Activated"
            }

        elif step == 5:
            # Step 5: Containment Actions Executed
            user.status = "SUSPENDED"
            user.privilege_level = "RESTRICTED"
            user.is_compromised = False
            user.travel_anomaly = False
            user.failed_login_attempts = 0
            user.risk_score = 15

            vm = db.query(CloudResource).filter(CloudResource.id == "res-vm-01").first()
            if vm:
                vm.is_contained = True
                vm.status = "CONTAINED"

            inc = db.query(Incident).filter(Incident.id == "INC-2026-091").first()
            if inc:
                inc.status = "CONTAINED"
                inc.containment_status = "CONTAINED"
                act2 = IncidentAction(
                    incident_id=inc.id,
                    action_type="CONTAIN_RESOURCE",
                    description="Revoked all active OAuth/JWT tokens for user, isolated VM res-vm-01 with quarantine security group.",
                    performed_by="SecOps Lead Analyst",
                    timestamp=now
                )
                db.add(act2)

            audit = AuditLog(
                id=f"AUD-{uuid.uuid4().hex[:6].upper()}",
                timestamp=now,
                actor="SecOps Lead Analyst",
                action="CONTAIN_IDENTITY_AND_HOST",
                target=f"{user.email} / res-vm-01",
                ip_address="10.0.4.12",
                status="SUCCESS",
                details="Executed Containment Playbook: User suspended, tokens revoked, ingress/egress cut."
            )
            db.add(audit)
            db.commit()
            return {
                "step": 5,
                "title": "Automated Containment Executed",
                "status": "CONTAINED",
                "message": f"Tokens revoked, account {user.email} suspended, host res-vm-01 network-quarantined.",
                "risk_impact": "-45 Risk Score (Threat Neutralized)"
            }

        elif step == 6:
            # Step 6: Recovery & Resolution
            inc = db.query(Incident).filter(Incident.id == "INC-2026-091").first()
            if inc:
                inc.status = "RESOLVED"
                inc.resolved_at = now
                act3 = IncidentAction(
                    incident_id=inc.id,
                    action_type="RESOLVE",
                    description="Root cause remediated. Passwords reset, FIDO2 token bound, VM scanned clean.",
                    performed_by="SecOps Lead Analyst",
                    timestamp=now
                )
                db.add(act3)
            
            alerts = db.query(ProactiveAlert).filter(ProactiveAlert.affected_entity == user.email).all()
            for a in alerts:
                a.status = "RESOLVED"
            
            threats = db.query(ThreatDetection).filter(ThreatDetection.affected_user == user.email).all()
            for t in threats:
                t.status = "MITIGATED"

            db.commit()
            return {
                "step": 6,
                "title": "Incident Resolved & System Secure",
                "status": "RESOLVED",
                "message": "Security lifecycle completed: Detection -> Alert -> Incident -> Containment -> Recovery -> Secure Baseline.",
                "risk_impact": "System Risk Score returned to Normal Baseline (18/100 - SECURE)"
            }

    elif scenario_id == "privilege_escalation":
        user = db.query(User).filter(User.email == "sarah.jenkins@cloudsentinel.io").first() or db.query(User).first()
        if step <= 2:
            user.privilege_level = "SUPERADMIN"
            user.risk_score = 80
            user.is_compromised = True
            db.commit()
            return {
                "step": step,
                "title": "Unauthorized Admin Role Injected",
                "status": "DETECTED",
                "message": f"Developer {user.email} injected FullAdministrator policy via API token bypassing CI/CD pipeline.",
                "risk_impact": "+35 Risk Score"
            }
        elif step <= 4:
            alt_id = f"ALT-SIM-{uuid.uuid4().hex[:5].upper()}"
            alert = ProactiveAlert(
                id=alt_id,
                title="Critical IAM Policy Tampering Detected",
                rule_triggered="RULE-IAM-009: Out-of-Band Admin Role Attachment",
                severity="CRITICAL",
                affected_entity=user.email,
                evidence="CloudTrail / AuditLog recorded iam:AttachUserPolicy from non-whitelisted IP.",
                risk_score_impact=35,
                status="OPEN",
                recommended_action="Detach policy, revoke API keys, freeze user permissions.",
                timestamp=now
            )
            db.add(alert)
            db.commit()
            return {
                "step": step,
                "title": "Privilege Escalation Alert Triggered",
                "status": "ALERTED",
                "message": f"Proactive alert {alt_id} opened for unauthorized IAM manipulation.",
                "risk_impact": "Threat Level: CRITICAL"
            }
        else:
            user.privilege_level = "STANDARD"
            user.risk_score = 12
            user.is_compromised = False
            db.commit()
            return {
                "step": step,
                "title": "IAM Rollback & Key Revocation Complete",
                "status": "RESOLVED",
                "message": "Policy detached, backdoor key terminated, standard developer role restored.",
                "risk_impact": "Risk Score Restored to SECURE"
            }

    elif scenario_id == "data_exfiltration":
        bucket = db.query(CloudResource).filter(CloudResource.resource_type == "BUCKET").first()
        bucket_name = bucket.name if bucket else "s3-customer-vault-prod"
        if step <= 2:
            anomaly = TrafficAnomaly(
                id=f"ANOM-{uuid.uuid4().hex[:5].upper()}",
                timestamp=now,
                source_ip="45.142.182.99",
                target_resource=bucket_name,
                anomaly_type="DATA_BURST",
                severity="CRITICAL",
                request_rate=8900,
                flag_reason="Outbound bandwidth sustained at 2.4 Gbps to unregistered bulletproof host.",
                is_blocked=False
            )
            db.add(anomaly)
            db.commit()
            return {
                "step": step,
                "title": "Massive Outbound Data Spike Detected",
                "status": "DETECTED",
                "message": f"DLP sensor registered 42 GB encrypted blob egress from {bucket_name} to 45.142.182.99.",
                "risk_impact": "+35 Network Risk"
            }
        elif step <= 4:
            alt_id = f"ALT-SIM-{uuid.uuid4().hex[:5].upper()}"
            alert = ProactiveAlert(
                id=alt_id,
                title="DLP Alert: Large-Scale Bucket Exfiltration in Progress",
                rule_triggered="RULE-DLP-003: S3 Multi-part Read Spike",
                severity="CRITICAL",
                affected_entity=bucket_name,
                evidence="Continuous chunk downloads matching sensitive database backup dumps.",
                risk_score_impact=40,
                status="OPEN",
                recommended_action="Block IP on Cloud Gateway, attach explicit Deny bucket policy.",
                timestamp=now
            )
            db.add(alert)
            db.commit()
            return {
                "step": step,
                "title": "Critical DLP Alert Dispatched",
                "status": "ALERTED",
                "message": f"Alert {alt_id} dispatched. Network graph highlighting active exfiltration vector.",
                "risk_impact": "System Risk: CRITICAL"
            }
        else:
            anoms = db.query(TrafficAnomaly).filter(TrafficAnomaly.source_ip == "45.142.182.99").all()
            for an in anoms:
                an.is_blocked = True
            db.commit()
            return {
                "step": step,
                "title": "Perimeter IP Blocked & Bucket Secured",
                "status": "RESOLVED",
                "message": "Gateway firewall rule attached. Outbound socket terminated. Zero data loss verified.",
                "risk_impact": "Risk Score Restored to SECURE"
            }

    return {"step": step, "title": "Simulation Step Executed", "status": "OK", "message": "Processed successfully."}

def reset_simulation(db: Session):
    """
    Restores the database state back to a pristine clean baseline for repeated presentations.
    """
    # Reset users
    users = db.query(User).all()
    for u in users:
        u.failed_login_attempts = 0
        u.is_compromised = False
        u.travel_anomaly = False
        if u.role == "ADMIN":
            u.privilege_level = "SUPERADMIN"
            u.risk_score = 10
        elif u.role == "SECURITY_ANALYST":
            u.privilege_level = "ELEVATED"
            u.risk_score = 12
        else:
            u.privilege_level = "STANDARD"
            u.risk_score = 15
        u.status = "ACTIVE"
        u.simulated_location = "San Francisco, US"

    # Reset resources
    resources = db.query(CloudResource).all()
    for r in resources:
        r.is_contained = False
        r.status = "ONLINE"
        r.risk_level = "CLEAN" if r.security_score > 85 else "LOW"

    # Clear SIM alerts or resolve them
    sim_alerts = db.query(ProactiveAlert).filter(ProactiveAlert.id.like("ALT-SIM%")).all()
    for a in sim_alerts:
        db.delete(a)

    # Clear SIM threats
    sim_threats = db.query(ThreatDetection).filter(ThreatDetection.id.like("THR-SIM%")).all()
    for t in sim_threats:
        db.delete(t)

    # Reset simulation incidents
    sim_incidents = db.query(Incident).filter(Incident.id.in_(["INC-2026-091", "INC-2026-092", "INC-2026-093"])).all()
    for inc in sim_incidents:
        db.delete(inc)

    # Reset simulation events
    sim_events = db.query(SecurityEvent).filter(SecurityEvent.id.like("EVT-SIM%")).all()
    for e in sim_events:
        db.delete(e)

    # Unblock anomalies
    anomalies = db.query(TrafficAnomaly).filter(TrafficAnomaly.source_ip.in_(["45.142.182.99", "185.220.101.5"])).all()
    for an in anomalies:
        db.delete(an)

    db.commit()
    return {"status": "SUCCESS", "message": "CloudSentinel telemetry reset to pristine baseline security state."}
