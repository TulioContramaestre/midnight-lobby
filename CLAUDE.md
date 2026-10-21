# Midnight Lobby

A week-long, browser-only dating sim set on a gaming Discord-style server, presented as a desktop + browser UI (v2 reskin). Vite + React + TypeScript, no backend.

## Commands

- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run typecheck` / `npm run lint` / `npm run test`

All four checks must pass before you consider a task done.

## Architecture

Boundaries are enforced by ESLint `no-restricted-imports`:

- `src/engine/` — pure TypeScript game rules and state. Never imports React, `src/ui` or `src/app`; may import `src/content` with `import type` only. Content is passed in: `createReducer(registry)` / `createSelectors(registry)`. Reducers are pure; all randomness goes through the seeded RNG in `GameState.rng`.
- `src/content/` — all game data as typed TS files, assembled in `registry.ts` and checked by `validate.ts`. Each love interest has her own folder under `characters/love-interests/`. Never imports React or UI code.
- `src/app/` — `GameProvider`, timers, and the session layer in `src/app/session/` (chat logs, scene locations, typing, popouts) that wraps the game reducer. No game rules here.
- `src/ui/` — React components that read state and dispatch actions. No game rules, thresholds or random picks.

Other rules:

- Relationships (best friend, rival, rival target) are fields on characters, not global maps.
- Scenes are picked by the scheduler from `day`, `slot`, `when` and `priority`. Choice-triggered scenes use flags (`setFlag` effects + `flag` conditions), not engine changes.
- Every scene title needs a location in `src/app/session/locations.ts`, and every character needs entries in `src/ui/theme.ts`. Tests fail otherwise.
- Icons go through `src/ui/components/Icon.tsx` (Tabler, rendered with the `.ti` wrapper). Don't import `@tabler/icons-react` anywhere else.
- Some tests pin the shipped content (`src/content/__tests__/parity.test.ts`, `src/engine/__tests__/real/`). Update their expected values only when content is changed on purpose.

## Docs

- `docs/STYLE.md` — voice and content rules. **Read before writing or editing any player-facing text** (dialogue, choices, narration, posts, endings), and use its self-check list.
- `docs/ADDING_CONTENT.md` — how to add characters, scenes and activities, and which tests each change breaks.
- `docs/PORT_NOTES.md` — quirks kept on purpose from the original game. Check before "fixing" odd behavior.
- `docs/DECISIONS.md` — why things are built this way. Read before proposing architecture or tooling changes; add an entry for significant decisions.
- `docs/ROADMAP.md` — planned work. Check when asked what's next; tick items off when done.

## Writing content

- Never rewrite existing lines unless explicitly asked. New content should sound like it was always there.
- Keep affection deltas on the existing scale (±1/±2, −3 only for betrayals).
- The content validator must pass with no new warnings, or explain each warning.
- When unsure how a character would say something, copy the rhythm of their existing lines in `src/content/characters/`.

## Working style

- Small, focused commits with clear messages.
- Add or update engine tests for any rule change.
- If a requested change would alter existing behavior or balance, say so before making it.
