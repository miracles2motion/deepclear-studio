# DeepClear Studio — Product Requirements Document (PRD)

## 1. Executive Summary & Vision
DeepClear Studio is an autonomous, multimodal film clearance and E&O legal underwriting co-pilot. It replaces the 4-week, $50,000 manual screenplay clearance process with an autonomous 60-second dialectic war room. By combining Google Cloud Gemini Flash (1,000,000+ token context window) with the official Parallel Web Systems TypeScript SDK, DeepClear identifies statutory liabilities, negotiates safe narrative substitutions across 5 distinct studio personas, verifies alternatives live against USPTO and public registries in ~40ms, and outputs a certified Form E&O-2026 Insurance Underwriting Binder.

---

## 2. Target Users & Personas
1. **Independent Film Producers & Line Producers**: Need fast, budget-friendly script clearance to satisfy completion bond guarantors and distributors without spending $40k on legal retainers.
2. **Studio Entertainment Attorneys & Outside Counsel**: Need an automated first-pass legal audit that flags Lanham Act § 43(a) trademarks, 17 U.S.C. § 504 copyright sync issues, municipal filming permits, and Cal. Civ. Code § 3344 living person defamation.
3. **Completion Bond Guarantors & E&O Underwriters**: Require deterministic evidentiary proof (Exhibit B Parallel Audit Ledgers) and cryptographic Merkle roots to issue policy riders and greenlight principal photography.
4. **Directors & Screenwriters**: Want creative compromises that preserve narrative tone, character voice, and authentic dialogue without awkward prop placements or stutter collisions.

---

## 3. Core Functional Requirements

### FR-1: Multimodal Screenplay Ingestion & Entity Extraction
- **Input Formats**: Accepts standard formats (.fountain, .md, .txt), direct text copy-paste, or one-click scene generation via Gemini.
- **Single-Pass Ingestion**: Leverages Google Cloud Gemini Flash's 1M+ token window to ingest full 120-page feature scripts in an atomic pass (zero chunking rate limits).
- **Classification Engine**: Identifies 6 statutory liability categories:
  1. *Commercial Trademarks & Trade Dress* (Lanham Act § 43).
  2. *Musical Compositions & Master Recordings* (17 U.S.C. § 107/115/504).
  3. *Municipal & Public Filming Permits* (Street closures, drone aerials, historic sites).
  4. *Living Person Defamation & False Light* (Cal. Civ. Code § 3344).
  5. *Telecom Safe 555 Numbers & ICANN WHOIS Domains*.
  6. *State Film Tax Incentives* (e.g. Georgia 30% QPE rebate).

### FR-2: 5-Agent War Room Dialectic Negotiation Swarm
- **5 Specialized Studio Personas**:
  - **The Director**: Passionately defends artistic motif and First Amendment fair use (*Rogers v. Grimaldi*).
  - **Studio Legal Counsel**: Enforces statutory trademark dilution and E&O underwriting standards.
  - **Location & Art Manager**: Resolves municipal permits and leverages state filming tax incentives.
  - **Script Supervisor**: Formats Fountain sluglines and prevents duplicate word collisions.
  - **Completion Bond Officer**: Actuarially underwrites liability and issues E&O safe-harbor riders.
- **Autonomous Auto-Pilot Swarm**: In Auto-Pilot mode, the 5 agents autonomously negotiate solutions for all flagged liabilities sequentially without requiring extra clicks.
- **Human Conversational Cadence**: Speech synthesis and chat messages mount with natural 350ms conversational handoffs.

### FR-3: Runtime Deterministic Parallel Web Grounding
- **Official SDK**: Utilizes the official `parallel-web` TypeScript SDK (`client.search` and `client.extract`).
- **Live USPTO Trademark Verification**: Proactively verifies that proposed substitute props have **zero active commercial trademark conflicts** before compromises are accepted.
- **Public Licensing & Defamation Grounding**: Checks public records for living person collisions in ~40ms.
- **Compact Telemetry Cards**: Legal Counsel displays clean, sanitized 1-to-2 sentence legal summaries in the chat stream.
- **Parallel Grounding Inspector Drawer**: Dedicated interactive drawer displaying full search IDs, query strings, latency metrics, and USPTO international classes with multi-input scrolling (wheel, drag, chevrons).

### FR-4: Screenplay Redline Diff & Stutter Defense Engine
- **Dual-Column Diff**: Side-by-side split view comparing the original draft with the cleared production script.
- **Screenplay Stutter Defense**: Contextual regex sanitization (`\b([A-Za-z]+)\s+\1\b`) preventing duplicate word errors (e.g., "vintage vintage", "An an").
- **Preserved Sluglines**: Authentic script sluglines and dialogue formatting remain 100% broadcast-ready.

### FR-5: Human-in-the-Loop Producer Dispute Controls
- **1-Click Dispute Rollback**: Any cleared asset can be disputed by the producer. Clicking `[ Dispute ]` instantly restores statutory exposure, re-queues the liability, rolls back the redline text to the raw prop, and alerts the war room for re-negotiation.

### FR-6: Form E&O-2026 PDF Binder & Cryptographic Passport Export
- **Form E&O-2026 PDF Underwriting Binder**: Executive multi-page underwriter package featuring:
  - Page 1: Policy summary, exposure reduction, qualified tax rebate savings, and completion bond seal.
  - Page 2: *Exhibit B: Parallel Web Systems Grounding & Audit Ledger* with verified queries, statutory classes, URLs, and official Parallel warranty attestation.
- **Cryptographic Clearance Passport**: Embeds a SHA-256 Merkle root into exported script frontmatter. Re-uploading a pre-cleared script triggers instant safe-harbor bypass ($0 exposure) with zero redundant API costs.

---

## 4. Non-Functional Requirements
- **Performance**: Script analysis in < 3 seconds; Parallel Search verification in < 50ms.
- **Reliability**: Self-Healing Model Cascade (`gemini-flash-latest`, `gemini-3.5-flash`, `gemini-3.7-flash`) with 99.9% uptime.
- **Security**: 100% client-side browser session persistence using `localStorage` (`deepclear_session_history_v1`)—zero script text stored on remote databases without authorization.
- **Ergonomics & Accessibility**: Responsive across 4K desktop studio monitors, tablets (768px–1023px), and mobile phones (<768px).

---

## 5. Success Metrics & KPIs
- **98% Reduction** in screenplay clearance turnaround time (from 4 weeks to 60 seconds).
- **100% Deterministic Evidentiary Proof** for all cleared assets via Parallel Web Grounding.
- **$0 Liability Safe Harbor** achieved for every verified production script.
