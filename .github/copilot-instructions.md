# Pathfinder Combat Pad - AI Coding Guidelines

## Project Overview
Desktop application built with **React + Vite + Tauri + TypeScript** for managing Pathfinder RPG combat encounters. Features canvas-based positioning, initiative tracking, and magnet-based status effects.

## Architecture
- **Frontend**: React components in `src/components/`, styled with vanilla-extract CSS-in-JS
- **Backend**: Tauri (Rust) in `src-tauri/` for cross-platform desktop functionality
- **State**: Zustand stores (`useEntityStore`, `useCanvasStore`, `useMagnetStore`) for reactive data management
- **Build**: Vite for fast HMR, pnpm for dependency management

## Key Patterns & Conventions
- **Component Structure**: Components in `src/components/Name/`, with `Name.tsx` and `Name.css.ts`
- **Styling**: Use `style`, `styleVariants`, `globalStyle` from vanilla-extract. Selectors must target `&` (e.g., `${parent} &` for child rules)
- **Naming**: PascalCase for classes/interfaces, camelCase for variables, kebab-case for filenames
- **Imports**: Pure ES modules, no CommonJS. Import CSS classes directly from `.css.ts` files
- **Async/Error**: `async/await` with try/catch, use project logging for errors
- **Animation**: `AnimatePresence` from `motion/react` for enter/exit transitions

## Development Workflow
- **Dev Server**: `pnpm dev` (Vite) + `pnpm tauri dev` (desktop)
- **Build**: `pnpm build` (frontend), `pnpm tauri build` (desktop app)
- **Linting (STRICT)**: Always run `pnpm lint:oxlint <file>` then `pnpm lint:eslint <file>`, fix errors sequentially until both pass clean

## Code Examples
- **Store Usage**: `const { entities } = useEntityStore()`
- **Styling**: `export const button = style({ padding: "12px" })`
- **Component**: `<div className={styles.container}>...</div>` (import styles from `./Component.css.ts`)
- **Debouncing**: `import { debounce } from "es-toolkit"`

## Validation Rules
- Target TypeScript 5.x/ES2022, avoid `any`, use discriminated unions for state
- No hardcode secrets; use Tauri's secure storage
- Sanitize user input, encode output for HTML rendering
- Follow existing patterns: composition over inheritance, single-purpose modules

## File References
- `AGENTS.md`: Detailed coding guidelines and security practices
- `src/components/CharacterMarkers/`: Initiative tracking with scroll overlays
- `src/store/`: Zustand store implementations
- `src-tauri/`: Rust backend configuration