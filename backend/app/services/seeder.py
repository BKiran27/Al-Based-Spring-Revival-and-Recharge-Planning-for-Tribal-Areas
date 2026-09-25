import random
import uuid
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.core.security import hash_password
from app.models import (
    User, RolePermission, CloudResource, SecurityEvent, 
    ProactiveAlert, ThreatDetection, Incident, IncidentAction, 
    TrafficRecord, TrafficAnomaly, MalwareScanResult, 
    SecurityPostureCheck, AuditLog
)

def seed_database(db: Session):
    # Only seed if users table is empty
    if db.query(User).count() > 0:
        return

    print("Seeding CloudSentinel database with high-fidelity SecOps dataset...")
    now = datetime.now(timezone.utc)
    hashed_pwd = hash_password("Password123!")

    # 1. Users (25 users across different roles)
    raw_users = [
        ("admin@cloudsentinel.io", "Sarah Vance (Admin)", "ADMIN", "SUPERADMIN", 10, "Security Operations", "San Francisco, US", False, False),
        ("analyst@cloudsentinel.io", "Marcus Reed (Lead Analyst)", "SECURITY_ANALYST", "ELEVATED", 12, "SOC Operations", "San Francisco, US", False, False),
        ("operator@cloudsentinel.io", "Elena Rostova (DevOps Lead)", "CLOUD_OPERATOR", "ELEVATED", 18, "Infrastructure", "London, UK", False, False),
        ("viewer@cloudsentinel.io", "Priyah Patel (Executive)", "VIEWER", "RESTRICTED", 5, "Executive Leadership", "New York, US", False, False),
        ("alex.chen@cloudsentinel.io", "Alex Chen (Staff Engineer)", "CLOUD_OPERATOR", "STANDARD", 45, "Platform Engineering", "Seattle, US", False, True),
        ("sarah.jenkins@cloudsentinel.io", "Sarah Jenkins (Senior Developer)", "CLOUD_OPERATOR", "STANDARD", 38, "Backend Services", "Austin, US", False, False),
        ("david.ross@cloudsentinel.io", "David Ross (Data Scientist)", "VIEWER", "STANDARD", 22, "AI & Analytics", "Boston, US", False, False),
        ("wei.zhang@cloudsentinel.io", "Wei Zhang (Kubernetes Architect)", "CLOUD_OPERATOR", "ELEVATED", 15, "Cloud Architecture", "Singapore, SG", False, False),
        ("carlos.mendez@cloudsentinel.io", "Carlos Mendez (Frontend Lead)", "VIEWER", "STANDARD", 10, "UI Engineering", "Madrid, ES", False, False),
        ("aisha.mansoor@cloudsentinel.io", "Aisha Al-Mansoor (SecOps Analyst)", "SECURITY_ANALYST", "ELEVATED", 8, "SOC Operations", "Dubai, AE", False, False),
        ("jordan.taylor@cloudsentinel.io", "Jordan Taylor (Cloud Architect)", "CLOUD_OPERATOR", "ELEVATED", 14, "Infrastructure", "Toronto, CA", False, False),
        ("hannah.schmidt@cloudsentinel.io", "Hannah Schmidt (DBA Lead)", "CLOUD_OPERATOR", "ELEVATED", 20, "Database Ops", "Berlin, DE", False, False),
        ("kenji.sato@cloudsentinel.io", "Kenji Sato (Site Reliability Eng)", "CLOUD_OPERATOR", "STANDARD", 16, "SRE", "Tokyo, JP", False, False),
        ("lucas.silva@cloudsentinel.io", "Lucas Silva (API Integrations)", "VIEWER", "STANDARD", 12, "Platform Services", "Sao Paulo, BR", False, False),
        ("chloe.dupont@cloudsentinel.io", "Chloe Dupont (Compliance Officer)", "VIEWER", "RESTRICTED", 5, "GRC & Audit", "Paris, FR", False, False),
        ("nathan.davis@cloudsentinel.io", "Nathan Davis (Junior Developer)", "VIEWER", "STANDARD", 30, "Backend Services", "Denver, US", False, False),
        ("olivia.kim@cloudsentinel.io", "Olivia Kim (Incident Responder)", "SECURITY_ANALYST", "ELEVATED", 9, "SOC Operations", "Seoul, KR", False, False),
        ("vikram.singh@cloudsentinel.io", "Vikram Singh (Cloud Security Eng)", "SECURITY_ANALYST", "ELEVATED", 11, "SecOps Engineering", "Bengaluru, IN", False, False),
        ("emily.watson@cloudsentinel.io", "Emily Watson (Product Manager)", "VIEWER", "RESTRICTED", 8, "Product Ops", "Chicago, US", False, False),
        ("gabriel.moreau@cloudsentinel.io", "Gabriel Moreau (Network Admin)", "CLOUD_OPERATOR", "ELEVATED", 17, "Core Network", "Montreal, CA", False, False),
        ("ananya.rao@cloudsentinel.io", "Ananya Rao (QA Automation)", "VIEWER", "STANDARD", 14, "Quality Assurance", "Hyderabad, IN", False, False),
        ("liam.o-connor@cloudsentinel.io", "Liam O'Connor (DevSecOps)", "SECURITY_ANALYST", "ELEVATED", 15, "DevSecOps", "Dublin, IE", False, False),
        ("sofia.rossi@cloudsentinel.io", "Sofia Rossi (Security Intern)", "VIEWER", "RESTRICTED", 18, "SOC Operations", "Milan, IT", False, False),
        ("mateo.hernandez@cloudsentinel.io", "Mateo Hernandez (Backend Eng)", "CLOUD_OPERATOR", "STANDARD", 25, "Backend Services", "Mexico City, MX", False, False),
        ("service.account.ci@cloudsentinel.io", "CI/CD Pipeline Service Account", "CLOUD_OPERATOR", "SUPERADMIN", 28, "Automated CI/CD", "AWS US-East", False, False)
    ]

    for email, name, role, priv, risk, dept, loc, comp, travel in raw_users:
        db.add(User(
            id=f"usr-{uuid.uuid4().hex[:6]}",
            email=email,
            full_name=name,
            hashed_password=hashed_pwd,
            role=role,
            privilege_level=priv,
            risk_score=risk,
            status="ACTIVE",
            department=dept,
            mfa_enabled=True,
            failed_login_attempts=2 if risk > 35 else 0,
            is_compromised=comp,
            travel_anomaly=travel,
            simulated_location=loc,
            last_login=now - timedelta(minutes=random.randint(5, 720))
        ))
    db.commit()

    # 2. Cloud Resources (20 resources across AWS, Azure, GCP simulation)
    resources_data = [
        ("res-vm-01", "prod-api-cluster-worker-01", "VM", "AWS (Simulated)", "us-east-1", "ONLINE", "Elena Rostova", "HIGH", 72, True, True),
        ("res-vm-02", "prod-api-cluster-worker-02", "VM", "AWS (Simulated)", "us-east-1", "ONLINE", "Elena Rostova", "LOW", 92, False, True),
        ("res-vm-03", "payment-service-vault-node", "VM", "AWS (Simulated)", "us-east-2", "ONLINE", "Sarah Vance", "CLEAN", 98, False, True),
        ("res-vm-04", "analytics-spark-master-01", "VM", "GCP (Simulated)", "us-central1", "ONLINE", "David Ross", "MEDIUM", 80, False, True),
        ("res-vm-05", "auth-redis-sentinel-cache", "VM", "AWS (Simulated)", "eu-west-1", "ONLINE", "Elena Rostova", "CLEAN", 95, False, True),
        ("s3-customer-vault-prod", "customer-pii-storage-primary", "BUCKET", "AWS (Simulated)", "us-east-1", "ONLINE", "Sarah Vance", "CRITICAL", 55, True, False),
        ("s3-finance-ledger-backup", "finance-immutable-ledger-archive", "BUCKET", "AWS (Simulated)", "us-west-2", "ONLINE", "Priyah Patel", "CLEAN", 99, False, True),
        ("gcs-analytics-lake", "gcs-telemetry-raw-data-lake", "BUCKET", "GCP (Simulated)", "us-central1", "ONLINE", "David Ross", "LOW", 88, False, True),
        ("azure-blob-logs", "azure-security-cold-storage-logs", "BUCKET", "AZURE (Simulated)", "eastus", "ONLINE", "Marcus Reed", "CLEAN", 94, False, True),
        ("rds-postgres-primary", "aurora-pg-ecommerce-cluster", "DATABASE", "AWS (Simulated)", "us-east-1", "ONLINE", "Hannah Schmidt", "LOW", 91, False, True),
        ("rds-aurora-replica", "aurora-pg-readonly-replica-01", "DATABASE", "AWS (Simulated)", "us-east-1", "ONLINE", "Hannah Schmidt", "CLEAN", 96, False, True),
        ("cosmos-db-sessions", "azure-cosmos-global-user-sessions", "DATABASE", "AZURE (Simulated)", "westeurope", "ONLINE", "Sarah Jenkins", "CLEAN", 93, False, True),
        ("dynamodb-threat-cache", "dynamo-active-threat-state-tbl", "DATABASE", "AWS (Simulated)", "us-east-1", "ONLINE", "Marcus Reed", "CLEAN", 97, False, True),
        ("api-gateway-public", "kong-api-gateway-edge-proxy", "API_GATEWAY", "AWS (Simulated)", "us-east-1", "ONLINE", "Lucas Silva", "MEDIUM", 78, True, True),
        ("k8s-ingress-traefik", "traefik-edge-ingress-controller", "API_GATEWAY", "GCP (Simulated)", "us-central1", "ONLINE", "Wei Zhang", "LOW", 89, True, True),
        ("k8s-pod-billing-svc", "eks-billing-engine-pod-x77", "CONTAINER", "AWS (Simulated)", "us-east-1", "ONLINE", "Elena Rostova", "LOW", 90, False, True),
        ("k8s-pod-auth-svc", "eks-oauth-jwt-issuer-pod-k41", "CONTAINER", "AWS (Simulated)", "us-east-1", "ONLINE", "Marcus Reed", "LOW", 88, False, True),
        ("iam-prod-deployer", "role/CloudProductionDeployerRole", "IAM_ROLE", "AWS (Simulated)", "global", "ONLINE", "Sarah Vance", "HIGH", 68, False, True),
        ("iam-secops-admin", "role/SecOpsGlobalIncidentResponder", "IAM_ROLE", "AWS (Simulated)", "global", "ONLINE", "Marcus Reed", "CLEAN", 98, False, True),
        ("iam-readonly-auditor", "role/ComplianceReadOnlyAuditRole", "IAM_ROLE", "AWS (Simulated)", "global", "ONLINE", "Chloe Dupont", "CLEAN", 100, False, True)
    ]

    for rid, name, rtype, prov, reg, stat, owner, risk, score, pub, enc in resources_data:
        db.add(CloudResource(
            id=rid,
            name=name,
            resource_type=rtype,
            provider=prov,
            region=reg,
            status=stat,
            owner=owner,
            risk_level=risk,
            security_score=score,
            public_access=pub,
            encryption_enabled=enc,
            tags='{"environment": "production", "tier": "critical", "compliance": "pci-dss"}',
            is_contained=False,
            last_activity=now - timedelta(minutes=random.randint(2, 60))
        ))
    db.commit()

    # 3. Security Events (120+ events generated)
    event_types = ["LOGIN", "API_CALL", "FILE_ACCESS", "PERMISSION_CHANGE", "NETWORK_ANOMALY", "MALWARE_DETECTED", "CONFIGURATION_CHANGE", "PRIVILEGE_ESCALATION", "DATA_ACCESS"]
    severities = ["INFO", "INFO", "LOW", "LOW", "MEDIUM", "HIGH", "CRITICAL"]
    ips = ["198.51.100.23", "203.0.113.88", "192.0.2.14", "185.220.101.5", "45.142.182.99", "54.210.12.8", "34.102.13.4", "10.0.1.45"]
    
    events_to_add = []
    # Key anchor events
    events_to_add.append(SecurityEvent(
        id="EVT-10001",
        event_type="LOGIN",
        severity="CRITICAL",
        actor_user="alex.chen@cloudsentinel.io",
        source_ip="185.220.101.5",
        location="St. Petersburg, RU",
        target_resource="Cloud SSO Portal",
        action_taken="LOGIN_CHALLENGE_FLAGGED",
        details="Authentication from high-risk Tor Exit Node; consecutive failed attempts observed.",
        is_anomaly=True,
        timestamp=now - timedelta(minutes=14)
    ))
    events_to_add.append(SecurityEvent(
        id="EVT-10002",
        event_type="PRIVILEGE_ESCALATION",
        severity="CRITICAL",
        actor_user="sarah.jenkins@cloudsentinel.io",
        source_ip="194.26.29.112",
        location="Frankfurt, DE",
        target_resource="iam-prod-deployer",
        action_taken="POLICY_ATTACH_MONITORED",
        details="Attempted attachment of AdministratorAccess policy outside maintenance window.",
        is_anomaly=True,
        timestamp=now - timedelta(minutes=28)
    ))
    events_to_add.append(SecurityEvent(
        id="EVT-10003",
        event_type="DATA_ACCESS",
        severity="CRITICAL",
        actor_user="service.account.ci@cloudsentinel.io",
        source_ip="45.142.182.99",
        location="Amsterdam, NL",
        target_resource="s3-customer-vault-prod",
        action_taken="RATE_LIMIT_TRIGGERED",
        details="Unusual bulk GetObject requests exceeding baseline threshold by 450%.",
        is_anomaly=True,
        timestamp=now - timedelta(minutes=42)
    ))

    # Add 117 other realistic chronological events
    for i in range(4, 125):
        etype = random.choice(event_types)
        sev = random.choice(severities)
        u_tuple = random.choice(raw_users)
        r_tuple = random.choice(resources_data)
        ip = random.choice(ips)
        ts = now - timedelta(minutes=random.randint(1, 1440))
        
        detail_msg = f"Standard {etype} executed on {r_tuple[0]} by {u_tuple[0]}."
        is_anom = False
        if sev in ["HIGH", "CRITICAL"]:
            is_anom = True
            detail_msg = f"Heuristic alert: Suspicious {etype} threshold exceeded on {r_tuple[0]}."

        events_to_add.append(SecurityEvent(
            id=f"EVT-{10000 + i}",
            event_type=etype,
            severity=sev,
            actor_user=u_tuple[0],
            source_ip=ip,
            location=u_tuple[6],
            target_resource=r_tuple[0],
            action_taken="ALLOWED" if sev in ["INFO", "LOW"] else "FLAGGED_FOR_AUDIT",
            details=detail_msg,
            is_anomaly=is_anom,
            timestamp=ts
        ))

    db.bulk_save_objects(events_to_add)
    db.commit()

    # 4. Proactive Alerts (25 alerts)
    alerts_data = [
        ("ALT-801", "CRITICAL: Potential Credential Compromise & Impossible Travel", "RULE-IAM-004", "CRITICAL", "alex.chen@cloudsentinel.io", "Concurrent sessions in Seattle, US and St. Petersburg, RU within 14 minutes.", 35, "OPEN", "Suspend active session and force password change.", "Marcus Reed"),
        ("ALT-802", "CRITICAL: S3 Public Access & Unencrypted Sensitive Bucket", "RULE-STORAGE-001", "CRITICAL", "s3-customer-vault-prod", "Bucket policy allows s3:GetObject to Principal: * without SSL requirement.", 30, "OPEN", "Enable S3 Block Public Access and apply KMS encryption.", "Sarah Vance"),
        ("ALT-803", "HIGH: Out-of-Band Admin Policy Attached to Role", "RULE-IAM-009", "HIGH", "iam-prod-deployer", "AdministratorAccess attached by developer API key.", 25, "OPEN", "Revert policy attachment and inspect CloudTrail logs.", "Aisha Al-Mansoor"),
        ("ALT-804", "HIGH: Excessive Outbound Network Bandwidth Spike", "RULE-NET-003", "HIGH", "res-vm-01", "Egress traffic peaked at 2.1 Gbps for 18 consecutive minutes.", 20, "ACKNOWLEDGED", "Inspect network flow logs and isolate host if anomalous.", "Vikram Singh"),
        ("ALT-805", "MEDIUM: Dormant Identity Activated Outside Working Hours", "RULE-IAM-006", "MEDIUM", "nathan.davis@cloudsentinel.io", "Account dormant for 45 days performed bulk IAM enumerations at 03:14 UTC.", 15, "OPEN", "Prompt for MFA step-up and verify with user manager.", "Olivia Kim"),
        ("ALT-806", "MEDIUM: SSH Port 22 Open to Public Internet (0.0.0.0/0)", "RULE-SEC-011", "MEDIUM", "res-vm-04", "Security group sg-09f1 allows ingress from any IP to TCP port 22.", 15, "ACKNOWLEDGED", "Restrict SSH access to corporate VPN IP pool.", "Elena Rostova"),
        ("ALT-807", "LOW: IAM User MFA Not Enforced on Secondary Account", "RULE-IAM-002", "LOW", "carlos.mendez@cloudsentinel.io", "Virtual MFA device deleted without replacement.", 10, "RESOLVED", "MFA successfully re-enrolled.", "Liam O'Connor"),
        ("ALT-808", "INFO: Monthly KMS Key Rotation Completed", "RULE-COMP-001", "INFO", "kms-vault-primary", "Automated annual key rotation succeeded with zero downtime.", 0, "RESOLVED", "No action needed.", "Sarah Vance")
    ]

    for i in range(9, 26):
        aid = f"ALT-{800 + i}"
        sev = random.choice(["HIGH", "MEDIUM", "LOW", "INFO"])
        alerts_data.append((
            aid,
            f"Automated Policy Check: {random.choice(['API Gateway Rate Limit', 'TLS 1.2 Deprecation Warning', 'Unattached EBS Volume Encryption', 'Container Image Vulnerability Scan'])}",
            f"RULE-SEC-{random.randint(10, 99)}",
            sev,
            random.choice(resources_data)[0],
            "Automated telemetry telemetry signature match.",
            random.randint(5, 20),
            random.choice(["OPEN", "ACKNOWLEDGED", "RESOLVED"]),
            "Review configuration against CIS benchmark guidance.",
            random.choice(["Marcus Reed", "Aisha Al-Mansoor", "Olivia Kim"])
        ))

    for aid, title, rule, sev, aff, evid, pts, stat, rec, asgn in alerts_data:
        db.add(ProactiveAlert(
            id=aid,
            title=title,
            rule_triggered=rule,
            severity=sev,
            affected_entity=aff,
            evidence=evid,
            risk_score_impact=pts,
            status=stat,
            recommended_action=rec,
            assigned_to=asgn,
            timestamp=now - timedelta(minutes=random.randint(5, 720))
        ))
    db.commit()

    # 5. Threats (12 realistic threats)
    threats_data = [
        ("THR-2026-01", "Credential Abuse & Account Takeover (ATO)", "CRITICAL", 96, "Cloud SSO Identity Provider", "alex.chen@cloudsentinel.io", "Tor exit node password spray matching known breach databases.", "Credential Stuffing", "Quarantine identity and enforce hardware token reset.", "ACTIVE"),
        ("THR-2026-02", "Unauthorized IAM Privilege Escalation", "CRITICAL", 94, "iam-prod-deployer", "sarah.jenkins@cloudsentinel.io", "Developer role escalated to AdministratorAccess without approval.", "IAM Policy Abuse", "Roll back IAM policy attachment and revoke session credentials.", "ACTIVE"),
        ("THR-2026-03", "Data Exfiltration & S3 Storage Harvesting", "CRITICAL", 91, "s3-customer-vault-prod", "service.account.ci@cloudsentinel.io", "Multi-part download burst of 45GB encrypted customer backups.", "Cloud Storage Exfiltration", "Attach explicit Deny bucket policy and terminate active connections.", "INVESTIGATING"),
        ("THR-2026-04", "External Port Sweep & Reconnaissance Probe", "HIGH", 88, "api-gateway-public", None, "Rapid SYN scans probing ports 22, 80, 443, 8080, and 9200.", "Port Scanning & Network Recon", "Update Gateway rate limiter and blacklist scanning subnet.", "ACTIVE"),
        ("THR-2026-05", "Malware C2 Beaconing Communication", "HIGH", 85, "res-vm-01", "elena.rostova@cloudsentinel.io", "Periodic heartbeat requests to suspicious dynamic DNS endpoint.", "Command & Control (C2)", "Isolate host from production VPC and initiate memory dump.", "INVESTIGATING"),
        ("THR-2026-06", "Brute-Force SSH Infiltration Attempt", "MEDIUM", 82, "res-vm-04", None, "Over 1,200 failed SSH handshakes from distributed IP pool in 30 minutes.", "Distributed Password Spray", "Disable password authentication and enforce SSH key pairs.", "MITIGATED"),
        ("THR-2026-07", "Crypto-Mining Container Process Spawning", "MEDIUM", 79, "k8s-pod-billing-svc", None, "CPU utilization pinned at 100% with xmrig string in container memory.", "Resource Hijacking", "Kill pod replica and inspect base container image registry.", "MITIGATED"),
        ("THR-2026-08", "Server-Side Request Forgery (SSRF) Vector", "HIGH", 87, "api-gateway-public", None, "Inbound HTTP parameter probing metadata IP 169.254.169.254.", "SSRF Exploitation", "Enforce IMDSv2 and block link-local address in application gateway.", "ACTIVE"),
        ("THR-2026-09", "CloudTrail Audit Logging Tampering", "CRITICAL", 95, "azure-security-cold-storage-logs", "service.account.ci@cloudsentinel.io", "Attempted StopLogging API call issued against global trail.", "Defense Evasion", "Enable S3 Object Lock and configure immutable MFA Delete.", "MITIGATED"),
        ("THR-2026-10", "Dormant Admin Account Resurrection", "MEDIUM", 76, "Identity Store", "nathan.davis@cloudsentinel.io", "Account dormant 60+ days logged in from novel IP range.", "Account Dormancy Exploitation", "Lock account pending supervisor verification.", "ACTIVE"),
        ("THR-2026-11", "Suspicious Database Export via Read Replica", "HIGH", 83, "rds-aurora-replica", "david.ross@cloudsentinel.io", "Continuous SELECT * queries running on credit_cards table.", "Insider Threat / Data Theft", "Revoke database session and restrict database user permissions.", "INVESTIGATING"),
        ("THR-2026-12", "Kubernetes RBAC ClusterRole Injection", "HIGH", 89, "k8s-ingress-traefik", "wei.zhang@cloudsentinel.io", "System:anonymous bound to cluster-admin role in staging namespace.", "RBAC Misconfiguration", "Delete anomalous role binding and rotate cluster certificates.", "MITIGATED")
    ]

    for tid, ttype, sev, conf, asset, usr, evid, vec, rec, stat in threats_data:
        db.add(ThreatDetection(
            id=tid,
            threat_type=ttype,
            severity=sev,
            confidence=conf,
            affected_asset=asset,
            affected_user=usr,
            detection_time=now - timedelta(minutes=random.randint(10, 480)),
            evidence=evid,
            attack_vector=vec,
            recommended_action=rec,
            status=stat
        ))
    db.commit()

    # 6. Incidents (6 realistic incidents with full audit action workflows)
    incidents_data = [
        ("INC-2026-001", "Suspicious Privilege Escalation in Prod Cluster", "CRITICAL", "INVESTIGATING", "sarah.jenkins@cloudsentinel.io", "iam-prod-deployer", "Marcus Reed", "Unauthorized AdministratorAccess role injection detected on production deployment role.", "Stolen CI/CD token used to execute iam:AttachRolePolicy API.", "UNCONTAINED", "THR-2026-02"),
        ("INC-2026-002", "Anomalous S3 Bucket Access Pattern from Unrecognized Subnet", "CRITICAL", "CONTAINED", "service.account.ci@cloudsentinel.io", "s3-customer-vault-prod", "Aisha Al-Mansoor", "Bulk download of customer financial blobs exceeding normal baseline.", "Exposed API key in repository commit history.", "CONTAINED", "THR-2026-03"),
        ("INC-2026-003", "Repeated MFA Challenge Failures & Geographic Discrepancy", "HIGH", "INVESTIGATING", "alex.chen@cloudsentinel.io", "Cloud SSO Portal", "Olivia Kim", "Staff engineer account accessed from St. Petersburg, RU within 14 minutes of US session.", "Credential stuffing attack against corporate SSO portal.", "UNCONTAINED", "THR-2026-01"),
        ("INC-2026-004", "Compromised Service Account Token Detected via Canary Endpoint", "HIGH", "RESOLVED", "service.account.ci@cloudsentinel.io", "api-gateway-public", "Marcus Reed", "Canary API token invoked from unregistered residential IP.", "Automated honey-token triggered defensive alarm.", "RESOLVED", "THR-2026-04"),
        ("INC-2026-005", "Outdated TLS Configuration on Public API Gateway", "MEDIUM", "RESOLVED", None, "api-gateway-public", "Vikram Singh", "TLS 1.0 and 1.1 handshakes accepted on edge proxy.", "Legacy client backward-compatibility flag left enabled.", "RESOLVED", None),
        ("INC-2026-006", "Potential Ransomware Precursor - Mass Encryption Header Modification", "CRITICAL", "CONTAINED", "elena.rostova@cloudsentinel.io", "res-vm-01", "Marcus Reed", "High-frequency file rename operations detected on mounted block volumes.", "Malicious macro execution in staging test harness.", "CONTAINED", "THR-2026-05")
    ]

    for iid, title, sev, stat, usr, res, anal, sumry, root, cont, tid in incidents_data:
        inc = Incident(
            id=iid,
            title=title,
            severity=sev,
            status=stat,
            affected_user=usr,
            affected_resource=res,
            assigned_analyst=anal,
            summary=sumry,
            root_cause=root,
            containment_status=cont,
            threat_id=tid,
            created_at=now - timedelta(hours=random.randint(2, 24)),
            resolved_at=now - timedelta(hours=1) if stat == "RESOLVED" else None
        )
        db.add(inc)
        db.commit()

        # Add actions
        act1 = IncidentAction(
            incident_id=iid,
            action_type="DETECTION",
            description=f"Incident opened automatically based on detection alert {tid or 'SURVEILLANCE'}.",
            performed_by="CloudSentinel AI Engine",
            timestamp=now - timedelta(hours=random.randint(2, 24))
        )
        db.add(act1)
        if stat in ["CONTAINED", "RESOLVED"]:
            act2 = IncidentAction(
                incident_id=iid,
                action_type="CONTAIN_RESOURCE",
                description=f"SecOps analyst {anal} quarantined affected resource {res or usr} and severed network egress.",
                performed_by=anal,
                timestamp=now - timedelta(hours=random.randint(1, 2))
            )
            db.add(act2)
        if stat == "RESOLVED":
            act3 = IncidentAction(
                incident_id=iid,
                action_type="RESOLVE",
                description="Root cause eliminated, credentials rotated, all verification health checks passed.",
                performed_by=anal,
                timestamp=now - timedelta(minutes=45)
            )
            db.add(act3)
        db.commit()

    # 7. Traffic Records (24 historical hourly points)
    for h in range(24, 0, -1):
        ts = now - timedelta(hours=h)
        db.add(TrafficRecord(
            timestamp=ts,
            requests_per_sec=random.randint(450, 1800),
            incoming_mbps=round(random.uniform(40.0, 120.0), 1),
            outgoing_mbps=round(random.uniform(20.0, 85.0), 1),
            failed_requests=random.randint(2, 25),
            active_connections=random.randint(800, 2400),
            anomalous_traffic=(h in [2, 3, 14])
        ))

    # 8. Traffic Anomalies
    traffic_anomalies_data = [
        ("ANOM-101", now - timedelta(minutes=18), "185.220.101.5", "api-gateway-public", "BRUTE_FORCE", "HIGH", 4200, "150 authentication attempts per second targeting /api/auth/login.", True),
        ("ANOM-102", now - timedelta(minutes=35), "45.142.182.99", "s3-customer-vault-prod", "DATA_BURST", "CRITICAL", 8900, "Outbound transfer sustained at 2.4 Gbps to unknown offshore endpoint.", False),
        ("ANOM-103", now - timedelta(minutes=62), "103.251.167.20", "res-vm-01", "PORT_SCAN", "MEDIUM", 1200, "Sequential TCP SYN sweep across destination ports 1024-65535.", True),
        ("ANOM-104", now - timedelta(minutes=110), "89.248.165.74", "rds-postgres-primary", "SYN_FLOOD", "HIGH", 6800, "Incomplete TCP handshake flood exhausting socket backlog.", True),
        ("ANOM-105", now - timedelta(minutes=240), "194.26.29.112", "k8s-ingress-traefik", "HTTP_REQUEST_SMUGGLING", "HIGH", 3100, "Malformed Content-Length and Transfer-Encoding headers.", False)
    ]
    for aid, ts, sip, tgt, atype, sev, rate, reason, blk in traffic_anomalies_data:
        db.add(TrafficAnomaly(
            id=aid,
            timestamp=ts,
            source_ip=sip,
            target_resource=tgt,
            anomaly_type=atype,
            severity=sev,
            request_rate=rate,
            flag_reason=reason,
            is_blocked=blk
        ))
    db.commit()

    # 9. Malware Scans (Simulated safe sandbox)
    scans_data = [
        ("SCAN-001", "aws_ec2_management_agent.sh", "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", "Shell Script", 14.2, "SAFE", 5, '["AWS Verified Signature"]', '["Normal System Monitoring", "Standard Cron Scheduling"]', "Approve binary for deployment fleet.", now - timedelta(hours=4)),
        ("SCAN-002", "powershell_reverse_beacon.ps1", "8f3b6c2018a1a9e88b4ef2134517b6a1e9487b41e3451b6972412b1928371928", "PowerShell", 24.8, "MALICIOUS", 98, '["Trojan.PowerShell.ReverseTCP", "YARA_RULE_AMSI_BYPASS"]', '["Encrypted Base64 Payload", "AMSI Memory Patching", "Outbound Socket Beaconing"]', "Immediately quarantine file and isolate invoking machine.", now - timedelta(hours=2)),
        ("SCAN-003", "database_migration_v4.py", "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8", "Python", 45.1, "SAFE", 10, '["Internal Code Signing Verified"]', '["SQL Schema Alteration", "Index Optimization"]', "Safe for production deployment.", now - timedelta(hours=6)),
        ("SCAN-004", "credential_dumper_mimikatz_sim.bin", "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9", "Windows PE32", 420.5, "MALICIOUS", 99, '["HackTool.Win64.Mimikatz", "LSASS_Memory_Scanner"]', '["LSASS Injection", "SeDebugPrivilege Acquisition", "Cleartext NTLM Extraction"]', "Hard block hash in EDR and trigger emergency endpoint quarantine.", now - timedelta(minutes=45)),
        ("SCAN-005", "unknown_debug_probe.so", "a354203de63b39b15703422eac8644f3d448a12d6694b1a95cb34603c6cac64e", "ELF Shared Object", 88.0, "SUSPICIOUS", 65, '["Unsigned Dynamic Library"]', '["PTrace Injection", "Hidden Symbol Export"]', "Submit to deep cloud sandbox for dynamic execution trace.", now - timedelta(minutes=90))
    ]
    for sid, fname, fhash, ftype, fsize, verd, rscore, sigs, beh, rec, ts in scans_data:
        db.add(MalwareScanResult(
            id=sid,
            file_name=fname,
            file_hash_sha256=fhash,
            file_type=ftype,
            file_size_kb=fsize,
            verdict=verd,
            risk_score=rscore,
            matched_signatures=sigs,
            behavioral_indicators=beh,
            recommended_action=rec,
            scan_timestamp=ts
        ))
    db.commit()

    # 10. Security Posture Checks (CIS Benchmarks)
    checks_data = [
        ("CHK-CIS-1.1", "CIS-1.1", "Ensure Multi-Factor Authentication (MFA) is enabled for all IAM users", "IAM", "CIS Benchmark v1.4", "CRITICAL", "PASSED", "Accounts lacking MFA are highly vulnerable to credential stuffing.", "Unauthorized access to cloud infrastructure via stolen passwords.", "Enforce MFA registration policy across all IAM identity pools.", 0),
        ("CHK-CIS-1.4", "CIS-1.4", "Ensure no root account access keys exist", "IAM", "CIS Benchmark v1.4", "CRITICAL", "PASSED", "Root account access keys allow unrestricted cloud control.", "Total cloud account takeover.", "Delete root access keys and use delegated IAM roles.", 0),
        ("CHK-CIS-2.1", "CIS-2.1", "Ensure S3 Bucket Access Logging is enabled for critical storage", "STORAGE", "CIS Benchmark v1.4", "HIGH", "WARNING", "Storage buckets lacking access logs hinder forensic analysis.", "Inability to audit unauthorized file reads.", "Enable server access logging to dedicated immutable audit bucket.", 2),
        ("CHK-CIS-2.3", "CIS-2.3", "Ensure S3 buckets enforce server-side encryption (SSE-KMS)", "STORAGE", "CIS Benchmark v1.4", "CRITICAL", "CRITICAL", "Storage bucket s3-customer-vault-prod is unencrypted.", "Data exposure if physical media or storage metadata is intercepted.", "Apply default KMS encryption with customer-managed keys.", 1),
        ("CHK-CIS-3.1", "CIS-3.1", "Ensure security groups do not allow ingress from 0.0.0.0/0 to port 22 (SSH)", "NETWORK", "CIS Benchmark v1.4", "HIGH", "CRITICAL", "Port 22 is exposed to the public internet on res-vm-04.", "Susceptible to automated brute force and remote vulnerability exploits.", "Restrict ingress to internal bastion subnet or corporate VPN IP.", 1),
        ("CHK-CIS-3.2", "CIS-3.2", "Ensure security groups do not allow ingress to port 3389 (RDP)", "NETWORK", "CIS Benchmark v1.4", "HIGH", "PASSED", "No RDP ports exposed publicly.", "Remote desktop attacks prevented.", "Maintain current security group perimeter rules.", 0),
        ("CHK-CIS-4.1", "CIS-4.1", "Ensure VPC Flow Logging is active across all production VPCs", "NETWORK", "CIS Benchmark v1.4", "HIGH", "PASSED", "VPC flow logs capture all ingress/egress network flows.", "Blind spots in network traffic analysis.", "Ensure flow log records are routed to CloudWatch and retention set to 365 days.", 0),
        ("CHK-CIS-5.1", "CIS-5.1", "Ensure KMS Customer Managed Key rotation is enabled", "ENCRYPTION", "CIS Benchmark v1.4", "MEDIUM", "WARNING", "One legacy cryptographic key has not been rotated in 400 days.", "Increased exposure window if key material is leaked.", "Toggle automated annual key rotation in KMS configuration.", 1),
        ("CHK-CIS-5.2", "CIS-5.2", "Ensure RDS automated backups and Multi-AZ replication are enabled", "DATABASE", "CIS Benchmark v1.4", "HIGH", "PASSED", "Databases configured with 30-day point-in-time recovery.", "Risk of unrecoverable data loss in regional failure.", "Maintain automated snapshot schedule.", 0),
        ("CHK-CIS-6.1", "CIS-6.1", "Ensure CloudTrail audit trail is enabled and integrated with CloudWatch", "AUDITING", "CIS Benchmark v1.4", "CRITICAL", "PASSED", "Multi-region CloudTrail enabled with log validation.", "Unlogged administrative actions.", "Ensure log file integrity validation is enabled.", 0)
    ]
    for cid, code, title, cat, std, sev, stat, prob, imp, rem, aff in checks_data:
        db.add(SecurityPostureCheck(
            id=cid,
            check_code=code,
            title=title,
            category=cat,
            standard=std,
            severity=sev,
            status=stat,
            problem=prob,
            impact=imp,
            remediation=rem,
            affected_resource_count=aff
        ))
    db.commit()

    # 11. Audit Logs (30 chronological records)
    audit_data = [
        ("AUD-101", now - timedelta(minutes=8), "Sarah Vance", "USER_ROLE_UPDATED", "alex.chen@cloudsentinel.io", "10.0.4.12", "SUCCESS", "Revoked Elevated privileges due to suspicious login flag."),
        ("AUD-102", now - timedelta(minutes=15), "CloudSentinel AI", "THREAT_EVALUATED", "THR-2026-01", "127.0.0.1", "SUCCESS", "Automated threat rule matched: Confidence 96%."),
        ("AUD-103", now - timedelta(minutes=22), "Marcus Reed", "CONTAINMENT_TRIGGERED", "s3-customer-vault-prod", "10.0.2.8", "SUCCESS", "Applied emergency deny policy to prevent further data egress."),
        ("AUD-104", now - timedelta(minutes=30), "Elena Rostova", "VM_SECURITY_GROUP_ATTACH", "res-vm-01", "10.0.1.5", "SUCCESS", "Attached sg-quarantine-isolate to VM node."),
        ("AUD-105", now - timedelta(minutes=45), "Sarah Vance", "INCIDENT_ASSIGNED", "INC-2026-001", "10.0.4.12", "SUCCESS", "Assigned P1 incident to Marcus Reed (Lead Analyst)."),
        ("AUD-106", now - timedelta(minutes=65), "Marcus Reed", "SESSION_REVOKED", "alex.chen@cloudsentinel.io", "10.0.2.8", "SUCCESS", "Forced revocation of active JWT tokens across all microservices.")
    ]
    for i in range(7, 31):
        audit_data.append((
            f"AUD-{100 + i}",
            now - timedelta(minutes=random.randint(70, 1400)),
            random.choice(["Sarah Vance", "Marcus Reed", "Elena Rostova", "CloudSentinel AI Engine", "Aisha Al-Mansoor"]),
            random.choice(["CONFIG_INSPECTED", "ALERT_ACKNOWLEDGED", "MFA_STATUS_QUERIED", "FIREWALL_RULE_MODIFIED", "ENCRYPTION_KEY_ACCESSED"]),
            random.choice(["api-gateway-public", "res-vm-02", "rds-postgres-primary", "k8s-pod-auth-svc"]),
            f"10.0.{random.randint(1, 8)}.{random.randint(2, 250)}",
            "SUCCESS",
            "Administrative SecOps action executed within policy compliance."
        ))

    for aid, ts, actor, action, tgt, ip, stat, dtl in audit_data:
        db.add(AuditLog(
            id=aid,
            timestamp=ts,
            actor=actor,
            action=action,
            target=tgt,
            ip_address=ip,
            status=stat,
            details=dtl
        ))
    db.commit()

    print("CloudSentinel database seeding completed successfully!")
