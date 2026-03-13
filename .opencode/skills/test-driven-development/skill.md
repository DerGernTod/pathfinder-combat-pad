---
name: test-driven-development
description: "Test-driven development (TDD) — implement one failing test, make it green, repeat. Use for every implementation task, or when the user mentions TDD"
---

Guidance for using strict, iterative TDD inside this repository. Use this skill when the user asks for step-by-step implementation guided by tests.

Behavior:

- Always work in small, focused increments: pick a single behavior or API, write one test that expresses that behavior, run the test suite and confirm it fails (red), implement the minimal code to satisfy the test, then run the tests again and confirm they pass (green).
- Do not batch-create many tests up front. Never write horizontal test scaffolding for multiple features before implementing any of them — the loop is: one test → red → code → green → refactor/commit → next test.
- Use the project's existing test tooling (pnpm/vitest/jest/whatever the repo uses). When in doubt, inspect package.json or ask the user only if the test command cannot be inferred.
- When running commands, use the Bash tool so the assistant can capture real output (red/green). Show the failing output and the passing output in the conversation.
- Use the repository's lint and format rules as part of the workflow if the project enforces them in CI or pre-commit hooks. Fix linter issues only when they block the test pass.

Workflow (apply exactly):

1. Identify the next smallest behavior to add. If unclear, infer a reasonable next task from nearby code or tests.
2. Create a new test file or add a single test case that asserts the intended behavior. Keep the test minimal and deterministic.
3. Run the test runner for the new test only (or the whole suite if necessary) using the Bash tool and capture output. Confirm the test fails (red).
4. Implement the smallest change in production code to make the test pass. Keep implementation minimal and targeted.
5. Run the test runner again and confirm the test passes (green). Share the passing output.
6. Run linter if repository requires it; fix issues that block commit.
7. Stage and create a single commit for the logical change. When VCS operations are requested, prefer the jujutsu-vcs skill conventions.
8. Repeat from step 1 for the next behavior.

Tooling & commands (examples):

- Run a single test file: `pnpm test -- <path/to/test>` or `pnpm vitest <path/to/test>` depending on project scripts.
- Run the full test suite: `pnpm test`.
- Lint: `pnpm lint` or `pnpm lint:eslint` / `pnpm lint:oxlint` per repository rules.
- Use `functions.bash` for all command execution so outputs (red/green) are captured.

When to ask the user:

- Only ask a single targeted question if you cannot infer the test runner, project test script, or if a change is destructive or affects secrets/configuration. Otherwise proceed and make reasonable defaults.
