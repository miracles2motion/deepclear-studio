# DeepClear Studio Product Requirements Document (PRD)

## 1. Project Goal and Executive Overview

DeepClear Studio is an autonomous legal clearance and insurance co-pilot for motion picture and television productions. It replaces the traditional 3 to 6-week, $25,000 to $60,000 manual legal clearance review with a 60-second autonomous multi-agent swarm. 

The system pairs Google Cloud Gemini Flash as a long-context creative reasoning engine with Parallel Web Systems as a sub-second, deterministic legal grounder. It detects legal liabilities, negotiates story-friendly replacements, verifies fictional assets against live public registries, and generates a certified Form E&O-2026 PDF Underwriting Binder with complete audit trails.

---

## 2. Target Users

1. Independent Film Producers: Need fast, cost-effective script clearance to qualify for Errors and Omissions (E&O) insurance and distribution agreements.
2. Entertainment Attorneys and Production Counsel: Need automated preliminary reviews to spot trademark, copyright, permit, and defamation liabilities across full screenplays.
3. Completion Bond Officers and Insurance Underwriters: Need verified, tamper-evident audit logs with live database query proofs before issuing insurance policy riders.
4. Film Directors and Screenwriters: Need story-authentic, period-accurate replacements that preserve dramatic tone without intrusive commercial brands.

---

## 3. Code Contracts and Verification Gate

### A. The Deterministic Gate Contract
DeepClear Studio prohibits artificial intelligence hallucinations in legal clearance. Agents are programmatically barred from clearing an asset solely based on generative language text. Clearance is strictly governed by the following TypeScript interface contract:

```typescript
export interface DeterministicClearanceGate {
  entityId: string;
  category: "trademark" | "permit" | "caselaw" | "tax" | "defamation" | "domain";
  rawText: string;
  proposedSubstitute: string;
  parallelData: {
    verified: boolean;
    searchId: string;
    latencyMs: number;
    registryStatus: string;
    trademarkClass?: string;
  };
  activeConflicts: number;
  gatePassed: boolean; // Must strictly satisfy: parallelData.verified === true && activeConflicts === 0
  statutorySignoff: boolean;
}
```

### B. Enforced Runtime Gate Invariant
- An asset status can only transition to "cleared" if gatePassed is true.
- The gate requires proof from the official Parallel Web Systems TypeScript SDK (parallel-web).
- If parallelData.verified is false or activeConflicts is greater than zero, the substitution is rejected and returned to the swarm for renegotiation.

---

## 4. Autonomous Swarm Dynamics and Bounded Debates

### A. The 5 Studio Agents
1. Script Supervisor (script_supervisor): Enforces screenplay Fountain formatting, slugline integrity, and regular expression stutter defense.
2. Studio Legal Counsel (legal_counsel): Manages Lanham Act compliance, copyright fair use, defamation vetting, and executes Parallel Search queries.
3. Location and Art Manager (location_manager): Audits municipal filming permits, FAA Part 107 drone restrictions, and routes tax-qualified locations to the zero-mutation License path.
4. The Director (director): Champions artistic intent, narrative authenticity, and fair use under Rogers v. Grimaldi. Manages producer disputes.
5. Completion Bond Officer (bond_officer): Tracks statutory exposure, underwrites policy riders, and certifies safe harbor when exposure reaches $0.00.

### B. Loop Guardrails and Bounded Debates
To prevent infinite reasoning loops, API token bloat, and agent deadlock:
- Hard Turn Limit: Swarm debates are capped at a maximum of 3 turns per liability.
- Deadlock Handling: If the Director and Legal Counsel cannot agree on a verified fictional substitute within 3 turns, the system halts autonomous execution for that entity and transitions the status to PRODUCER_INTERVENTION_REQUIRED.
- Producer Intervention: The human producer receives an interactive choice in the Action Required panel:
  1. Input a custom replacement name for instant Parallel verification.
  2. Confirm an outside license agreement.
  3. Authorize an explicit E&O policy rider exclusion.

---

## 5. Financial Independence Formulas

DeepClear Studio enforces the Strict Independence Principle: legal liabilities and production tax credits are calculated independently. Tax credits never net down statutory liabilities.

### A. Gross Statutory Exposure Formula
Calculated as the sum of statutory baseline damages across all un-cleared liabilities:

