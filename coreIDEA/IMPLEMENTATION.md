# DeepClear Studio Technical Implementation Guide

This guide explains the architecture, API routes, data structures, and setup details for DeepClear Studio.

---

## 1. Core Technical Requirements

1. Google Cloud Gemini Integration: All screenplay reading, multimodal analysis, and debate discussions use the official Google GenAI SDK (@google/genai with Gemini Flash).
2. Parallel Web Systems Integration: All live trademark checks call the official Parallel Search API at runtime using the parallel-web SDK.
3. Open-Source Setup: Standard MIT license in the root directory and a clean README.
4. Live Deployment: Hosted on Vercel with real-time UI updates.
5. Working Code: All buttons, script replacements, audio voices, and PDF exports run real code without placeholders.

---

## 2. Technology Stack

- Frontend: Next.js (App Router), React, TypeScript.
- Styling and Animation: Tailwind CSS, Framer Motion, Lucide React icons.
- AI Core: Google GenAI SDK (@google/genai) for Gemini Flash.
- Live Web Grounding: parallel-web SDK for trademark, permit, and court record checks.
- Audio Synthesis: Web Speech API for voice playback.
- PDF Generation: jspdf and jspdf-autotable for client-side Form E&O-2026 insurance binders.

---

## 3. Key Project Folders

```
deepclear-studio/
├── LICENSE
├── README.md
├── package.json
├── tsconfig.json
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/route.ts        # Script reading with Gemini
│   │   │   ├── agent-chat/route.ts     # User questions and Parallel checks
│   │   │   └── debate/route.ts         # Agent debates
│   │   ├── layout.tsx                  # Root layout
│   │   └── page.tsx                    # Main 3-column dashboard
│   ├── components/
│   │   ├── ParallelInspectorDrawer.tsx # Side drawer for Parallel search records
│   │   ├── ScreenplayRedlineView.tsx   # Side-by-side script comparison
│   │   ├── SessionHistoryModal.tsx     # Browser session history
│   │   ├── PromptBar.tsx               # Chat bar and controls
│   │   └── MarkdownRenderer.tsx        # Chat text formatting
│   ├── lib/
│   │   ├── parallel.ts                 # Parallel SDK integration
│   │   ├── gemini.ts                   # Gemini models and agent personas
│   │   ├── autoSwarm.ts                # Auto-pilot queue runner
│   │   ├── pdfGenerator.ts             # PDF insurance binder generator
│   │   ├── sessionHistory.ts           # Browser local storage manager
│   │   └── utils.ts                    # Text cleanup utilities
│   └── types/
│       └── index.ts                    # TypeScript types
├── logs/
│   ├── CHANGELOG.md                    # Release history
│   └── ERROR_HANDLING.md               # Reliability and rate limit guide
└── coreIDEA/
    ├── IDEA.md                         # Product concept
    ├── IMPLEMENTATION.md               # Technical setup
    ├── TASK_LIST.md                    # Task tracker
    └── UI.md                           # Interface layout specs
```

---

## 4. Key Data Interfaces

### 1. Script Hazard Interface (src/types/index.ts)
```typescript
export interface ExtractedEntity {
  id: string;
  sceneNumber: number;
  rawText: string;
  category: "trademark" | "copyright" | "permit" | "defamation" | "tax" | "domain";
  description: string;
  status: "hazard" | "cleared" | "licensed";
  originalExposure: number;
  clearedExposure: number;
  defusedText?: string;
  citations?: ParallelGroundingCitation[];
}
```

### 2. Parallel Citation Interface (src/types/index.ts)
```typescript
export interface ParallelGroundingCitation {
  id: string;
  category: "trademark" | "permit" | "caselaw" | "tax" | "defamation" | "domain";
  title: string;
  sourceUrl: string;
  snippet: string;
  verified: boolean;
  trademarkClass?: string;
  registrationStatus?: string;
  searchId?: string;
  searchLatencyMs?: number;
}
```

---

## 5. Offline Demo Mode
If API keys are omitted, DeepClear Studio automatically runs in offline mode using realistic sample data for trademark and legal checks. This allows judges and testers to evaluate the complete user flow without needing accounts.
