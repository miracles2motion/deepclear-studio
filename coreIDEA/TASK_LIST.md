# DeepClear Studio — Execution Checklist for Antigravity

- [ ] **1. Environment & Scaffold**
  - [ ] Initialize Next.js project with Tailwind CSS and TypeScript.
  - [ ] Create root LICENSE file with MIT license text.
  - [ ] Configure environment variables (GEMINI_API_KEY, PARALLEL_API_KEY, NEXT_PUBLIC_RPC_URL).
  - [ ] Install dependencies: @google/genai, parallel-web, framer-motion, lucide-react, jspdf, jspdf-autotable, ethers.

- [ ] **2. Backend Agent Pipeline**
  - [ ] Implement src/lib/gemini.ts using Google GenAI SDK with structured Pydantic/JSON schemas.
  - [ ] Implement src/lib/parallel.ts with real-time parallel-web API search calls.
  - [ ] Create /api/analyze route with Server-Sent Events (SSE) streaming thought logs.
  - [ ] Create adversarial debate loop between Director and Legal Counsel.
  - [ ] Implement Completion Bond probabilistic liability calculator ($ exposure range).

- [ ] **3. Frontend War Room Dashboard**
  - [ ] Build script editor & viewer with Framer Motion neon redaction animations.
  - [ ] Build live agent terminal displaying real-time SSE logs and Parallel search URLs.
  - [ ] Build Audible War Room audio component using Web Speech API synthesis.
  - [ ] Implement the "Butterfly Effect" Variety headline alert component.
  - [ ] Add 3 preloaded scenario buttons (Sci-Fi Nightmare, Historical Benchmark, Cleared Masterpiece).

- [ ] **4. Verification & Export**
  - [ ] Implement on-chain clearance token minting via ethers.js on a testnet.
  - [ ] Implement SHA-256 hash generation for the clearance report.
  - [ ] Build 1-click client-side PDF export for the E&O Insurance Binder.

- [ ] **5. Testing & Deployment**
  - [ ] Test real Parallel search execution against live queries.
  - [ ] Verify judge flow (1-click load -> live scan -> debate -> re-score -> mint).
  - [ ] Deploy to Vercel/Cloud Run and verify public URL.
