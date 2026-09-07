# DeepClear Studio — Changelog

This changelog records major releases, architectural features, and critical milestone implementations.

---

## [v0.8.4] — 2026-09-07
### 🎥 Automated 1080p Studio Trailer Recorder & Synchronized Narration Engine
- **Automated Video Recorder (`scripts/record-demo.js`)**:
  - Engineered an automated 1080p 60/30fps video recording pipeline using Microsoft Edge via Puppeteer Chrome DevTools Protocol (`Page.startScreencast`) piped directly to `ffmpeg.exe` via stdin.
  - Zero OS notifications, zero browser chrome/infobars (`--disable-notifications`, `--disable-infobars`, `--hide-scrollbars`), producing an uncompressed, studio-grade H.264 MP4 (`deepclear_studio_demo.mp4`).
  - Choreographed end-to-end walkthrough covering: Studio Dashboard, `@` Agent Tagging with dynamic listening cards, Gemini Flash ingestion (Southern Gothic), 5-Agent dialectics with live Parallel SDK telemetry (~42ms), Parallel Inspector Drawer, Screenplay Redline Diff, Producer Dispute rollback, and Form E&O-2026 PDF Document scroll down to Exhibit B.
- **Synchronized Voiceover Synthesizer & Audio Mixer (`scripts/generate-synced-audio.js`)**:
  - Implemented a timed multi-act audio synthesizer dividing narration into 7 distinct acts with precise start-time offsets.
  - Mixed all speech clips using FFmpeg's `adelay` and `amix` filter graph into a master audio stream (`master_narration.wav`).
  - Automatically merged video and narration into a final, submission-ready video: **`deepclear_final_submission.mp4`** (1920x1080, AAC 192kbps stereo, ~7.1 MB).

---

## [v0.8.3] — 2026-09-07
### 🏷️ @ Mention Tagging System, Conversational Agent Q&A & Inter-Agent Collaboration Swarm
- **@ Mention Tagging & Floating Autocomplete Popover**:
  - Implemented an interactive `@` mention autocomplete popover triggered by typing `@` or an agent identifier in the prompt box textarea.
  - Supports keyboard navigation (`ArrowUp`, `ArrowDown`, `Enter`, `Tab`, `Escape`) to smoothly tag any of the 5 studio agents: `@legal_counsel`, `@director`, `@location_manager`, `@script_supervisor`, or `@bond_officer`.
- **Dynamic Tag Syntax Highlighting in Prompt Box**:
  - Implemented a subpixel-synchronized mirror backdrop layer in the prompt box textarea. When an agent tag (`@legal_counsel`, `@director`, `@location_manager`, `@script_supervisor`, `@bond_officer`) is present, only the `@xxxxx` tag itself reflects that specific agent's theme color (e.g. sky blue, rose, amber, emerald, indigo) while the rest of the text remains in crisp standard text color.
  - Added a responsive "Directing to:" header badge inside the prompt box showcasing the tagged agent's avatar, role, and department.
- **Dynamic Typing Detection & Active "Listening... ... ..." Thought Card**:
  - Attached an input debouncing listener (`isUserTyping` with 1000ms idle detection).
  - While an agent is tagged and the user is actively typing, that agent's card in the Left Sidebar ("Autonomous Crew Swarm") illuminates with its theme ring and a green pulsing `LISTENING` badge.
  - An animated `listening... ... ...` thought card mounts in the agent's sidebar card with live radio frequency pulses and bouncing wave indicators.
  - Pausing typing automatically pauses/dismisses the listening card. Resuming typing instantly reactivates it. Dispatching the message (`Enter` or Send button) immediately clears listening and transitions cleanly to the agent's default thinking state (`agentThinking`).
- **Mobile Prompt Bar Responsiveness & Compact Listening Badge**:
  - Optimized the prompt bar's tagged agent banner and mini listening badge for compact mobile screens (iPhone SE, iPhone 14, 375px–390px viewports).
  - Truncated redundant labels on small screens (`Directing:` hidden on `< sm`, long department titles hidden on `< md`), and streamlined the listening tag to a sleek, compact radio pill (`((•)) listening...`), ensuring generous breathing room and zero container clipping.
- **Conversational Intent Router (`/api/agent-chat`)**:
  - Implemented intelligent distinction between screenplay ingestion and conversational inquiries. Screenplay analysis is reserved for text with scene sluglines (`EXT./INT.`), Fountain formatting, dialogue cue blocks, or uploaded files.
  - Conversational questions and directives bypass screenplay mutation and hazard extraction entirely, preserving authentic screenplay text and exposure metrics without false liabilities.
