---
name: vitest
description: "Run Vitest tests — CLI guidance and examples (use --run to avoid watch mode)"
---

Guidance for running Vitest in this repository. Use this skill when you need to execute tests, run a single file, or capture CI-style output.

Behavior:

- Always run Vitest with `--run` when you want the process to exit after running tests. Omitting `--run` starts watch mode and the CLI will not exit, which blocks automated workflows and the TDD red/green loop.
- Prefer running a single test file or a targeted test during TDD to keep feedback fast: run `pnpm vitest path/to/file.test.ts --run` or `pnpm test path/to/file.test.ts --run` if `pnpm test` proxies to Vitest (do not add an extra `--`; pnpm forwards arguments by default).
- Use `-t`/`--testNamePattern` to run a single test by name: `pnpm vitest -t "my test name" --run` (quote patterns appropriately on Windows).
- For CI or machine-readable output, use reporters: `pnpm vitest --run --reporter json` or `--reporter verbose`.
- Disable threads when debugging to get deterministic stack traces: `--run --threads=false`.
- If the project exposes a `test` script in package.json that calls Vitest, prefer `pnpm test --run` or `pnpm test path/to/file.test.ts --run`. Do not add an extra `--` when forwarding args; using `--` can cause issues.

Examples:

- Run the whole suite and exit: `pnpm vitest --run`.
- Run a single file and exit: `pnpm vitest test/components/counter.test.ts --run`.
- Run a single test by name: `pnpm vitest -t "renders counter" --run`.
- Run with JSON reporter (CI-friendly): `pnpm vitest --run --reporter json > vitest-output.json`.

Windows quoting notes:

- On Windows PowerShell or CMD, wrap test name patterns in double quotes: `-t "my test"`.
- When forwarding args through `pnpm test` use `pnpm test --run` (pnpm forwards args automatically; do not add an extra `--`).

Workflow tips for TDD:

- Write a single test file or test case, then run it with `--run` to get a failing (red) result quickly.
- Implement the minimal code change and run the same command to verify it goes green.
- Capture the exact failing and passing output when using the Bash tool so you can inspect stack traces and linter messages.

Execution:

-- Use the Bash tool for running commands so outputs are recorded. Example commands the assistant will run: `pnpm vitest <path> --run` or `pnpm test <path> --run`.
Reference:

- Vitest CLI docs: https://vitest.dev/guide/cli.html
