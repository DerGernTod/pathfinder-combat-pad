# Development Details

## Project Overview
This repository is built using TypeScript, with React components and the Tauri framework for desktop application development.

## Build Tools and Frameworks
- **React**: For building user interfaces.
- **Vite**: For fast builds and hot module replacement.
- **Tauri**: To build cross-platform desktop applications.

## Project Structure
- **`src/`**: Main source code directory.
  - Contains React components, TypeScript files, and other source code files.
- **`src-tauri/`**: Tauri-specific source files for building the desktop application.
  - Includes Tauri configuration files and assets.
- **`public/`**: Static assets like HTML files.

## Development Tools
- **ESLint**: For linting JavaScript and TypeScript code to enforce coding standards.
- **TypeScript**: For static type checking to catch errors early in development.

## Configuration Files
- `.editorconfig`: Ensures consistent editor configurations.
  - Specifies settings for line endings, indentation, and other editor-specific options.
- `tsconfig.json`, `tsconfig.node.json`: TypeScript configuration files.
  - Define project-wide settings such as target environment, module system, and include/exclude patterns.
- `.eslint.config.mjs`: ESLint configuration file.
  - Defines rules and configurations for linting JavaScript/TypeScript code.

## Linting Procedure (STRICTLY REQUIRED)
This project uses **eslint** and **oxlint**. ALWAYS follow this sequential procedure when asked to fix linting errors in a file:

1.  **FIRST STEP: Get REAL Errors.** You **MUST** run the `lint:oxlint` command in the terminal to retrieve the actual warnings/errors before taking any other action. Do not attempt to fix or list errors without running this command first.
    * **Terminal Command:** `pnpm lint:oxlint <file path>`
2.  **Analyze & Fix (oxlint):**
    * Create a detailed, prioritized list of all warnings and errors reported by the terminal output.
    * Handle each item one-by-one. Provide clear and concise fix suggestions based *only* on the linter output.
3.  **Validate Fixes (oxlint):**
    * After applying the changes, you **MUST** run the command again to confirm success.
    * **Terminal Command:** `pnpm lint:oxlint <file path>`
    * If there are still errors, repeat steps 2 and 3 until the command completes without errors.
4.  **Repeat for eslint:**
    * Once `lint:oxlint` runs clean, you **MUST** repeat the entire process (Steps 1-3, adjusted) for `eslint`.
    * **Terminal Command:** `pnpm lint:eslint <file path>`
    * (Analyze, Fix, and Validate until clean).
5.  * Final Successful Outcome: The task is only complete when the `pnpm lint:eslint <file path>` command is run and reports ZERO errors and ZERO warnings. You must show the final, clean terminal output for both oxlint and eslint to confirm the task is finished.

**DO NOT** suggest that the user run a command; **YOU** must execute the required terminal commands.


# Coding Guidelines

## Core Intent

- Respect the existing architecture and coding standards.
- Prefer readable, explicit solutions over clever shortcuts.
- Extend current abstractions before inventing new ones.
- Prioritize maintainability and clarity, short methods and classes, clean code.

## General Guardrails

- Target TypeScript 5.x / ES2022 and prefer native features over polyfills.
- Use pure ES modules; never emit `require`, `module.exports`, or CommonJS helpers.
- Rely on the project's build, lint, and test scripts unless asked otherwise.
- Note design trade-offs when intent is not obvious.

## Project Organization

- Follow the repository's folder and responsibility layout for new code.
- Use kebab-case filenames (e.g., `user-session.ts`, `data-service.ts`) unless told otherwise.
- Keep tests, types, and helpers near their implementation when it aids discovery.
- Reuse or extend shared utilities before adding new ones.

## Naming & Style

- Use PascalCase for classes, interfaces, enums, and type aliases; camelCase for everything else.
- Skip interface prefixes like `I`; rely on descriptive names.
- Name things for their behavior or domain meaning, not implementation.

## Formatting & Style

- Run the repository's lint/format scripts (e.g., `npm run lint`) before submitting.
- Match the project's indentation, quote style, and trailing comma rules.
- Keep functions focused; extract helpers when logic branches grow.
- Favor immutable data and pure functions when practical.

## Type System Expectations

- Avoid `any` (implicit or explicit); prefer `unknown` plus narrowing.
- Use discriminated unions for realtime events and state machines.
- Centralize shared contracts instead of duplicating shapes.
- Express intent with TypeScript utility types (e.g., `Readonly`, `Partial`, `Record`).

## Async, Events & Error Handling

- Use `async/await`; wrap awaits in try/catch with structured errors.
- Guard edge cases early to avoid deep nesting.
- Send errors through the project's logging/telemetry utilities.
- Surface user-facing errors via the repository's notification pattern.
- Debounce configuration-driven updates and dispose resources deterministically.

## Architecture & Patterns

- Follow the repository's dependency injection or composition pattern; keep modules single-purpose.
- Observe existing initialization and disposal sequences when wiring into lifecycles.
- Keep transport, domain, and presentation layers decoupled with clear interfaces.
- Supply lifecycle hooks (e.g., `initialize`, `dispose`) and targeted tests when adding services.

## External Integrations

- Instantiate clients outside hot paths and inject them for testability.
- Never hardcode secrets; load them from secure sources.
- Apply retries, backoff, and cancellation to network or IO calls.
- Normalize external responses and map errors to domain shapes.

## Security Practices

- Validate and sanitize external input with schema validators or type guards.
- Avoid dynamic code execution and untrusted template rendering.
- Encode untrusted content before rendering HTML; use framework escaping or trusted types.
- Use parameterized queries or prepared statements to block injection.
- Keep secrets in secure storage, rotate them regularly, and request least-privilege scopes.
- Favor immutable flows and defensive copies for sensitive data.
- Use vetted crypto libraries only.
- Patch dependencies promptly and monitor advisories.

## Configuration & Secrets

- Reach configuration through shared helpers and validate with schemas or dedicated validators.
- Handle secrets via the project's secure storage; guard `undefined` and error states.
- Document new configuration keys and update related tests.

## UI & UX Components

- Sanitize user or external content before rendering.
- Keep UI layers thin; push heavy logic to services or state managers.
- Use messaging or events to decouple UI from business logic.

## Testing Expectations

- Add or update unit tests with the project's framework and naming style.
- Expand integration or end-to-end suites when behavior crosses modules or platform APIs.
- Run targeted test scripts for quick feedback before submitting.
- Avoid brittle timing assertions; prefer fake timers or injected clocks.
