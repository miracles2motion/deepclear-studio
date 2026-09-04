# DeepClear Studio — Changelog

This changelog records major releases, architectural features, and critical milestone implementations.

---

## [v0.6.0] — 2026-09-04
### ⚡ Autonomous Swarm Clearance Engine ("Auto-Pilot Mode") & Producer Dispute Controls
- **Default Autonomous Clearance Mode**: DeepClear Studio now defaults to **Auto-Pilot Mode** on boot, enabling 1-click autonomous triage and clearance across all identified script hazards while preserving manual control when preferred.
- **Left Sidebar Mode Switcher**: Added an obsidian glassmorphic segmented control `[ ⚡ Auto-Pilot | 👤 Manual ]` directly above the 5-agent crew roster in the Left Sidebar for instant mode switching.
- **Intelligent Decision Triage Routing (`src/lib/autoSwarm.ts`)**:
  - *Municipal Locations / Permits*: Automatically routes to **Auto-License** (`handleMarkAsLicensed`) to preserve authentic script sluglines and safeguard state filming tax rebates (e.g. Georgia 30%).
  - *Consumer Trademarks / Incidental Props*: Automatically routes to **Auto-Mutate** (`handleStartDebate`) to trigger runtime Parallel Search USPTO validation and defuse brand dilution.
- **Strict Credit Conservation & Rate-Limit Defense**:
  - *Sequential Safe Pacing*: Executes hazard clearance sequentially (1 hazard at a time with a 1.5s paced reading delay) to prevent concurrent burst spikes against Gemini and Parallel Search API quotas.
  - *In-Memory Query Deduplication*: Caches verified trademark queries (`getCachedParallelQuery` / `setCachedParallelQuery`) so recurring props across scenes consume 0 redundant search credits.
- **Human-in-the-Loop Dispute & Appeal Engine**:
  - Added an interactive **Cleared Assets Ledger** in the Right Column HUD with instant `[ Dispute ]` controls.
  - Disputing any cleared asset instantly rolls back safe-harbor status, restores statutory exposure to the underwriting ledger, and posts a high-priority appeal notice into the chat feed.
- **1-Click Swarm Runner**: Added `[ ⚡ Auto-Clear All (N) ]` in the Action Required bar with real-time animated countdown (`Clearing X/Y...`) and spinner indicators.

---

## [v0.5.0] — 2026-09-04
### 🏛️ 5-Agent War Room, Runtime Parallel Search Verification & Safe-Harbor Passport
- **True 5-Agent Dialectic War Room**: Transformed the debate from a canned 2-person exchange into an authentic 5-agent studio war room. Legal Counsel, The Director, Location / Art Department Manager, Completion Bond Officer, and Script Supervisor now actively converse, challenge assumptions, and negotiate solutions.
- **🌟 Runtime Parallel Search Registry Verification (Parallel Track Centerpiece)**: Integrated real-time Parallel Search API calls directly into the debate loop. When alternatives or licenses are proposed, Parallel Search searches live USPTO and global trademark registries (`verifySubstitutePropWithParallel`) to confirm zero conflicting marks before the crew or bond officer approves the compromise.
- **Dual Clearance Action Routes**:
  - *Route A (Defuse & Substitute)*: Mutates infringing props/locations to authentic narrative alternatives verified conflict-free by Parallel Search.
  - *Route B (Licensed & Permitted Exemption)*: Supports productions holding existing music sync rights (17 U.S.C. § 115), product placement deals, or city filming permits. Parallel Search validates the statutory standard, and the Bond Officer waives exposure to $0 while keeping the authentic original script wording intact.
- **Tamper-Evident Clearance Passport Engine (`src/lib/passport.ts`)**: Built `embedClearancePassport` and `extractClearancePassport`. Automatically embeds a YAML frontmatter header into exported `.md` and `.fountain` files recording the Merkle root, cleared replacements, and licensed exemptions.
- **Resolved Re-Upload Risk Loop**: When a downloaded safe-harbor script is re-uploaded, DeepClear automatically extracts the passport, injects safe-harbor exemptions into Gemini, confirms $0 risk, and displays a green verified safe-harbor badge with zero false-positive re-flagging.
- **1-Click Judge Presets**: Added 3 quick-launch scenario chips above the prompt bar:
  - `[ 🚀 Cyber Heist ]`: Tests trademark and music sync (Apple Vision Pro, Cybertruck, Radiohead).
  - `[ 🏛️ Southern Gothic ]`: Tests municipal filming permits and tax rebates (Forsyth Park, Macallan 25).
  - `[ 🛡️ Cleared Masterpiece (Safe Harbor) ]`: Pre-cleared script demonstrating instant $0 risk on re-upload.
- **Extended Voice Casting**: Added dedicated voice profile for the Location / Art Manager in browser speech synthesis.
- **Export & Import Chat History & Session State (`DeepClearSessionData`)**: Added 1-click export and import of complete session JSON files. Saves all messages, 5-agent debate turns, citations, screenplay state, and risk metrics. Allows writers and developers to back up their sessions, restore past negotiations, or share debug snapshots directly into chat.

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
- **Harmonized Chat Cards, Quick Copy & Dynamic Reply Counts**: Restyled the user message box to seamlessly match the crew's glassmorphic Obsidian card design and added a dedicated user avatar badge. Added instant 1-click message copy buttons with animated checkmark feedback, and dynamic live reply count indicators (`[ 💬 X replies ]`) on every threaded message.
- **Responsive Mobile 3-Way Navigation & Center-Stage Cinematic Focus**: Added an intuitive mobile header with segmented tab controls (`[ 💬 Chat ]`, `[ 👥 Crew ]`, `[ 📊 Risk ]`) granting mobile users 100% access to the 5-agent crew roster and underwriting risk dashboard. Elevated center-stage chat focus with an ambient radial gradient, generous message spacing (`space-y-7`), and responsive hazard action card dimensions for mobile and desktop screens.
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
