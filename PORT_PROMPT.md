# Port "Midnight Lobby" from a single HTML file to Vite + React + TypeScript

## Your job

Port the browser dating sim in `reference/midnight_lobby_dating_sim_v4.html` into this Vite + React + TypeScript project. The reference file is the **single source of truth**. Read the whole file before writing any code.

The `reference/` folder is gitignored and will be deleted once the port is done. Never commit it, never remove it from `.gitignore`, and never import, read or fetch it from `src/`, tests, scripts or config. The project must build and every test must pass with `reference/` deleted. Anything you need from it (content, the counts for the parity test) gets copied into source files.

There are two goals, in this order:

1. **Exact parity.** Every line of text, every choice, every number, every threshold, every screen and every flow must behave exactly as it does in the reference. Do not rewrite, "improve", shorten, re-punctuate or reorder any content. Keep curly quotes (“ ”), primes (′ ″), em dashes and emoji-free text exactly as they appear.
2. **A structure that scales.** Adding a character, a scene, an activity or a choice-triggered event should mean adding a content file, not editing engine or UI code.

If parity and a structural idea conflict, parity wins. If you find something in the reference that looks like a bug, **preserve it** and list it in `docs/PORT_NOTES.md` instead of fixing it.

Do not add features beyond what is listed under "Allowed changes".

---

## Tech constraints

- Vite + React 18/19 + TypeScript, `strict: true`.
- State: `useReducer` over a **pure** engine reducer, exposed through a React context. No Redux/Zustand.
- Icons: `@tabler/icons-react` (replaces the CDN webfont the reference uses).
- Tests: Vitest, for the engine and content validation.
- Path alias `@/` → `src/` (configure in both `vite.config.ts` and `tsconfig.app.json`).
- No other runtime dependencies without a strong reason. No CSS framework; plain CSS files.
- The engine (`src/engine`) must not import React or anything from `src/ui`.
- Content (`src/content`) must not import from `src/ui`. It may import types and small helpers from the engine.

---

## Architecture: three areas

### 1. `src/engine` — rules and state (pure TS)

Everything about *how the game works*. It knows nothing about specific characters except through the content registry.

### 2. `src/content` — all game data (typed TS files)

Everything about *what is in the game*: characters, scenes, lines, activities, posts, endings, character-creation effects. Every character-specific piece of data lives in that character's folder.

### 3. `src/ui` — React components

Thin components that read state and dispatch actions. No game rules in components (no affection math, no thresholds, no random picks during render).

---

## Required project structure

Use this layout. You may add files, but keep these boundaries.

