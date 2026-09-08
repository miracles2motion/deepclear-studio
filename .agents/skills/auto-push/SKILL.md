---
name: auto-push
description: >-
  Use this skill when the user asks to push changes to GitHub, commit work,
  save progress, or sync the repo. This skill automatically stages all changes,
  creates a descriptive commit message, and pushes to the remote origin.
---

# Auto Push to GitHub

Automatically commit and push all changes to the GitHub remote (`origin/main`).

## When to Use

- User says "push", "save", "sync", "commit", "push to github", or similar
- After completing a major phase of work (scaffold, feature, fix)
- User explicitly asks to update the repo

## Steps

1. **Check status**  -  Run `git status` in the workspace root to see what changed.
2. **Stage all changes**  -  Run `git add -A` to stage everything.
3. **Generate commit message**  -  Create a descriptive commit message following this format:
   ```
   <emoji> <type>: <short summary>
   
   <optional body with details>
   ```
   
   Types and emojis:
   - ` feat:`  -  New feature or component
   - ` fix:`  -  Bug fix
   - ` docs:`  -  Documentation updates
   - `️ chore:`  -  Config, deps, scaffolding
   - ` style:`  -  UI/styling changes
   - ` refactor:`  -  Code restructuring
   - ` test:`  -  Tests
   - ` deploy:`  -  Deployment changes

4. **Commit**  -  Run `git commit -m "<message>"`.
5. **Push**  -  Run `git push origin main`.
6. **Log it**  -  After a successful push, update `logs/CHANGELOG.md` with a brief note about what was pushed (use the changelog-tracker skill).

## Error Handling

- If push fails due to auth, tell the user to check their GitHub credentials or SSH key.
- If push fails due to divergence, run `git pull --rebase origin main` first, then retry.
- If there are merge conflicts, list the conflicting files and ask the user how to proceed.
- If there's nothing to commit, inform the user that the repo is already up to date.

## Important

- **Never force push** (`git push --force`) unless the user explicitly asks.
- **Always stage with `git add -A`** to catch new files, deletions, and renames.
- The remote is `origin` and the branch is `main`.
