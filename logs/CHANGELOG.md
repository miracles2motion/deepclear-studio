# DeepClear Studio — Changelog

This changelog records major releases, architectural features, and critical milestone implementations.

---

## [v0.4.0] — 2026-09-03
### 🎭 Agent Persona Theming, Live Thinking Traces & Multi-Voice Engine
- **Real-Time Agent Thinking Mini-Cards**: Added dynamic reasoning cards inside left-sidebar agent cards (`✨ THINKING • • •`) displaying internal legal reasoning (e.g. *Rogers v. Grimaldi* tests, Lanham Act § 43(a) exposure, and prop substitution feasibility) before each dialectic turn.
- **Unique Signature Agent Themes & Ambient Gradients**:
  - Distinct signature palettes, active borders, speaker indicators, and top glowing ambient gradient bars for all 5 agents (Director: Rose/Crimson, Legal Counsel: Sky/Cyan, Script Supervisor: Emerald/Mint, Location Manager: Amber/Gold, Bond Officer: Indigo/Violet).
- **Multi-Voice Persona Speech Synthesis**: Configured browser Web Speech API with tailored pitch and rate profiles per agent; added animated `[ 🔊 LIVE ]` speaker badge on the active card; unmuted by default.
- **Interactive Quoted Reply Threading**: Messages now feature `@Agent: "quote"` banners; clicking smoothly scrolls to and highlights the target message with an active glowing ring.
- **Dynamic & Editable Production Title**: Auto-detects titles from uploaded `.fountain`/`.md` files, scene sluglines, or live AI generation, and provides an inline editable title input in the Export Modal.
- **Dual Clearance Action Workflow**: Added `[ 📜 Licensed ]` (indemnity release on file) alongside `[ Negotiate ]` (dialectic script mutation) for real-world studio flexibility.
- **Universal Multi-Format Downloads**: 1-click downloads for `.fountain`, `.md`, and `.txt` in both the final script chat card and the Export Modal.
- **Form E&O-2026 PDF Licensed Prop Distinction**: Resolved PDF binder reporting so licensed items are explicitly documented as `"Licensed (Release On File • Retained in Screenplay)"` with bold cyan `LICENSED` status badges rather than erroneously reporting them as substituted/mutated narrative props.
- **Modern Flexbox PDF Engine (@react-pdf/renderer)**: Upgraded Form E&O-2026 PDF generation from manual coordinate offsets to a modern declarative React Flexbox engine, guaranteeing zero text overlapping, auto-wrapping columns, crisp vector typography, and Apple/Linear design aesthetics with graceful jsPDF fallback.
- **Future-Proof Self-Healing API Discovery**: Added automatic fallback to Google's live `/v1beta/models` endpoint to discover active models on the fly with zero code updates.

---

## [v0.3.1] — 2026-09-03
### 🔧 Gemini API Model Cascade & Resilience Update
- **Google Generative AI Model Migration**: Replaced retired/deprecated legacy models (`gemini-pro`, `gemini-1.5-flash`, `gemini-2.0-flash`) with verified active models (`gemini-flash-latest`, `gemini-3.5-flash`, `gemini-3.7-flash`, `gemini-3.6-flash`, `gemini-3.5-flash-lite`, `gemini-3.1-pro-preview`, `gemini-pro-latest`).
- **Self-Healing Failover**: Added zero-downtime cascade to automatically switch models if a specific endpoint experiences a transient 503 high-demand spike.

---

## [v0.3.0] — 2026-09-02
### ⚡ Direct Live API Engine & On-Demand AI Generation
- **Direct Live API Integration**: Connected 100% direct live Google Cloud Gemini 2.0 Flash (`@google/genai`) and Parallel Search API (`https://api.parallel.ai/v1/search`) with explicit error handling and zero fallbacks.
- **Dynamic Gemini Screenplay Generator (`/api/generate-scene`)**: Replaced all static scenes with on-demand AI screenplay generation powered by Gemini.
- **Paced Dialectic Cadence & Visual Loaders**: Introduced 3.5s reading intervals between debate turns, live `[Agent is typing...]` indicators, top shimmer progress bar, and rotating action spinners.
- **Sequential Non-Obstructing Audio**: Tuned distinct speech synthesis voice profiles (Legal Counsel: `0.85`, Director: `1.25`) that speak concise 1-sentence statements in sequence.
- **Executive Form E&O-2026 Binder**: Re-engineered `pdfGenerator.ts` with clean 40pt margins, 2-column executive metrics, itemized hazard table, and SHA-256 Merkle root verification seal.
- **Production Deployment**: Verified live public production deployment at `https://deepclear-studio.vercel.app`.

---

## [v0.2.0] — 2026-09-02
### 🎨 3-Column Google Gemini Layout & Apple/Linear Dark Mode
- **3-Column Architecture**:
  - Left Column (260px): 5-Agent crew swarm roster with real-time active indicators and voice toggle.
  - Middle Column (Workspace): Main scrollable chat & clearance stream with bottom floating prompt bar.
  - Right Column (300px): E&O Underwriting status, statutory liability gauge, and Form E&O-2026 PDF export.
- **Apple / Linear Dark Theme**: Converted interface to minimal zinc `#0C0C0E` and `#141416` surfaces with subtle `border-white/[0.08]`.
- **Pinned Quick-Action Bar**: Added instant `⚡ Negotiate [Hazard]` pills above the prompt bar to eliminate manual scrolling.
- **Clean Empty Startup**: Removed pre-loaded dummy movie cards for a pristine workspace.

---

## [v0.1.0] — 2026-09-02
### 🚀 Core Architecture & Full-Stack Scaffolding
- **Scaffolding**: Next.js 14 App Router, TypeScript, and Tailwind CSS Obsidian Film Lab tokens.
- **AI & Search Backend**: Integrated `@google/genai` (Gemini 2.0 Flash) and `parallel-web` (Parallel 4D Search).
- **Streaming Telemetry**: Built `/api/analyze` and `/api/debate` SSE routes for real-time multi-agent reasoning.
- **Cryptographic Deliverables**: Built `pdfGenerator.ts` for Form E&O-2026 PDF export and `web3.ts` for Base Sepolia testnet minting.
- **Deployment**: Added `Dockerfile` and `cloudbuild.yaml` for Google Cloud Run containerization.

---

## [v0.0.1] — 2026-09-02
### 🛠️ Initialization & Autonomous Operating System
- Initialized repository with README.md, MIT LICENSE, and core documentation.
- Created `.agents/` autonomous skills (`auto-push`, `changelog-tracker`, `readme-updater`, `build-guard`, `task-sync`, `api-tester`).
- Enforced strict credit conservation rules in `AGENTS.md`.
