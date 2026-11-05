# Roadmap

Ideas and next steps that came up while planning the port. Not commitments. Move items to "Done" with a date and commit when finished.

## Next up

- [ ] **Voice checks in the content validator.** Implement `docs/STYLE.md` section 9 as warnings, with an allowlist for existing lines that break pattern on purpose.
- [ ] **Decide on preserved quirks.** Go through `docs/PORT_NOTES.md` and decide, item by item, whether each quirk is intended. Fixing any of them is a balance change: update tests and note it in `DECISIONS.md`.

## Soon

- [ ] **Save and load.** Store `GameState` (including the RNG state) in `localStorage`, wrapped in try/catch. Autosave after each action; a "Continue" option on the intro screen.
- [ ] **Dev panel.** A toggleable overlay (dev builds only) showing hidden affection for every character, flags, current tier per girl, and the projected ending score. Useful for writing and balancing.
- [ ] **First choice-triggered storyline.** A scene that only appears if an earlier choice set a flag. Proves out the scheduler and doubles as the worked example in `docs/ADDING_CONTENT.md`.
- [ ] **Player gender choice.** Let the player pick a gender at character creation, which changes the love interests.
- [ ] **Bigger side characters.** More interactions with the supporting cast, with more impact on how the story plays out.

## Later

- [ ] **A fourth love interest,** following the template in `docs/STYLE.md` section 7.
- [ ] **More scenes per day or a longer week.** Re-check balance so a focused run still reaches a good ending and doesn't max out everyone.
- [ ] **Non-coder authoring** (JSON/YAML or Ink), only if writers who don't code join. See `DECISIONS.md` #2.
- [ ] **Oxlint alongside ESLint,** only if linting gets slow. See `DECISIONS.md` #6.

## Done

- Ported the original HTML game to Vite + React + TypeScript with parity tests.
- Added `CLAUDE.md` and `docs/STYLE.md`.
- v2 desktop + browser reskin (2026-10-18).
- Deleted `reference/`.
- Removed `PORT_PROMPT.md` (2026-11-04).
- Mobile layout and link preview tags (2026-11-04).
