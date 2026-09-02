# DeepClear Studio — Master UI/UX Specification (UI.md V4.5)

**Design System:** 3-Column Google Gemini-Style AI Co-Pilot & Hollywood Legal Mission Control  
**Theme:** Apple / Linear Dark Mode (`#0C0C0E` Charcoal Canvas, `#121214` / `#141416` Zinc Panels, `border-white/[0.08]`, `#10B981` Emerald Cleared, `#F43F5E` Hazard Rose, `#38BDF8` Parallel Sky)

---

## 1. Global Viewport Wireframe (3-Column Architecture)

```
┌──────────────────────────┬──────────────────────────────────────────────┬───────────────────────────┐
│     LEFT COLUMN (260px)  │           MIDDLE COLUMN (WORKSPACE)          │    RIGHT COLUMN (300px)   │
│                          │                                              │                           │
│  🤖 5-Agent Crew Swarm   │  💬 Google Gemini Chat & Clearance Feed      │  📑 E&O Underwriting HUD  │
│  • Completion Bond Off.  │     • Smooth independent auto-scroll         │     • Statutory Exposure  │
│  • Script Supervisor     │     • Live Parallel Search citation chips    │     • Georgia 30% Tax     │
│  • Studio Legal Counsel  │     • Paced Director vs Counsel debates      │     • Distribution Risk   │
│  • Location Manager      │     • Live script mutation diffs             │     • Export Form E&O PDF │
│  • The Director          │                                              │                           │
│                          │  ⚡ Pinned Quick-Negotiate Action Bar        │                           │
│                          │                                              │                           │
│  🎙️ Dual-Voice Synthesizer│  ⌨️ Floating Prompt Bar                      │                           │
│     (Sequential audio)   │     • ✨ "Generate Scene with Gemini"        │                           │
│                          │     • 📎 Attach .md, .fountain, .txt files   │                           │
└──────────────────────────┴──────────────────────────────────────────────┴───────────────────────────┘
```

---

## 2. Column Specifications

### 🤖 Column 1: Autonomous Crew Swarm (Left - 260px)
- **Header**: Monospace `DeepClear Studio` branding with New Session (`+`) and Clear Session triggers.
- **5-Agent Roster Cards**:
  - 👑 *Completion Bond Officer* (Risk Underwriting)
  - 👁️ *Script Supervisor* (Gemini Multimodal Vision)
  - ⚖️ *Studio Legal Counsel* (Parallel Search Grounding)
  - 📍 *Location Manager* (Permits & Georgia 30% Tax Arbitrage)
  - 🎬 *The Director* (Creative Intent & Fair Use)
  - Includes real-time active status pulse indicators.
- **Voice Dock**: Single-click toggle for sequential dual-voice speech synthesis (Muted / Active).

---

### 💬 Column 2: Google Gemini Chat & Workspace (Middle - Flex-1)
- **Top Shimmer Progress Bar**: Active gradient pulse during live AI reasoning and API calls.
- **Message Stream**:
  - Ingested & Gemini-generated screenplay scene cards.
  - Identified scene hazard cards with category badges and verified Parallel Search citation chips.
  - Paced turn-based debate cards with 3.5s reading intervals and live `[Agent is typing...]` indicators.
  - Script mutation diff cards showing strikethroughs $\rightarrow$ cleared green alternatives.
- **Pinned Quick-Action Bar**: Instant `⚡ Negotiate [Hazard]` action pills pinned right above the prompt box.
- **Floating Prompt Bar**:
  - Auto-expanding textarea for pasting dialogue or custom commands.
  - 📎 Attach script (`.fountain`, `.md`, `.txt`, `.pdf`) and storyboard image button.
  - ✨ "Generate Scene with Gemini" button with rotating `Loader2` spinner.
  - Send button with active loading state.

---

### 📑 Column 3: E&O Underwriting HUD (Right - 300px)
- **Statutory Liability Card**: Real-time financial exposure meter ($2.8M $\rightarrow$ $0).
- **Tax Rebate Card**: Computes unlocked state production tax incentives (+$42,000 Georgia 30% uplift).
- **Distribution Risk Card**: Dynamic reactive status (`IDLE` $\rightarrow$ `HOLD` $\rightarrow$ `APPROVED`).
- **Export Button**: 1-click trigger to open the Form E&O-2026 Underwriting Binder modal.

---

## 3. Modals & Deliverables

### 📑 Form E&O-2026 Export Modal
- Apple/Linear dark surface with executive summary metrics.
- 1-Click **"Download Form E&O-2026 PDF"** with confetti animation.
- **"Mint On-Chain Clearance Passport"** executing Base Sepolia testnet transaction.
