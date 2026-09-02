# DeepClear Studio — Master UI/UX Specification (UI.md V4.5)

**Design System:** Desktop-First Hollywood Legal Clearance War Room & Autonomous Swarm Mission Control  
**Theme:** Cyberpunk FinTech-Legal Hybrid (`#0B0F17` Midnight Canvas, `#FF3B30` Hazard Crimson, `#00E5FF` Parallel Cyan, `#10B981` Cleared Emerald, `#F59E0B` Active Amber)

---

## 1. Global Viewport Wireframe & Spatial Architecture

```
+-----------------------------------------------------------------------------------------------+
|  🎬 DeepClear Studio [V4.5]   [Preset 1: Sci-Fi Nightmare] [Preset 2] [Preset 3]  [PDF] [Mint]| Top Bar
+-----------------------------------------------------------------------------------------------+
|                                 👑 [Completion Bond Officer]                                  | Top Apex
|                               /                              \                                |
|        (Wavy Bezier SVGs)    /                                \  (Wavy Bezier SVGs)           |
|                             /                                  \                              |
|  👈 [Script Supervisor]                                          👉 [Studio Legal Counsel]    | Swarm Flanks
|         │                                                                │                    |
|  👈 [Location Manager]                                           👉 [The Director]            |
+-----------------------------------------------------------------------------------------------+
|  [All Risks] [Trademarks] [Permits] [Hazards]          [Split View] [Script] [Storyboard]     | Filter Strip
+-------------------------------------------------------+---------------------------------------+
|                                                       |  📊 [Probabilistic Exposure Gauge]    |
|  📜 SCRIPT & STORYBOARD DELIVERY STAGE                |  ──────────────────────────────────   | HUD Panels
|  - Interactive Risk Pill Badges                       |  📰 [Butterfly Effect Headline]       |
|  - Framer Motion Live Redaction & Mutation            |  ──────────────────────────────────   |
|  - Multimodal Storyboard Bounding Boxes & Defusal     |  🗺️ [Tax Rebate Arbitrage Card]       |
+-------------------------------------------------------+---------------------------------------+
|  📁 Drag-and-Drop Ingestion Dropzone (.pdf, .txt, .fountain, images)                          | Bottom Command
|  ⌨️ Swarm Prompt Command Bar                                                                  | & Audio Dock
|  🎙️ Audible War Room HUD: Dual-Voice Synthesizer & Canvas Frequency Waveform                  |
+-----------------------------------------------------------------------------------------------+
```

---

## 2. Component Specifications

### 🎛️ 1. Header & Global Control Bar
* **Branding:** Monospace DeepClear Studio logo with a pulsing status beacon (`🟢 ONLINE / SSE READY`).
* **One-Click Presets:**
  * `[Preset 1: Indie Sci-Fi Nightmare]` ($180K liability trigger $\rightarrow$ resolved to $0).
  * `[Preset 2: The Receipts (Historical)]` (Real-world precedent comparison).
  * `[Preset 3: Cleared Masterpiece]` ($0 liability + 30% Georgia tax credit unlocked).
* **Workflow Mode:** `[Full Scan]` vs `[Revision Diff Mode (Draft Blue)]`.
* **Export Triggers:**
  * `[Download Form E&O-2026 (.PDF)]`: Generates client-side multi-page insurance binder.
  * `[Mint On-Chain Certificate]`: Executes Web3 transaction with SHA-256 clearance audit hash.

---

### 🕸️ 2. 5-Node Agent Visual Network (Swarm Telemetry)
Each agent is rendered as a glassmorphism card (`backdrop-blur-md bg-slate-900/80 border border-slate-700/60`):
* 👑 **Apex Node (Completion Bond Officer):**
  * Real-time master underwriting status, clearance progress bar, and exposure range ($ Best-Case vs Worst-Case).
* 👈 **Left Flank (Extraction & Logistics):**
  * **Script Supervisor:** Live log stream of parsed props, stunts, logos, and SAG triggers.
  * **Location Manager:** Municipal film portal citations, permit lead times, and active tax rebate comparisons.
* 👉 **Right Flank (Debate & Verification):**
  * **Studio Legal Counsel:** Parallel Search live query log, trademark registry citations, and case-law precedents.
  * **The Director:** Artistic defense rationale and creative compromise proposals.
* 〰️ **Dynamic SVG Wavy Bezier Links:**
  * Glowing animated cubic Bezier curves connecting nodes, pulsing with cyan/crimson particles during SSE streaming.

---

### 🎯 3. Center Viewport: Script & Storyboard Delivery Stage
* 📜 **Screenplay Display Engine:**
  * Formatted courier font with line numbers.
  * **Interactive Pill Badges:** Adjacent to flagged lines (e.g., `[🔴 CRITICAL: Rolex Submariner]`).
  * **Resolution Popover Window:**
    * Parallel Search live citation link.
    * Calculated exposure (e.g., *$45,000 potential statutory damages*).
    * 3 Selectable Copyright-Safe Alternatives suggested by Counsel.
  * **Framer Motion Live Mutation:** Selecting an alternative strikes through the red text with an animated line, types the replacement in glowing emerald, and switches the badge to `[🟢 CLEARED: Vintage Timepiece]`.
* 🖼️ **Storyboard Vision Inspector:**
  * Interactive canvas with normalized bounding boxes over detected visual hazards.
  * **Generative Prop Defusal:** Split-screen before-and-after slider revealing the AI-cleared prop replacement.

---

### 📊 4. Dynamic HUD Panels (Right Side)
* 📉 **Probabilistic Liability Meter:**
  * Dynamic radial gauge animating smoothly from crimson ($180,000) down to emerald ($0.00).
* 📰 **"Butterfly Effect" Trade Headline Card:**
  * Dynamic trade magazine banner that morphs from red panic (*"VARIETY: Indie Director Bankrupted..."*) to green triumph (*"DEADLINE: Indie Feature Sparks 5-Platform Bidding War..."*).
* 🗺️ **Tax Rebate Arbitrage Card:**
  * Side-by-side comparison table showing net production spend across filming jurisdictions (e.g., California 0% vs Georgia 30% vs UK 25.5%).

---

### 📥 5. Bottom Command Dock & Audible War Room
* 📁 **Dropzone & Ingestion Bar:** Accepts screenplay files (`.pdf`, `.txt`, `.fountain`) and storyboard images.
* ⌨️ **Swarm Prompt Bar:** Allows manual override of agent decisions or custom prompt adjustments.
* 🎙️ **Audible War Room HUD:**
  * Dual-voice browser audio synthesis (urgent tone for Director, calm analytical tone for Counsel).
  * Real-time canvas audio frequency waveform visualizer that activates during live debates.
  * Speed selector (`1x`, `1.25x`, `1.5x`) and mute toggles.

---

## 3. Visual State Transitions Summary

| UI Element | Initial / High-Risk State | In-Progress Debate State | Resolved / Cleared State |
| :--- | :--- | :--- | :--- |
| **Risk Badges** | Crimson pill (`[🔴 HIGH: Brand]`) | Amber pulse (`[🟡 NEGOTIATING]`) | Emerald pill (`[🟢 CLEARED: Prop]`) |
| **Script Text** | Highlighted neon crimson | Real-time strike-through animation | Clean text with replacement inline |
| **Exposure Gauge** | $180,000 statutory liability | Countdown step animation | $0.00 (100% Insurable) |
| **Butterfly Effect** | Variety catastrophe headline | Neutral risk summary | Deadline distribution triumph |
| **Export Triggers** | Disabled (Scanning indicator) | Processing state | Active glowing `[Download PDF]` & `[Mint Token]` |
