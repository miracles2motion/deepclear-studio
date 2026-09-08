# DeepClear Studio Task Checklist

- [x] Phase 1: Project Setup and Dependencies
  - [x] Initialize Next.js project with App Router, TypeScript, and Tailwind CSS.
  - [x] Add root MIT LICENSE file.
  - [x] Configure environment variables for Gemini and Parallel Search.
  - [x] Install required dependencies: @google/genai, parallel-web, jspdf, jspdf-autotable, framer-motion, lucide-react.

- [x] Phase 2: Core Agent Logic and Search Grounding
  - [x] Build script reading pipeline in src/lib/gemini.ts using the Google GenAI SDK.
  - [x] Build live search tools in src/lib/parallel.ts using the parallel-web SDK.
  - [x] Implement API routes for script analysis, agent chat, and debate turns.
  - [x] Build risk calculation engine for statutory exposure and state tax credits.

- [x] Phase 3: Dashboard Interface
  - [x] Build 3-column layout with crew cards, chat feed, and insurance HUD.
  - [x] Add 1-click test presets for quick evaluation.
  - [x] Implement Web Speech audio synthesis with instant mute control.
  - [x] Build side-by-side Screenplay Redline diff view.

- [x] Phase 4: Verification and PDF Export
  - [x] Implement SHA-256 digital fingerprint for pre-cleared scripts.
  - [x] Build Form E&O-2026 PDF export engine with Exhibit B search audit table.

- [x] Phase 5: Testing and Deployment
  - [x] Deploy live application to Vercel (https://deepclear-studio.vercel.app).
  - [x] Verify complete judge test flow across all sample scenes.

- [x] Phase 6: Autonomous Swarm and Parallel Upgrades
  - [x] Add Auto-Pilot mode for automated queue resolution.
  - [x] Integrate live USPTO trademark checks during debate turns.
  - [x] Build Parallel Inspector Drawer with multi-input scrolling.
  - [x] Add 1-click Dispute button for filmmaker rollback control.

- [x] Phase 7: Team Mentions and Session Storage
  - [x] Add @ mention autocomplete popover for specific crew questions.
  - [x] Add browser local storage session persistence with recent session restore.
  - [x] Add Screenplay Stutter Defense to clean up repeated words in dialogue.
  - [x] Verify clean TypeScript build with zero errors.

- [x] Phase 8: System Knowledge Base and Product Management Sync
  - [x] Expand knowledge.md into an authoritative, 8-section technical and behavioral power house.
  - [x] Document mathematical statutory exposure formulas and independent tax credit calculations.
  - [x] Detail the 5 swarm agent roles, personalities, and acoustic voice settings.
  - [x] Formally specify the 13 core state machine invariants and Deterministic Gate enforcement.
  - [x] Enforce zero emojis and zero em dashes across all workspace and knowledge documentation.