```
reference/                               # gitignored, local only, deleted after the port
  midnight_lobby_dating_sim_v4.html      # read-only source of truth
docs/
  PORT_NOTES.md                          # quirks preserved, decisions made
  ADDING_CONTENT.md                      # how to add a character / scene / activity
src/
  main.tsx
  app/
    App.tsx                              # picks screen from state.phase / state.view
    GameProvider.tsx                     # context + useReducer(engine reducer)
    useGame.ts                           # hook: { state, dispatch, selectors }
  engine/
    types.ts                             # GameState, Action, Mood, Tier, etc.
    constants.ts                         # thresholds, DAY_NAMES, PFP_MIN, SLEEP_MIN
    initialState.ts
    reducer.ts                           # (state, action) => state, pure
    rng.ts                               # seeded PRNG; its state lives in GameState
    affection.ts                         # tier(), mood(), applyDeltas()
    conditions.ts                        # evaluate(Condition, state)
    effects.ts                           # applyEffects(Effect[], state)
    scheduler.ts                         # pick the scene for (day, slot)
    reactions.ts                         # resolve a choice's reaction into Line[]
    evening.ts                           # queue / watch / pfp / sleep resolution
    feed.ts                              # addPostsForDay(), like()
    confrontation.ts                     # shouldConfront(), describeOffenses()
    scoring.ts                           # final score + modifiers + ending tier
    creation.ts                          # starting affection from age/height/vibe
    selectors.ts                         # derived values for the UI
    __tests__/
  content/
    types.ts                             # Character, Scene, Choice, Line, Condition, Effect, Activity, ...
    registry.ts                          # collects everything; lookup by id
    characters/
      love-interests/
        nyx/
          index.ts                       # assembles the character
          profile.ts                     # name, handle, type, age, tint, bio
          portrait.ts                    # palette + feature flags for the portrait renderer
          avatarTheme.ts                 # ears/colors applied to player avatar on matched pfp (GIRLV)
          eveningLines.ts                # QTIER / WTIER lines for this character
          milestones.ts                  # pfp + sleep-call lines for this character
          feed.ts                        # this character's Chirp posts per day + like replies (REPLY)
          confrontation.ts               # CONF entry
          endings.ts                     # END + EPI entries
        goldie/ ...                      # same files
        rhea/ ...                        # same files
      supporting/
        benji.ts  mika.ts  theo.ts  jade.ts     # profile, avatar, role, relationships, posts
      rivals/
        ezra.ts  dex.ts  kai.ts                 # profile, avatar, role, target, rival ending (RIVEND), posts
      index.ts
    scenes/
      day1-monday.ts
      day2-tuesday.ts
      day3-wednesday.ts
      day4-thursday.ts
      day5-friday.ts
      day6-saturday.ts
      day7-sunday.ts
      index.ts
    activities/
      games.ts                           # GAMES
      watch.ts                           # WATCH
      milestones.ts                      # pfp + sleep-call definitions (ACT), unlock thresholds
    creation/
      age.ts                             # ageFx
      height.ts                          # htFx + htLabel
      vibes.ts                           # VIBE
      ethnicities.ts                     # ETH
      appearance.ts                      # SKINS, HAIRS, hair styles + hair paths (HS)
    scoring.ts                           # ending modifier rules expressed as data where practical
    validate.ts                          # content validator (see Testing)
  ui/
    layout/
      Header.tsx                         # "Day X of 7 · Monday" + Story / Chirp / People tabs
    screens/
      IntroScreen.tsx
      CreateScreen.tsx
      SceneScreen.tsx
      EveningScreen.tsx
      ConfrontationScreen.tsx
      EndingScreen.tsx
    panels/
      FeedPanel.tsx
      PeoplePanel.tsx
    components/
      Card.tsx  ChoiceButton.tsx  DialogueLine.tsx  DeltaChips.tsx
      Tag.tsx  LockedOption.tsx  Swatch.tsx  PortraitRow.tsx
    art/
      Portrait.tsx                       # love-interest portraits (port of portrait())
      Avatar.tsx                         # generic avatars (port of avatar())
      PlayerAvatar.tsx                   # port of pav()
  styles/
    tokens.css                           # color/radius tokens, light + dark
    base.css                             # resets, buttons, inputs, range sliders, selects
    game.css                             # the .ed rules from the reference
```

### Ownership rules

- **Relationships live on the character**, not in global maps. Replace `SID`, `RIV` and `GK` with fields: each love interest declares `bestFriend: "mika"` and `rival: "ezra"`; each rival declares `target: "nyx"`. The list of love interests comes from the registry, in the order nyx, goldie, rhea.
- Replace the parallel tables (`G`, `GIRLV`, `CONF`, `END`, `EPI`, `QTIER`, `WTIER`, `REPLY`, the per-girl parts of `POSTS`, and the palette inside `portrait()`) with per-character files as shown above.
- Activities (`GAMES`, `WATCH`) keep their per-character reactions keyed by character id, so a new character can be added to an activity by adding a key.

---

## Content model

Design the types in `src/content/types.ts` roughly like this (adjust names as needed, keep the capabilities):

```ts
type CharacterId = string;

type LineText = string | ((ctx: ContentContext) => string);   // dynamic lines are allowed
type Line = { speaker: CharacterId | null; text: LineText };   // null = narration (italic)

type Condition =
  | { all: Condition[] } | { any: Condition[] } | { not: Condition }
  | { affection: { who: CharacterId; gte?: number; lte?: number } }
  | { tier: { who: CharacterId; is: "low" | "mid" | "high" } }
  | { flag: string; is?: boolean | number }
  | { day: { gte?: number; lte?: number; is?: number } };

type Effect =
  | { type: "affection"; deltas: Record<CharacterId, number> }
  | { type: "setFlag"; flag: string; value?: boolean | number }
  | { type: "pickDate"; who: CharacterId };                    // the Sunday choice

type Reaction =
  | { kind: "oneOf"; speaker?: CharacterId; options: string[] } // reference `C(..., r)` with string[]
  | { kind: "sequenceOf"; options: Line[][] };                  // reference `V(..., rv)`

type Choice = {
  text: string;
  effects: Effect[];
  reaction?: Reaction;
  narration?: string;                                           // reference `n`, appended after reaction
};

type SceneVariant = { when?: Condition; lines: Line[]; choices: Choice[] };

type Scene = {
  id: string;
  title: string;
  day: number;            // 0-based
  slot: number;           // 0..2
  cast: CharacterId[];    // reference `who`, or `[tg]` for tiered scenes
  when?: Condition;       // for future choice-triggered scenes
  priority?: number;
  variants: SceneVariant[]; // first variant whose `when` passes is used
};
```

