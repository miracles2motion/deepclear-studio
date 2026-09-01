# DeepClear Studio — Master UI/UX Specification (UI.md)

**Design System:** Desktop-First Legal Clearance War Room & Autonomous Swarm Command Center[span_0](start_span)[span_0](end_span)  
**Theme:** Cyberpunk / FinTech-Legal Hybrid (Dark mode base `#0B0F17`, Neon Crimson `#FF3B30` for risks, Terminal Cyan `#00E5FF` for telemetry, Emerald `#10B981` for cleared assets)

---

## 1. Global Viewport Wireframe & Spatial Layout

+----------------------------------------------------------------------------------------+
|  DeepClear Studio [V4]    [Preset A] [Preset B] [Preset C]   [Diff Mode]   [PDF] [Mint] | Top Bar
+----------------------------------------------------------------------------------------+
|                           👑 [Completion Bond Officer]                                 | Top Apex Node
|                         /                              \                               |
|        (Wavy Beziers)  /                                \  (Wavy Beziers)              |
|                       /                                  \                             |
|  👈 [Script Supervisor]                                  👉 [Studio Legal Counsel]     | Left / Right
|         │                                                        │                     | Flanks
|  👈 [Location Manager]                                   👉 [The Director]             |
+----------------------------------------------------------------------------------------+
|  [All] [Trademarks] [Permits] [Hazards]            [Split View] [Script] [Storyboard]  | Filter & Mode Bar
+---------------------------------------------------+------------------------------------+
|                                                   |  📊 [Probabilistic Exposure Gauge] |
|  📜 SCRIPT & STORYBOARD VIEWPORT                  |  ────────────────────────────────  | Center Stage
|  - Interactive Risk Pill Badges                   |  📰 [Butterfly Effect Headline]    | & Dynamic HUD
|  - Framer Motion Live Strike-through / Redactions │  ────────────────────────────────  |
|  - Multimodal Storyboard Bounding Boxes           │  🗺️ [Tax Rebate Arbitrage Card]    |
+---------------------------------------------------+------------------------------------+
|  📁 Drag-and-Drop Ingestion Dropzone (.pdf, .txt, .fountain, images)                  | Bottom Command
|  ⌨️ Agent Prompt Command Bar                                                           | & Ingestion Dock
|  🎙️ Audible War Room HUD: Waveform Visualizer & Speaker Toggles                        |
+----------------------------------------------------------------------------------------+

---

## 2. Component Specifications

### 🎛️ Header & Control Bar
* **Branding**: Monospace DeepClear Studio logo with a pulsing status beacon (`ONLINE / SSE CONNECTED`)[span_1](start_span)[span_1](end_span).
* **One-Click Presets**:
  * `[Preset 1: Indie Sci-Fi Nightmare]` ($180K liability trigger)[span_2](start_span)[span_2](end_span)[span_3](start_span)[span_3](end_span).
  * `[Preset 2: The Receipts (Historical)]` (Real-world precedent comparison)[span_4](start_span)[span_4](end_span)[span_5](start_span)[span_5](end_span).
  * `[Preset 3: Cleared Masterpiece]` ($0 liability + 30% tax credit)[span_6](start_span)[span_6](end_span)[span_7](start_span)[span_7](end_span).
* **Workflow Toggles**:
  * `[Full Scene Scan]` vs `[Revision Diff Mode (Draft Blue)]`.
* **Export Triggers**:
  * `[Download E&O Binder (.PDF)]`: Generates an insurance-ready PDF document[span_8](start_span)[span_8](end_span)[span_9](start_span)[span_9](end_span).
  * `[Mint On-Chain Certificate]`: Executes Web3 smart contract transaction upon clearance[span_10](start_span)[span_10](end_span)[span_11](start_span)[span_11](end_span).

---

### 🕸️ 5-Node Agent Visual Network
Each agent is rendered as a rounded, glassmorphism terminal card (`backdrop-blur-md bg-slate-900/80 border border-slate-700`):

* 👑 **Apex Node (Completion Bond Officer)**[span_12](start_span)[span_12](end_span):
  * Displays master underwriting status, aggregated risk score, and real-time total exposure range ($ Best-Case vs. Worst-Case)[span_13](start_span)[span_13](end_span)[span_14](start_span)[span_14](end_span).
* 👈 **Left Flank (Discovery & Logistics)**[span_15](start_span)[span_15](end_span):
  * **Script Supervisor**: Live log stream of parsed props, stunts, brands, and SAG-AFTRA triggers[span_16](start_span)[span_16](end_span)[span_17](start_span)[span_17](end_span).
  * **Location Manager**: Municipal film portal citations, permit lead times, and active tax rebate comparisons[span_18](start_span)[span_18](end_span)[span_19](start_span)[span_19](end_span).
* 👉 **Right Flank (Debate & Verification)**[span_20](start_span)[span_20](end_span):
  * **Studio Legal Counsel**: Live Parallel Search API queries, trademark registry citations, and copyright case law[span_21](start_span)[span_21](end_span)[span_22](start_span)[span_22](end_span).
  * **The Director**: Real-time counter-arguments, fair use justifications, and creative compromise propositions[span_23](start_span)[span_23](end_span)[span_24](start_span)[span_24](end_span).