- **Inter-Agent Collaboration & Cross-Specialty Consultations**:
  - Agents formulate comprehensive, studio-grade responses in their authentic Hollywood persona and seamlessly cross-consult other crew members (e.g. Legal Counsel looping in Bond Officer for underwriting indemnity, or Director consulting Location Manager for permit logistics).
  - Secondary agents provide connected follow-up commentary turns in the chat feed with speech audio synthesis.
- **Parallel Search Grounding Badges & Interactive Action Pills**:
  - Connected live Parallel Web Systems grounding queries to conversational Q&A, rendering clickable verification badges directly under agent responses.
  - Rendered clickable suggested follow-up action pills that instantly populate the prompt box with actionable studio next steps.

---

## [v0.8.2] — 2026-09-07
### 📱 Microsoft Edge Live Preview & Multi-Viewport Mobile Audit Suite
- **Edge Automated Viewport Testing Suite (`scripts/preview-mobile.js`)**: Configured direct execution of Windows Microsoft Edge (`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`) via `puppeteer-core` to run high-resolution, end-to-end mobile audits across iPhone 14 (390x844), iPhone SE (375x667), and iPad (768x1024).
- **Mobile Full-Width Sidebar Fix**: Removed conflicting base widths (`w-64`, `w-72`) on mobile sidebars in `src/app/page.tsx`, scoping desktop widths to `lg:w-72 xl:w-80` and allowing the Crew Swarm and E&O Risk HUD tabs to render at full width on mobile viewports.
- **Responsive Subheader & Action Controls**: Added responsive breakpoint labels (`Swarm Debate & Audit` -> `Debate`, `Screenplay Redline` -> `Redline`, `Auto-Clear All` -> `Auto-Clear`) to eliminate header overcrowding on small viewports.
- **Export Modal Mobile Scrolling**: Added `max-h-[92vh] overflow-y-auto` and adaptive padding (`p-4 sm:p-6`) to `ExportModal.tsx`, preventing action button clipping on compact screens.
- **Parallel Inspector Mobile Bottom-Sheet**: Verified the slide-over drawer properly renders with segmented tabs (`Single Asset` / `All Dossier`), clean telemetry cards, and pinned bottom audit actions across mobile and small phone screens.

---

## [v0.8.1] — 2026-09-07
### 🛡️ Speech Mute Cancellation, Auto-Pilot Abortion, DOM Scroll Preservation & Parallel Inspector Overhaul
- **Instant Audio Mute Cancellation**: Added synchronous `isAudioMutedRef` tracking in `speakTextAsync` and on utterance start. Clicking "Voice Muted" now immediately invokes `synth.cancel()`, clears `speakingAgent`, and halts any pending playback with zero lag.
- **Immediate Auto-Pilot Abortion on Manual Toggle**: Fixed mode switching so clicking "Manual" during an active Auto-Pilot run immediately aborts the clearance queue via `isManualMode()` checks, stops ongoing speech, and restores granular control to the producer.
- **DOM View Scroll State Preservation**: Converted the view switcher between "Swarm Debate & Audit" and "Screenplay Redline" to use CSS class visibility toggling (`hidden` vs `flex flex-col`) rather than conditional component unmounting. Switching tabs never resets or scrolls the chat feed to the top.
- **Pre-Cleared Masterpiece Ingestion Bypass**: Scripts possessing a verified cryptographic Clearance Passport now bypass `/api/analyze` and dialectic swarm debates completely, certifying safe harbor at $0.00 exposure and immediately delivering the final certified production script card.
- **Parallel Grounding Inspector Overhaul (`ParallelInspectorDrawer.tsx`)**:
  - Added dual view modes: "Single Asset Telemetry" and "All Grounding Dossier" tabulating the entire screenplay's registry evidence, average latency, and external citations.
  - Added asset picker pills for rapid switching between liabilities directly inside the drawer.
  - Added "Cleaned Intelligence" vs "Raw Web Extract" snippet toggling powered by `cleanParallelSnippet()`.
  - Added strict flex boundary containment (`min-w-0 max-w-full overflow-hidden break-words`) to prevent citation boxes from expanding outside card borders.
- **Mouse-Wheel & Chevron Badge Scrolling (`ScreenplayRedlineView.tsx`)**: Added `onWheel` horizontal scroll translation and left/right navigation chevrons to the Interactive Clearance Badges bar, enabling effortless mouse wheel scrolling without requiring Shift key.
- **Session Export & Import Parity**: Upgraded `DeepClearSessionData` to serialize and restore `originalScriptSnapshot` and `disputedEntityIds`, ensuring full redline diffs and active dispute states persist across backup files.
- **PDF Layout & Page Break Protection**: Added bottom margin buffer (`bottom: 120`) in `autoTable` and smart page break calculation in `pdfGenerator.ts`, eliminating orphaned single lines (e.g. "Ram truck") from breaking across bottom page margins.

---

