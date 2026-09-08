# DeepClear Studio — Technical Architecture & Data Flow

## 1. High-Level System Architecture Diagram

```mermaid
flowchart TD
    subgraph Ingestion["1. Multimodal Script Ingestion"]
        A[User Input / Fountain Script / Presets] --> B{Cryptographic Passport Present?}
        B -- "Yes (Merkle Root Valid)" --> C[Bypass Analysis: Exposure = $0]
        C --> D[Instant Production Script & Safe Harbor Seal]
        B -- "No" --> E[Google Cloud Gemini Flash<br/>1,000,000+ Token Single-Pass Scan]
    end

    subgraph Swarm["2. 5-Agent War Room Dialectic Swarm"]
        E --> F[Script Supervisor: Continuity & Stutter Defense]
        E --> G[Studio Legal Counsel: Trademark & Copyright Exposure]
        E --> H[The Director: Artistic Intent & Rogers v. Grimaldi]
        E --> I[Location Manager: Permits & Georgia 30% Tax Rebates]
        E --> J[Completion Bond Officer: Actuarial Underwriting]
    end

    subgraph Grounding["3. Live Parallel Web Systems Grounding"]
        G & I --> K[Parallel Search TypeScript SDK v1.3]
        K --> L[Live USPTO Trademark Database Check: ~40ms]
        K --> M[Public Records & Living Person Directory Check]
        K --> N[WHOIS & FCC Safe 555 Reserve Validation]
    end

    subgraph Verification["4. UI Telemetry & Inspection"]
        L & M & N --> O[Parallel Grounding Inspector Drawer]
        O --> P[Screenplay Redline Diff Split-View]
        P --> Q{Producer Approves or Disputes?}
        Q -- "Approved" --> R[Script Mutation & Exposure Reduced to $0]
        Q -- "Disputed" --> S[Instant Rollback to Raw Text & Re-Open Exposure]
    end

    subgraph Export["5. Underwriting & Export"]
        R --> T[Form E&O-2026 PDF Underwriting Binder]
        T --> U[Exhibit B: Parallel Audit Ledger]
        R --> V[Tamper-Evident Clearance Passport Export]
    end
```

---

## 2. Core Architectural Principles
1. **Zero-Drop Resilience**: Self-Healing Model Cascade across Gemini models (`gemini-flash-latest`, `gemini-3.5-flash`, `gemini-3.7-flash`) with in-flight session resumption.
2. **Deterministic Grounding**: Every proposed narrative substitution is anchored by live Parallel Web Search USPTO verification.
3. **Producer Sovereignty**: 1-click dispute triggers ensure human creators retain ultimate veto power over automated mutations.
4. **Client-Side Privacy**: Full session state and chat histories persist exclusively in the user's browser via `localStorage`.
