---
name: task-sync
description: >-
  Use this skill to automatically synchronize progress with tasks/TASK_LIST.md.
  Marks completed phases and checkboxes cleanly as milestones are met.
---

# Task List Synchronizer

Fast utility for keeping `tasks/TASK_LIST.md` accurately updated with the project's actual build state.

## When to Use

- After completing any task in Phase 1 through Phase 5.
- When user asks "what is our progress?", "update task list", or "check off finished tasks".

## Rules

1. Only mark items `[x]` that are completely written, tested, and verified.
2. Maintain clean markdown format with zero extra noise.
3. If an item is blocked, leave it as `[ ]` and briefly note the blocker.
