from sqlalchemy.orm import Session
from app.models import User, CloudResource, ProactiveAlert, ThreatDetection, Incident, TrafficAnomaly, SecurityPostureCheck
from app.schemas import RiskBreakdown, RiskFactor

def calculate_system_risk(db: Session) -> RiskBreakdown:
    factors = []
    
    # 1. Identity Risk Analysis
    compromised_users = db.query(User).filter(User.is_compromised == True).all()
    travel_anomalies = db.query(User).filter(User.travel_anomaly == True).all()
    failed_logins_users = db.query(User).filter(User.failed_login_attempts >= 3).all()
    
    identity_risk = 0
    if compromised_users:
        pts = min(len(compromised_users) * 15, 30)
        identity_risk += pts
        factors.append(RiskFactor(
            factor="Compromised Identities",
            category="Identity",
            points=pts,
            description=f"{len(compromised_users)} user account(s) exhibit verified credential compromise indicators.",
            severity="CRITICAL"
        ))
    if travel_anomalies:
        pts = min(len(travel_anomalies) * 8, 16)
        identity_risk += pts
        factors.append(RiskFactor(
            factor="Impossible Travel Anomaly",
            category="Identity",
            points=pts,
            description=f"{len(travel_anomalies)} account(s) logged in from geographically conflicting regions within 15 minutes.",
            severity="HIGH"
        ))
    if failed_logins_users:
        pts = min(len(failed_logins_users) * 4, 12)
        identity_risk += pts
        factors.append(RiskFactor(
            factor="Brute-Force Login Patterns",
            category="Identity",
            points=pts,
            description=f"{len(failed_logins_users)} account(s) experienced multiple consecutive authentication failures.",
            severity="MEDIUM"
        ))

    # 2. Threat & Active Incident Severity
    active_threats = db.query(ThreatDetection).filter(ThreatDetection.status == "ACTIVE").all()
    crit_threats = [t for t in active_threats if t.severity == "CRITICAL"]
    high_threats = [t for t in active_threats if t.severity == "HIGH"]
    
    threat_severity_risk = 0
    if crit_threats:
        pts = min(len(crit_threats) * 18, 36)
        threat_severity_risk += pts
        factors.append(RiskFactor(
            factor="Active Critical Threats",
            category="Threats",
            points=pts,
            description=f"{len(crit_threats)} uncontained critical threat vector(s) targeting production infrastructure.",
            severity="CRITICAL"
        ))
    if high_threats:
        pts = min(len(high_threats) * 9, 18)
        threat_severity_risk += pts
        factors.append(RiskFactor(
            factor="High-Severity Threat Activity",
            category="Threats",
            points=pts,
            description=f"{len(high_threats)} high-priority threat detection(s) requiring security team triage.",
            severity="HIGH"
        ))

    # 3. Traffic Anomaly Risk
    active_traffic_anomalies = db.query(TrafficAnomaly).filter(TrafficAnomaly.is_blocked == False).all()
    traffic_risk = 0
    if active_traffic_anomalies:
        pts = min(len(active_traffic_anomalies) * 10, 20)
        traffic_risk += pts
        factors.append(RiskFactor(
            factor="Unmitigated Traffic Anomalies",
            category="Network",
            points=pts,
            description=f"{len(active_traffic_anomalies)} suspicious traffic stream(s) (SYN Flood / Outbound Burst) active.",
            severity="HIGH"
        ))

    # 4. Resource Vulnerability & Exposure Risk
    uncontained_risky_resources = db.query(CloudResource).filter(
        CloudResource.risk_level.in_(["CRITICAL", "HIGH"]),
        CloudResource.is_contained == False
    ).all()
    public_resources = db.query(CloudResource).filter(CloudResource.public_access == True).all()
    
    resource_risk = 0
    if uncontained_risky_resources:
        pts = min(len(uncontained_risky_resources) * 12, 24)
        resource_risk += pts
        factors.append(RiskFactor(
            factor="Uncontained High-Risk Cloud Assets",
            category="Resources",
            points=pts,
            description=f"{len(uncontained_risky_resources)} cloud compute/storage resource(s) operating without network isolation.",
            severity="HIGH"
        ))
    if public_resources:
        pts = min(len(public_resources) * 4, 12)
        resource_risk += pts
        factors.append(RiskFactor(
            factor="Publicly Accessible Resources",
            category="Resources",
            points=pts,
            description=f"{len(public_resources)} resource(s) exposed to the public internet without perimeter zero-trust.",
            severity="MEDIUM"
        ))

    # 5. Posture & Compliance Gap
    failing_checks = db.query(SecurityPostureCheck).filter(SecurityPostureCheck.status == "CRITICAL").all()
    posture_risk = 0
    if failing_checks:
        pts = min(len(failing_checks) * 5, 15)
        posture_risk += pts
        factors.append(RiskFactor(
            factor="Critical Security Posture Deficiencies",
            category="Compliance",
            points=pts,
            description=f"{len(failing_checks)} CIS Benchmark check(s) currently failing critical compliance requirements.",
            severity="HIGH"
        ))

    # Base baseline security score (baseline cloud noise: 12)
    total_score = min(max(10, 10 + identity_risk + threat_severity_risk + traffic_risk + resource_risk + posture_risk), 100)
    
    if total_score >= 80:
        posture_status = "CRITICAL"
    elif total_score >= 60:
        posture_status = "HIGH_RISK"
    elif total_score >= 35:
        posture_status = "ELEVATED"
    else:
        posture_status = "SECURE"

    return RiskBreakdown(
        total_score=total_score,
        posture_status=posture_status,
        identity_risk=identity_risk,
        traffic_risk=traffic_risk,
        resource_risk=resource_risk,
        threat_severity_risk=threat_severity_risk,
        posture_risk=posture_risk,
        factors=factors
    )
