# Product Requirements Document (PRD): DeepClear Studio

## Document Information

| Document Attribute | Details |
| :--- | :--- |
| **Product Name** | DeepClear Studio |
| **Feature Set** | MVP: Agentic Screenplay Clearance Engine, Deterministic Clearance Gate, Whole-Script Context Ingestion, Modeled Risk Exposure HUD, & DeepClear E&O Evidence Binder Export |
| **Target Market** | Primary: Independent Film & Television Producers, Entertainment Legal Counsel |
| **Document Version** | v1.0 |
| **Date** | Q3 2026 |
| **Status** | Approved |
| **Founder** | Aigbomian Miracle |
| **Product Manager** | Osasumwen Ngozi Scott |
| **Primary Stakeholders**| Studio Legal Engineering, Production Operations, & E&O Risk Underwriters |

---

## 1. Executive Summary & Product Thesis

**Product Thesis:** DeepClear lets agents reason about clearance risk, requires external evidence before verification, and preserves the resulting decision as an auditable, tamper-evident clearance record.

DeepClear Studio is an agentic screenplay clearance and evidence-preparation system designed to streamline pre-production clearances. By automating initial risk analysis and evidence gathering through Google Cloud's Gemini SDK and long-context model capabilities (1,000,000+ tokens) and Parallel Web Systems' external search SDK (`parallel-web`), DeepClear Studio provides an auditable evidence record for clearance risks across trademarks, copyright, living persons, and production locations.

The system coordinates a 5-agent operational swarm to identify risks, propose creative resolutions that protect story intent, calculate independent modeled risk metrics, and enforce a strict Clearance Gate that prevents unverified agent self-approvals.

**Data Boundary & Privacy Architecture:** Screenplay state, diffing, local session state persistence (`deepclear_session_history_v1`), and PDF evidence binder generations remain client-side in the browser. Required screenplay content is transmitted only to configured Gemini endpoints for analysis, while scoped content and identifiers are sent to external evidence services when required for verification.

---

## 2. Modeled Risk Exposure & Production Incentive Models

DeepClear Studio maintains strict computational independence between modeled risk indicators and economic production incentives:

### A. Modeled Risk Exposure Formulation
Modeled Risk Exposure is an internal DeepClear benchmark calculated as the sum of configured reserve assumptions; it is not a prediction or statement of actual legal liability:

$$\text{Modeled Risk Exposure} = \sum \text{Configured Benchmark Reserve}$$

When an item is cleared via a verified fictional replacement or cleared via a verified production license, its remaining modeled exposure drops to $0.00:

$$\text{Net Remaining Exposure} = \sum \text{Remaining Un-cleared Exposure}$$

**Configured Benchmark Reserves (Internal Modeling Assumptions):**
* **Brand & Trademark Exposure:** $150,000 configured benchmark reserve — an internal risk-modeling assumption informed by relevant trademark remedies and litigation exposure; not a statutory damages amount.
* **Copyright & Creative IP:** $150,000 configured benchmark reserve — informed by Title 17 U.S.C. §504(c)(2) statutory maximum for willful copyright infringement.
* **People & Personality Rights:** $250,000 configured benchmark reserve — internal DeepClear modeling assumption informed by applicable personality-rights remedies and litigation exposure.
* **Location & Permit Restrictions:** $50,000 configured benchmark reserve — internal DeepClear modeling assumption informed by applicable regulatory and permitting exposure (including FAA Part 107 drone filming compliance).
* **Domain & Telecom Reserves:** $100,000 configured benchmark reserve — internal DeepClear modeling assumption informed by ACPA 15 U.S.C. §1125(d) and reserved fictional telecom numbering guidelines (NANPA 555-0100 through 555-0199).

### B. State Film Production Tax Incentive Formulation (Illustrative)
Tax credit rebates are computed independently as **Estimated Incentive Eligibility** for production accounting reference:

$$\text{Estimated Incentive Eligibility} = \text{Qualified Production Expenditure (QPE)} \times \text{State Rebate Rate}$$

* *Note:* Estimated Incentive Eligibility is never netted against Modeled Risk Exposure. Binder release requires all configured hazards to reach a verified or licensed state.

---

## 3. Goals & Success Metrics

