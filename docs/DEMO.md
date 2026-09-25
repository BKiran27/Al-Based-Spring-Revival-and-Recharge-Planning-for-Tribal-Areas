# CloudSentinel — Competition Live Demonstration Script (3–5 Minutes)

Use this step-by-step presentation script during judging to demonstrate the complete cybersecurity lifecycle.

---

## Preparation (10 Seconds Before Judging Begins)
1. Open your browser directly to the live GitHub Pages site:
   👉 **[https://bkiran27.github.io/Al-Based-Spring-Revival-and-Recharge-Planning-for-Tribal-Areas/dashboard/demo/](https://bkiran27.github.io/Al-Based-Spring-Revival-and-Recharge-Planning-for-Tribal-Areas/dashboard/demo/)**
2. Confirm the demo is at **Step 1: Baseline Security Posture**. If not, click **"Reset Baseline"**.

---

## 3-Minute Presentation Walkthrough

### ⏱️ Minute 0:00 – 0:45: The Problem & Baseline Posture
- **Action**: Show **Step 1 (Normal State)** on the screen.
- **Say**:
  > *"Good morning judges. Cloud environments today face massive visibility gaps, credential stuffing, and delayed response times. This is CloudSentinel — an autonomous Cloud Security Operations and Threat Intelligence platform.*
  > 
  > *Right now, our multi-cloud fleet is operating normally. Notice our Explainable Risk Engine calculates a baseline score of 18/100 across 20 monitored assets and 25 IAM identities."*

### ⏱️ Minute 0:45 – 1:30: The Attack & Heuristic Detection
- **Action**: Click **"Start Attack Simulation"** & advance through **Step 2, 3, and 4**.
- **Say**:
  > *"Now, watch what happens when an adversary attacks. First, we detect rapid failed logins from a Tor Exit Node targeting engineer Alex Chen.*
  > 
  > *14 minutes later, the stolen session cookie is used in Frankfurt, Germany. A flight from San Francisco to Frankfurt takes 11 hours. CloudSentinel immediately classifies this as an Impossible Travel Velocity Anomaly.*
  > 
  > *Our Threat Engine correlates these signals and classifies an Account Takeover with 98% confidence. System risk jumps to 82."*

### ⏱️ Minute 1:30 – 2:15: Proactive Alerting & Automatic Incident War Room
- **Action**: Click to **Step 5 & 6**.
- **Say**:
  > *"Notice that before any sensitive data is exfiltrated, our proactive alert engine fires rule RULE-IAM-004. Unlike noisy legacy tools, CloudSentinel auto-instantiates a formal P1 Incident: INC-2026-091, assigning our lead analyst and mapping the blast radius to production node res-vm-01."*

### ⏱️ Minute 2:15 – 3:00: Investigation & 1-Click Automated Containment
- **Action**: Click to **Step 7 & 8**. Show the containment action.
- **Say**:
  > *"In the incident war room, the analyst reviews the Visual Relationship Graph. With a single click on 'Contain Threat', the platform executes automated playbooks: revoking active OAuth/JWT tokens, suspending the compromised user, and isolating the VM into a quarantine network security group."*

### ⏱️ Minute 3:00 – 3:45: Risk Reduction & Recovery
- **Action**: Click to **Step 9 & 10**.
- **Say**:
  > *"With the attack vector severed, our Explainable Risk Engine immediately recalculates the posture score, dropping risk from 92 back down to a safe 18. The incident is resolved, passwords rotated with hardware FIDO2 keys, and an immutable cryptographic audit record is generated.*
  > 
  > *We have demonstrated the full security lifecycle: Problem -> Detection -> Proactive Alert -> Incident -> Containment -> Recovery -> Secure Baseline."*

---

## Standout Wow Features to Highlight If Judges Ask Questions:
1. **Interactive Security Relationship Graph** (`/dashboard/threats`): Visualizes blast radius from User -> Role -> API -> Resource -> Threat -> Incident.
2. **Explainable Risk Decomposition** (`/dashboard/risk`): Formulaic breakdown showing exact mathematical point attribution.
3. **Safe Simulated Malware Sandbox** (`/dashboard/malware`): Heuristic detonation, SHA-256 calculation, and YARA rule matching.
4. **1-Click Role Switcher** (Top navigation): Easily switch between Admin, Security Analyst, Cloud Operator, and Viewer to demonstrate RBAC enforcement live.
