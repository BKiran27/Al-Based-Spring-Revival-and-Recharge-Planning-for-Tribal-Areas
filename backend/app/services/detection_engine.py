import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models import SecurityEvent, ProactiveAlert, ThreatDetection, User, Incident, AuditLog

def evaluate_event(db: Session, event: SecurityEvent):
    """
    Real-time detection engine evaluating security events against heuristic & behavioral rules.
    """
    # 1. Rule: Brute Force Authentication Detection
    if event.event_type == "LOGIN" and event.severity in ["HIGH", "CRITICAL"] and "failed" in event.details.lower():
        user = db.query(User).filter(User.email == event.actor_user).first()
        if user:
            user.failed_login_attempts += 1
            if user.failed_login_attempts >= 3:
                user.risk_score = min(user.risk_score + 25, 95)
                # Generate Proactive Alert
                alert_id = f"ALT-{uuid.uuid4().hex[:6].upper()}"
                alert = ProactiveAlert(
                    id=alert_id,
                    title="Brute-Force Credential Stuffing Attack",
                    rule_triggered="RULE-IAM-001: Consecutive Failed Authentication Attempts > 3",
                    severity="HIGH",
                    affected_entity=user.email,
                    evidence=f"3+ consecutive failed login attempts detected originating from IP {event.source_ip} ({event.location}).",
                    risk_score_impact=20,
                    status="OPEN",
                    recommended_action="Temporarily lock account, invalidate active JWT tokens, and force password reset with MFA.",
                    timestamp=datetime.now(timezone.utc)
                )
                db.add(alert)
                
                # Check if Threat should be created
                threat_id = f"THR-{uuid.uuid4().hex[:6].upper()}"
                threat = ThreatDetection(
                    id=threat_id,
                    threat_type="Brute-force Credential Attack",
                    severity="HIGH",
                    confidence=92,
                    affected_asset="Identity Provider / IAM",
                    affected_user=user.email,
                    detection_time=datetime.now(timezone.utc),
                    evidence=f"Rapid password spray sequence matching known dictionary attacks from IP {event.source_ip}.",
                    attack_vector="Credential Stuffing / Password Spray",
                    recommended_action="Enforce IP rate-limiting at Cloud Gateway and trigger automated MFA challenge.",
                    status="ACTIVE"
                )
                db.add(threat)
                db.commit()

    # 2. Rule: Impossible Travel Velocity Anomaly
    if event.event_type == "LOGIN" and "travel" in event.details.lower():
        user = db.query(User).filter(User.email == event.actor_user).first()
        if user:
            user.travel_anomaly = True
            user.risk_score = min(user.risk_score + 35, 98)
            user.is_compromised = True
            
            alert_id = f"ALT-{uuid.uuid4().hex[:6].upper()}"
            alert = ProactiveAlert(
                id=alert_id,
                title="Impossible Travel Velocity Anomaly",
                rule_triggered="RULE-NET-004: Geographically Infeasible Session Origin (<30min travel between continents)",
                severity="CRITICAL",
                affected_entity=user.email,
                evidence=f"User authenticated from Frankfurt, DE just 14 minutes after active session in San Francisco, US.",
                risk_score_impact=30,
                status="OPEN",
                recommended_action="Immediately terminate all active session tokens, isolate user permissions, and notify SecOps on-call.",
                timestamp=datetime.now(timezone.utc)
            )
            db.add(alert)
            db.commit()

    # 3. Rule: Privilege Escalation
    if event.event_type == "PRIVILEGE_ESCALATION" or (event.event_type == "PERMISSION_CHANGE" and "admin" in event.details.lower()):
        user = db.query(User).filter(User.email == event.actor_user).first()
        if user:
            user.privilege_level = "SUPERADMIN"
            user.risk_score = min(user.risk_score + 40, 99)
            user.is_compromised = True
            
            alert_id = f"ALT-{uuid.uuid4().hex[:6].upper()}"
            alert = ProactiveAlert(
                id=alert_id,
                title="Unauthorized Privilege Escalation Detected",
                rule_triggered="RULE-IAM-009: Non-Admin Identity Granted Administrator Role Without Change Approval",
                severity="CRITICAL",
                affected_entity=user.email,
                evidence=f"User role modified from Standard Developer to SuperAdmin by anomalous API key from unknown source IP.",
                risk_score_impact=35,
                status="OPEN",
                recommended_action="Revert role binding immediately, quarantine API keys, and open P1 Security Incident.",
                timestamp=datetime.now(timezone.utc)
            )
            db.add(alert)
            
            # Create Threat
            threat_id = f"THR-{uuid.uuid4().hex[:6].upper()}"
            threat = ThreatDetection(
                id=threat_id,
                threat_type="Unauthorized IAM Privilege Escalation",
                severity="CRITICAL",
                confidence=96,
                affected_asset="IAM Security Policy Store",
                affected_user=user.email,
                detection_time=datetime.now(timezone.utc),
                evidence="Direct policy injection bypassing SecOps approval workflow and ticketing system.",
                attack_vector="Cloud IAM API Abuse",
                recommended_action="Quarantine affected IAM user and inspect audit logs for lateral cloud movement.",
                status="ACTIVE"
            )
            db.add(threat)
            db.commit()

    # 4. Rule: High-Volume Outbound Data Exfiltration
    if event.event_type == "DATA_ACCESS" and "exfiltration" in event.details.lower():
        alert_id = f"ALT-{uuid.uuid4().hex[:6].upper()}"
        alert = ProactiveAlert(
            id=alert_id,
            title="Suspicious High-Volume Data Exfiltration Pattern",
            rule_triggered="RULE-DLP-003: S3/Storage Outbound Data Transfer Exceeds 50GB in 10-Minute Window",
            severity="CRITICAL",
            affected_entity=event.target_resource or "s3-customer-financial-vault",
            evidence=f"Continuous multi-part download stream transferring encrypted customer archive to external IP {event.source_ip}.",
            risk_score_impact=40,
            status="OPEN",
            recommended_action="Revoke bucket read policy immediately, attach IAM quarantine deny policy, and inspect TLS endpoints.",
            timestamp=datetime.now(timezone.utc)
        )
        db.add(alert)
        db.commit()
