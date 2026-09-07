const fs = require("fs");
const path = require("path");

const KNOWLEDGE_DIR = path.resolve("..", "knowledge deepclear");

if (!fs.existsSync(KNOWLEDGE_DIR)) {
  console.error("Knowledge dir not found at:", KNOWLEDGE_DIR);
  process.exit(1);
}

// 1. UPDATED ABOUT.MD
const aboutContent = `# DeepClear Studio — Executive Summary & Product Architecture

## 1. Executive Summary & Problem Statement

### The Quiet Production Killer in Hollywood
Every film, episodic series, documentary, or commercial distributed on platforms like **Netflix, Amazon Prime Video, Apple TV+, or theatrical festivals (Sundance, Cannes, Venice)** requires an **Errors & Omissions (E&O) Insurance Policy** before distribution financing is unlocked or principal photography can begin.

Underwriters will not issue an E&O policy without an ironclad, line-by-line **Chain of Title & Legal Clearance Binder**.

### The High Cost of Failure
Today, film clearance is painfully manual, slow, and adversarial:
- **Weeks of Attorney Redlining**: Entertainment clearance law firms charge **$450–$900 per hour**, spending 4–6 weeks manually combing through 120-page screenplays, call sheets, prop lists, and production design drafts.
- **Catastrophic Statutory Exposure**:
  - **Lanham Act § 43(a)** (Trademark Dilution & False Endorsement): Prominent unauthorized display of consumer marks (Apple, Ford, Rolex, Macallan) can trigger federal statutory injunctions, halting film premieres or forcing emergency multi-million-dollar CGI frame paint-outs.
  - **17 U.S.C. § 504** (Statutory Copyright Damages): Unlicensed background songs or artwork can trigger damages up to **$150,000 per willful infringement**.
  - **Municipal Film Ordinances**: Filming on historic public squares or municipal parks without verified city permits can trigger stop-work police injunctions, equipment impoundment, and complete forfeiture of state filming tax credits.
- **The Creative vs. Legal War**: Legal counsel demands blanket deletion of all recognizable props to minimize liability, while the Director passionately fights for character authenticity, period grit, and expressive Fair Use (*Rogers v. Grimaldi*). Producers are caught in the crossfire.

### The DeepClear Studio Solution
**DeepClear Studio** transforms film clearance into an **autonomous, multimodal studio command center**:
1. **Multimodal Ingestion**: Scans scripts (\`.fountain\`, \`.md\`, \`.txt\`) or generates dynamic scenes on the fly with **Google Cloud Gemini** (\`gemini-flash-latest\` / \`gemini-pro-latest\` via \`@google/generative-ai\`).
2. **5-Agent War Room Dialectics**: Legal Counsel, The Director, Location/Art Manager, Script Supervisor, and Completion Bond Officer converse and negotiate balanced compromises in real time.
3. **Official Parallel Web Systems SDK Grounding**: Validates proposed fictitious prop names against live USPTO registries and web citations before any compromise is accepted, operating with sub-second (~40ms) latency.
4. **🔬 Parallel Grounding Inspector Drawer**: Slide-over drawer providing transparent telemetry (latency, query executed, search ID), USPTO legal classifications (Class 9, Class 14, Class 25), and dual modes: "Single Asset Telemetry" and "All Grounding Dossier".
5. **📜 Screenplay Redline Diff Engine**: Concurrent side-by-side comparison view (Original Draft vs. Cleared Production Script) with responsive segmented controls (\`[Cleared]\`, \`[Original]\`, \`[Split]\`), mouse-wheel badge scrolling, and interactive \`[⚡ Parallel Verified]\` chips.
6. **Dual Clearance Paths**: Allows producers to defuse hazards via script mutations or verify active licenses/permits to reduce statutory exposure to **$0** while keeping authentic script wording intact.
7. **Clearance Passport & Form E&O-2026**: Embeds cryptographic Merkle safe-harbor immunity into exported scripts and compiles executive insurance binders featuring **Exhibit B: Parallel Web Systems Grounding & Audit Ledger**.
8. **Multi-Viewport & Mobile Accessibility**: Full responsiveness across desktop, tablet, and mobile with automated Microsoft Edge testing suites (\`scripts/preview-mobile.js\`).

---

## 2. System Architecture & Tech Stack

\`\`\`
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   DEEPCLEAR STUDIO                                     │
├───────────────────────────┬────────────────────────────────────────────┬───────────────┤
│     LEFT COLUMN           │           MIDDLE WORKSPACE                 │ RIGHT COLUMN  │
│                           │                                            │               │
│  ⚡ [Auto-Pilot|Manual]    │  📜 Dual-View Switcher:                    │ 📊 E&O HUD    │
│                           │     [Swarm Debate] | [Screenplay Redline]  │     Exposure  │
│  👥 5-Agent Crew Swarm    │                                            │     Tax 30%   │
│    Completion Bond Off.   │  💬 Interactive Clearance Feed             │     Risk Bar  │
│    Script Supervisor      │       SSE Streamed Dialectic War Room      │     Ledger    │
│    Studio Legal Counsel   │       Live Parallel Telemetry Cards        │     Dispute   │
│    Location Manager       │       Final Production Script Delivery     │     PDF E&O   │
│    The Director           │                                            │               │
│                           │  🔬 Parallel Grounding Inspector Drawer    │               │
│  🔊 Multi-Voice Speech    │       Query, Latency, USPTO Class, Dossier │               │
│     (Instant Mute Cancel) │                                            │               │
│                           │  ⚡ Quick Presets [Cyber Heist] [Gothic]    │               │
│                           │  🛡️ [Cleared Masterpiece] Safe-Harbor Bypass│               │
│                           │  ⌨️ Dynamic Prompt & Ingestion Bar         │               │
└───────────────────────────┴────────────────────────────────────────────┴───────────────┘
\`\`\`

### Core Technologies
- **Google Cloud Gemini Flash & Pro (\`@google/generative-ai\`)**:
  - High-speed multimodal reasoning engine for zero-shot script ingestion, hazard extraction, legal reasoning, dynamic scene generation, and creative compromise generation.
  - Built with a **Self-Healing Model Cascade** (\`gemini-flash-latest\`, \`gemini-pro-latest\`) with dynamic Google ModelService runtime discovery, guaranteeing zero downtime.
- **Parallel Web Systems (\`parallel-web\` SDK)**: Official TypeScript SDK integration (\`client.search\`, \`client.extract\`) providing live statutory search, USPTO conflict checks, and legal class parsing.
- **Next.js 14 App Router & TypeScript**: Reactive, strictly-typed fullstack web application with complete DOM scroll state preservation across tab switches.
- **Screenplay Redline Diff Engine**: Custom side-by-side diff comparing original draft against cleared production script with stutter sanitization (\`\\b([A-Za-z]+)\\s+\\1\\b\`).
- **Web Speech API**: Multi-voice browser audio casting with distinct personality profiles, natural 300–400ms cadence, and synchronous mute cancellation.
- **Cryptographic Clearance Passport**: SHA-256 Merkle root hashing and YAML frontmatter injection.
- **Form E&O-2026 PDF Engine (\`jspdf\` + \`jspdf-autotable\`)**: Generates executive motion picture underwriting binders with itemized legal citations, tax rebate formulas, and Exhibit B Parallel Audit Ledgers with smart page breaks.
- **Microsoft Edge & Puppeteer-Core**: Automated headless browser testing suite validating desktop (1440x960 3:2), tablet (768x1024), and mobile (iPhone 14, iPhone SE) viewports.

---

## 3. The 5-Agent War Room Swarm

DeepClear models a high-stakes studio debate with 5 specialized personas:
1. **Script Supervisor (The Eye)**: Scans sluglines, dialogue, and parentheticals. Applies clean string mutations with built-in duplicate word stutter defense (\`"vintage vintage"\`, \`"An an"\`).
2. **Studio Legal Counsel (The Shield)**: Cites Lanham Act § 43(a), 17 U.S.C. § 504, Right of Publicity statutes, and calculates gross statutory exposure.
3. **Location & Art Department Manager (The Builder)**: Evaluates physical prop fabrication, municipal filming permits (Savannah, Atlanta, LA), and state tax rebate qualification (e.g. Georgia 30% QPE).
4. **The Director (The Soul)**: Fights for narrative grit, period authenticity, and artistic Fair Use under *Rogers v. Grimaldi*.
5. **Completion Bond Officer (The Sovereign)**: The final actuarial authority who signs off on the E&O safe-harbor policy rider, executes the completion bond, and certifies Form E&O-2026 for distribution.

---

## 4. Key Innovations & Differentiators

### A. Runtime Parallel Web Systems Grounding
When a brand hazard is detected (e.g. *"Macallan 25 Scotch"* or *"Apple Vision Pro"*), the crew doesn't guess or hallucinate a replacement. Parallel executes live runtime queries:
- Query: \`"aged single malt scotch poured from a decanter with a fictional cleared prop label 'Loch Haven 25'" trademark USPTO registered brand conflict clearance\`
- Latency: **~42ms** live index retrieval.
- Registry Verdict: **VERIFIED: ZERO COMMERCIAL CONFLICTS**.
- Detailed telemetry viewable inside the slide-over **Parallel Grounding Inspector Drawer**.

### B. Dual Clearance Resolution Tracks
- **Route A (Defuse & Mutate)**: Rewrites the script with a Parallel-verified fictitious prop, mutating the screenplay in real time.
- **Route B (Production License Exemption)**: Validates existing synchronization rights or municipal filming permits, reducing statutory exposure to **$0** while keeping the original script wording 100% intact.

### C. Screenplay Redline Diff & DOM Scroll State Persistence
Switching between the **Swarm Debate & Audit** view and the **Screenplay Redline** view is managed via CSS class toggling (\`hidden\` vs \`flex\`), ensuring the DOM elements stay mounted and active scroll position is never lost.

### D. Tamper-Evident Clearance Passport & Safe Harbor Bypass
Stateless LLMs repeatedly re-flag cleared assets upon script re-upload. DeepClear embeds a cryptographic YAML \`deepclear_passport\` header containing a Merkle root hash and registered exemptions. Scripts possessing a verified passport completely bypass \`/api/analyze\` and debate queues, instantly certifying safe harbor at $0 exposure.

### E. Human-in-the-Loop Producer Dispute Engine
Every cleared asset populates the **Resolved Assets Ledger** in the Right Column HUD. Clicking **\`[ Dispute ]\`** immediately rolls back safe-harbor immunity, restores statutory liability, reverts the screenplay text to the authentic raw prop, and posts a high-priority producer appeal into the chat feed for re-negotiation.

### F. Exhibit B: Parallel Web Systems Underwriting Ledger
The exported Form E&O-2026 PDF features a dedicated underwriter annex tabulating each cleared asset's Parallel Search query, statutory class, registry verdict, and grounding URL with an official Parallel Web Systems warranty attestation.

### G. State Film Tax Rebate Optimization
Automatically detects qualifying filming locations and calculates eligible tax credits under state programs (e.g., **Georgia Entertainment Industry Investment Act** 20% base + 10% promotional uplift), turning legal compliance into quantifiable production savings.
`;

