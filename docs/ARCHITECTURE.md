# CloudSentinel AI — System Architecture & Technical Specifications

CloudSentinel is an enterprise-grade Autonomous Cloud Security Operations (SecOps) and Threat Intelligence Platform engineered for multi-cloud visibility, proactive threat prevention, and deterministic incident containment.

---

## 1. High-Level System Architecture

```
+---------------------------------------------------------------------------------------+
|                                    PRESENTATION LAYER                                 |
|   Next.js 14 (App Router) + TypeScript + Tailwind CSS + Lucide Icons + Recharts       |
|                                                                                       |
|   [Command Center]   [Relationship Graph]   [Judges Demo Mode]   [Incident War Room]  |
|   [IAM Profiler]     [Resource Inventory]   [Attack Simulator]   [Posture / CIS]      |
+---------------------------------------------------------------------------------------+
                                           │
                                  REST APIs / JSON / JWT
                                           │
                                           ▼
+---------------------------------------------------------------------------------------+
|                                  APPLICATION SERVICES LAYER                           |
|                       FastAPI (Python 3.11) + Pydantic v2 + Starlette                 |
|                                                                                       |
|  [Auth & RBAC Service]   [Explainable Risk Engine]   [Threat Correlation Evaluator]   |
|  [Simulation Engine]     [Automated Containment]     [CIS Posture Benchmark Evaluator]|
+---------------------------------------------------------------------------------------+
                                           │
                                   SQLAlchemy 2.0 ORM
                                           │
                                           ▼
+---------------------------------------------------------------------------------------+
|                                    DATA PERSISTENCE LAYER                             |
|       Dual Database Support: SQLite 3 (WAL Mode & Foreign Keys) / PostgreSQL ready    |
|                                                                                       |
|  • Users (25+)         • Cloud Resources (20+)  • Security Events (120+)              |
|  • Proactive Alerts    • Active Threats         • Incidents & Actions                 |
|  • Traffic History     • Network Anomalies      • Malware Scans & CIS Checks          |
+---------------------------------------------------------------------------------------+
```

---

## 2. Telemetry Ingestion & Threat Lifecycle

CloudSentinel demonstrates the complete enterprise cybersecurity lifecycle:

```
[ Normal Cloud Fleet ]
         │
         ▼
[ Suspicious Activity ] ────► Heuristic Signal: 4 failed logins + Tor exit node IP
         │
         ▼
[ Detection Engine ]    ────► Correlates session velocity: Impossible Travel (Frankfurt / SF)
         │
         ▼
[ Proactive Alert ]     ────► Rule RULE-IAM-004 triggered before damage occurs
         │
         ▼
[ Threat Analysis ]     ────► Correlates attack vector into Account Takeover (Confidence 98%)
         │
         ▼
[ Incident Created ]    ────► Auto-instantiates War Room INC-2026-091 & assigns SecOps Lead
         │
         ▼
[ Investigation ]       ────► Explores blast radius via Visual Relationship Graph
         │
         ▼
[ 1-Click Containment ] ────► User suspended, JWT revoked, host isolated in quarantine subnet
         │
         ▼
[ Risk Recovery ]       ────► Explainable Risk Engine recalculates score: 92 -> 24
         │
         ▼
[ Secure State ]        ────► Post-incident resolution logged to immutable cryptographic audit
```

---

## 3. Explainable Risk Formulation

Unlike opaque black-box machine learning engines, CloudSentinel implements an auditable formulaic score:

$$\text{Risk Score} = \min\left(100, 10 + \text{Identity Risk} + \text{Threat Risk} + \text{Traffic Risk} + \text{Resource Risk} + \text{Posture Gap}\right)$$

Where:
- $\text{Identity Risk}$: Credential compromise penalties ($+15$ pts/user), Impossible travel anomalies ($+8$ pts), Brute force sequences ($+4$ pts).
- $\text{Threat Risk}$: Active unmitigated critical threats ($+18$ pts/threat), high threats ($+9$ pts/threat).
- $\text{Traffic Risk}$: Active DDoS SYN floods and bandwidth spikes ($+10$ pts/anomaly).
- $\text{Resource Risk}$: Publicly exposed cloud assets ($+4$ pts) and unencrypted storage ($+12$ pts).
- $\text{Posture Gap}$: Failing CIS Benchmark checks ($+5$ pts/critical finding).

---

## 4. Multi-Cloud Inventory Simulation

CloudSentinel simulates realistic multi-cloud resources:
- **AWS (Simulated)**: EC2 worker nodes (`res-vm-01`, `res-vm-02`), S3 Customer Storage (`s3-customer-vault-prod`), Aurora RDS clusters, IAM roles (`iam-prod-deployer`).
- **GCP (Simulated)**: Google Cloud Storage Data Lake (`gcs-analytics-lake`), GKE Traefik Ingress Controller.
- **Azure (Simulated)**: Cosmos DB global session store (`cosmos-db-sessions`), Azure Blob security cold archive (`azure-blob-logs`).

Every resource includes real configuration attributes, encryption status, public exposure markers, and instant 1-click containment isolation.
