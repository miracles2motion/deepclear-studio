# DeepClear Studio — Execution Checklist for Antigravity

- [x] **Phase 1: Environment & Project Scaffolding**
  - [x] Initialize Next.js project with App Router, TypeScript, and Tailwind CSS.
  - [x] Configure root `LICENSE` file with MIT license text.
  - [x] Setup `.env.local` with `GEMINI_API_KEY`, `PARALLEL_API_KEY`, and Web3 testnet RPC configurations.
  - [x] Install dependencies: `@google/genai`, `parallel-web`, `framer-motion`, `lucide-react`, `jspdf`, `jspdf-autotable`, `ethers`, `canvas-confetti`.

- [x] **Phase 2: Core Agent Pipelines & Grounding Backend**
  - [x] Implement `src/lib/gemini.ts` using Google GenAI SDK for Gemini Multimodal extraction and dialectic debate loops.
  - [x] Implement `src/lib/parallel.ts` with 4D search integrations (Trademarks, Municipal Permits, Case Law Precedents, Tax Rebates).
  - [x] Build `/api/analyze` route with Server-Sent Events (SSE) streaming thought logs and entity extraction.
  - [x] Build `/api/debate` route orchestrating the multi-turn Director vs Legal Counsel negotiation.
  - [x] Build safe-prop substitution engine on storyboard canvases.
  - [x] Implement Completion Bond actuarial liability calculator ($ exposure range).

- [x] **Phase 3: Frontend War Room Command Center**
  - [x] Build `HeaderControlBar.tsx` with 1-click test scenarios (Sci-Fi Nightmare, Historical Benchmark, Cleared Masterpiece).
  - [x] Build `AgentNetworkGraph.tsx` with 5-Node glassmorphism swarm cards and animated dynamic Bezier SVG telemetry links.
  - [x] Build `ScriptViewer.tsx` with real-time strike-through redaction and inline green compromise typing.
  - [x] Build `StoryboardInspector.tsx` with normalized bounding boxes and interactive Before/After defusal slider.
  - [x] Build `DynamicHUD.tsx` with radial liability gauge, trade impact card, and tax arbitrage table.
  - [x] Build `AudibleWarRoom.tsx` with Web Speech API dual-voice synthesis and live canvas audio waveform visualizer.

- [x] **Phase 4: Cryptographic Verification & Export**
  - [x] Implement SHA-256 Merkle audit hashing for script and clearance decision logs.
  - [x] Implement `src/lib/web3.ts` for minting testnet clearance tokens (Base Sepolia / Polygon Amoy).
  - [x] Build `src/lib/pdfGenerator.ts` for 1-click export of publication-ready **Form E&O-2026 Insurance Underwriting Binder** with embedded QR code.

- [x] **Phase 5: Verification & Cloud Deployment**
  - [x] Test end-to-end judge flow: Load screenplay $\rightarrow$ Live Gemini multimodal scan $\rightarrow$ Parallel 4D search $\rightarrow$ Audible debate $\rightarrow$ Script mutation $\rightarrow$ Re-score $\rightarrow$ Form E&O-2026 PDF & Base Sepolia On-Chain mint.
  - [x] Deploy to production hosting with active SSE streaming and public URL verification (https://deepclear-studio.vercel.app).

- [x] **Phase 6: 5-Agent War Room, Parallel Search Live Verification & Clearance Passport**
  - [x] True 5-Agent War Room: Extended dialectic negotiation to include Legal Counsel, The Director, Location / Art Manager, Completion Bond Officer, and Script Supervisor.
  - [x] Runtime Parallel Search Verification: Integrated live USPTO and global trademark registry verification during debate before compromises are accepted.
  - [x] Dual Clearance Modes: Support for both narrative prop mutations and active commercial/sync licenses (17 U.S.C. § 115) with $0 exposure.
  - [x] Tamper-Evident Clearance Passport (`src/lib/passport.ts`): Embeds YAML frontmatter metadata into exported scripts.
  - [x] Safe-Harbor Re-upload: Automatic passport extraction eliminating false-positive re-flagging loops.
  - [x] 1-Click Judge Presets: Added Cyber Heist, Southern Gothic, and Cleared Masterpiece scenario chips.

- [x] **Phase 7: Autonomous Swarm Clearance Engine (Auto-Pilot Mode) & Producer Dispute Controls**
  - [x] Implement `src/lib/autoSwarm.ts` autonomous triage routing (License vs Mutate) and rate-limit safe pacing delays.
  - [x] Implement in-memory Parallel Search deduplication cache (`getCachedParallelQuery`, `setCachedParallelQuery`).
  - [x] Set Auto-Pilot as the default clearance mode with Left Sidebar segmented mode toggle `[ ⚡ Auto-Pilot | 👤 Manual ]`.
  - [x] Build `[ ⚡ Auto-Clear All (N) ]` queue runner in Action Required header with live sequential progress feedback.
  - [x] Implement Human-in-the-Loop Cleared Assets Ledger with 1-click `[ Dispute ]` rollback and chat audit notification.
  - [x] Verify zero TypeScript errors (`npx tsc --noEmit`) and successful production bundle build (`npm run build`).

- [x] **Phase 8: Autonomous Swarm Orchestration, Reactive De-Queueing & Responsive Viewport Parity**
  - [x] Zero-click autonomous swarm trigger in Auto-Pilot mode when screenplay analysis completes.
  - [x] Immediate reactive de-queueing of cleared/licensed items from Action Required bar via functional state updaters.
  - [x] Organic speech cadence and conversational pacing replacing artificial delays with 350ms handoff breath.
  - [x] Unified responsive navigation breakpoint to `lg` (1024px) for full tablet & mobile E&O HUD accessibility.
  - [x] Permanent codification of autonomous swarm and UI state invariants in `AGENTS.md`.

- [x] **Phase 9: Parallel Partner Track Hero Upgrade (Official SDK, Inspector Drawer, Redline Diff & PDF Audit Exhibit)**
  - [x] Upgrade `src/lib/parallel.ts` to official `parallel-web` TypeScript SDK with typed `client.search` and `client.extract`.
  - [x] Extend `ParallelGroundingCitation` with search telemetry (`searchId`, `searchLatencyMs`, `trademarkClass`, `registrationStatus`).
  - [x] Build `ParallelInspectorDrawer.tsx` with responsive desktop slide-over and mobile bottom sheet.
  - [x] Build `ScreenplayRedlineView.tsx` with side-by-side desktop diff and mobile segmented tabs (`[Cleared]`, `[Original]`, `[Split]`).
  - [x] Add Exhibit B: Parallel Web Systems Grounding & Registry Audit Ledger to `src/lib/pdfGenerator.ts`.
  - [x] Complete production build verification (`npm run build`) and update changelog.

- [x] **Phase 10: @ Mention Tagging System, Conversational Agent Engine & Inter-Agent Collaboration**
  - [x] Build `@` mention autocomplete popover with keyboard navigation (`ArrowUp`, `ArrowDown`, `Enter`, `Tab`, `Escape`) in prompt box.
  - [x] Add click-to-tag integration on Left Sidebar "Autonomous Crew Swarm" agent cards.
  - [x] Implement `/api/agent-chat` route and `generateConversationalAgentResponse` in `src/lib/gemini.ts` for conversational inquiries.
  - [x] Screenplay vs conversational intent classification preventing question mutation into fake liabilities.
  - [x] Inter-agent consultation passing context between crew members with secondary follow-up commentary turns and audio speech.
  - [x] Parallel Search grounding badges and interactive suggested action pills in text messages.

