# CloudSentinel AI — Autonomous Cloud Security & Threat Operations

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%200.110-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black.svg?style=flat&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%205-blue.svg?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38bdf8.svg?style=flat&logo=tailwindcss)](https://tailwindcss.com)
[![Python](https://img.shields.io/badge/Python-3.11-3776ab.svg?style=flat&logo=python)](https://python.org)
[![Status](https://img.shields.io/badge/Competition-Ready-emerald.svg?style=flat)](#)

> **CloudSentinel** is a realistic, enterprise-grade Cloud Security Operations (SecOps) & Threat Intelligence platform designed specifically for university innovation and technical hackathon competitions.

It demonstrates the full cybersecurity lifecycle:
$$\text{NORMAL CLOUD} \longrightarrow \text{SUSPICIOUS ACTIVITY} \longrightarrow \text{DETECTION} \longrightarrow \text{PROACTIVE ALERT} \longrightarrow \text{THREAT ANALYSIS} \longrightarrow \text{INCIDENT} \longrightarrow \text{CONTAINMENT} \longrightarrow \text{RECOVERY} \longrightarrow \text{SECURE BASELINE}$$

---

## 🌟 Key Modules & Capabilities

1. **Security Command Center**: Real-time aggregation of Risk Score, Active Threats, Critical Alerts, Monitored Resources, 12-hour event trends, and live telemetry feeds.
2. **Interactive Security Relationship Graph**: Visual node-link topology linking `USER` $\rightarrow$ `ROLE` $\rightarrow$ `API` $\rightarrow$ `RESOURCE` $\rightarrow$ `EVENT` $\rightarrow$ `THREAT` $\rightarrow$ `INCIDENT`.
3. **Dedicated Judges Demo Mode**: A 10-step guided demonstration interface with presentation scripts for competition evaluators.
4. **IAM & Behavioral Risk Profiler**: 25+ monitored identities detecting impossible travel anomalies, credential stuffing, and privilege escalation.
5. **Multi-Cloud Resource Inventory**: 20+ cloud assets (VMs, S3 Buckets, RDS Databases, API Gateways, EKS Containers) across AWS, Azure, and GCP simulation with 1-click quarantine.
6. **Proactive Alert System**: Rule-based detection triggers catching credential theft, unauthorized role injection, and outbound exfiltration before damage occurs.
7. **Incident Response War Room**: NIST SP 800-61 aligned lifecycle with 1-click containment playbooks (quarantine host, revoke JWT sessions, disable user, block IP).
8. **Network Traffic & Anomaly Visualizer**: Real-time ingress/egress bandwidth monitoring, SYN flood alerts, and edge firewall IP blocking.
9. **Simulated Threat Sandbox**: Safe heuristic scanner calculating SHA-256 hashes, YARA signature matches, and dynamic behavior classifications.
10. **Explainable Risk Engine**: Formulaic scoring breakdown showing mathematically why the security score changed.
11. **Cloud Protection Posture**: CIS Benchmark v1.4 compliance checks with 1-click automated remediations.
12. **Immutable Audit Logs**: Cryptographic chronological ledger of administrative and SecOps actions.
13. **Executive Security Dossier**: Professional CISO briefing report with print/PDF layout and CSV export.

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm

### 1. Start the Backend API (FastAPI)
```bash
cd backend
python -m pip install -r requirements.txt
python run.py
```
*Backend runs at: `http://127.0.0.1:8000` (API Docs at `http://127.0.0.1:8000/docs`)*

### 2. Start the Frontend Application (Next.js)
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at: `http://localhost:3000`*

---

## 🔑 Demo Credentials & Quick Profiles

You can sign in with any of these preloaded profiles (or use the **1-click auto-fill buttons** on the login page):

| Role | Email | Password | Privilege Level |
|---|---|---|---|
| **Admin** | `admin@cloudsentinel.io` | `Password123!` | SuperAdmin |
| **Security Analyst** | `analyst@cloudsentinel.io` | `Password123!` | Elevated |
| **Cloud Operator** | `operator@cloudsentinel.io` | `Password123!` | Elevated |
| **Executive Viewer** | `viewer@cloudsentinel.io` | `Password123!` | Restricted |

---

## 🏆 Presentation Quick Link: Judges Demo Mode

For a 3–5 minute competition presentation:
1. Navigate directly to `http://localhost:3000/dashboard/demo`
2. Follow the 10-step guided sequence using the included **Presenter Speaking Script**.
3. Watch the system transition from **Normal State (Risk: 18)** $\rightarrow$ **Threat & Alert (Risk: 92)** $\rightarrow$ **1-Click Containment** $\rightarrow$ **Secure Baseline (Risk: 18)**.

---

## 📚 Technical Documentation Index

- [System Architecture](docs/ARCHITECTURE.md)
- [REST API Reference](docs/API.md)
- [Security & Threat Model](docs/SECURITY.md)
- [3-Minute Judges Presentation Script](docs/DEMO.md)
