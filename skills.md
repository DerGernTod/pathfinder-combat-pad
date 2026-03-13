Skills — gotchas and references

- Primary VCS: this repository prefers `jj` (jujutsu). See `.opencode/skills/jujutsu-vcs/jujutsu-cli.md` for a compact CLI cheat sheet.
- Triggers: conversation about `commit`, `push`, `merge`, `git`, `github`, `jj`, or `jujutsu` should route to the jujutsu skill and examples.
- Gotchas:
  - `jj` workflows are similar to git but not identical — avoid assuming exact `git` flags map one-to-one.
  - CI or third-party tools may require adapters; test integrations when switching commands.

See subdocs in `opencode/vendor/` for per-skill CLI notes.
