# Midnight Lobby

A week-long, browser-only dating sim set on a gaming Discord-style server. Vite + React + TypeScript, no backend.

## Commands

- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run typecheck` / `npm run lint` / `npm run test`

All four checks must pass before you consider a task done.

## Architecture

Three areas with strict boundaries (enforced by ESLint `no-restricted-imports`):

- `src/engine/` — pure TypeScript game rules and state. Never imports React or `src/ui`. The reducer is pure; all randomness goes through the seeded RNG stored in `GameState`.
- `src/content/` — all game data as typed TS files. Each character's data lives in their own folder under `src/content/characters/`. Never imports `src/ui`.
- `src/ui/` — React components that read state and dispatch actions. No game rules, thresholds or random picks in components.

Other rules:

- Relationships (best friend, rival, rival target) are fields on characters, not global maps.
- Scenes are selected by the scheduler using `day`, `slot`, `when` conditions and `priority`. New choice-triggered scenes use flags (`setFlag` effects + `flag` conditions) rather than engine changes.
- Icons are imported only through `src/ui/icons.ts`.
- `reference/` (if present) is the original HTML. It is gitignored: never commit it and never read it from `src/`, tests or config.

## Writing content

**Before writing or editing any player-facing text** (dialogue, choices, narration, posts, endings), read `docs/STYLE.md` and follow it, including its self-check list.

- Never rewrite existing lines unless explicitly asked. New content should sound like it was always there.
- Keep affection deltas on the existing scale (±1/±2, −3 only for betrayals).
- When adding a character, scene or activity, follow `docs/ADDING_CONTENT.md` and make sure the content validator passes with no new warnings, or explain each warning.
- When unsure how a character would say something, copy the rhythm of their existing lines in `src/content/characters/`.

## Working style

- Small, focused commits with clear messages.
- Add or update engine tests for any rule change.
- If a requested change would alter existing behavior or balance, say so before making it.