| Metric Type | Metric | Target | Measurement Method |
| :--- | :--- | :--- | :--- |
| **North Star** | Terminal State Integrity | 100% of detected hazards end in a valid terminal state (VERIFIED, BLOCKED, or HUMAN_REVIEW). | Automated state machine audit log |
| **Trust Invariant** | Unverified Clearance Rate | 0% (Strictly enforced fail-closed gate) | Automated assertion test suite on agent outputs |
| **Trust Metric** | Gate Compliance Rate | 100% of VERIFIED hazards satisfy all configured gate evidence criteria. | System verification payload logs |
| **Input - Speed** | Hazard Extraction Target | < 60 seconds target for initial extraction on a 120-page screenplay | Event timer (Ingestion to HUD population) |
| **Input - Verification** | External Verification Target | Target <= 2 seconds P95 (with graceful timeout fallback) | API gateway telemetry logging |
| **Output - Binder Audit** | Binder Verification Coverage | 100% of verified hazards represented in exported E&O Evidence Binders. | Client-side PDF export validation suite |

---

## 4. Canonical Hazard Taxonomy & 5-Agent Swarm

### Taxonomy Buckets
1. **Brand & Trademark Protection:** Commercial brand names, product placement, logos, corporate identifiers.
2. **Copyright & Creative IP:** Song titles, lyrics, artwork, fictional universe collisions.
3. **People & Personality:** Real living individuals, public figures, name/likeness concerns.
4. **Location & Production Facilities:** Locations, permits, drones (FAA Part 107), municipal restrictions, fictional telecom identifiers.

### 5-Agent Swarm Personas & Responsibilities

| Role | Agent Name | Domain / Focus | Operational Behavioral Invariant |
| :--- | :--- | :--- | :--- |
| `script_supervisor` | **Script Supervisor** | Grammar, Fountain syntax, sluglines, character cues. | Sanitizes mutations via regex to eliminate duplicate words or article collisions (e.g., 'vintage vintage', 'An an'). |
| `legal_counsel` | **Studio Legal Counsel** | Trademark, copyright, personality rights, telecom reserves. | Formulates Parallel queries; rejects substitution unless `evidence.verified === true` with zero conflicts. |
| `location_manager` | **Location & Art Manager**| Permits, location releases, drone rules (FAA Part 107), production incentive context. | Routes qualifying locations to the license path while preserving original script sluglines and recording eligibility-relevant production information. |
| `director` | **The Director** | Dramatic stakes, era authenticity, narrative intent. | Proposes story-authentic substitutes; registers user Producer Disputes and re-opens items for re-negotiation. |
| `bond_officer` | **Completion Bond Officer**| Financial solvency, E&O underwriting readiness, evidence completeness. | Evaluates underwriting readiness; recommends binder release when all configured hazards reach a verified state. |

---

## 5. System State Machine & Clearance Gate

```text
DETECTED
   ↓
UNDER_REVIEW
   ↓
PROPOSED
   ↓
EVIDENCE_REQUIRED
   ↓
 ┌──────────────┬────────────────┐
 ↓              ↓                ↓
VERIFIED    HUMAN_REVIEW      BLOCKED
                ↓
        COUNSEL_RESOLUTION
                ↓
        EVIDENCE EVALUATION
                ↓
          CLEARANCE GATE
```

### The Architectural Invariant
> **NO VERIFIED EVIDENCE. NO CLEARANCE.**
> 
> The Clearance Gate is the sole authority capable of transitioning a hazard to VERIFIED. No agent, UI action, or client-side state mutation may directly produce a VERIFIED state without satisfying all gate conditions.

### The Verification Code Contract
```typescript
export interface DeterministicClearanceGate {
  entityId: string;
  category: "brand_trademark" | "copyright_ip" | "people_personality" | "location_production";
  rawText: string;
  proposedSubstitute: string;
  resolutionRoute: "mutate" | "license";
  evidence: {
    verified: boolean;
    source: "parallel_web" | "official_registry" | "permit_verification";
    searchId: string;
    latencyMs: number;
    registryStatus: string;
    trademarkClass?: string;
  };
  activeConflicts: number;
  ruleSetSatisfied: boolean;
  gatePassed: boolean; // Must strictly satisfy: evidence.verified === true && activeConflicts === 0 && ruleSetSatisfied === true
}
```

---

## 6. Functional Requirements

