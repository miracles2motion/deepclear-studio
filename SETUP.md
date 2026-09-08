# DeepClear Studio — Technical Setup & Developer Guide

## 1. Prerequisites
- **Node.js**: v18.18.0 or later (v20+ recommended).
- **Package Manager**: npm (v9+) or pnpm.
- **API Keys**:
  - **Google Cloud Gemini API Key**: From [Google AI Studio](https://aistudio.google.com) or Vertex AI.
  - **Parallel Web Systems API Key**: From [Parallel AI](https://parallel.ai).

---

## 2. Installation & Quickstart

### Step 1: Clone the Repository
```bash
git clone https://github.com/miracles2motion/deepclear-studio.git
cd deepclear-studio
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env.local` file in the project root:
```env
# Google Cloud Gemini API Key
GEMINI_API_KEY="your_gemini_api_key_here"

# Parallel Search API Key
PARALLEL_API_KEY="your_parallel_api_key_here"

# Optional: Base Sepolia RPC
NEXT_PUBLIC_RPC_URL="https://sepolia.base.org"
```

---

## 3. Running Locally

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Typecheck (TypeScript Verification)
```bash
npm run typecheck
```

### Production Build
```bash
npm run build
npm run start
```

---

## 4. Key Project Structure
```
deepclear-studio/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/route.ts        # Gemini multimodal screenplay extraction (SSE)
│   │   │   ├── agent-chat/route.ts     # Conversational agent query & Parallel grounding
│   │   │   └── debate/route.ts         # Dialectic debate turn generation
│   │   ├── page.tsx                    # Main 3-column studio dashboard & state orchestrator
│   │   └── layout.tsx                  # Root layout & font configurations
│   ├── components/
│   │   ├── ParallelInspectorDrawer.tsx # Multi-input telemetry drawer for Parallel grounding
│   │   ├── SessionHistoryModal.tsx     # Browser-based session restore & search
│   │   ├── PromptBar.tsx               # Mention tagging, auto-pilot toggle, audio mute
│   │   └── MarkdownRenderer.tsx        # React Markdown engine with signature agent pills
│   ├── lib/
│   │   ├── parallel.ts                 # Official parallel-web SDK client & registry search
│   │   ├── gemini.ts                   # Google GenAI cascade & agent personas
│   │   ├── autoSwarm.ts                # Autonomous clearance queue runner & triage
│   │   ├── pdfGenerator.ts             # Form E&O-2026 PDF binder with Exhibit B
│   │   ├── passport.ts                 # SHA-256 Merkle root & YAML frontmatter passport
│   │   ├── sessionHistory.ts           # Browser localStorage session persistence
│   │   └── utils.ts                    # Text sanitization & stutter defense regex
├── logs/
│   ├── CHANGELOG.md                    # Release history & milestone tracking
│   └── ERROR_HANDLING.md               # Rate-limit defenses & cascade documentation
├── coreIDEA/
│   └── TASK_LIST.md                    # Core roadmap checklist
├── PRD.md                              # Product Requirements Document
├── SETUP.md                            # Technical Setup Guide
├── AGENTS.md                           # Autonomous Agent System Invariants
└── README.md                           # Master Showcase & Documentation
```

---

## 5. Offline & Resilient Mode
If external API keys are not provided or rate limits are reached, DeepClear Studio automatically activates its **Resilient Fallback Mode**:
- Uses authentic California legal fixtures (Lanham Act, Cal. Civ. Code § 3344, 17 U.S.C. § 107).
- Synthesizes realistic Parallel Search USPTO registry data with accurate latency indicators.
- Enables judges to test the complete end-to-end workflow with zero configuration.
