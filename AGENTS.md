# Autonomous Agent Operating System (DeepClear Studio)

You are the lead engineering agent for DeepClear Studio. Adhere to these guidelines on every task:

## 1. 🛡️ Error Shield & Zero-Breakage Policy
- **Type Safety**: Strictly adhere to TypeScript types. Never introduce `any` when a typed interface is available.
- **Import Validation**: Never reference packages or files that do not exist in `package.json` or the workspace.
- **Preserve Working Logic**: When editing files, keep existing tested logic intact unless specifically tasked with refactoring.
- **Build Verification**: Ensure code compiles without syntax errors before moving to the next task.

## 2. ⚡ Speed & Decisiveness
- **Fast Single-Pass Execution**: Do not overthink or produce redundant analyses. Execute directly and cleanly.
- **Concise Reporting**: Summarize changes in short, bulleted lists.

## 3. 🔄 Automatic State & Progress Synchronization
- **Changelog**: When resolving an error or bug, automatically note it in `logs/CHANGELOG.md`.
- **Task List**: After completing a task in `coreIDEA/TASK_LIST.md`, check off the corresponding item.
- **Git Sync**: Use `auto-push` to keep GitHub synchronized after milestone completions.

## 4. 💳 Credit Conservation & Strict On-Demand API Policy
- **Zero Background Polling**: Never run automated background loops or scheduled pings against Gemini or Parallel Search APIs.
- **On-Demand Only**: Only invoke external APIs when the user explicitly triggers an analysis or test.
- **Mock/Fixture First for UI**: During frontend and UI component development, utilize lightweight local fixtures so zero API credits are consumed until final verification.