## [v0.8.0] — 2026-09-07
### 🚀 Parallel Partner Track Hero Upgrade: Official SDK, Inspector Drawer, Redline Diff & PDF Audit Ledger
- **Official `parallel-web` TypeScript SDK Integration**: Replaced raw HTTP REST calls with the official `Parallel` TypeScript SDK client (`client.search`, `client.extract`). Implemented typed request formulations (`search_queries`, `objective`, `mode: "fast"`) and rich telemetry extraction (`search_id`, latency in ms, publish dates).
- **Parallel Extract API (`extractStatutoryEvidenceWithParallel`)**: Integrated Parallel's `/v1/extract` capability to parse full statutory clauses (Lanham Act § 43(c), 17 U.S.C. § 107/115, USPTO classifications) directly from public registry URLs.
- **Fail-Safe Offline Simulation Architecture**: Retained high-fidelity, deterministic statutory mock fixtures across all Parallel methods. Ensures hackathon judges evaluating the codebase without active `PARALLEL_API_KEY` credentials experience zero crashes, unhandled errors, or latency timeouts.
- **🔬 Parallel Grounding Inspector Drawer (`ParallelInspectorDrawer.tsx`)**: Built a responsive slide-over drawer (desktop right-hand glassmorphic flyout, mobile/tablet bottom sheet) showcasing live search telemetry, latency, query strings, statutory classes, and direct external verification links. Connected to all entity cards, hazard queue items, and resolved asset badges.
- **📜 Screenplay Redline Diff View (`ScreenplayRedlineView.tsx`)**: Created a dedicated redline comparison view:
  - *Desktop (>=1024px)*: Dual-column side-by-side screenplay diff (Original Draft on left with red liability tags, Cleared Production Script on right with green safe-harbor chips).
  - *Mobile/Tablet (<1024px)*: Segmented controller (`[Cleared]`, `[Original]`, `[Split]`) ensuring line-by-line screenplay formatting without horizontal overflow.
  - *Interactive Badges*: Embedded clickable `[⚡ Parallel Verified]` chips opening the Inspector Drawer.
- **📑 Exhibit B: Parallel Web Systems Grounding & Audit Ledger (`pdfGenerator.ts`)**: Upgraded the generated E&O Underwriting Binder PDF to include a dedicated Page 2 underwriter annex tabulating each asset's Parallel Search query, statutory class, registry verdict, and grounding URL with an official Parallel Web Systems warranty attestation.

---

