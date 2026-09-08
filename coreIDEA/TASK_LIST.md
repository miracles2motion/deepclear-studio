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

- [x] Phase 8: Controlled Autonomy and Fail-Closed Clearance Gate
  - [x] Implement live conflict detection for contested marks in Parallel Search verification.
  - [x] Enforce bounded debate deadlocks (Turn 6) when active registry conflicts are detected.
  - [x] Build fail-closed clearance gate that pauses Auto-Pilot queue on un-cleared marks.
  - [x] Implement interactive Producer Intervention card with dual terminal directives (Mutate or License).
  - [x] Implement automatic Auto-Pilot resumption upon human ratification.
  - [x] Add Executive Impasse test preset showcasing 90/10 controlled autonomy ratio.
  - [x] Reflect executive directives in Form E&O-2026 PDF binder and Redline Diff view.

- [x] Phase 9: Live Sequential Screenplay Redline Diff
  - [x] Dynamic 3-state clearance status header (Awaiting Clearance -> Live Update -> E&O Certified).
  - [x] Real-time hazard clearance pop-up ticker banner in production script column.
  - [x] Live reactive token segmentation: red pending liabilities and glowing emerald verified substitutions.
  - [x] Interactive bottom clearance chips with sequential checkmarks.

