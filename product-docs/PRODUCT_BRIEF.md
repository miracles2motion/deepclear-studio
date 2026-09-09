# Product Brief: DeepClear Studio
**Document Version:** v1.0  
**Date:** Q3 2026  
**Status:** Approved  

---

## 1. Executive Summary and System Purpose

DeepClear Studio is an agentic screenplay clearance and evidence-preparation system built on Google Cloud's Gemini SDK and grounded by Parallel Web Systems (`parallel-web`). In traditional studio workflows, clearing a 120-page screenplay for Errors and Omissions (E&O) insurance commonly involves 15 to 30 business days of manual legal review.

DeepClear Studio targets compressed initial hazard extraction (<60 seconds target) and drastically reduces pre-production evidence gathering overhead. Gemini-powered agents analyze screenplay context and deliberate over competing creative, legal, and production objectives. Parallel Web Systems retrieves external evidence. A deterministic Clearance Gate evaluates that evidence and controls clearance state transitions. Ambiguous cases escalate to human review, while the system packages the resulting evidence trail into an E&O Evidence Binder and a tamper-evident clearance record.

The platform provides:
* **Whole-Script Context Ingestion:** Parsing screenplays up to 120 pages in a single full-context analysis request without manual page chunking using the Google Cloud Gemini SDK.
* **Model Availability Fallback:** DeepClear routes a workflow across 7 configured Gemini models when the active model is unavailable or rate-limited, preserving workflow continuity.
* **Modeled Risk Exposure HUD:** Real-time modeled risk indicators across brand trademarks, copyright, living persons, permits, and telecom reserves alongside Estimated Incentive Eligibility meters.
* **5-Agent Swarm Deliberation:** A multi-agent negotiation dialectic that proposes story-authentic replacements or licensing routes across competing objectives.
* **Evidence Grounding:** External evidence retrieval via the official Parallel Web Systems TypeScript SDK (`parallel-web`) to check fictional substitutes against USPTO registries and public records.
* **Auditable Output:** Export of a clearance-ready DeepClear E&O Evidence Binder PDF with Exhibit B verification audit trails and an embedded Cryptographic Clearance Passport SHA-256 state manifest.

---

## 2. Modeled Risk Exposure & Production Incentive Methodology

### A. Strict Independence Principle
DeepClear Studio maintains strict computational independence between modeled risk indicators and economic production incentives:
* **Modeled Risk Exposure** represents internal benchmark liability models informed by relevant statutory remedies, regulatory exposure, and litigation history.
* **Estimated Incentive Eligibility** represents independent production budget rebates based on qualified local spending.
* The system never nets tax credit rebates against legal exposure liabilities. All configured clearance hazards must reach a verified or licensed state before the binder is marked clearance-ready.

### B. Modeled Risk Exposure Formulations
Modeled Risk Exposure is an internal DeepClear benchmark calculated as the sum of configured reserve assumptions; it is not a prediction or statement of actual legal liability.
When an item is resolved via a verified fictional replacement or a verified production license, its remaining modeled exposure drops to $0.00.

**Configured Benchmark Reserves (Internal Modeling Assumptions):**
* **Brand & Trademark Exposure:** $150,000 configured benchmark reserve — an internal risk-modeling assumption informed by relevant trademark remedies and litigation exposure; not a statutory damages amount.
* **Copyright & Creative IP:** $150,000 configured benchmark reserve — informed by Title 17 U.S.C. §504(c)(2) statutory maximum for willful copyright infringement.
* **Living Persons & Rights:** $250,000 configured benchmark reserve — internal DeepClear modeling assumption informed by applicable personality-rights remedies and litigation exposure.
* **Municipal Locations & Drone Rules:** $50,000 configured benchmark reserve — internal DeepClear modeling assumption informed by applicable regulatory and permitting exposure (including FAA Part 107).
* **Domains & Telecom Reserves:** $100,000 configured benchmark reserve — internal DeepClear modeling assumption informed by ACPA 15 U.S.C. §1125(d) and telecom numbering guidelines (NANPA 555-0100 through 555-0199).

### C. Illustrative Production Tax Incentive Formulations
Tax credit rebates are computed independently for production accounting reference:
* **Georgia (Illustrative):** 20% base credit + 10% GEP promotion uplift = 30% gross qualified rebate.
* **New Mexico (Illustrative):** 25% base credit; additional uplifts may apply based on eligibility.
* **California (Illustrative):** Illustrative state film incentive (Program 4.0); applicable rate varies by program, production type, and eligibility.

---

## 3. The 5-Agent Swarm Behaviors & Roles