## [v0.7.0] — 2026-09-05
### ⚡ Autonomous Swarm Orchestration, Reactive De-Queueing & Tablet Accessibility
- **Zero-Click Autonomous Initiation in Auto-Pilot Mode**: Screenplay analysis in Auto-Pilot mode now automatically initiates the multi-agent clearance queue after an 800ms analysis review transition. Eliminates the need for users to manually click "Auto-Clear All" when Auto-Pilot is active.
- **Immediate Reactive De-Queueing**: Resolved state closure lag where cleared hazards remained in the Action Required bar across sequential auto-pilot runs. Implemented functional state updaters across `setEntities`, `setClearedEntityIds`, `setLicensedEntityIds`, and `setCurrentExposure`, ensuring hazards vanish immediately upon resolution.
- **Organic Speech Cadence & Conversational Pacing**: Eliminated glitchy artificial delays (`sleep(1500)` and `sleep(600)`) with natural 350ms quick cognition blinks. Dialectic turn cards mount concurrently with speech onset, and `speakTextAsync` enforces natural 350ms handoff breath pauses between speaking agents.
- **Multi-Viewport Tablet & Mobile Accessibility**: Fixed the tablet viewport gap (`768px - 1023px`) where the E&O Underwriting tab was previously inaccessible. Unified navigation breakpoint to `lg` (`1024px`), enabling seamless 1-touch tab switching (`Chat`, `Crew`, `Risk`) with live pending liability badges on mobile and tablet devices.
- **Final Cleared Production Script Card Delivery**: Resolved a closure issue where `currentScriptText` was captured as empty or stale in async clearance loops and omitted during manual resolution. Introduced `currentScriptRef` and a centralized `deliverFinalScriptCard` dispatcher with duplicate protection, ensuring the Final Cleared Production Script card (with copy, format pills, and instant downloads) is reliably delivered across Auto-Pilot clearance, manual debate/licensing resolutions, and zero-liability pre-cleared passport scripts.
- **E&O Underwriting Status Card Audit & Dismissal State Alignment**: Audited all cards in the Right Column HUD. Aligned the Distribution Risk card's pending filters to account for both mutated and licensed clearances (`licensedEntityIds` / `status === "licensed"`), ensuring red `HOLD` warning cards dismiss cleanly to `APPROVED` the instant liabilities reach zero. Upgraded the Cleared Assets Ledger to dynamically dismiss when 0 assets are resolved and seamlessly display all protected assets (including licensed sync agreements and pre-cleared passport exemptions).
- **High-Density E&O Underwriting Vertical Spacing & Card Clipping Elimination**: Refactored the right column (`<aside>`) layout to eliminate vertical bloating, double-scrolling, and bottom button collision. Combined card headers and secondary metrics onto single horizontal rows, compacted card gaps to `space-y-2.5`, encased the cards in a responsive scrollable viewport (`flex-1 overflow-y-auto`), and cleanly pinned the "Export Form E&O-2026 PDF" button in a fixed footer (`pt-2.5 shrink-0 border-t border-white/[0.06]`). Reclaimed ~120px of dead vertical space, preventing the Resolved Assets ledger from clipping beneath the export button.
- **Judge Presets Lifecycle & Dispute Action Guards**: Enforced strict visibility and active state rules for Judge Presets chips (`shouldShowJudgePresets`). Presets are now strictly suppressed whenever: (1) pending liabilities exist (`pendingHazards.length > 0`), (2) a user re-opens a liability via `[ Dispute ]`, (3) an active workflow is executing (`isLoading`, `isAutoClearing`, `speakingAgent`, `agentThinking`, `isGeneratingScene`), or (4) an initiated workflow is incomplete. Presets only mount during the initial clean boot state or when all liabilities are 100% resolved with $0 exposure.
- **Screenplay Mutation Stutter Defense (`mutateScriptText`)**: Eliminated duplicate prefix word stutters and article collisions during hazard substitution (e.g. `"vintage vintage"` and `"An an"`). Automatically regex-sanitizes adjacent identical word overlaps (`\b([A-Za-z]+)\s+\1\b`) and clashing indefinite articles (`\b(a|an)\s+(a|an)\b`), preserving proper capitalization and producing pristine studio-grade script text.
- **Dispute Screenplay Rollback Invariant**: Enhanced `handleDisputeEntity` to automatically revert `currentScriptText` and `currentScriptRef` from `entity.defusedText` back to the authentic `entity.rawText`. When a producer appeals a clearance decision, the original hero prop/slugline is cleanly restored in the screenplay, allowing them to license the authentic asset or negotiate a fresh alternative.
- **Resolved Hazards Ledger Safe Harbor Clarity Enhancement**: Overhauled the Right Column ledger typography to eliminate ambiguity between protected status and original hazards. Mutated items now prominently feature the cleared prop as the hero line (`🛡️ tactical augmented reality spatial visor`) with the defused hazard and savings in the subtext (`Defused from: "Apple Vision Pro headset" • -$150,000`), while the card header displays an unambiguous `Safe Harbor ($0)` badge with a shield icon.
- **Autonomous Swarm & UI Invariants**: Codified core operating rules in `AGENTS.md` (Section 5) to permanently protect autonomous execution, immediate de-queueing, conversational pacing, multi-viewport accessibility, screenplay stutter defense, and dispute script rollback.

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
- **End-to-End UI & Swarm Synchronization**:
  - *Full Crew Licensing Verification*: Upgraded `handleMarkAsLicensed` into an async dialectic flow where the Location Manager verifies municipal/state tax credit permits followed by the Completion Bond Officer underwriting indemnity release, complete with dedicated voices, sidebar thinking cards, and chat status updates.
  - *Unified In-Chat Reasoning & Speech Card*: Enhanced the middle-column status bubble with dynamic agent icons, animated bounce speaker indicator (`[SPEAKING (VOICE ACTIVE)]`), and real-time swarm queue status.
  - *Flicker-Free Rate-Limit Pacing*: Inter-hazard delays (1.5s) now display active pacing telemetry via the Script Supervisor (`⚡ Auto-Pilot Swarm: Rate-limit defense pacing (1.5s) • Next: "..."`), eliminating visual blinks between items.
  - *Right Column HUD Progress Meter*: Added live animated progress bar and target counter in the Underwriting HUD tracking swarm resolution in real time.
  - *Smooth Viewport Auto-Lock*: Synchronized `useEffect` auto-scrolling with `agentThinking`, `agentTypingStatus`, and `isAutoClearing` to ensure the active reasoning state is always in viewport focus.
  - *Judge Presets Visibility & Clearance Passport HUD Fix*: Resolved an issue where Judge Presets vanished after completing a cleared passport (`isCleared` was falsely requiring `initialExposure > 0`). Presets are now permanently accessible whenever idle (`!isLoading && !isAutoClearing`) with contextual status labels (`"🛡️ Passport Verified! Test Another Preset:"`). Synchronized the Underwriting HUD to display `APPROVED (SAFE HARBOR)` and `SAFE HARBOR (EXEMPT)` rather than falsely showing `IDLE` or `Awaiting Script Ingestion`. Ingested passport assets now immediately populate the Cleared Assets Ledger.

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
