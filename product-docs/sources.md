# Verified Sources & Evidence Index: DeepClear Studio
**Document Version:** v1.0  
**Date:** Q3 2026  
**Status:** Approved  
**Core Repository:** [github.com/miracles2motion/deepclear-studio](https://github.com/miracles2motion/deepclear-studio)  

---

## 1. Statutory, Regulatory & Industry Benchmark References

The modeled exposure reserves, clearance rules, and production incentive formulations in DeepClear Studio are structured around the following legal and regulatory frameworks:

* **United States Patent and Trademark Office (USPTO) Trademark Registrations**
  * *Statutory Framework:* Lanham Act, 15 U.S.C. § 1051 et seq.
  * *Application:* Live commercial trademark queries in Class 32 (Beverages), Class 33 (Spirits), Class 25 (Apparel), and Class 9 (Technology) executed via Parallel Web Infrastructure SDK (`parallel-web`).
* **Copyright Infringement Remedies & Statutory Damages**
  * *Statutory Framework:* Title 17 U.S.C. § 504(c)(2) (Willful Infringement Statutory Maximum of $150,000 per work).
  * *Application:* Informs the internal $150,000 benchmark risk reserve for uncleared songs, artwork, and creative literary IP.
* **Anticybersquatting Consumer Protection Act (ACPA) & Telecom Standards**
  * *Statutory Framework:* 15 U.S.C. § 1125(d) & North American Numbering Plan Administration (NANPA) Fictional Numbering Guidelines.
  * *Application:* Informs the internal $100,000 benchmark risk reserve for domain collisions and enforces defusing of phone numbers into reserved ranges (555-0100 through 555-0199).
* **Right of Publicity & Personality Rights Frameworks**
  * *Statutory Framework:* California Civil Code § 3344 & New York Civil Rights Law §§ 50-51.
  * *Application:* Informs the internal $250,000 benchmark risk reserve for living individuals, public figures, and name/likeness clearance.
* **Aviation & Drone Filming Compliance**
  * *Regulatory Framework:* FAA Part 107 (14 CFR Part 107 Small Unmanned Aircraft Systems Regulations).
  * *Application:* Informs the internal $50,000 benchmark risk reserve for municipal and aerial cinematography hazards.
* **State Film & Television Tax Incentive Statutes**
  * *Georgia:* O.C.G.A. § 48-7-29.8 (Georgia Entertainment Industry Investment Act — 20% Base + 10% GEP Promotion Uplift).
  * *New Mexico:* NMSA 1978, § 7-2F-1 et seq. (Film Production Tax Credit — 25% Base Rebate).
  * *California:* Cal. Rev. & Tax. Code § 17053.98 / § 23698 (California Film & Television Tax Credit Program 4.0).

---

## 2. Platform SDKs, Dependencies & Live Runtime Endpoints

The complete build depends on the following official core packages and production endpoints:

| Component / Service | Package / SDK Identification | Source / Domain Reference |
|---|---|---|
| Agentic AI Framework | `@google/genai` (v0.1.1+) / `@google/generative-ai` | Google Cloud Gemini SDK (7 configured models with dynamic ModelService discovery) |
| External Grounding Engine | `parallel-web` (v1.3.x) | Parallel Web Systems Search Infrastructure API (api.parallel.ai) |
| Screenplay Parsing Engine | Fountain format | Fountain Open Screenplay Syntax Standard (fountain.io) |
| Client PDF Compiler | `@react-pdf/renderer` & `jspdf` | Client-side E&O Evidence Binder generation engine |
| Cryptographic Utilities | Native Web Crypto API (`crypto.subtle`) | W3C Web Cryptography API Specification (SHA-256 Digest) |

---

## 3. Verified Script Presets & Test Verification Records

The demo build mounts pre-validated screenplay scenario files for verification auditing:

### A. Preset: Cyber Heist Scene
* **Hazard Ledger & Grounding Verification:**
  * BRAND-001: "Red Bull" → Defused to fictional energy beverage (Verified via Parallel Search).
  * PHONE-001: "310-555-0199" → NANPA reserved range compliance verified.
  * COPY-001: Background commercial track → Mutated to fictional acoustic track.

### B. Preset: Defamation & Domain Check
* **Hazard Ledger & Grounding Verification:**
  * BRAND-002: Technology brand reference → Defused to fictional hardware prop.
  * PERSON-001: Identifiable living professional reference → Escalated to HUMAN_REVIEW due to personality rights rules.

### C. Preset: Executive Impasse
* **Hazard Ledger & Grounding Verification:**
  * CONFLICT-001: Contested trademark with active USPTO registry claims → Clearance Gate fail-closed trigger pausing Auto-Pilot.
  * COUNSEL-001: Escalated to Producer Directive (Mutate vs License Waiver) and returned to Gate for verification.

---

## 4. Live Verification API Mock & Fallback Data Contracts

When live network connectivity to external search registries is degraded or operating in disconnected demo mode, the system defaults to a deterministic mock verification payload structure:

```json
{
  "verified": true,
  "source": "parallel_web",
  "searchId": "par_mock_v27_99201",
  "latencyMs": 1420,
  "registryStatus": "CLEAR_NO_MATCHES",
  "trademarkClass": "Class 32 / Class 33",
  "citationUrl": "https://api.parallel.ai/v1/search/cite/par_mock_v27_99201",
  "rawQuery": "USPTO trademark status live commercial registry Red Dragon Energy",
  "timestamp": "2026-09-08T21:19:19.000Z"
}
```
