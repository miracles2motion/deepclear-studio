# DeepClear Studio — Changelog

## [v0.3.0] — 2026-09-02

### 🚀 Major Enhancements
- **Direct Live API Integration**: Removed all heuristic fallbacks from `/api/analyze`, `gemini.ts`, and `parallel.ts`. The engine now executes 100% direct live Google Cloud Gemini 2.0 Flash (`@google/genai`) and Parallel Search API (`https://api.parallel.ai/v1/search`) calls.
- **Dynamic Gemini Scene Generator (`/api/generate-scene`)**: Replaced all hardcoded mock scenes with on-demand dynamic screenplay generation powered by Gemini 2.0 Flash.
- **Visual Progress & Loading Spinners**: Added top active shimmer gradient loading bar, rotating `Loader2` spinners on action buttons, and live streaming agent reasoning telemetry pills.
- **Paced Multi-Agent Cadence**: Integrated 3.5s reading intervals between debate turns and live `[Agent is typing...]` indicators so users comfortably absorb arguments.
- **Sequential Non-Obstructive Voice**: Engineered sequential audio queue with distinct pitch profiles (Legal Counsel: `0.85`, Director: `1.25`) that speak punchy 1-sentence summaries and never talk over one another.
- **Executive Form E&O-2026 PDF Binder**: Re-engineered `pdfGenerator.ts` with clean 40pt margins, 2-column executive metrics, alternate-row itemized table, and SHA-256 Merkle root verification seal.
- **Live Vercel Deployment**: Live production URL active at [https://deepclear-studio.vercel.app](https://deepclear-studio.vercel.app).

---

## [v0.2.0] — 2026-09-02

### 🎨 UI & UX Redesign
- **3-Column Google Gemini Layout**:
  - Left Column (260px): 5-Agent crew swarm roster with real-time active indicators and voice toggle.
  - Middle Column (Workspace): Main scrollable chat & clearance stream with bottom floating prompt bar.
  - Right Column (300px): E&O Underwriting status, statutory liability gauge, and Form E&O-2026 PDF export.
- **Apple / Linear Dark Palette**: Converted from neon accents to zinc `#0C0C0E` and `#141416` surfaces with subtle `border-white/[0.08]`.
- **Pinned Quick-Action Bar**: Added instant `⚡ Negotiate [Hazard]` pills pinned above the prompt bar to eliminate manual scrolling.
- **Clean Empty State**: Removed all dummy movies and mock starter cards on startup.

---

## [v0.1.0] — 2026-09-02

### 🚀 Core Architecture
- Scaffolding: Next.js 14 App Router, TypeScript, and Tailwind CSS Obsidian Film Lab tokens.
- Backend: Integrated `@google/genai` (Gemini 2.0 Flash) and `parallel-web` (Parallel 4D Search).
- Streaming: Built `/api/analyze` and `/api/debate` SSE routes for real-time multi-agent telemetry.
- Deliverables: Built `pdfGenerator.ts` for Form E&O-2026 PDF export and `web3.ts` for Base Sepolia testnet minting.
- Deployment: Added `Dockerfile` and `cloudbuild.yaml` for Google Cloud Run containerization.

---

## [v0.0.1] — 2026-09-02

### 🚀 Initialization
- Initialized repository with README.md, MIT LICENSE, and core documentation.
- Created `.agents/` autonomous skills (`auto-push`, `changelog-tracker`, `readme-updater`, `build-guard`, `task-sync`, `api-tester`).
- Defined Google Cloud Agentic Cinema Hackathon — Parallel Track ($15,000) roadmap.
