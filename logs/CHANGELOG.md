# DeepClear Studio — Complete Chronological Changelog

All notable changes, fixes, and architectural milestones are documented in this file in reverse chronological order.

---

## [v0.3.4] — 2026-09-02 (07:18)
### 🧹 Documentation Polish
- Cleaned redundant repository URLs from `README.md` to keep the layout minimalist and focused.

---

## [v0.3.3] — 2026-09-02 (07:15)
### 📚 Documentation & Judge Alignment
- Synchronized `README.md` with the live production deployment URL: `https://deepclear-studio.vercel.app`.
- Documented the full 3-Column Gemini architecture, 5-agent crew swarm, and dynamic on-demand scene generation.
- Checked off Phase 5 in `coreIDEA/TASK_LIST.md`.

---

## [v0.3.2] — 2026-09-02 (07:13)
### 🎬 Dynamic Screenplay Generator & Visual Loaders
- **Gemini Dynamic Scene API (`/api/generate-scene`)**: Created an on-demand endpoint using Gemini 2.0 Flash (`@google/genai`) to dynamically write original, dramatic screenplay scenes with trademark/permit hazards on the fly.
- **Top Shimmer Progress Bar**: Added an animated multi-color gradient shimmer bar pulsing along the top edge of the chat whenever agents are reasoning or fetching API data.
- **Rotating Spinners**: Added `Loader2` rotating spinners on the send button and dynamic scene button.
- **Real-Time Telemetry Pill**: Integrated live activity status (`[SWARM]: Generating fresh scene...` ➔ `[SWARM]: Querying Gemini Multimodal Vision & Parallel Search API...`).

---

## [v0.3.1] — 2026-09-02 (07:09)
### ⚡ 100% Direct Live API Engine (Zero Mock Fallbacks)
- **Direct Gemini Execution**: Refactored `src/lib/gemini.ts` to strictly invoke Google Cloud Gemini 2.0 Flash with explicit error validation.
- **Direct Parallel Search API**: Refactored `src/lib/parallel.ts` to query `https://api.parallel.ai/v1/search` with live bearer tokens and real error propagation.
- **Explicit Error Reporting**: Updated `/api/analyze/route.ts` to stream real API error messages directly to the UI if a key is missing or invalid.

---

## [v0.3.0] — 2026-09-02 (06:50)
### ⏱️ Paced Multi-Agent Cadence & Visual Typing States
- **Reasoning Breathing Space**: Added realistic 3.5-second reading pauses between agent debate turns so users can comfortably absorb arguments.
- **Live Agent Typing Indicator**: Displayed animated reasoning states between turns (`[LEGAL COUNSEL]: Legal Counsel is evaluating trademark statutes...` ➔ `[THE DIRECTOR]: The Director is formulating artistic Fair Use defense...`).
- **Restored Smooth Auto-Scroll**: Fixed chat feed auto-scroll so the stream smoothly follows new incoming messages and streaming chunks.

---

## [v0.2.2] — 2026-09-02 (06:43)
### 🧹 100% Reactive Distribution Risk HUD
- Replaced static Trade Impact headlines (*Variety / Deadline* mock strings) with a reactive Distribution Risk HUD that dynamically reflects detected liabilities, dollar amounts, and clearance states.

---

## [v0.2.1] — 2026-09-02 (06:41)
### 🎙️ Audio Queue Differentiation & Executive PDF Formatting
- **Sequential Voice Queue**: Fixed audio overlap/obstruction by cancelling prior utterances before starting new dialogue.
- **Distinct Persona Voices**: Tuned distinct speech synthesis pitches (Legal Counsel: `0.85`, Director: `1.25`).
- **1-Sentence Spoken Summaries**: Agents only speak punchy 1-sentence statements instead of reading long walls of text. Defaulted to muted on startup.
- **Pinned Quick-Negotiate Action Bar**: Added instant `⚡ Negotiate [Hazard]` pills pinned above the prompt box to eliminate manual scrolling.
- **Executive PDF Formatting (`pdfGenerator.ts`)**: Formatted Form E&O-2026 with 40pt standard margins, 2-column executive metrics, itemized hazard table with alternate row fills, and SHA-256 Merkle root verification seal.
- **Apple / Linear Dark Export Modal**: Redesigned `ExportModal.tsx` matching Linear dark mode.

---

## [v0.2.0] — 2026-09-02 (06:17)
### 🎨 3-Column Google Gemini Layout & Apple / Linear Dark Mode
- **3-Column Architecture**:
  - Left Column (260px): 5-Agent crew swarm roster with active indicators and voice toggle.
  - Middle Column (Workspace): Main scrollable chat & clearance stream with bottom floating prompt bar.
  - Right Column (300px): E&O Underwriting status, statutory liability gauge, and Form E&O-2026 PDF export.
- **Apple / Linear Dark Theme**: Converted from neon accents to zinc `#0C0C0E` and `#141416` surfaces with subtle `border-white/[0.08]`.
- **Clean Empty Startup**: Removed pre-loaded dummy movie cards on startup.

---

## [v0.1.2] — 2026-09-02 (06:06)
### 📁 File Upload & Prompt Ingestion Modal
- Built `ScriptUploadModal.tsx` supporting `.fountain`, `.md`, `.txt`, `.pdf`, and storyboard image uploads with drag-and-drop.

---

## [v0.1.0] — 2026-09-02 (05:55)
### 🚀 Core Full-Stack Implementation
- Scaffolding: Next.js 14 App Router, TypeScript, and Tailwind CSS Obsidian Film Lab tokens.
- Backend: Integrated `@google/genai` (Gemini 2.0 Flash) and `parallel-web` (Parallel 4D Search).
- Streaming: Built `/api/analyze` and `/api/debate` SSE routes for real-time multi-agent telemetry.
- Deliverables: Built `pdfGenerator.ts` for Form E&O-2026 PDF export and `web3.ts` for Base Sepolia testnet minting.
- Deployment: Added `Dockerfile` and `cloudbuild.yaml` for Google Cloud Run containerization.

---

## [v0.0.1] — 2026-09-02 (05:17)
### 🚀 Initialization & Operating System
- Initialized repository with README.md, MIT LICENSE, and core documentation.
- Created `.agents/` autonomous skills (`auto-push`, `changelog-tracker`, `readme-updater`, `build-guard`, `task-sync`, `api-tester`).
- Enforced strict credit conservation rules in `AGENTS.md`.
