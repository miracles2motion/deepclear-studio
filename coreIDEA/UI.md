# DeepClear Studio UI and UX Specification

Design System: Responsive Studio Dashboard (Desktop, Tablet, and Mobile)
Theme: Dark Mode (Dark Charcoal Canvas, Zinc Panels, Emerald Green for Cleared items, Rose Red for Hazards, Sky Blue for Parallel Search links)

---

## 1. Desktop Viewport (Screen Width 1024px and Above)

On desktop screens, the app displays a full 3-column studio layout:

```
+-----------------------------------------------------------------------------------------------------+
|     LEFT COLUMN (260px)  |           MIDDLE COLUMN (WORKSPACE)          |    RIGHT COLUMN (300px)   |
|                          |                                              |                           |
|  5-Agent Crew Swarm      |  Google Gemini Chat and Workspace            |  E&O Underwriting HUD     |
|  - Completion Bond Off.  |  - Chat feed with agent discussions          |  - Total legal exposure   |
|  - Script Supervisor     |  - Pinned quick-negotiate action chips       |  - Georgia 30% tax credit |
|  - Studio Legal Counsel  |  - Side-by-side script Redline Diff view     |  - Distribution status    |
|  - Location Manager      |  - Prompt bar for questions or script input  |  - Export Form E&O PDF    |
|  - The Director          |                                              |                           |
|                          |                                              |  Parallel Inspector       |
|  Auto-Pilot / Manual     |                                              |  - Search query records   |
|  Speech Audio Toggle     |                                              |  - Trademark classes      |
+-----------------------------------------------------------------------------------------------------+
```

---

## 2. Tablet Viewport (Screen Width 768px to 1023px)

On tablet screens, the left crew list collapses into an accessible top navigation drawer or header selector, giving the middle workspace and the legal HUD plenty of breathing room:

```
+---------------------------------------------------------------------------------------+
|  TOP HEADER BAR                                                                       |
|  DeepClear Studio   [Crew: 5 Agents v]   [Auto-Pilot: ON]   [Audio: ON]   [History]   |
+---------------------------------------------------------------------------------------+
|           WORKSPACE (FLEX)                     |      E&O UNDERWRITING (280px)        |
|                                                |                                      |
|  [Swarm Chat]   [Screenplay Redline]           |  Financial Exposure: $0 (CLEARED)    |
|                                                |  Georgia 30% Tax Rebate: +$157,500   |
|  - Agent debate turns and legal advice         |  Distribution Status: APPROVED       |
|  - Verified Parallel Search citations          |  [Export Form E&O PDF]               |
|  - Side-by-side screenplay diff comparison     |                                      |
|                                                |  Resolved Assets Ledger (3 items)    |
|  Pinned Quick Presets:                         |  - Apple Vision Pro [Dispute]        |
|  [Cyber Heist] [Southern Gothic] [Legal 555]   |  - Tesla Cybertruck [Dispute]        |
|                                                |                                      |
|  Prompt Bar:                                   |  Parallel Inspector Button           |
|  [Ask crew or paste scene...]        [Send]    |  [Inspect Search Telemetry ->]       |
+---------------------------------------------------------------------------------------+
```

---

## 3. Mobile Viewport (Screen Width Under 768px)

On mobile phones, the screen stacks into a clean single-column view. Top tabs let users switch effortlessly between Chat, Script Redline, and the Insurance HUD without horizontal overflow:

```
+---------------------------------------------------+
|  DeepClear Studio                 [History] [Mute]|
|  Mode: [Auto-Pilot | Manual]                      |
+---------------------------------------------------+
|  VIEW TABS:                                       |
|  [ Chat ]        [ Redline Diff ]        [ HUD ]  |
+---------------------------------------------------+
|  ACTIVE TAB VIEW (Chat Mode)                      |
|                                                   |
|  Agent Dialogue Feed:                             |
|  - Script Supervisor: Flags brand liability       |
|  - Legal Counsel: Cites Lanham Act Section 43     |
|  - Director: Proposes narrative prop replacement  |
|                                                   |
|  Parallel Search Card:                            |
|  Target: "spatial computing headset"              |
|  Status: PASSED (0 conflicts)                     |
|                                                   |
|  Presets:                                         |
|  [Cyber Heist] [Southern Gothic] [Legal 555]      |
|                                                   |
|  Prompt Bar:                                      |
|  [Type a message or question...]          [Send]  |
+---------------------------------------------------+
|  BOTTOM BAR: Exposure: $0  |  [Export PDF]        |
+---------------------------------------------------+
```

---

## 4. Mobile Bottom Sheet Drawers

On mobile screens, detailed inspection views open as smooth bottom-sheet drawers that slide up from the bottom of the screen:
- Parallel Inspector Drawer: Slides up from the bottom to display search queries, timestamps, and trademark classes with touch scrolling.
- Resolved Assets Sheet: Lets filmmakers review cleared items and tap Dispute on the go.

---

## 5. Column and Component Breakdown

### Left Section: Studio Crew
- Branding: DeepClear Studio header with New Session and History controls.
- 5-Agent Roster: Cards for Completion Bond Officer, Script Supervisor, Studio Legal Counsel, Location Manager, and The Director.
- Mode Selector: Segmented toggle between Auto-Pilot and Manual mode.
- Speech Toggle: One-click button to mute or unmute agent voice reading.

### Middle Section: Workspace
- Sub-Navigation: Clean tab switcher between Swarm Chat and Screenplay Redline view.
- Chat Stream: Shows agent discussions, detected risks, and verified Parallel Search citation cards.
- Quick Presets: Curated 1-click test buttons (Cyber Heist, Southern Gothic, Legal and WHOIS Shield, Cleared Masterpiece) placed directly above the input bar.
- Prompt Bar: Auto-expanding text box with an attachment button, Generate Scene button, and Send button.

### Right Section: E&O Underwriting Status
- Financial Risk Card: Real-time dollar exposure meter.
- Tax Savings Card: Shows qualified state film tax credits (such as Georgia 30%).
- Resolved Assets Ledger: Lists all cleared and licensed items with a 1-click Dispute button for human review.
- Export Button: Downloads the official Form E&O-2026 PDF binder.
- Parallel Inspector Drawer: Slide-out panel for inspecting exact search IDs, query formulations, and USPTO international classes.