* 〰️ **Dynamic SVG Wavy Links**:
  * Animated cubic Bezier curves connecting flank nodes to the apex without obstructing center stage.
  * Pulses with colored glowing particles when Server-Sent Events (SSE) stream between agents[span_25](start_span)[span_25](end_span).

---

### 🎯 Center Viewport: Delivery Stage

* 🏷️ **Tag Filter Strip**:
  * Quick filter pill switches: `[All Risks]`, `[Trademarks]`, `[Permits & Locations]`, `[Stunts & Pyro]`, `[SAG-AFTRA]`.
* 🔀 **View Switcher**:
  * Segmented control: `[ Split View ]` | `[ Script Only ]` | `[ Storyboard Only ]`.
* 📜 **Screenplay Display Engine**:
  * Formatted courier font with line numbering.
  * **Interactive Pill Badges**: Highlighted adjacent to flagged lines (e.g., `[🔴 HIGH: Rolex Submariner]`)[span_26](start_span)[span_26](end_span).
  * **Resolution Popover Window**:
    * Parallel Search API citation link[span_27](start_span)[span_27](end_span).
    * Calculated itemized exposure (e.g., *$45,000 potential statutory damages*).
    * 3 Selectable Copyright-Safe Alternatives suggested by Counsel[span_28](start_span)[span_28](end_span)[span_29](start_span)[span_29](end_span).
  * **Framer Motion Live Mutation**: Selecting an alternative strikes through the offending word in red, animates the replacement text, and transitions the pill badge to emerald green (`[🟢 CLEARED: Vintage Timepiece]`).
* 🖼️ **Storyboard Vision Inspector**:
  * Canvas viewer rendering bounding boxes with label tooltips over detected visual hazards (e.g., unpermitted artwork, high-elevation stunts).

---

### 📊 Dynamic Metric Panels (Right Side / Integrated HUD)

* 📉 **Probabilistic Liability Meter**:
  * Dynamic radial gauge animating from crimson red down to emerald green as issues are resolved.
* 📰 **"Butterfly Effect" Headline Card**:
  * **High Risk State**: Pulsing red trade headline (*"VARIETY: Indie Production Bankrupted After Unpermitted LA Bridge Stunt Halts Traffic; Faces $2M Lawsuit"*)[span_30](start_span)[span_30](end_span).
  * **Cleared State**: Glowing green trade headline (*"DEADLINE: Indie Feature Sparks 5-Platform Bidding War After Clean E&O Clearance and Full 30% Georgia Rebate Approval"*)[span_31](start_span)[span_31](end_span).
* 🗺️ **Tax Rebate Arbitrage Card**:
  * Side-by-side comparison table showing net production spend across filming jurisdictions (e.g., California 0% vs. Georgia 30% vs. UK 25.5%)[span_32](start_span)[span_32](end_span)[span_33](start_span)[span_33](end_span).

---

### 📥 Bottom Command & Audio Dock

* 📁 **Dropzone & Ingestion Bar**:
  * Accepts screenplay files (`.pdf`, `.txt`, `.fountain`) and storyboard images[span_34](start_span)[span_34](end_span).
  * Visual pulse animation triggers from the dock up through the wavy links to start agent processing.
* ⌨️ **Swarm Prompt Bar**:
  * Command prompt input allowing the user to provide direct instructions or override agent decisions.
* 🎙️ **Audible War Room HUD**:
  * **Web Speech API / Cloud TTS Engine**: Dual voice synthesis (urgent passionate tone for Director, calm analytical tone for Counsel)[span_35](start_span)[span_35](end_span)[span_36](start_span)[span_36](end_span).
  * **Audio Waveform HUD**: Real-time canvas frequency visualizer that activates during agent debates[span_37](start_span)[span_37](end_span).
  * **Controls**: Individual mute toggles, audio speed selector (`1x`, `1.25x`, `1.5x`), and transcript toggle[span_38](start_span)[span_38](end_span).

---

## 3. Visual State Transitions Summary

| UI Element | Initial / High-Risk State | In-Progress Debate State | Resolved / Cleared State |
| :--- | :--- | :--- | :--- |
| **Pill Tags** | Red pill (`[🔴 HIGH: Brand]`) | Yellow pulse (`[🟡 NEGOTIATING]`) | Green pill (`[🟢 CLEARED: Prop]`) |
| **Script Text** | Highlighted neon crimson | Real-time strike-through animation | Clean text with replacement inline |
| **Liability Gauge** | $180,000 exposure | Count-down step animation | $0.00 (100% Insurable) |
| **Butterfly Effect** | Variety catastrophe headline | Neutral risk summary | Deadline distribution triumph |
| **Action Buttons** | Disabled (Grayed out) | Disabled (Scanning indicator) | Active glowing `[Download PDF]` & `[Mint Token]` |

