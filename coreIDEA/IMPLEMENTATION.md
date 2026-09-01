# DeepClear Studio — Technical Implementation Guide

This guide details the complete development setup for building and deploying DeepClear Studio for Google Antigravity.

---

## 1. Mandatory Hackathon Constraints

1. **Google Cloud / Gemini:** All agent reasoning, entity extraction, debate logic, and underwriting must execute via the official Google GenAI SDK (@google/genai).
2. **Parallel Track Runtime Integration:** All live web searches MUST call the Parallel Search API at runtime using parallel-web.
3. **Public GitHub Repository:** Must include a root LICENSE file (MIT License).
4. **Live Hosted App:** Must be deployed to a public URL with Server-Sent Events (SSE) streaming active.
5. **No Placeholders:** All tool calls and UI state mutations must execute functional code.

---

## 2. Tech Stack Architecture

* **Frontend:** Next.js (App Router), React, Tailwind CSS, Framer Motion, Lucide Icons.
* **Backend:** Next.js API Routes with Server-Sent Events (SSE) for streaming agent thought processes.
* **AI Core:** Google GenAI SDK (gemini-2.0-flash / gemini-1.5-pro).
* **Web Grounding:** parallel-web SDK.
* **Audio:** Web Speech API (zero-latency browser TTS) with fallback to Google Cloud TTS.
* **Web3 Integration:** ethers.js for minting the clearance certificate to Base Sepolia or Polygon Amoy.
* **Export:** jspdf and jspdf-autotable for client-side E&O Insurance Binder PDF generation.

---

## 3. Project Directory Structure

deepclear-studio/
├── LICENSE
├── README.md
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── public/
│   ├── sample_scripts/
│   └── assets/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/
│   │   │   ├── debate/
│   │   │   └── search/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ScriptViewer.tsx
│   │   ├── AgentTerminal.tsx
│   │   ├── AudibleWarRoom.tsx
│   │   ├── RiskGauge.tsx
│   │   ├── ArbitrageCard.tsx
│   │   ├── ButterflyHeadline.tsx
│   │   └── ExportModal.tsx
│   ├── lib/
│   │   ├── gemini.ts
│   │   ├── parallel.ts
│   │   ├── web3.ts
│   │   └── pdfGenerator.ts
│   └── types/
│       └── index.ts

---

## 4. Key Agent Pipelines & Schemas

### Script Supervisor Output Schema (JSON)
* `sceneTitle`: string
* `props`: Array of { name: string, line: number, brandRisk: boolean, textSnippet: string }
* `brands`: Array of { brandName: string, line: number, category: string, context: string }
* `locations`: Array of { name: string, city: string, interior: boolean, stuntInvolved: boolean }
* `stuntsAndHazards`: Array of { description: string, pyro: boolean, weapons: boolean, sagTriggers: string[] }

### Parallel Search Tool Call Contract
* Input: `{ query: string, category: "trademark" | "permit" | "tax" }`
* Execution: Calls `parallel.search({ query, maxResults: 3 })` via `parallel-web` SDK.
* Output: Array of `{ title: string, url: string, snippet: string }` attached to the clearance report.

### Adversarial Debate Loop Contract
* Turn 1: Counsel presents high-risk trademark flag + Parallel search citation + 3 safe alternatives.
* Turn 2: Director responds asserting fair use or background visibility.
* Resolution: Consensus compromise generated (e.g., "Blur brand in post-production" or "Accept alternative vintage prop").

---

## 5. Preloaded 1-Click Test Scenarios

1. **Scenario A: "The Indie Sci-Fi Nightmare"**
   * Elements: Unlicensed 1980s pop track on car radio, visible luxury Rolex watch on protagonist, high-speed drone chase on 6th Street Bridge (Los Angeles).
   * Result: $180,000 potential exposure. LA bridge permit failure. Counsel suggests public domain music & Atlanta shooting alternative (30% tax credit).
2. **Scenario B: "The Receipts (Historical Benchmark)"**
   * Elements: Recreation of The Hangover Part II tattoo dispute and Twelve Monkeys architectural copyright set piece.
   * Result: Flags exact legal liabilities that led to multi-million dollar real-world settlements.
3. **Scenario C: "The Cleared Masterpiece"**
   * Elements: Fully generic props ("Vintage Soda"), fully cleared public studio lot in Savannah, Georgia.
   * Result: $0 liability, 30% Georgia tax rebate unlocked, immediate on-chain clearance mint ready.
