# DeepClear Studio — Technical Implementation Guide (V4.5)

This guide details the complete development setup, API contracts, agent schemas, and deployment architecture for building and deploying DeepClear Studio for Google Antigravity.

---

## 1. Mandatory Hackathon Constraints & Architecture

1. **Google Cloud / Gemini Integration:** All agent reasoning, multimodal vision entity extraction, dialectic debate logic, and underwriting must execute via the official Google GenAI SDK (`@google/genai` with `gemini-2.0-flash` / `gemini-1.5-pro`).
2. **Parallel Track Runtime Integration:** All live web grounding queries MUST actively call the Parallel Search API at runtime using the `parallel-web` SDK (or REST endpoint).
3. **Public GitHub Repository:** Root `LICENSE` file (MIT License) and comprehensive `README.md`.
4. **Live Hosted Application:** Deployed to a public URL with Server-Sent Events (SSE) streaming active for real-time agent telemetry.
5. **No Placeholders:** All UI components, tool calls, script mutations, audio synthesis, and exports execute functional code.

---

## 2. Tech Stack Architecture

* **Frontend Framework:** Next.js (App Router), React, TypeScript.
* **Styling & Motion:** Tailwind CSS, Framer Motion (live script redaction & Bezier SVG animations), Lucide React Icons.
* **AI & Vision Core:** Google GenAI SDK (`@google/genai`) for Gemini multimodal text + vision extraction and reasoning.
* **Live Web Grounding:** `parallel-web` SDK for trademark registry queries, municipal permit retrieval, legal case-law citations, and state tax rebate arbitrage.
* **Audio Synthesis:** Web Speech API (zero-latency dual-voice synthesis) with Google Cloud TTS fallback.
* **Web3 Verification:** `ethers.js` for minting cryptographic clearance proofs and SHA-256 Merkle hashes to Base Sepolia or Polygon Amoy.
* **Document Export:** `jspdf` and `jspdf-autotable` for client-side multi-page **Form E&O-2026 Insurance Binder PDF** generation.

---

## 3. Project Directory Structure

```
deepclear-studio/
├── LICENSE
├── README.md
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── public/
│   ├── sample_scripts/
│   │   ├── sci_fi_nightmare.fountain
│   │   ├── historical_benchmark.txt
│   │   └── cleared_masterpiece.txt
│   ├── sample_storyboards/
│   │   ├── scene4_rolex_bridge.png
│   │   └── scene4_cleared_prop.png
│   └── assets/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/route.ts       # SSE Stream: Script & Storyboard extraction
│   │   │   ├── debate/route.ts        # SSE Stream: Director vs. Counsel dialectic
│   │   │   ├── search/route.ts        # Parallel Search 4D grounding endpoint
│   │   │   ├── defuse-prop/route.ts   # Generative safe-prop image synthesis
│   │   │   └── mint/route.ts          # Web3 testnet clearance certificate mint
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── HeaderControlBar.tsx       # Branding, Presets, Export triggers
│   │   ├── AgentNetworkGraph.tsx      # 5-Node glassmorphism swarm + Bezier SVG links
│   │   ├── ScriptViewer.tsx           # Screenplay viewer + Framer Motion live mutation
│   │   ├── StoryboardInspector.tsx    # Multimodal canvas with Bounding Boxes & Defusal slider
│   │   ├── DynamicHUD.tsx             # Risk Gauge, Butterfly Headline, Tax Arbitrage Card
│   │   ├── AudibleWarRoom.tsx         # Waveform audio visualizer & dual TTS controller
│   │   ├── IngestionDock.tsx          # Drag & Drop file upload + prompt command bar
│   │   └── ExportModal.tsx            # Form E&O-2026 PDF preview & Web3 minting modal
│   ├── lib/
│   │   ├── gemini.ts                  # Google GenAI SDK client & prompt schemas
│   │   ├── parallel.ts                # Parallel Search SDK client & 4D search tools
│   │   ├── web3.ts                    # Ethers.js testnet minting & SHA-256 hashing
│   │   └── pdfGenerator.ts            # Form E&O-2026 PDF generation engine
│   └── types/
│       └── index.ts                   # TypeScript interfaces & schemas
```

---

## 4. Key Agent Pipelines & Data Schemas

### 1. Script Supervisor Multimodal Schema (`types/index.ts`)
```typescript
export interface ClearanceExtraction {
  sceneTitle: string;
  sceneNumber: number;
  totalLines: number;
  hazards: ScriptHazard[];
  storyboardHazards?: StoryboardHazard[];
}

export interface ScriptHazard {
  id: string;
  line: number;
  rawText: string;
  category: "trademark" | "copyright" | "permit" | "stunt_hazard" | "sag_trigger";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  entityName: string;
  initialEstimatedExposure: number; // in USD statutory damages
  legalDescription: string;
  cleared: boolean;
  clearedText?: string;
}

export interface StoryboardHazard {
  id: string;
  label: string;
  box2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax] normalized 0-1000
  brandDetected: string;
  riskDescription: string;
  safeReplacementPrompt: string;
  clearedImageUrl?: string;
}
```

### 2. Parallel Search 4D Tool Call Contract (`src/lib/parallel.ts`)
```typescript
export interface ParallelSearchRequest {
  query: string;
  category: "trademark" | "permit" | "caselaw" | "tax";
  maxResults?: number;
}

export interface ParallelSearchCitation {
  title: string;
  url: string;
  snippet: string;
  sourceDomain: string;
  confidenceScore: number;
  retrievedAt: string;
}
```

### 3. Adversarial Dialectic Loop Contract (`src/app/api/debate/route.ts`)
* **Turn 1 (Legal Counsel):** Presents critical trademark or permit violation, cites live Parallel Search result, and calculates statutory damages ($ Best-Case vs Worst-Case). Proposes 3 copyright-safe alternatives.
* **Turn 2 (The Director):** Challenges Counsel's flag citing fair use, narrative necessity, or background *de minimis* visibility. Demands a compromise that preserves cinematic tone.
* **Turn 3 (Location Manager):** Interjects with geographic arbitrage (e.g., finding private property with faster permitting and higher state tax rebates).
* **Consensus Resolution:** Generates the unified compromise (e.g., "Replace Rolex Submariner with Chronos 1974 Vintage Timepiece and reroute bridge chase to Pullman Yards, Atlanta"). Triggers live script mutation on screen.

### 4. Completion Bond Actuarial Financial Model
* **Probabilistic Exposure Formula:**  
  $$\text{Total Exposure} = \sum (\text{Statutory Damage Base} \times \text{Injunction Probability}) + \text{Permit Delay Costs} - \text{State Tax Rebate Credit}$$
* **Dynamic Range:** Outputs Best-Case, Expected, and Worst-Case financial liability in real-time.

---

## 5. Server-Sent Events (SSE) Telemetry Stream Format

All agent thoughts, Parallel search queries, and script mutations stream via standard SSE chunks:
```json
data: {
  "type": "AGENT_THOUGHT" | "PARALLEL_QUERY" | "PARALLEL_RESULT" | "SCRIPT_MUTATION" | "RISK_UPDATE" | "AUDIO_TRIGGER" | "CLEARANCE_COMPLETE",
  "agent": "script_supervisor" | "legal_counsel" | "location_manager" | "director" | "bond_officer",
  "payload": { ... }
}
```