Five specialized agents operate across creative, legal, research, production, and compliance objectives:

1. **Script Supervisor (`script_supervisor`)**
   * *Domain:* Fountain syntax, scene sluglines, character cues.
   * *Behavioral Invariant:* Sanitizes screenplay mutations via regular expressions to prevent duplicate word stutters (e.g., 'vintage vintage') or article clashes (e.g., 'An an').

2. **Studio Legal Counsel (`legal_counsel`)**
   * *Domain:* Trademark, copyright, personality rights, telecom reserves.
   * *Behavioral Invariant:* Constructs Parallel search queries and enforces evidentiary verification standards.

3. **Location & Art Manager (`location_manager`)**
   * *Domain:* Permits, location releases, drone rules (FAA Part 107), production incentive eligibility context.
   * *Behavioral Invariant:* Routes qualifying locations to the license path while preserving original script sluglines and recording eligibility-relevant production information.

4. **The Director (`director`)**
   * *Domain:* Story stakes, era authenticity, narrative intent.
   * *Behavioral Invariant:* Defends creative intent; proposes story-authentic substitutes; registers producer disputes and re-opens items for negotiation.

5. **Completion Bond Officer (`bond_officer`)**
   * *Domain:* Underwriting risk assessment, financial solvency, evidence completeness.
   * *Behavioral Invariant:* Evaluates underwriting readiness; recommends binder release only when all configured hazards reach a verified or licensed state.

---

## 4. Deterministic Gate Architecture & State Control

### A. The Programmatic Clearance Gate
Agents suggest and reason, but no agent can grant clearance.
* An entity state can transition to VERIFIED only if the Clearance Gate confirms `evidence.verified === true && activeConflicts === 0 && ruleSetSatisfied === true`.
* If external evidence is ambiguous or network timeouts occur, the system transitions state to HUMAN_REVIEW or BLOCKED.
* In HUMAN_REVIEW, an explicit human resolution (COUNSEL_RESOLUTION) is recorded, returning the asset to evidence evaluation. Human resolution cannot directly create VERIFIED status or bypass the Gate.

### B. Dual Resolution Pathways
* **Route 'license' (Preserve & License / Authorization):** Used when the original element can remain subject to an appropriate license, release, permit, or other documented authorization. Screenplay text remains 100% unaltered.
* **Route 'mutate':** Applied to trademarks, copyrighted songs, living person collisions, and non-555 phone numbers. Generates a story-authentic substitute, verifies via Parallel Search, and updates script text globally.

### C. Version Identity vs Record Integrity
* **Continuity Asset Hash (SHA-256):** Hashes screenplay source text to verify version identity and preserve revision continuity.
* **Cryptographic Clearance Passport (SHA-256):** Generates a tamper-evident digital receipt binding the screenplay version, hazard states, search ID citations, and Clearance Gate outcomes into a tamper-evident clearance history manifest.

---

## 5. System Architectural Invariants

* **Default Autonomous Execution:** In 'auto' mode, queue processing initiates post-extraction without extra user clicks.
* **Immediate Reactive De-queueing:** Cleared items are immediately removed from the active Action Required bar.
* **Human Conversational Cadence:** Agent speech onsets sync with text; natural 300ms–400ms pauses separate handoffs.
* **Rate-Limit Defense:** 1,200ms active delay between sequential resolutions during automated runs prevents API rate limits.
* **Autonomous Queue Abort:** Switching to Manual mode instantly aborts queue execution and halts active speech.
* **Instant Mute Cancellation:** Toggling mute synchronously invokes `window.speechSynthesis.cancel()`.
* **Dispute Script Rollback:** Clicking "Dispute" reverts mutated text from defusedText back to rawText, restoring configured modeled exposure and reopening the hazard for negotiation.
* **Mutation Stutter Defense:** Sanitizes adjacent duplicate words (`\b([a-zA-Z]+)\s+\1\b`) and articles (`\b(a|an)\s+(a|an)\b`).
* **Preset Lifecycle:** Judge scenario presets mount strictly during clean boot or 100% resolved states; suppressed during active runs.
* **Tab View Scroll Preservation:** Swarm Debate and Redline Diff views remain concurrently mounted in the DOM to preserve scroll positions across tab toggles.
* **Synchronized Script Reference:** Chat script, Redline script, and Binder export script derive from a single state reference (`currentScriptRef.current`).
* **Data Boundary & Privacy Architecture:** Screenplay state, diffing, session history, and binder generation remain client-side. Required screenplay content is transmitted only to configured Gemini endpoints for analysis, while scoped content and identifiers are sent to external evidence services when required for verification.