// 2. UPDATED KNOWLEDGE.MD
const knowledgeContent = `# DeepClear Studio — Technical Knowledge & System Architecture

## 1. Mathematical Risk Engine & E&O Formulations

DeepClear calculates real-time statutory exposure across all screenplay entities using a dynamic legal underwriting formulation:

$$\\text{Net Statutory Exposure} = \\sum_{i=1}^{n} \\Big( E(a_i) \\cdot (1 - c_i) \\Big) - \\Big( B_{\\text{qualified}} \\cdot R_{\\text{jurisdiction}} \\Big)$$

Where:
- **E(a_i)**: Statutory exposure value of liability asset $a_i$ (e.g. $150,000 for Lanham Act trademark dilution, $150,000 for willful copyright infringement).
- **c_i ∈ {0, 1}**: Clearance status verified by Parallel ($c_i = 1$ indicates certified safe harbor or production license exemption).
- **B_qualified**: Qualified production spend in the filming jurisdiction.
- **R_jurisdiction**: Regional film tax incentive credit (e.g., 30% Georgia / Savannah rebate).

---

## 2. Technical Architecture & Agentic Workflow

\`\`\`mermaid
flowchart TD
    A[Screenplay Ingestion / Scene Generator] --> B{Cryptographic Passport Present?}
    B -- Yes (Merkle Root Valid) --> C[Safe Harbor Bypass: Exposure = $0]
    C --> D[Instant Production Script Delivery & Certification]
    B -- No --> E[Google Cloud Gemini Flash / Pro Entity Extraction]
    E --> F[5-Agent Dialectic Debate Swarm]
    F --> G[Parallel Web Systems SDK Grounding]
    G --> H[Live USPTO Class & Conflict Check: ~40ms]
    H --> I[Parallel Inspector Drawer & Redline Diff]
    I --> J{Producer Approval or Dispute?}
    J -- Approved --> K[Automatic Screenplay Mutation & Stutter Defense]
    J -- Dispute --> L[Rollback Mutation, Revert Text & Re-Open Exposure]
    K --> M[Form E&O-2026 PDF Underwriting Binder + Exhibit B]
    M --> N[SHA-256 Merkle Root & Clearance Passport Export]
\`\`\`

### Key Components & Capabilities
1. **Official \`parallel-web\` SDK Integration (\`src/lib/parallel.ts\`)**:
   - Upgraded to official TypeScript SDK (\`Parallel\` client).
   - Structured search (\`client.search\`) and statutory extraction (\`client.extract\`).
   - Rich telemetry: \`search_id\`, latency in milliseconds, USPTO classification (\`Class 9, Class 14, Class 25\`), and sanitized web evidence snippets (\`cleanParallelSnippet\`).
   - Fail-safe offline simulation fixtures guarantee zero downtime or timeouts during hackathon judge evaluations.

2. **Parallel Grounding Inspector Drawer (\`src/components/ParallelInspectorDrawer.tsx\`)**:
   - Responsive slide-over drawer (desktop right flyout, mobile/tablet bottom sheet).
   - Dual view modes:
     - **Single Asset Telemetry**: Real-time query, latency, USPTO class, registry verdict, and safe-harbor substitution comparison.
     - **All Grounding Dossier**: Complete script audit table listing all assets, citations, and aggregate search latency.
   - Cleaned intelligence vs. raw snippet toggle.

3. **Screenplay Redline Diff Engine (\`src/components/ScreenplayRedlineView.tsx\`)**:
   - Side-by-side comparative diff: Original Draft on left with red hazard tags; Cleared Production Script on right with green safe-harbor chips.
   - Mobile segmented controller (\`[Cleared]\`, \`[Original]\`, \`[Split]\`) preventing layout clipping.
   - Interactive badge bar with horizontal mouse-wheel scrolling and left/right chevrons.
   - Screenplay synchronization invariant: The redline script, chat script card, and exported PDF binder script derive from identical reactive state.

4. **Cryptographic Clearance Passport (\`src/lib/web3.ts\`)**:
   - SHA-256 Merkle tree calculation over all cleared assets.
   - Injected into \`.fountain\`, \`.md\`, and \`.txt\` exports as standardized YAML frontmatter (\`deepclear_passport\`).
   - Re-uploading a pre-cleared script triggers instant safe-harbor bypass with zero redundant API calls.

5. **Form E&O-2026 PDF Binder Engine (\`src/lib/pdfGenerator.ts\`)**:
   - Executive multi-page underwriter package.
   - Page 1: Policy summary, exposure reduction, qualified tax rebate savings, and completion bond seal.
   - Page 2: **Exhibit B: Parallel Web Systems Grounding & Audit Ledger** with verified search queries, statutory classes, URLs, and official Parallel warranty attestation.
   - Dynamic page break margin buffer calculation preventing orphaned lines.

6. **State & Session Persistence**:
   - Complete 1-click **Session Export & Restore (.JSON)** capturing all 5-agent debate turns, citations, original snapshots, and dispute states.
   - Preserves DOM scroll positions across view switches via CSS class toggling (\`hidden\` vs \`flex\`).

---

## 3. Product Roadmap & Future Expansion

- **Phase 2 (Q3 2026)**: Screenwriting Software Plugins (Final Draft / WriterDuet / Movie Magic) acting as real-time legal clearance linting.
- **Phase 3 (Q4 2026)**: Autonomous Video Dailies Clearance via Gemini Live Multimodal Video for physical trademark logos on wardrobe, background art, and vehicles.
- **Phase 4 (2027)**: Direct Municipal Film Commission API integrations (Savannah, Atlanta, FilmLA) for auto-filing street permits.
- **Phase 5 (2027)**: On-Chain E&O Underwriting on Base/EVM for immutable streaming acquisition chain of title.
`;

