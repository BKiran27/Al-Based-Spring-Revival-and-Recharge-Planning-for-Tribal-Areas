# CloudSentinel Security & Threat Model

Because CloudSentinel is a cloud security platform, it was designed according to the highest industry standards of secure software engineering and defensive architecture.

---

## 1. Authentication & Session Security
- **Bcrypt Password Hashing**: Passwords stored using adaptive salt-based bcrypt hashing.
- **Stateless JWT Tokens**: Signed using HMAC-SHA256 with expiration windows and subject validation.
- **Zero Hardcoded Secrets**: Secrets and database connection strings configured via environment variables with secure fallbacks.
- **Session Revocation**: Incident response playbooks support instant global token revocation.

---

## 2. Role-Based Access Control (RBAC)
CloudSentinel enforces four distinct operational roles:
1. **ADMIN (`SUPERADMIN`)**: Full configuration, policy changes, user suspension, simulation controls, and audit export.
2. **SECURITY_ANALYST (`ELEVATED`)**: Incident triage, containment playbook dispatch, threat analysis, and evidence attachment.
3. **CLOUD_OPERATOR (`ELEVATED`)**: Infrastructure resource inventory, firewall rule management, and health monitoring.
4. **VIEWER (`RESTRICTED`)**: Read-only observation of security dashboards and executive reports.

---

## 3. Threat Modeling & Defense-in-Depth
- **SQL Injection Prevention**: 100% parameterized queries via SQLAlchemy 2.0 ORM.
- **Cross-Site Scripting (XSS)**: Next.js / React automatic escaping with strict Content-Type response headers.
- **CORS Hardening**: Strict origin whitelisting allowing only authorized client origins.
- **Immutable Audit Trail**: All privileged actions (containments, privilege updates, rule toggles) generate tamper-evident audit records.
- **Safe Malware Detonation**: The malware analysis engine executes heuristic pattern matching and cryptographic hashing without executing unverified binary bytecode on the operating system.
