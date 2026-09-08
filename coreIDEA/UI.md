# DeepClear Studio UI and UX Specification

Design System: 3-Column Studio Dashboard
Theme: Dark Mode (Dark Charcoal Canvas, Zinc Panels, Emerald Green for Cleared items, Rose Red for Hazards, Sky Blue for Parallel Search links)

---

## 1. 3-Column Layout

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

## 2. Column Breakdown

### Column 1: Studio Crew (Left - 260px)
- Branding: DeepClear Studio header with New Session and History controls.
- 5-Agent Roster: Cards for Completion Bond Officer, Script Supervisor, Studio Legal Counsel, Location Manager, and The Director.
- Mode Selector: Segmented toggle between Auto-Pilot and Manual mode.
- Speech Toggle: One-click button to mute or unmute agent voice reading.

### Column 2: Workspace (Middle)
- Sub-Navigation: Clean tab switcher between Swarm Chat and Screenplay Redline view.
- Chat Stream: Shows agent discussions, detected risks, and verified Parallel Search citation cards.
- Quick Presets: Curated 1-click test buttons (Cyber Heist, Southern Gothic, Legal and WHOIS Shield, Cleared Masterpiece) placed directly above the input bar.
- Prompt Bar: Auto-expanding text box with an attachment button, Generate Scene button, and Send button.

### Column 3: E&O Underwriting Status (Right - 300px)
- Financial Risk Card: Real-time dollar exposure meter.
- Tax Savings Card: Shows qualified state film tax credits (such as Georgia 30%).
- Resolved Assets Ledger: Lists all cleared and licensed items with a 1-click Dispute button for human review.
- Export Button: Downloads the official Form E&O-2026 PDF binder.
- Parallel Inspector Drawer: Slide-out panel for inspecting exact search IDs, query formulations, and USPTO international classes.
