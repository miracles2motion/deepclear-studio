---
name: build-guard
description: >-
  Use this skill to quickly verify that the project builds cleanly, TypeScript types are valid,
  and no breaking changes were introduced. Runs fast syntax and type checks.
---

# Build Guard & Zero-Breakage Verifier

Fast validation engine that ensures the codebase remains 100% buildable and error-free.

## When to Use

- User asks to "check for errors", "verify build", "run lint", "test types", or "make sure nothing broke".
- Automatically after editing core libraries or major UI components.

## Actions

1. **TypeScript Type Check**:
   Run `npx tsc --noEmit` to catch type mismatches, missing exports, or bad imports without generating build files.

2. **Next.js Build Check** (when ready):
   Run `npm run build` or `npx next build` to verify page routes, SSR/CSR boundaries, and bundler health.

3. **Fast Auto-Fix**:
   If an error is detected:
   - Identify the exact file and line number.
   - Apply a surgical fix using replacement tools.
   - Log the issue and resolution in `logs/CHANGELOG.md`.
