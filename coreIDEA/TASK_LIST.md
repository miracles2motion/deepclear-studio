# DeepClear Studio — Execution Checklist for Antigravity

- [ ] **Phase 1: Environment & Project Scaffolding**
  - [ ] Initialize Next.js project with App Router, TypeScript, and Tailwind CSS.
  - [ ] Configure root `LICENSE` file with MIT license text.
  - [ ] Setup `.env.local` with `GEMINI_API_KEY`, `PARALLEL_API_KEY`, and Web3 testnet RPC configurations.
  - [ ] Install dependencies: `@google/genai`, `parallel-web`, `framer-motion`, `lucide-react`, `jspdf`, `jspdf-autotable`, `ethers`, `canvas-confetti`.

- [ ] **Phase 2: Core Agent Pipelines & Grounding Backend**
  - [ ] Implement `src/lib/gemini.ts` using Google GenAI SDK for Gemini Multimodal extraction and dialectic debate loops.
  - [ ] Implement `src/lib/parallel.ts` with 4D search integrations (Trademarks, Municipal Permits, Case Law Precedents, Tax Rebates).
  - [ ] Build `/api/analyze` route with Server-Sent Events (SSE) streaming thought logs and entity extraction.
  - [ ] Build `/api/debate` route orchestrating the multi-turn Director vs Legal Counsel negotiation.
  - [ ] Build `/api/defuse-prop` for generative safe-prop image substitution on storyboard canvases.
  - [ ] Implement Completion Bond actuarial liability calculator ($ exposure range).

- [ ] **Phase 3: Frontend War Room Command Center**
  - [ ] Build `HeaderControlBar.tsx` with 1-click test scenarios (Sci-Fi Nightmare, Historical Benchmark, Cleared Masterpiece).
  - [ ] Build `AgentNetworkGraph.tsx` with 5-Node glassmorphism swarm cards and animated dynamic Bezier SVG telemetry links.
  - [ ] Build `ScriptViewer.tsx` with Framer Motion real-time strike-through redaction and inline green compromise typing.
  - [ ] Build `StoryboardInspector.tsx` with normalized bounding boxes and interactive Before/After defusal slider.
  - [ ] Build `DynamicHUD.tsx` with radial liability gauge, "Butterfly Effect" trade headline card, and tax arbitrage table.
  - [ ] Build `AudibleWarRoom.tsx` with Web Speech API dual-voice synthesis and live canvas audio waveform visualizer.

- [ ] **Phase 4: Cryptographic Verification & Export**
  - [ ] Implement SHA-256 Merkle audit hashing for script and clearance decision logs.
  - [ ] Implement `src/lib/web3.ts` for minting testnet clearance tokens (Base Sepolia / Polygon Amoy).
  - [ ] Build `src/lib/pdfGenerator.ts` for 1-click export of publication-ready **Form E&O-2026 Insurance Underwriting Binder** with embedded QR code.

- [ ] **Phase 5: Verification & Cloud Deployment**
  - [ ] Test end-to-end judge flow: Load preset $\rightarrow$ Live multimodal scan $\rightarrow$ Parallel 4D search $\rightarrow$ Audible debate $\rightarrow$ Script mutation $\rightarrow$ Re-score $\rightarrow$ PDF & On-Chain mint.
  - [ ] Deploy to production hosting with active SSE streaming and public URL verification.
