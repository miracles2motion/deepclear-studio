# 🎬 DeepClear Studio

> **Autonomous Multimodal Film Clearance, Crew-Agent Dialectic Negotiation & E&O Underwriting Engine**  
> *Built for Google Cloud Agentic Cinema Hackathon — Parallel Track ($15,000 Category)*

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Google Cloud Gemini](https://img.shields.io/badge/Google%20Cloud-Gemini%202.0-orange)](https://cloud.google.com/vertex-ai)
[![Parallel Search](https://img.shields.io/badge/Grounding-Parallel%20Search%20API-cyan)](https://parallel.ai)
[![Next.js](https://img.shields.io/badge/Framework-Next.js%2014-black)](https://nextjs.org/)

---

## 🌟 Executive Summary

In cinematic production, the creative vision of filmmakers constantly collides with the harsh reality of legal liability, clearance bottlenecks, and insurance rejection. Before any motion picture can be distributed on platforms like Netflix or Amazon Prime, or screened at major festivals, production companies must secure an **Errors & Omissions (E&O) Insurance Policy** and prove a clean **Chain of Title**.

Today, this clearance process is governed by $500/hour entertainment attorneys who manually scour scripts, storyboards, and set pieces. A single unvetted trademarked product or unpermitted landmark can freeze a multimillion-dollar distribution deal.

**DeepClear Studio** transforms this enterprise bottleneck into an autonomous, real-time command center:
1. **Multimodal Script & Storyboard Scanning:** Parses screenplay text and visual storyboard sketches for trademark, copyright, municipal permit, and SAG-AFTRA risks using **Google Cloud Gemini Multimodal**.
2. **4-Dimensional Parallel Grounding:** Dynamically queries live trademark registries, municipal permit ordinances, real-world case law (*Hangover II*, *12 Monkeys*), and state film tax rebate portals using the **Parallel Search API**.
3. **Audible Dialectic War Room:** Simulates an adversarial negotiation between conflicting crew personas (passionate Director vs. analytical Legal Counsel) with dual-voice audio synthesis and live script text mutation.
4. **Form E&O-2026 PDF & On-Chain Clearance Passport:** Exports an official, multi-page Errors & Omissions Underwriting Binder and mints a cryptographic SHA-256 clearance proof to an EVM testnet.

---

## 🤖 The 5-Persona Autonomous Multi-Agent Swarm

```
                                👑 Completion Bond Officer
                               (Master Underwriting & Risk)
                                      /            \
                       (Bezier SVG)  /              \  (Bezier SVG)
                                    /                \
          👈 Script Supervisor (Multimodal)      👉 Studio Legal Counsel (Parallel Search)
                    │                                          │
          👈 Location Manager (Permits & Tax)    👉 The Director (Adversarial Creative)
```

1. **👑 Completion Bond Officer:** Calculates probabilistic financial exposure ($ best-case vs worst-case), aggregates swarm telemetry, and issues E&O insurance binders.
2. **👁️ Script Supervisor:** Multimodal vision engine extracting props, logos, stunts, and landmarks from screenplays and storyboard frames.
3. **⚖️ Studio Legal Counsel:** Queries live trademark databases and case-law precedents via Parallel Search; generates 3 copyright-safe creative alternatives.
4. **📍 Location Manager:** Queries municipal permit codes, drone airspace regulations, and conducts state tax rebate arbitrage (e.g. GA 30% vs CA 0%).
5. **🎬 The Director (Adversarial):** Fights for artistic integrity, argues fair use doctrine, and engages in dialectic bargaining with Legal Counsel.

---

## 🛸 Key Innovations

* **Multimodal Storyboard Defusal:** Identifies visual trademark infringements with precision bounding boxes and offers generative safe-prop replacements with an interactive Before/After slider.
* **4D Parallel Grounding Matrix:** Scans USPTO marks, LAPD/FAA permits, federal case law, and state tax rebate schedules in real-time.
* **Live Script Mutation Engine:** Hazarded script text physically strikes through in red and types the negotiated compromise in glowing emerald green as agents reach consensus.
* **"Butterfly Effect" Trade Simulator:** Live trade headline banner that transitions from red catastrophe (*"VARIETY: Indie Feature Bankrupted..."*) to green triumph (*"DEADLINE: Indie Feature Sparks 5-Platform Bidding War..."*).
* **On-Chain Clearance Proof:** Mints an immutable SHA-256 Merkle audit record of all agent decisions to Base Sepolia testnet.

---

## 🛠️ Tech Stack

* **AI Core:** Google GenAI SDK (`@google/genai` with Gemini 2.0 Flash / Pro)
* **Web Grounding:** Parallel Search API (`parallel-web` SDK)
* **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons
* **Audio:** Web Speech API dual-voice synthesis & HTML5 Canvas waveform visualizer
* **Web3:** Ethers.js (Base Sepolia / Polygon Amoy testnet)
* **Export:** jsPDF & jsPDF-AutoTable (Form E&O-2026 Insurance Binder)

---

## 🚀 Quickstart

### Prerequisites
* Node.js 18+
* Google Gemini API Key (`GEMINI_API_KEY`)
* Parallel Search API Key (`PARALLEL_API_KEY`)

### Installation
```bash
# Clone the repository
git clone https://github.com/miracles2motion/deepclear-studio.git
cd deepclear-studio

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to launch the DeepClear Studio War Room.

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
