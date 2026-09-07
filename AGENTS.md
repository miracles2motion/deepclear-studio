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

## 5. 🤖 Autonomous Swarm & UI State Invariants
- **Default Autonomous Execution**: When `clearanceMode === "auto"`, the system must immediately initiate the clearance swarm queue once screenplay analysis finishes, requiring 0 extra clicks from the user.
- **Immediate Reactive De-queueing**: Every cleared or licensed asset must immediately be removed from the Action Required bar and horizontal queue via functional state updaters (`setEntities`, `setClearedEntityIds`, `setLicensedEntityIds`). Never retain resolved liabilities in active action queues.
- **Speech-Synchronized Human Cadence**: Never use arbitrary rapid delays that feel like glitches. Agent turns must mount their text alongside their speech onset and provide natural 300–400ms conversational pauses.
- **Multi-Viewport HUD Accessibility**: The E&O Underwriting Status and risk dashboard must be fully accessible across mobile (<768px), tablet (768px–1023px), and desktop (>=1024px) with responsive navigation controls.
- **Dispute Screenplay Rollback Invariant**: When a user disputes a cleared asset (`handleDisputeEntity`), any mutated substitution in `currentScriptText` and `currentScriptRef` must immediately revert from `entity.defusedText` back to `entity.rawText`. Disputing must fully restore authentic script sluglines and dialogue.
- **Screenplay Mutation Stutter Defense**: Screenplay mutations must sanitize adjacent word and article collisions (`\b([A-Za-z]+)\s+\1\b`, `\b(a|an)\s+(a|an)\b`). Never deliver production scripts with stuttered duplicates (e.g., "vintage vintage", "An an").
- **Strict Judge Presets Lifecycle**: Judge Presets must strictly mount only during initial clean boot or when all liabilities are 100% resolved with $0 exposure. They must remain completely suppressed during active runs, pending actions, and active producer disputes.
- **Immediate Audio Mute Cancellation**: Voice synthesis operations (`speakTextAsync`) must check `isAudioMutedRef.current` synchronously on start and inside `utterance.onstart`. Toggling mute must immediately invoke `synth.cancel()` and reset `speakingAgent` to `null`, ensuring instant silence with zero lingering audio.
- **Autonomous Queue Abort Invariant**: Any iterative autonomous swarm loop (`handleRunAutoClearance`) must evaluate `isManualMode()` at the start of every iteration and immediately following async rate-limit delays. Switching to Manual mode must instantly abort queue execution, clear progress indicators, and halt active speech.
- **Pre-Cleared Masterpiece Ingestion Bypass**: Screenplays possessing a verified cryptographic Clearance Passport (Merkle root + E&O policy ID) must bypass `/api/analyze` and swarm debates completely. The system must immediately certify the safe harbor, set exposure to $0, and deliver the final adjudicated production script card without extra debate turns.
- **Tab View Scroll Preservation**: Core workspace views (Swarm Debate & Screenplay Redline) must remain concurrently mounted in the DOM and toggled via CSS (`hidden` vs `flex flex-col`). Never conditionally unmount active chat containers, ensuring scroll offset is permanently preserved across view switches.
- **Flex Child Containment & Telemetry Sanitization**: External grounding citations, web snippets, and telemetry cards within flex layouts must strictly declare `min-w-0 flex-1 max-w-full overflow-hidden break-words` and pass through `cleanParallelSnippet()`. Raw markdown URLs and scraped navigation headers must never bleed over parent container borders.
- **Screenplay Synchronization Invariant**: The final production script delivered in the chat stream, the script rendered in the Redline Diff view, and the exported E&O binder script must always be 100% identical, derived from `currentScriptRef.current` / `currentScriptText`.