| ID | Feature | Requirement Description | Priority (MoSCoW) |
|---|---|---|---|
| FR-01 | Whole-Script Context Analysis | System must analyze up to 120-page screenplays using a single full-context analysis request without manual page chunking via Google Cloud Gemini SDK. | Must Have |
| FR-02 | Hazard Extraction Engine | System must identify and categorize risks across Brand, Copyright, People, and Location taxonomy. | Must Have |
| FR-03 | Modeled Risk Exposure HUD | System must display Modeled Risk Exposure, Net Remaining Exposure, and Estimated Incentive Eligibility meters in real time. | Must Have |
| FR-04 | 5-Agent Swarm Debate | System must stream real-time decision-oriented debate among the 5 agents with a hard cap of 3 turns per hazard. | Must Have |
| FR-05 | The Clearance Gate | System must intercept agent proposals and mandate external evidence validation prior to clearance state updates. | Must Have |
| FR-06 | Parallel Search Integration | System must execute live search lookups via Parallel Web SDK with interactive latency targets (<=2s P95 target). | Must Have |
| FR-07 | Dual Resolution Routing | System must support 'mutate' (fictional substitution) and 'license' (Preserve & License / Authorization) routes. | Must Have |
| FR-08 | Screenplay Redline Diff | System must render a visual side-by-side redline diff comparing original vs proposed/verified production screenplay text using Fountain syntax. | Must Have |
| FR-09 | DeepClear E&O Evidence Binder | System must generate a downloadable PDF binder containing policy headers, exposure ledgers, and Exhibit B verification trails. | Must Have |
| FR-10 | Cryptographic Clearance Passport | System must compute a SHA-256 cryptographic digest binding the screenplay version, hazard states, and search ID citations into a tamper-evident clearance history manifest. | Must Have |
| FR-11 | Producer Dispute Rollback | System must support an explicit "Dispute" action, instantly reverting mutated text back to rawText, restoring configured modeled exposure, and reopening the hazard for negotiation. | Must Have |
| FR-12 | Parallel Inspector Drawer | System must expose a UI inspector drawer displaying raw JSON verification payloads (evidence) for technical auditing. | Should Have |

---

## 7. Key Invariants & Architectural Safeguards
* **Default Autonomous Execution:** In 'auto' mode, swarm queue initiates automatically post-extraction with 0 extra clicks.
* **Immediate Reactive De-queueing:** Cleared or licensed assets are immediately removed from the active Action Required bar.
* **Batch Pacing Delay:** 1,200ms delay inserted between sequential hazard resolutions during Auto-Pilot to prevent API rate limits.
* **Instant Audio Mute:** Toggling mute immediately invokes window.speechSynthesis.cancel() and halts active agent audio.
* **Mutation Stutter Sanitize:** Sanitizes adjacent duplicate words (\b([a-zA-Z]+)\s+\1\b) and articles (\b(a|an)\s+(a|an)\b).
* **NANPA Reserved 555 Telecom Standard:** Automatically defuses phone numbers into the reserved fictional-use range (555-0100 through 555-0199).
* **Model Availability Fallback:** DeepClear can route a workflow across 7 configured Gemini models when the active model is unavailable or rate-limited, preserving workflow continuity.

---

## 8. Non-Functional Requirements

| Category | Requirement ID | Requirement | Acceptance Criteria / Metric |
|---|---|---|---|
| Performance | NFR-P01 | First-pass extraction latency target. | Target < 60s for initial extraction on a 120-page script. |
| Performance | NFR-P02 | External verification target. | Target <= 2s P95 under standard network conditions with timeout fallback. |
| Performance | NFR-P03 | Client-side PDF build time. | Client PDF render time <= 10s for complete Evidence Binder package. |
| Security | NFR-S01 | Gate Integrity. | Zero execution paths bypass external evidence gate in automated test suites. |
| Security | NFR-S02 | Data Boundary. | Screenplay state, diffing, session history, and binder generation remain client-side. Required screenplay content is transmitted only to configured Gemini endpoints for analysis, while scoped content and identifiers are sent to external evidence services when required for verification. |

---

## 9. System Boundaries & Explicit Out of Scope

### Out of Scope for MVP
* Real-time multi-user concurrent editing.
* Automated direct third-party licensing purchases or direct payment executions.
* Integrated payment processing or subscription billing tiers.
* Audio, video, or daily production footage analysis.
* International multi-jurisdictional trademark registry integrations (MVP defaults to US baseline).

---

## 10. Sign-off

| Role | Name | Status |
|---|---|---|
| Founder | Aigbomian Miracle | Approved |
| Product Manager | Osasumwen Ngozi Scott | Approved |
| Project Stage | MVP / Hackathon Build | v1.0 |