- **Tiered scenes** (`tg` + `tiers.low/mid/high` in the reference) become one scene with three variants gated on `{ tier: { who, is } }`. The tier is computed when the scene loads, exactly like `loadScene()`.
- **Dynamic lines** must be ported as functions of a read-only context: `nyxLine()`, Goldie's Day 1 DM that uses the player's gamertag, and Goldie's Day 7 meltdown line that checks how many sleep calls happened.
- **The scheduler** selects, for a given day and slot, the highest-priority scene whose `when` passes. With today's content, every (day, slot) has exactly one scene, so the flow is identical to `DAYS[day][scene]`. This is the hook for future choice-triggered scenes.
- **Flags**: add a generic `flags` map to state and support `setFlag` effects and `flag` conditions, even though current content does not use them. Keep `slept`, `pfpAll` and `matched` as explicit state fields because the engine's rules depend on them, and also mirror them as flags (`slept:nyx`, `pfp:goldie`, ...) so future scenes can condition on them.

---

## Engine behavior to reproduce exactly

Port these from the reference. Treat this list as a checklist, not a replacement for reading the code.

**State and phases**
- Phases: `intro` → `create` → (`scene` ⇄ `react`) × 3 per day → `evening` → next day … → Day 7 slot 3 "Who do you choose?" → `confront` (only if needed) → `ending`.
- Views: `story`, `feed`, `people`. Switching to `feed` resets the unseen counter and jumps the feed to today. Switching view clears the feed note.
- "Play again" fully resets state.
- `nextDay()`: increments day, resets slot, clears mood overrides, resets the daily like, clears evening state, adds that day's posts, loads the scene, goes to `story`.

**Character creation**
- Gamertag is required (trimmed); empty shows "Enter a gamertag first". Max length 16. The error clears as soon as the user types.
- Age slider 18–35, height slider 60–80 inches, labeled with `htLabel()`. The slider readout updates live while dragging; the state commits on change (keep this split, since committing re-renders the preview).
- Vibe, ethnicity, skin swatches, hair swatches, hair style. Ethnicity has no gameplay effect (keep the helper text).
- First impressions preview: sum of `ageFx`, `htFx` and `VIBE` effects per girl, shown as happy/upset/neutral portraits with arrows, plus the three explanation lines.
- On start: girls' affection = starting affection; benji, mika, theo, jade = 0; ezra, dex, kai = 2. Then add Day 1 posts and load the first scene.

**Affection, tiers and moods** (keep each threshold where it is used; they differ on purpose)
- Scene/evening tier: `>= 7` high, `>= 3` mid, else low.
- Portrait mood: mood override if present; otherwise `>= 6` happy, `<= 0` upset, else neutral.
- After a choice, every *love interest* whose delta is nonzero gets a mood override (happy if positive, upset if negative) for the reaction view. Overrides clear on Continue.
- Ending thresholds: final `>= 9` good, `>= 4` friends, else left. "Meanwhile" epilogue tiers: `>= 9` high, `>= 4` mid, else low.

**Choices and reactions** (`react()`)
- `rv` choices: pick one of the line sequences.
- `r` as `string[]`: pick one string; the speaker is the scene's first cast member.
- `r` as a fixed line array: use as-is.
- If `n` exists, append it as narration.
- Random picks happen when the action is dispatched and are stored in state, never during render.

**Delta chips** (`chips()`)
- One chip per nonzero delta. For rivals the label is "{Name}'s odds" and colors are inverted (a positive delta is red/danger, a negative one is green/success). Arrow icons keep their aria-labels.

