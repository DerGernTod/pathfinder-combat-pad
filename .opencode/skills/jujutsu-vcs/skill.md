---
name: jujutsu-vcs
description: "jujutsu (`jj`) VCS — Use when you want to do anything related to git, commit, push, merge, diff, or check change status"
---

Provides assistance for using jujutsu (`jj`), a Mercurial-inspired, git-compatible version control tool used by this repository.

Behavior:

- Treat `jj` as the repository's primary VCS for help, command examples, and troubleshooting.
- When a user mentions one of the triggers above, suggest `jj` commands and workflow patterns first.

Splitting & organizing a working copy into separate commits:

- Principle: keep each change focused on a single logical topic. If your working copy contains unrelated edits, split them into separate changes before publishing.
- When changes are still uncommitted (live in the working copy):
  - Use `jj commit <paths>` to commit only specific files or filesets into the first new change. Example: `jj commit src/foo.ts test/foo.test.ts -m "feat(foo): add foo and tests"`.
  - Use `jj commit -i` to interactively pick hunks/paths for the first commit.
- When you already committed a broad change and need to split it afterwards:
  - Use `jj split` to move parts of a change into a new child change. `jj split` opens a diff editor where you remove the content you want in the new change from the right side; the remaining edits stay in the original change and the removed edits become a new change on top.
  - You can restrict `jj split` to particular filesets: `jj split <paths>` will place matching paths in the selected change.
  - Use `jj split -i` for an interactive selection of files/hunks.
- Alternatives and helpers:
  - `jj new` creates a fresh, empty change you can then populate by moving files or using `jj restore`/`jj file` operations.
  - `jj file track` / `jj file untrack` can change which files are tracked in the working copy before committing.
- Preview and verify before finalizing:
  - Use `jj status` and `jj show` to inspect what will be committed.
  - Use `jj log` / `jj diff` to review history and the split outcome.
- Practical examples:
  1. Commit just the skills files from the working copy:
     - `jj commit .opencode/skills/test-driven-development/skill.md .opencode/skills/vitest/skill.md -m "docs(skills): add tdd and vitest skills"`
  2. Split an existing change `@` interactively and move tests into a separate change:
     - `jj split -i` then pick the test files/hunks to move.

Notes:

- `jj` operates on a snapshot of the working copy; many commands (commit, split) operate on the working-copy commit `@` unless you pass a `-r`/`--revision` to target another change. Read prompts from `jj` carefully when splitting — it may open an editor.
- Non-destructive: `jj split` and the interactive flows let you reorganize history locally without force-pushing or rewriting shared history; prefer splitting locally before publishing.

Reference docs:

- CLI usage: .opencode/skills/jujutsu-vcs/references/jujutsu-cli.md