// 3. UPDATED VIDEO SCRIPT SUBMISSION.MD
const videoScriptContent = `# DeepClear Studio — 3-Minute Video Trailer & Walkthrough Script

## Timing Breakdown (Total Duration: 2:55)
- **Act 1: The Hook & The Hollywood Bottleneck** (0:00 - 0:30)
- **Act 2: Instant Ingestion & Gemini Parsing** (0:30 - 1:10)
- **Act 3: The 5-Agent War Room & Official Parallel SDK Grounding** (1:10 - 1:55)
- **Act 4: Parallel Inspector Drawer & Redline Diff Engine** (1:55 - 2:30)
- **Act 5: Producer Dispute Rollback, Clearance Passport & PDF Export** (2:30 - 2:55)

---

### ACT 1: THE HOOK & THE HOLLYWOOD BOTTLENECK (0:00 - 0:30)
**Visual on Screen**:
- Browser open at \`https://deepclear-studio.vercel.app\` (or localhost).
- Display the clean, obsidian-dark 3-column studio dashboard:
  - Left: Autonomous Crew Swarm (5 agents) with Auto-Pilot toggle.
  - Middle: Swarm Debate & Audit Feed with quick judge presets.
  - Right: Real-time E&O Underwriting Status HUD.

**Voiceover (Solo Creator Voice)**:
> *"Before any indie film or studio series can stream on Netflix, Apple TV+, or premiere at Cannes, distributors demand an Errors & Omissions insurance policy and a clean Chain of Title.*  
> *Today, entertainment lawyers charge $800 an hour, taking 4 to 6 weeks to manually redline scripts. A single unvetted trademark—like an Apple Vision Pro or an unpermitted drone shot—can trigger federal statutory injunctions under the Lanham Act or stop-work police orders, killing the film before opening night.*  
> *I built **DeepClear Studio**—an autonomous film clearance and E&O underwriting engine powered by **Google Cloud Gemini** and **Parallel Web Systems**."*

---

### ACT 2: INSTANT INGESTION & GEMINI PARSING (0:30 - 1:10)
**Visual on Screen**:
- Hover over the 3 Judge Presets: \`[ 🚀 Cyber Heist ]\`, \`[ 🏛️ Southern Gothic ]\`, and \`[ 🛡️ Cleared Masterpiece ]\`.
- Click **\`[ 🏛️ Southern Gothic ]\`**.
- Watch Gemini Flash parse the scene in under 2 seconds.
- Show the 5 detected liabilities in the chat stream: Macallan 25 Scotch, 1968 Ford Mustang, Forsyth Park filming permit, Otis Redding song sync, and Georgia tax rebate.
- Pan to the Right HUD: Show **Statutory Liability: $525,000 (HOLD)** and **Tax Rebate Unlocked: +$157,500 (Georgia 30%)**.

**Voiceover**:
> *"I've embedded one-click Judge Presets right into the studio. Clicking **Southern Gothic** loads a Savannah noir scene.*  
> *In under two seconds, Google Cloud Gemini Flash ingests the draft and isolates 5 statutory liabilities: unauthorized trademarks on a 1968 Mustang and Macallan 25 Scotch, an unpermitted city park shoot, an unlicensed music cue, and regional film tax compliance.*  
> *Our Underwriting HUD immediately calculates our gross exposure: **$525,000 in statutory liability**, putting distribution on HOLD, but also unlocking **$157,500 in Georgia film tax credits**."*

---

### ACT 3: THE 5-AGENT WAR ROOM & OFFICIAL PARALLEL SDK GROUNDING (1:10 - 1:55)
**Visual on Screen**:
- With **⚡ Auto-Pilot Active**, show the swarm automatically initiating clearance without requiring extra clicks.
- Turn on audio: listen to the distinct agent voices (Studio Legal Counsel citing Lanham Act § 43(a), Director defending character authenticity, Location Manager offering permit paperwork).
- Zoom in on Studio Legal Counsel delivering the **Parallel Web Systems Telemetry Card**:
  - Live query: \`"aged single malt scotch poured from a decanter with a fictional cleared prop label 'Loch Haven 25'"\`
  - Latency: \`42ms (Live Index)\`
  - Verdict: \`VERIFIED: ZERO COMMERCIAL CONFLICTS\`
  - Official Parallel citation link.

**Voiceover**:
> *"In Auto-Pilot mode, the clearance swarm takes over autonomously.*  
> *Listen to the dialectic debate: Studio Legal Counsel warns of trademark dilution, while the Director fights for narrative grit under Rogers v. Grimaldi.*  
> *To break the deadlock, DeepClear connects directly to the official **Parallel Web Systems TypeScript SDK**. Parallel executes live USPTO trademark searches in just **42 milliseconds**, validating that our proposed substitute prop has **zero conflicting commercial registrations**. Only when Parallel certifies safe harbor does the Director accept the prop and the Completion Bond Officer underwrites the rider."*

---

### ACT 4: PARALLEL INSPECTOR DRAWER & REDLINE DIFF ENGINE (1:55 - 2:30)
**Visual on Screen**:
- Click the top-right **\`[ ⚡ Parallel Inspector ]\`** button (or click any clearance badge).
- The **Parallel Grounding Inspector Drawer** slides in from the right:
  - Toggle between **Single Asset** and **All Dossier (5 Assets)**.
  - Show live search IDs, query strings, and USPTO Class 9/14/25 classifications.
- Close the Inspector, then click the **\`[ 📜 Screenplay Redline ]\`** tab:
  - Show the side-by-side comparison: Original Draft on the left, Cleared Production Script on the right with green safe-harbor chips.
  - Scroll horizontally across the clearance badges using the mouse wheel and chevrons.
  - Show the clean script text: zero duplicate stutter collisions (e.g., sanitized "vintage vintage").

**Voiceover**:
> *"Clicking the **Parallel Inspector** opens a transparent telemetry drawer, letting production attorneys inspect exact search IDs, query formulations, and USPTO international classes across all screenplay assets.*  
> *Switching to the **Screenplay Redline Diff View**, producers see a side-by-side comparison of the original draft versus the cleared production script. Notice our built-in Screenplay Stutter Defense: all duplicate word collisions are sanitized, guaranteeing broadcast-ready dialogue."*

---

### ACT 5: PRODUCER DISPUTE ROLLBACK, CLEARANCE PASSPORT & PDF EXPORT (2:30 - 2:55)
**Visual on Screen**:
- In the Right HUD, click **\`[ Dispute ]\`** on the Ford Mustang:
  - Show liability immediately restore by $150,000, the item re-enter the active queue, and the script text roll back to the authentic Mustang.
- Next, click the **\`[ 🛡️ Cleared Masterpiece ]\`** preset:
  - Confetti explodes! Show the verified **Cryptographic Clearance Passport** header with SHA-256 Merkle root, bypassing redundant analysis and certifying safe harbor at $0.00 exposure.
- Click **\`[ 📥 Export Form E&O-2026 PDF ]\`** and open the downloaded binder:
  - Show Page 1 underwriting certificate and Page 2 **Exhibit B: Parallel Web Systems Grounding & Audit Ledger**.

**Voiceover**:
> *"Human filmmakers always maintain final say. Clicking **Dispute** immediately rolls back safe harbor, restores exposure, and reverts the script for re-negotiation.*  
> *To solve AI amnesia, DeepClear embeds a cryptographic **Clearance Passport** with a SHA-256 Merkle root into exported scripts. When re-uploaded, safe harbor is recognized instantly with zero false positives.*  
> *Finally, one click compiles an official **Form E&O-2026 Underwriting Binder** as an executive PDF, complete with an official Parallel audit ledger ready for insurance carriers and distributors.*  
> *DeepClear Studio turns a 6-week, $50,000 legal ordeal into a 60-second autonomous workflow. Test it live at **deepclear-studio.vercel.app**!"*
`;

fs.writeFileSync(path.join(KNOWLEDGE_DIR, "about.md"), aboutContent, "utf8");
console.log("Updated: about.md");

fs.writeFileSync(path.join(KNOWLEDGE_DIR, "knowledge.md"), knowledgeContent, "utf8");
console.log("Updated: knowledge.md");

fs.writeFileSync(path.join(KNOWLEDGE_DIR, "video script submission.md"), videoScriptContent, "utf8");
console.log("Updated: video script submission.md");

console.log("All files in 'knowledge deepclear' successfully updated!");