Gross Statutory Exposure = Sum of (Entity Baseline Statutory Damage for all un-cleared liabilities)

Baseline statutory figures configured in the system:
- Lanham Act Trademark Dilution (15 U.S.C. Section 1125): $150,000 per unvetted mark.
- Copyright Infringement (17 U.S.C. Section 504(c)(2)): $150,000 maximum statutory damages.
- Living Person Defamation / Right of Publicity (Cal. Civ. Code Section 3344): $250,000 baseline.
- Municipal Permit & Drone Infractions (FAA Part 107): $50,000 baseline.
- ACPA Cybersquatting & Telecom Harassment (15 U.S.C. Section 1125(d)): $100,000 baseline.

When all liabilities are resolved via verified mutations or production licenses, Gross Statutory Exposure reaches exactly $0.00:

Net Exposure = Sum of (Remaining Liabilities) = $0.00

### B. State Film Tax Rebate Formula
Calculated independently as an economic benefit for production financing:

Tax Rebate Unlocked = Qualified Production Expenditure (QPE) x State Tax Rebate Rate

Jurisdictional rates supported:
- Georgia: 20% base + 10% promotional uplift = 30% transferable credit.
- New Mexico: 25% base + 5% rural uplift = up to 35% refundable credit.
- California: 20% to 25% non-transferable tax credit.

---

## 6. Auditability and Client-Side PDF Engine

DeepClear Studio generates a verifiable, multi-page Form E&O-2026 Motion Picture Underwriting Binder directly inside the browser using jsPDF and jspdf-autotable.

### A. Page 1: Executive Underwriting Summary
- Policy Certificate Header: Unique binder ID, timestamp, and policy decision (APPROVED or PENDING_REMEDY).
- Financial Metrics: Side-by-side display of Gross Statutory Exposure ($0.00 required for approval) and Unlocked State Tax Rebates.
- Cleared Asset Ledger: Structured table listing original screenplay text, verified replacements, legal classifications, and final clearance status.
- Cryptographic Signature: Merkle root hash generated from all resolved entities.

### B. Page 2: Exhibit B Audit Ledger
- Parallel Search Records: Full audit log of every query executed against live registries.
- Required Audit Fields: Parallel Search ID, execution latency in milliseconds, trademark classification, registry status, source URL, and exact query timestamp.
- Underwriter Legal Admissibility: Provides insurance carriers with written documentary evidence satisfying carrier due diligence standards.

---

## 7. Error Recovery and Resiliency Matrix

DeepClear Studio includes comprehensive resiliency safeguards for production reliability:

| Risk / Failure Mode | System Guardrail | Technical Implementation |
| :--- | :--- | :--- |
| Redundant API Queries | 30-Minute In-Memory Cache | getCachedParallelQuery stores normalized search results for 30 minutes, cutting redundant queries by up to 70%. |
| Data Privacy / Leaks | Local-First Architecture | 100% browser localStorage persistence (deepclear_session_history_v1). Zero screenplay text stored on remote databases. |
| HTTP 429 Rate Limits | Automatic Model Cascade | generateContentWithCascade cascades through 7 candidate Gemini models (gemini-flash-latest, gemini-3.5-flash, gemini-3.7-flash, etc.). |
| Deprecated Endpoints | Dynamic Model Discovery | Automatically queries Google Generative Language ModelService directly if local candidate models are unavailable. |
| Dialogue Word Collisions | Regex Stutter Defense | Automated regular expression filters clean repeated words (\b([a-zA-Z]+)\s+\1\b) and articles (\b(a|an)\s+(a|an)\b). |
| Audio Overlap | Synchronous Mute Guard | Instant voice cancellation via window.speechSynthesis.cancel() with zero lingering audio on mute toggle. |

---

## 8. Screenplay Redline Diff and Formatting Standards

- Multi-Format Ingestion: Accepts Fountain (.fountain), Markdown (.md), and plain text (.txt).
- Side-by-Side Redline Diff: Left pane displays original text; right pane displays cleared production text with highlighted changes.
- Cryptographic Clearance Passport: Finalized scripts receive an embedded SHA-256 Merkle root frontmatter header. Uploading a pre-cleared script triggers instant safe harbor bypass with zero redundant debate turns.
