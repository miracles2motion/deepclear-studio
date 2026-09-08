# DeepClear Studio UI and UX Specification

Design System: Responsive Studio Dashboard (Desktop, Tablet, and Mobile)
Theme: Dark Mode (Dark Charcoal Canvas, Zinc Panels, Emerald Green for Cleared items, Rose Red for Hazards, Sky Blue for Parallel Search links)

---

## 1. Desktop Viewport (1024px and Above)

On desktop monitors, DeepClear Studio displays the full 3-column layout:

```
+---------------------------------------------------------------------------------------------------------+
| [DeepClear Studio]  [+ New] [History: 3] [Export JSON] | [Presets: Cyber Heist | Southern Gothic | 555] |
+---------------------------------------------------------------------------------------------------------+
| LEFT: CREW ROSTER (260px)  | MIDDLE: WORKSPACE (FLEX-1)             | RIGHT: E&O UNDERWRITING (300px)   |
|                            |                                        |                                   |
| Mode: [Auto-Pilot|Manual]  | View: [ Swarm Chat ] [ Redline Diff ]  | E&O Status: Form E&O-2026         |
|                            |                                        |                                   |
| Studio Crew Swarm:         | Chat Feed:                             | Statutory Liability:              |
| - Completion Bond Officer  | - Welcome message & file upload prompt | $0 (CLEARED)                      |
| - Script Supervisor        | - Identified hazards card (3 detected) |                                   |
| - Studio Legal Counsel     | - Agent debate dialogue cards          | Tax Rebate Unlocked:              |
| - Location & Art Manager   | - Parallel Search verification cards   | +$157,500 (Georgia 30%)           |
| - The Director             |                                        |                                   |
|                            | Pinned Quick Action Presets:           | Distribution Risk:                |
| Audio Voice Synthesis:     | [Cyber Heist] [Southern Gothic] [555]  | APPROVED (Safe Harbor)            |
| [Voice: Active] [Mute]     |                                        |                                   |
|                            | Prompt Input Bar:                      | Resolved Assets Ledger (3 items): |
| System Status:             | [Ask crew or paste screenplay scene]   | - Apple Vision Pro [Dispute]      |
| Live USPTO Grounding       | [Attach File] [Generate Scene]  [Send] | - Tesla Cybertruck [Dispute]      |
| ~40ms Registry Index       |                                        | - Radiohead Track  [Dispute]      |
|                            |                                        |                                   |
|                            |                                        | [ Export Form E&O-2026 PDF ]      |
+---------------------------------------------------------------------------------------------------------+
```

---

## 2. Tablet and Mobile Viewports (Under 1024px)

On tablet and mobile screens (under 1024px), the screen uses an app-style top header with a 3-way segmented view switcher: **Chat**, **Crew**, and **Risk**. Tapping any tab switches the view without horizontal scrolling.

### View A: Chat Tab (Active by Default)
This shows the middle workspace, the debate cards, and the prompt input box:

```
+-------------------------------------------------------------------------+
| [Logo] DeepClear    [ Chat (active) | Crew | Risk ]    [Export] [Mute]  |
+-------------------------------------------------------------------------+
| View Switcher: [ Swarm Chat ]  [ Screenplay Redline Diff ]              |
|                                                                         |
| Chat Stream:                                                            |
| - Script Supervisor: Identified 3 risks in Scene 1                      |
| - Studio Legal Counsel: Lanham Act trademark dilution on Vision Pro     |
| - The Director: Proposes narrative replacement "spatial headset"        |
|                                                                         |
| Parallel Search Verification Card:                                      |
| Target: "spatial computing headset"                                     |
| Verdict: PASSED (0 conflicting USPTO registrations)                     |
|                                                                         |
| Pinned Test Presets:                                                    |
| [Cyber Heist] [Southern Gothic] [Legal 555] [Cleared Masterpiece]       |
|                                                                         |
| Prompt Bar:                                                             |
| +---------------------------------------------------------------------+ |
| | @legal_counsel what are the risks of using this real hospital?     | |
| +---------------------------------------------------------------------+ |
| [Attach File] [Generate Scene with Gemini]                       [Send] |
+-------------------------------------------------------------------------+
```

---

### View B: Crew Tab
When the user taps **Crew** in the top bar, the 5 studio agents and operating controls fill the screen:

```
+-------------------------------------------------------------------------+
| [Logo] DeepClear    [ Chat | Crew (active) | Risk ]    [Export] [Mute]  |
+-------------------------------------------------------------------------+
| Session Controls:                                                       |
| [+ New Session]  [Import JSON]  [History: 3 saved]  [Export JSON]       |
|                                                                         |
| Operating Mode:                                                         |
| [ Zap Auto-Pilot Active (Default) ]   [ User Manual Active ]            |
|                                                                         |
| Autonomous Crew Swarm (Tap agent to tag in chat):                       |
| +---------------------------------------------------------------------+ |
| | Completion Bond Officer        - Actuarial Underwriter (Idle)       | |
| +---------------------------------------------------------------------+ |
| | Script Supervisor              - Token & Stutter Scrubber (Idle)    | |
| +---------------------------------------------------------------------+ |
| | Studio Legal Counsel           - Trademark & Case Law Auditor       | |
| +---------------------------------------------------------------------+ |
| | Location & Art Manager         - Permits & Georgia 30% Tax Rebate   | |
| +---------------------------------------------------------------------+ |
| | The Director                   - Narrative Vision & Fair Use        | |
| +---------------------------------------------------------------------+ |
|                                                                         |
| Speech Controls: [Voice: Active] [Mute Audio]                           |
+-------------------------------------------------------------------------+
```

---

### View C: Risk Tab (E&O Underwriting HUD)
When the user taps **Risk** in the top bar, the full legal and insurance status dashboard fills the screen:

```
+-------------------------------------------------------------------------+
| [Logo] DeepClear    [ Chat | Crew | Risk (active) ]    [Export] [Mute]  |
+-------------------------------------------------------------------------+
| E&O Underwriting Status (Form E&O-2026)                                 |
|                                                                         |
| Statutory Liability:                                                    |
| $0 (CLEARED)                                      Initial: $500,000     |
|                                                                         |
| Tax Rebate Unlocked:                                                    |
| +$157,500                                        Georgia 30% QPE Credit |
|                                                                         |
| Distribution Status:                                                    |
| APPROVED (Safe Harbor Policy Rider Certified)                           |
|                                                                         |
| Parallel Search Telemetry:                                              |
| [ Inspect Live Grounding Records -> ]                                   |
|                                                                         |
| Resolved Assets Ledger (3 items):                                       |
| - Apple Vision Pro -> spatial computing headset        [ Dispute ]      |
| - Tesla Cybertruck -> matte-black utility truck        [ Dispute ]      |
| - Radiohead Idioteque -> aggressive electronic track   [ Dispute ]      |
|                                                                         |
| Actions:                                                                |
| [ Export Form E&O-2026 PDF Underwriting Binder ]                        |
+-------------------------------------------------------------------------+
```

---

## 3. Responsive Sliding Drawers

Regardless of screen size, two detailed telemetry drawers slide into view when requested:
- **Parallel Grounding Inspector Drawer**: Slides out from the right on desktop, or from the bottom on mobile, displaying full search queries, response times in milliseconds, and USPTO international classes.
- **Session History Modal**: Centered modal on desktop and full-width on mobile with search, timestamps, and one-click session restore.
