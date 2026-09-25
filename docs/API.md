# CloudSentinel API Reference

The CloudSentinel REST API runs on FastAPI with Pydantic v2 validation and Bearer JWT authentication, backed by an autonomous client-side SecOps state engine for direct GitHub Pages deployment.

Full OpenAPI 3.1 specification schema is included in the backend repository.

---

## 1. Authentication & RBAC

### `POST /api/auth/login`
Authenticates a security principal and issues a JWT token.
- **Request Body**:
  ```json
  {
    "email": "admin@cloudsentinel.io",
    "password": "Password123!"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUz...",
    "token_type": "bearer",
    "user": {
      "id": "usr-admin-demo",
      "email": "admin@cloudsentinel.io",
      "full_name": "Sarah Vance (Admin)",
      "role": "ADMIN",
      "privilege_level": "SUPERADMIN",
      "risk_score": 10
    }
  }
  ```

### `GET /api/auth/me`
Fetches the active authenticated user profile.

---

## 2. Command Center Dashboard

### `GET /api/dashboard/summary`
Returns aggregated SecOps metrics:
- Overall Security Risk Score (0-100)
- Active threat count & critical alerts
- Suspicious identity count
- Monitored multi-cloud resource count
- 12-hour events timeline with anomaly breakdown
- Top risky users & affected resources
- Itemized risk factors

---

## 3. IAM & Identity Management

### `GET /api/users`
Lists all monitored identities with filtering options (`role`, `min_risk`, `search`).

### `GET /api/users/{id}`
Returns granular telemetry for a specific identity (failed logins, impossible travel flag, location).

### `POST /api/users/{id}/suspend`
Quarantines and suspends a compromised identity, logging the action to the audit trail.

### `POST /api/users/{id}/reset-risk`
Clears accumulated behavioral risk penalties for an identity.

---

## 4. Cloud Resource Inventory

### `GET /api/resources`
Lists all monitored multi-cloud resources with filters (`resource_type`, `provider`, `risk_level`).

### `GET /api/resources/{id}`
Retrieves configuration details, encryption state, and public exposure status.

### `POST /api/resources/{id}/contain`
Toggles network quarantine for an instance or storage bucket.

---

## 5. Security Events & Audit Trail

### `GET /api/events`
Query security events with filters: `event_type`, `severity`, `search`, `limit`, `offset`.

### `GET /api/audit-logs`
Fetches the immutable chronological audit log.

---

## 6. Proactive Alerts

### `GET /api/alerts`
Retrieves proactive alerts with filters (`status`, `severity`).

### `POST /api/alerts/{id}/status`
Updates alert state to `ACKNOWLEDGED`, `RESOLVED`, or `SUPPRESSED`.

### `POST /api/alerts/{id}/escalate-to-incident`
Automatically creates a formal incident war room from the alert.

---

## 7. Threats & Relationship Graph

### `GET /api/threats`
Lists correlated threat vectors with confidence percentages and MITRE ATT&CK vectors.

### `GET /api/threats/graph`
Returns node-link topology linking `USER` -> `ROLE` -> `API` -> `RESOURCE` -> `EVENT` -> `THREAT` -> `INCIDENT`.

---

## 8. Incident Response War Room

### `GET /api/incidents`
Lists all incidents with filterable lifecycle status.

### `GET /api/incidents/{id}`
Retrieves incident details, assigned analyst, blast radius, root cause, and chronological actions.

### `POST /api/incidents/{id}/actions`
Executes containment actions: `CONTAIN_RESOURCE`, `DISABLE_USER`, `REVOKE_SESSION`, `BLOCK_IP`, `ADD_NOTE`, `RESOLVE`.

---

## 9. Network Traffic & Anomaly Detection

### `GET /api/traffic/history`
Returns 24-hour network throughput history (MB/s in/out, req/s).

### `GET /api/traffic/anomalies`
Lists anomalous traffic bursts and DDoS attempts.

### `POST /api/traffic/anomalies/{id}/block`
Deploys a perimeter firewall drop rule for the offending IP.

---

## 10. Malware Analysis Sandbox

### `POST /api/malware/scan`
Safely detonates and analyzes a file sample: calculates SHA-256, matches YARA rules, and determines `SAFE`, `SUSPICIOUS`, or `MALICIOUS`.

---

## 11. Attack Simulation Engine

### `GET /api/simulation/scenarios`
Returns the 3 predefined attack scenarios.

### `POST /api/simulation/run-step?scenario_id={id}&step={n}`
Advances the simulation step and updates live database state.

### `POST /api/simulation/reset`
Restores the database state back to a clean security baseline.
