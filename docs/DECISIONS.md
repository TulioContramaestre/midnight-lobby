# Decisions

Why the project is built the way it is. Add a new entry when a significant choice is made; don't rewrite old entries, mark them superseded instead.

---

## 1. Vite + React + TypeScript, not Next.js

**Decision:** A client-only Vite + React + TS app.

**Why:** The game is a single-screen state machine with no backend, no routing, no SEO and no shareable URLs. Next.js would add server rendering, hydration problems (content uses randomness) and `"use client"` everywhere, for no benefit.

**Alternatives considered:**
- **SolidJS:** a good fit technically, but a smaller ecosystem and fewer people know it. Performance isn't a factor at this size.
- **Plain TypeScript:** would end up hand-building a mini framework for rendering and state as screens multiply.

**Revisit if:** the project needs accounts, a backend, a marketing site or shareable pages. The game would still be a client-side app inside whatever is added.

## 2. Content is authored as TypeScript files

**Decision:** All game content (characters, scenes, lines, activities, posts, endings) lives in typed TS files under `src/content/`.

**Why:** Full type checking, conditions and dynamic lines can be real functions, and the content validator can run as a normal test.

**Alternatives considered:**
- **JSON/YAML:** editable by non-coders, but needs a custom condition syntax and loses type safety.
- **Ink (inkjs):** a narrative scripting language built for branching stories and variables, but it's a second language to learn and integrate.

**Revisit if:** writers who don't code join the project. JSON/YAML or Ink could then be added as an authoring layer that compiles into the same content types.

## 3. Engine, content and UI are separate areas

**Decision:** `src/engine` (pure rules and state), `src/content` (data), `src/ui` (React). The engine never imports React or UI; content never imports UI. Enforced with ESLint `no-restricted-imports`.

**Why:** Adding characters, scenes and interactions should mean adding content files, not touching the engine or components. A pure engine is also easy to test.

## 4. Scenes are scheduled, not hard-coded in a list

**Decision:** The scheduler picks the highest-priority scene whose `when` condition passes for each day and slot. Choices can set flags; scenes can require flags.

**Why:** This is the foundation for storylets: scenes that appear because of earlier choices. With the original content every day and slot has exactly one scene, so the flow matches the original game.

## 5. Seeded RNG stored in game state

**Decision:** All randomness goes through a seeded PRNG whose state lives in `GameState`. No `Math.random()` in content or components.

**Why:** Keeps the reducer pure (it survives React StrictMode double-invoking reducers), makes playthroughs reproducible in tests, and makes save/load possible.

## 6. ESLint, not Oxlint

**Decision:** Keep the ESLint setup from the Vite template.

**Why:** At this size ESLint runs in a couple of seconds, so Oxlint's speed doesn't matter. ESLint has the mature type-aware rules and plugins, and `no-restricted-imports` enforces the architecture boundaries.

**Revisit if:** linting becomes slow. Oxlint can run alongside ESLint using `eslint-plugin-oxlint`.

## 7. Tabler icons, through one file

**Decision:** `@tabler/icons-react`, mapped from kebab-case names in `src/ui/components/Icon.tsx` and rendered inside the `.ti` metric wrapper. Components never import the icon library directly.

**Why:** The original game used Tabler, so the icons match exactly. Tabler's larger set (about 5,900 icons) covers future game themes. The single wrapper file makes switching libraries a one-file change.

## 8. Parity port, quirks preserved

**Decision:** The port reproduced the original HTML game exactly, including behavior that looks like bugs. Known quirks are listed in `docs/PORT_NOTES.md`.

**Example:** switching your matching profile picture to another girl costs the previous girl −3 immediately and again counts −2 against you in final scoring. Whether this is intended is still undecided.

**Allowed differences from the original:** icons come from the React package instead of a CDN webfont, and the RNG is seeded. The v2 reskin replaced the original layout; its deliberate differences are listed under "v2 reskin" in `docs/PORT_NOTES.md`.

## 9. The reference HTML is not in the repo

**Decision:** The original `midnight_lobby_dating_sim_v4.html` was kept in a gitignored `reference/` folder during the port and has since been deleted. Nothing in the project depends on it.

**Note:** keep a copy outside the repo if you ever want to re-check parity.

## 10. Voice and style are written down

**Decision:** `docs/STYLE.md` defines each character's voice, the narrator, the choice archetypes and the balance scale. Existing content is the source of truth; the guide follows it.

**Why:** Keeps new content consistent across many sessions and contributors. The content validator turns the mechanical voice rules into warnings.