**Evening**
- Pick one girl (defaults to Nyx on first evening; selection persists across days like the reference's `evG`). Choose Queue or Watch, then an item from `GAMES` / `WATCH` with name + description, or Back.
- Result: girl's reaction line, then the narration (`narr()`), then, only if that item's effect for her is positive, a tier line from `QTIER` / `WTIER`.
- Matching pfp: shown only if she is not already the matched girl. Unlocked at `PFP_MIN = 6`; below that, show the dashed locked option. If another girl was matched, that girl gets −3 and the "noticed you switched" narration. Sets `matched`, adds to `pfpAll`, adds the "Check the People tab" narration. Lines come from the `mid` pool unless the tier is high.
- Sleep call: shown at `SLEEP_MIN = 8`. If her affection is at least 6 but under 8, show the "Something even more personal unlocks…" hint. A repeat sleep call with the same girl gives +1 instead of +2. Adds a narration line and records `slept`.
- Every evening action also gives her rival −1.
- One action per evening, then the "Sleep, go to {next day}" and Chirp buttons. The Chirp button label shows whether today's like is used.

**Chirp feed**
- Each day adds posts in this insertion order: nyx, goldie, rhea, then the two extra posts for that day. The feed is newest-first (`unshift`), so the **display order within a day is: extra post 2, extra post 1, rhea, goldie, nyx.** Preserve this.
- A love interest's post for a day can be a single string or a `[warm, cold]` pair; pick `warm` if her affection is `>= 3` at the moment the day's posts are added.
- Like counts use the reference formulas exactly: love interests `14 + ((d*37 + id.length*29 + text.length) % 90)`; extras `5 + ((d*13 + text.length) % 60)`. Post ids are `"p" + day + characterId`.
- Unseen counter += 5 per day (keep this literal number).
- Day tabs from Monday to today, with prev/next chevrons, clamped.
- One like per day. Liking a love interest's post: +1 to her, −1 to each other love interest, increments her like count (used by `nyxLine`), and she replies with a random line from her replies. Liking a supporting character: +1 to them. Liking a rival: +1 to them (the note says you hyped your competition).
- Feed notes for: already liked, like used today, and "The week is over" during confront/ending. Keep every note string exactly.

**Sunday pick and confrontation**
- The "Who do you choose?" choices set the picked girl. If you had a sleep call or matching pfp with anyone else, go to `confront` with her portrait upset; otherwise go straight to `ending`.
- `describeOffenses()` is the reference `what()` and must produce identical strings, including the lower-casing for Nyx and Goldie and the capitalised first letter for Rhea.
- A confrontation choice applies its modifier only in scoring (it is shown as a chip), sets her mood to neutral if positive or upset otherwise, and shows a random reply. Then "See how it ends".

**Scoring** (`score()`)
- Base = her affection. Modifiers, in this order and with these exact labels:
  - Best friend `>= 2`: "{Friend} vouched for you" +2; `<= -2`: "{Friend} warned her about you" −2.
  - Benji `>= 2`: "Benji the mod put in a good word" +1; `<= -2`: "Benji spread gossip about you" −1.
  - Her rival `>= 4`: "{Rival} was serious competition" −2; `<= 0`: "You outshone {Rival}" +1.
  - Matched pfp with her: "Your matching pfps sealed it" +1.
  - Sleep calls with others: "Your sleep call with {names}" −3. Matching pfps with others: "Your matching pfps with {names}" −2.
  - Confrontation choice label and modifier, if any.
- Ending screen: portrait(s) (player avatar shown beside her only on the good ending), the tag "{Good|Friends|Bad} ending · {n} hearts", the ending title and text, the "hidden numbers" breakdown with signed modifiers using the real minus sign (−), the threshold legend, "Meanwhile" for the other two girls, and a rival ending line for each rival whose affection is `>= 3`, unless that rival's target is the picked girl **and** the ending is good.

**People tab**
- Player card (avatar, name, age, height, ethnicity, vibe, matched pfp status, sleep calls list), then "Friends and influencers" (mika, theo, jade, benji) and "Competition" (ezra, dex, kai) with their helper text.

**Player avatar**
- Background and ears come from the matched girl's avatar theme (cat, dog or bunny ears); otherwise a gray background and no ears.

---

## Randomness

Use a small seeded PRNG (for example mulberry32) whose state is stored in `GameState`, so the reducer stays pure (it must survive React StrictMode double-invoking reducers) and a save/load system can be added later. Seed from `Date.now()` on reset. Port every `Math.random`, `pick()` and `rnd()` call, including the ones inside the activity `narr()` functions. Change those functions to take the RNG as an argument.

---

## Art

- Port `portrait()` to `ui/art/Portrait.tsx` as JSX SVG, and `avatar()` to `ui/art/Avatar.tsx`. Keep every path, coordinate, color and transform identical, and keep `role="img"` and the aria-labels.
- Move each girl's palette and feature choices (ears, bangs streak, dog ears, choker, bow, freckles, etc.) into her `portrait.ts`, so the renderer is driven by data. A new love interest should be addable by writing a new `portrait.ts`; it's fine if the renderer branches on a feature enum rather than character ids.
- Replace the global `uid` clip-path counter with React `useId()`.

---

## Styling

- The reference relies on CSS variables injected by its original host page. Extract only the tokens the game actually uses into `styles/tokens.css`, copying light and dark values from the reference's `:root` and `prefers-color-scheme: dark` blocks. At minimum: surfaces (`--surface-1`, `--surface-2`), borders (`--border`, `--border-strong`, `--border-stronger`, `--border-danger`), text (`--text-primary`, `--text-secondary`, `--text-muted`, `--text-success`, `--text-danger`, `--text-warning`, `--text-accent`), backgrounds (`--bg-success`, `--bg-danger`, `--bg-warning`, `--bg-accent`), `--text-tint-violet/yellow/magenta`, and `--radius`. Resolve them to final colors rather than copying the whole token tree.
- Port the host's base styles for `button`, text `input`, `select` and `input[type=range]` into `base.css` so controls look the same.
- Port the `.ed` rules into `game.css`. Keep the card radius, padding, font sizes and line heights.
- Font: system sans stack (the reference's custom font isn't available).

---

## Allowed changes (only these)

- Center the app in a max-width container of about 760px with 16px side gutters, since it no longer lives inside a chat widget. It must work at phone width with no horizontal scroll.
- Replace the CDN icon font with `@tabler/icons-react` using the same icons.
- Seeded RNG, `useId()`, React event handlers instead of inline `onclick` strings.
- A `docs/` folder and tests.

Anything else that would change what a player sees or how the numbers move is out of scope.

---

## Testing and verification

Add these scripts: `dev`, `build`, `preview`, `typecheck` (`tsc -b --noEmit` or equivalent), `lint`, `test` (`vitest run`).

**Content validator** (`src/content/validate.ts`, run as a test):
- Every character id referenced anywhere (cast, speakers, deltas, relationships, rival targets, activity reactions, posts) exists in the registry.
- Every love interest has a profile, portrait, avatar theme, evening lines for all three tiers, milestone lines, posts for days 0–6, replies, a confrontation and all ending/epilogue tiers.
- Every (day, slot) for days 0–6 and slots 0–2 resolves to exactly one scene for every tier combination.
- Every scene variant has at least one choice.

**Parity counts** (as a test): the number of scenes, variants, choices per variant, games, watch options, posts per day, and ending entries match the reference. Count them from the reference by hand once and hard-code the expected numbers in the test.

**Engine tests**, at minimum:
- `startingAffection` for each age and height bracket and each vibe.
- `tier()` and `mood()` at their boundaries (2/3, 6/7, 0/1, 5/6).
- Evening: pfp switch penalty (−3 to the previous match), repeat sleep call gives +1, rival −1 on every action, lock thresholds.
- Likes: the love-interest ±1 spread, one like per day, no likes during confront/ending.
- Feed: insertion order and like-count formula for a known day.
- `describeOffenses()` strings for each girl with one and with two offenses.
- `score()`: every modifier label and value, and the 3/4 and 8/9 ending boundaries.
- Confrontation trigger: none when you've only done pfp/sleep with the picked girl.
- With a fixed seed, a scripted playthrough ending on each of the three girls reaches the expected ending tier.

**Before you finish**: `npm run typecheck`, `npm run lint`, `npm run test` and `npm run build` all pass. Confirm they still pass with `reference/` temporarily renamed, then rename it back. Then run `npm run dev` and play through once per girl, comparing screen by screen against the reference opened in a browser. Note any visual differences in `PORT_NOTES.md`.

---

## How to work

1. Read the reference end to end. Write `docs/PORT_NOTES.md` with: an inventory of every table and function in the reference and where it will live, the content counts for the parity test, and any quirks you'll preserve.
2. Set up tooling (alias, Vitest, icons, CSS files). Commit.
3. Write `content/types.ts` and the engine with its tests. Commit.
4. Port content character by character and day by day, copying strings verbatim. Run the validator and parity tests as you go. Commit after each character and after the scenes.
5. Build the UI screens and art. Commit.
6. Verify (above), then write `docs/ADDING_CONTENT.md` with short worked examples: adding a fourth love interest, adding a scene that only appears if a flag was set by an earlier choice, and adding a new game to the evening list.

Make small, focused commits with clear messages. When you're unsure how something behaves, re-read the reference rather than guessing.
