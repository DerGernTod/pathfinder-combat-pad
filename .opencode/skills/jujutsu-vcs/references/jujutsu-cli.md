
# jujutsu (jj) — Quick CLI reference

Short, accurate use-cases for commonly used `jj` commands. This is intended to help an LLM
choose the right `jj` command and common flags for everyday workflows.

Status
- `jj status` (alias `jj st`) — show the working-copy commit, its parents, a summary of the
  changes in the working copy, and any conflicts. Use path args to restrict output to specific
  files.

History & inspection
- `jj log` — show revision history (graph view by default). Useful flags:
  - `-r, --revisions <revset>` to specify which revisions (see `jj help -k revsets`).
  - `-n, --limit <n>` to limit results.
  - `-p, --patch` to include diffs.
- `jj show [REVSET]` — render a single revision's description and its diff (default `@`).

Creating & recording changes
- `jj new [REVSETS]` — create a new change. By default it edits the new change in the working
  copy so you can continue working on it. Common flags:
  - `-m, --message "msg"` to set the description without opening an editor.
  - `--no-edit` to create a change but not edit it in the working copy.
  - You can create a merge commit by passing multiple parents: `jj new @ main`.
- `jj commit [FILESETS]` (alias `jj ci`) — update the description and create a new change on top.
  When called without path arguments or `--interactive`, `jj commit` behaves like `jj describe`
  followed by `jj new`. Use `-i/--interactive` to pick hunks.

Editing work-in-progress
- `jj edit <REVSET>` — set the specified revision as the working-copy revision; useful to
  continue working on an existing change. The docs generally recommend creating a new change
  with `jj new` and using `jj squash` or `jj rebase` to adjust history instead of heavy editing.

Branch-like workflows
- There is no top-level `branch` or `checkout` subcommand. Use bookmarks to get git-like
  branch behavior.
- `jj bookmark <command>` (alias `jj b`) — create, move, list, and track bookmarks. Typical
  flow: `jj bookmark create feature/foo` then `jj edit feature/foo` or `jj new` to work on it.

History rewriting
- `jj rebase` — move revisions to new parents. Multiple modes: `--source/-s`, `--branch/-b`
  (default `-b @`), and `--revisions/-r`. Destination flags: `--onto/-o`, `--insert-after/-A`,
  `--insert-before/-B`. Use this for reordering or moving stacks of changes.
- `jj squash` — move changes from one revision into another (or use `--from`/`--into`). The
  `-r` flag squashes a revision into its parent. There are experimental `-o/-A/-B` options to
  create a new commit as the result instead of moving content.

Collaboration / remotes
- There are no top-level `push`/`pull` subcommands. Use `jj git` to interact with Git remotes and
  the underlying Git repo. Examples:
  - `jj git push <remote> <refspec>` — push to a Git remote
  - `jj git fetch <remote>` — fetch from a Git remote
  - `jj git clone <url>` / `jj git init` — create a Git-backed repo or clone a Git repo into jj

Useful gotchas
- Revision selection: `jj` uses powerful revsets; prefer `jj log -r <revset>` when you need a
  specific range. See `jj help -k revsets` for syntax.
- Working-copy snapshotting: `jj` snapshots the working copy at the start of most commands and
  updates it at the end. Use `--ignore-working-copy` to avoid snapshotting when needed.
- There are many aliases: `st` → `status`, `ci` → `commit`, `b` → `bookmark`. Consult `jj help`
  for aliases and other subcommands.
- `jj` subcommands differ from `git`; don't assume one-to-one flag mappings.

Further reading
- `jj help` and `jj help -k` for keyword help.
- Official docs: https://docs.jj-vcs.dev/latest/
