---
name: api-tester
description: >-
  Use this skill to quickly test live connectivity and credentials for Google Cloud Gemini
  and Parallel Search APIs. Runs lightweight ping scripts to ensure API keys are healthy.
---

# API Health & Credential Tester

Fast diagnostic utility for verifying that Gemini and Parallel Search endpoints respond correctly.

## When to Use

- When setting up or changing API keys in `.env.local`.
- When troubleshooting network timeouts or unexpected model responses.
- Before final hackathon submission to confirm live runtime connectivity.

## Verification Checklist

1. Check `.env.local` contains valid `GEMINI_API_KEY` and `PARALLEL_API_KEY`.
2. Run lightweight test script against `@google/genai` (generate text test).
3. Run lightweight test query against `parallel-web` SDK.
4. Report latency and response status concisely.
