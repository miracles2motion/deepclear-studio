---
name: readme-updater
description: >-
  Use this skill when the user asks to update, polish, enhance, format, or synchronize
  the root README.md. This skill quickly transforms the README into an ultra-interactive,
  visually compelling, judge-ready showcase with dynamic badges, Mermaid architecture diagrams,
  feature deep-dives, collapsible runbooks, and live demo links.
---

# README Architect & Showcase Enhancer

Super-fast engine for maintaining an interactive, high-impact `README.md` for hackathon judges, contributors, and the public.

## When to Use

- User asks to "update the readme", "make readme interactive", "polish github page", or "refresh readme".
- After introducing new components, endpoints, or features that need immediate presentation in the docs.
- Before final hackathon submission to ensure all badges, track requirements, architecture diagrams, and quickstart commands are crystal clear.

## Key README Sections to Maintain

1. **Hero & Dynamic Badges**:
   - Live demo URL badge, MIT license badge, Google GenAI badge, Parallel Web Search badge, Next.js 14 badge.
   - 1-line elevator pitch with dramatic high-concept hook.

2. **Interactive Quick Preview / Visual Anchor**:
   - Before/After comparison tables (e.g. Defused Props, Strike-through Script Changes).
   - Dynamic trade headline simulation snippet ("DEADLINE / VARIETY").

3. **Mermaid System Architecture**:
   - Interactive SVG-rendered flowchart showing:
     `Script/Image Input` -> `5-Agent Swarm` -> `Gemini 2.0 Multimodal + Parallel 4D Grounding` -> `Dialectic Negotiation` -> `Form E&O-2026 PDF + Testnet Hash`.

4. **Judge's Guided Tour (1-Click Evaluation)**:
   - Clear steps for hackathon evaluators to test 3 key preset scenarios without friction.

5. **Track Compliance Verification Table**:
   - Explicit confirmation of `@google/genai` and `parallel-web` usage at runtime to ensure instant pass on Stage 1 automated checks.

6. **Interactive Collapsible Sections (`<details><summary>`)**:
   - Detailed API contracts (`/api/analyze`, `/api/debate`, `/api/defuse-prop`).
   - Actuarial bond math formulas and sample calculation breakdown.
   - Local installation & deployment guide.

## Execution Rules

1. **Speed & Precision**: Perform single-pass contiguous edits or cleanly overwrite the root `README.md` when restructuring.
2. **Visual Richness**: Use emojis, clean markdown tables, callout blocks (`> [!TIP]`, `> [!IMPORTANT]`), and syntax-highlighted blocks.
3. **Keep Ground Truth Synced**: Pull actual package names and component details from `package.json` and `tasks/` files so there is no drift.
4. **Auto-Push Trigger**: Once the README is updated, prompt or trigger `auto-push` to keep GitHub live.
