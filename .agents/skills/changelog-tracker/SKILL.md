---
name: changelog-tracker
description: >-
  Use this skill when the user asks to log an error, track progress, update the
  changelog, bump the project version, or document what happened during development.
  This skill maintains a CHANGELOG.md inside the logs/ folder of DeepClear Studio.
---

# Changelog & Progress Tracker

Maintain the project changelog at `logs/CHANGELOG.md`. This file tracks errors encountered, 
fixes applied, features completed, and version bumps throughout development.

## When to Use

- User reports an error or bug → log it under the current version's "Bugs & Errors" section
- A feature is completed → log it under "Changes"  
- User asks to bump the version → create a new version header
- User asks for a project status update → read and summarize the changelog

## File Location

The changelog lives at: `<workspace_root>/logs/CHANGELOG.md`

## Format

Always follow this structure when updating the changelog:

```markdown
# DeepClear Studio — Changelog

## [vX.Y.Z] — YYYY-MM-DD

### 🚀 Changes
- Description of what was added or changed

### 🐛 Bugs & Errors  
- Description of the error and how it was resolved

### 📝 Notes
- Any observations, learnings, or context
```

## Rules

1. **Never overwrite** the entire file. Always append or insert at the top (newest first).
2. **Always include a timestamp** with each entry using the current local time.
3. **Be specific** about errors — include the error message, the file, and the fix.
4. **Use semantic versioning**: 
   - `0.1.0` → initial scaffold
   - `0.x.0` → new feature phase
   - `0.x.y` → bug fixes within a phase
5. When bumping a version, insert a new `## [vX.Y.Z]` block at the top, below the title.
6. When logging an error, always note whether it was **resolved** or **unresolved**.
7. **Major Milestones Only**: Only log significant architectural features, new subsystem capabilities, and major version releases (`v0.1.0`, `v0.2.0`, `v0.3.0`). Do NOT create version entries for trivial micro-edits, minor copy adjustments, or link tweaks.
