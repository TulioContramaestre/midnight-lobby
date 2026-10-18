# Port notes

The source of truth is `reference/midnight_lobby_dating_sim_v4.html` (gitignored; deleted after the port). This file records:

- where every part of it went,
- the content counts the parity test checks,
- the quirks kept on purpose,
- the decisions made during the port,
- how the port was verified and what still looks different.

The UI has since been replaced by the v2 "desktop + browser" reskin (see [v2 reskin](#v2-reskin-desktop--browser)). The engine and content are unchanged apart from the changes listed there. Quirks and decisions below that are about the original UI (the host button rule, delta chips, the People tab, the sliders, the visual comparison) describe the port before the reskin.

## Inventory

### Data tables

| Reference | Where it lives now |
|---|---|
| `G` (love-interest profiles) | `src/content/characters/love-interests/<id>/profile.ts` |
| `CH` (`kind: "side"`) | `src/content/characters/supporting/<id>.ts` |
| `CH` (`kind: "rival"`) | `src/content/characters/rivals/<id>.ts` |
| `GK` | The love-interest list in `src/content/characters/index.ts` (order nyx, goldie, rhea) |
| `SID` | `bestFriend` on each love interest |
| `RIV` | `rival` on each love interest |
| `CH[*].target` | `target` on each rival |
| `DN` | `DAY_NAMES` in `src/engine/constants.ts` |
| `GIRLV` | `love-interests/<id>/avatarTheme.ts` |
| `SKINS`, `HAIRS`, `HS`, hair-style options | `src/content/creation/appearance.ts` |
| `ageFx` | Brackets in `src/content/creation/age.ts`; the lookup is in `src/engine/creation.ts` |
| `htFx`, `htLabel` | `src/content/creation/height.ts` |
| `VIBE` | `src/content/creation/vibes.ts` |
| `ETH` | `src/content/creation/ethnicities.ts` |
| `PFP_MIN`, `SLEEP_MIN` | `src/engine/constants.ts` (imported by `content/activities/milestones.ts`) |
| `DAYS` | `src/content/scenes/day1-monday.ts` … `day7-sunday.ts` |
| `MAPS`, `GAMES` | `src/content/activities/games.ts` |
| `WATCH` | `src/content/activities/watch.ts` |
| `QTIER`, `WTIER` | `love-interests/<id>/eveningLines.ts` |
| `ACT` | Labels, icons, unlock thresholds and sleep narration: `content/activities/milestones.ts`. Each girl's gain and lines: `love-interests/<id>/milestones.ts` |
| `CONF` | `love-interests/<id>/confrontation.ts` |
| `POSTS` (per girl), `REPLY` | `love-interests/<id>/feed.ts` |
| `POSTS[d].x` (extra posts) | `posts` on the supporting/rival character, as `{ day, order, text }` |
| `END`, `EPI` | `love-interests/<id>/endings.ts` |
| `RIVEND` | `rivalEnding` on each rival |
| `portrait()` palette and per-girl branches | `love-interests/<id>/portrait.ts` |

### Content helpers and dynamic lines

| Reference | Where it lives now |
|---|---|
| `fx`, `C`, `V` | `src/content/helpers.ts` (`choice`, `sequence`; `fx` replaced by explicit delta objects) |
| `nyxLine` | `love-interests/nyx/lines.ts` (a function of `ContentContext`) |

### Engine functions

| Reference | Where it lives now |
|---|---|
| `pick`, `rnd` | `src/engine/rng.ts` (`rng.pick`, `rng.int`) |
| `what` | `describeOffenses()` in `src/engine/confrontation.ts` |
| `S`, `reset` | `GameState` in `src/engine/types.ts`, `createInitialState(seed)` in `src/engine/initialState.ts`, the `reset` action |
| `uid` | React `useId()` in `ui/art/Portrait.tsx` and `ui/art/Avatar.tsx` |
| `nm` | `characterName()` in `src/engine/names.ts` (exposed as `selectors.name`) |
| `esc` | Not needed (React escapes text) |
| `tier`, `mood`, `apply` | `sceneTier()`, `mood()`, `applyDeltas()` in `src/engine/affection.ts` |
| `startH` | `startingAffection()` in `src/engine/creation.ts` |
| `addPosts`, `like` | `addPostsForDay()`, `like()` in `src/engine/feed.ts` |
| `loadScene` | `src/engine/scheduler.ts` (`pickScene`), called by the reducer |
| `react` | `resolveReaction()` in `src/engine/reactions.ts` |
| `chips` | `deltaChips()` selector (not rendered since the v2 reskin, which hides affection) |
| `score` | `src/engine/scoring.ts`, driven by the rules in `src/content/scoring.ts` |
| `doEv` | `src/engine/evening.ts` |
| `begin`, `choose`, `cont`, `nextDay`, `confChoose`, `setView`, `setP`, `nameIn`, `fdGo` | Reducer actions in `src/engine/reducer.ts` |

### Rendering and styles

| Reference | Where it lives now |
|---|---|
| `portrait()` drawing | `src/ui/art/Portrait.tsx` |
| `avatar()` | `src/ui/art/Avatar.tsx` |
| `pav()` | `src/ui/art/PlayerAvatar.tsx` |
| `pic()` | `src/ui/art/CharacterPicture.tsx`, wrapped for circles by `src/ui/art/Pic.tsx` |
| `intro()`, `create()` | `src/ui/desktop/` (`Desktop`, `IntroStep`, `ProfileStep`) |
| `header()` | `src/ui/browser/Browser.tsx` (tab strip and address bar) |
| `sceneView()`, `evening()`, `confrontView()` | `src/ui/lobby/` (chat log and composer states), with the message log kept in `src/app/session/` |
| `feed()` | `src/ui/chirp/Chirp.tsx` |
| `people()` | `src/ui/lobby/ProfilePopout.tsx` |
| `ending()` | `src/ui/recap/WeekRecap.tsx` |
| `render()` | `src/app/App.tsx` |
| All CSS | `src/styles/app.css` |

### State names

| Reference `S` | Port `GameState` |
|---|---|
| `v` | `affection` |
| `p` | `player` |
| `scene` | `slot` |
| `cur` | `scene` (`{ sceneId, variant }`) |
| `last` / `lastR` | `lastChoice` / `lastReaction` |
| `tm` | `moodOverrides` |
| `evG` / `evMode` / `evDone` | `evening.selected` / `evening.mode` / `evening.result` |
| `conf` | `confrontation` |
| `fd` | `feedDay` |
| `err` | `createError` |
| `slept`, `pfpAll` | Ordered id arrays (the reference used objects; `Object.keys` order is kept) |

## Content counts (parity test)

| What | Count |
|---|---|
| Scenes | 21 (7 days × 3 slots) |
| Tiered scenes | 6: rhea day 2, nyx day 3, goldie day 3, goldie day 4, nyx day 6, rhea day 6 |
| Scene variants | 33 |
| Choices per variant | 3 (99 in total) |
| Games | 5: spike, lanes, vanguard, omni, petal |
| Watch options | 4: anime, horror, cozy, esports |
| Posts per day | 5 (3 love interests + 2 extras). Day 1 posts are single strings; days 2–7 are warm/cold pairs |
| Endings | `END` 9 (3 girls × good/friends/left), `EPI` 9 (high/mid/low), `RIVEND` 3 |
| `QTIER` low/mid/high | nyx 2/3/3, goldie 2/2/3, rhea 2/2/3 |
| `WTIER` low/mid/high | 2/2/2 for each girl |
| Like replies | 4 per girl |
| pfp lines (mid/high) | 2/2 per girl |
| Sleep-call lines | 3 per girl, plus 4 shared sleep narrations |
| Confrontation choices | 3 per girl |
| Ethnicities / vibes | 11 / 4 |

Day numbers in this table are 1-based (Monday = day 1). In code, `day` is 0-based.

## Content conventions

- **Scene ids** are `d<day>-<title-slug>` with a 1-based day, for example `d7-who-do-you-choose`. The scene's `day` field is 0-based, like the reference's `DAYS` index.
- **Templated text.** Text the reference built by concatenation is now a template with placeholders, filled by the engine:
  - feed notes in `src/content/feedNotes.ts` (`{name}`, `{others}`, `{target}`);
  - milestone labels and narration in `activities/milestones.ts` (`{n}`, `{prev}`, `{name}`);
  - Queue/Watch labels in `activities/games.ts` and `activities/watch.ts` (`{n}`);
  - ending modifiers in `src/content/scoring.ts` (`{name}`, `{names}`).
- **Per-girl milestone values.** Each girl's pfp and sleep-call gain (`ACT.pfp.f`, `ACT.sleep.f`) is in her `milestones.ts`. The repeat sleep-call gain (+1) and the pfp-switch penalty (−3) are in `activities/milestones.ts`.
- **Extra posts.** An extra post's `order` is its index in the reference's `POSTS[d].x`, which keeps the feed order.
- **Assembly and checks.** `src/content/registry.ts` assembles everything, and `src/content/validate.ts` checks it (run by `src/content/__tests__/validate.test.ts`).
- **How the content was copied.** The data files were generated once from the reference tables by a throwaway script, so every string is copied exactly. Dynamic lines and `narrate` functions were written by hand. Everything was then checked against the reference in a scratch harness:
  - every table, field by field;
  - every `narr()` over 1,000 seeds;
  - 400 random seeded playthroughs, compared state by state.

## Quirks preserved

### Styling

- **Host button rule wins over `.ed` rules.** The host's `button:not(#action-btns button, …):not(form.elicit button)` has specificity (1,1,4), which beats `.ed button.ch` and `.ed .tabs button.on`. Confirmed with `getComputedStyle` in Chromium:
  - Choice buttons render at 14px with `8px 16px` padding, not the 15px / `10px 14px` written in `.ed`.
  - The active header tab and the active feed-day tab look the same as the others.
  - Inline styles still win, so the selected evening girl *is* highlighted.
  - The port keeps the `.ed` rules verbatim and gives the base button rule the same precedence.
- The dashed locked option is a `div`, not a button, so it does get the 15px / `10px 14px` styling. It looks slightly different from the buttons next to it.

### Scenes and text

- Dynamic lines (`nyxLine`, Goldie's Day 1 DM, Goldie's Day 7 meltdown, the confrontation lines) are evaluated every time the screen renders.
  - Liking a post in the middle of Saturday's first scene changes Nyx's line when you return to Story.
  - The scene's tier is fixed when the scene loads.

### Evening

- Switching to another girl keeps the open Queue/Watch list.
- Queue/watch tier lines and pfp line pools use her tier from *before* the action's own change.
- Evening delta chips appear in this order: her, then the previously matched girl (−3, only on a pfp switch), then her rival (−1).
- Matching pfps with a girl you matched earlier, after switching away, gives the full pfp gain again and costs the current match −3.

### Chirp feed

- Within a day, the feed displays posts in this order: extra post 2, extra post 1, Rhea, Goldie, Nyx.
- Like counts are computed from the post text, so a girl's warm and cold variants have different counts.
- The unseen badge always adds 5 per day.
- During confront/ending, liking anything shows "The week is over…", even on a post you already liked, because that check runs first.

### Ending and People

- "Meanwhile" shows a neutral portrait only for the mid tier. The high tier (≥ 9) shows the upset portrait.
- The ending tag never pluralises differently: "1 hearts" is possible.
- "Meanwhile" values, the base and the final score use JavaScript number formatting (ASCII "-"). Modifiers use the real minus sign (−).
- The sleep-call modifier always says "Your sleep call with …", even when there were two.
- The People tab joins sleep-call names with ", ". Everywhere else uses " and ".
- `describeOffenses()` returns the raw `what()` text.
  - Nyx and Goldie lower-case the whole string, including names.
  - Rhea capitalises only the first letter.

### Character creation

- A whitespace-only gamertag shows "Enter a gamertag first" and stays untrimmed in the field.

### Page

- The reference page's screen-reader-only `<h2>` description is kept.

## Decisions

### Engine and state

- **Content is passed into the engine.** The engine never imports `src/content` at runtime. `createReducer(content)` and `createSelectors(content)` receive the registry, and `GameProvider` passes the real one. This keeps the engine testable against small fixtures and avoids import cycles.
- **ESLint enforces the layer boundaries.** `src/engine` may not import React, `src/ui` or `src/app`, and may import `src/content` only with `import type`. `src/content` may not import React or UI code.
- **Each reducer case works on a copy.** It `structuredClone`s the state and then mutates the copy. That keeps the code close to the reference for review while staying pure (safe under StrictMode's double-invoked reducers).
- **Randomness is mulberry32 with its state in `GameState.rng`.** Every `Math.random` / `pick` / `rnd` call from the reference draws from it, in the same order. That includes the activity `narr()` functions, which keep their exact expression structure.
  - The initial seed comes from `Date.now()` in `main.tsx`. "Play again" passes a fresh `Date.now()` from the click handler.
- **The current scene is stored as `{ sceneId, variant }`.** The selected variant is fixed when the scene loads, matching `loadScene()`.
  - Dynamic line text is resolved at render through a selector, without randomness.
  - Reactions are random, so they're resolved when the choice is dispatched and stored as plain strings.

### UI

- The range sliders keep the reference's split. The readout updates while dragging (local component state), and the value commits to game state on the native `change` event, attached through a ref callback.
- **Icons use `@tabler/icons-react`** inside an `<i class="ti">` wrapper that keeps the reference's inline styles and aria attributes.
  - The wrapper's font is a local system font with `ascent-override: 90%` / `descent-override: 10%`, the same vertical metrics as the tabler-icons webfont. A 1em-wide `::before` gives it the glyph's width, and the SVG is absolutely positioned inside.
  - As a result, every line box rounds exactly as it did with the webfont. Measured in Chromium, every element's box matches the reference across all three scripted playthroughs.
  - Browsers without `ascent-override` (older Safari) fall back to the system font's metrics, so icon rows can be up to a pixel taller there.
- **Text runs are built as single strings** wherever the reference had one text node. For example, `Day 1 of 7 · Monday evening` is one string, not several JSX fragments. Chromium shapes each text node separately, so splitting a run shifts later glyphs by subpixels.
- **Focus.** The reference rebuilt `#app` with `innerHTML` on every update, so the focused element was always destroyed. React keeps elements, so focus stays where the player put it.
  - This is visible in one place: after picking a vibe, ethnicity or hair style, the select keeps its focus ring until you click elsewhere. In the reference, the ring disappears immediately.

### Accessibility

- One a11y-only difference: the creation preview avatar's aria-label follows the gamertag as you type. In the reference it updates only on the next full render.

## Verification

These checks ran in a scratch harness outside the repo, against the reference file, before `reference/` was deleted. Each one was also run against a deliberately planted error, to confirm it fails.

- **Content.** Every table compared field by field, every `narr()` over 1,000 seeds, and starting affection for every age (18–35) and height (60–80 inches).
- **Behaviour.** 400 random seeded playthroughs (38,715 actions) run on the reference and on the port's reducer, comparing state and RNG after every action.
- **Markup.** After every step of 150 playthroughs (13,866 renders, plus the intro), the port's markup matches the reference's `#app`: the same elements, attributes, inline styles and text.
- **Layout.** Every element's box matches across the three scripted playthroughs at 792px (7,905 boxes).
- **Without the reference.** `npm run typecheck`, `lint`, `test` and `build` all pass with `reference/` removed.

## Visual differences

The comparison method:

- **What ran.** The reference file and the port (`vite preview`), with the same seed on both sides, screenshotted after every step of the three scripted playthroughs (one per girl, 249 steps).
- **Configurations.** 792px light and dark, 390px light and dark, and 320px light: 1,245 screenshot pairs in all.
- **Comparison.** Headless Chromium at 1× scale, compared with pixelmatch at threshold 0.1.

Results:

- **Page size.** Identical at every step in every configuration. Neither version scrolls sideways at 390px or 320px.
- **Icons.** The only difference a player would see.
  - The port draws inline SVG (`@tabler/icons-react` 3.49), while the reference used the tabler-icons webfont (3.42).
  - Glyphs and positions match, but the edges antialias slightly differently: at most 203 pixels per screen, about 140 on average.
- **Focus rings.** 9 steps per configuration (about 2,800 pixels each), all on the create screen.
  - The gamertag box still shows its focus ring in the port, because the harness sets sliders and selects by script without moving focus. By then the reference had rebuilt the page and dropped focus.
  - In real use the player clicks the next control, so what they see is the select behaviour described under Decisions → UI → Focus.
- **Not compared.** Firefox and Safari. Older Safari ignores `ascent-override`, so icon rows may be up to a pixel taller there (see Decisions → UI).

## v2 reskin (desktop + browser)

The source is `design_handoff_midnight_lobby_v2/`. `Midnight Lobby.dc.html` is the visual source of truth, and its `<script data-dc-script>` block is the UI logic. Its `engine.js` is the original game code with four changes, applied here as follows:

1. **`render()` becomes a hook.** Nothing to change: React already re-renders from the reducer.
2. **Portraits fill their container.** `Portrait` and `Avatar` draw at `width/height 100%` with `preserveAspectRatio="xMidYMid slice"`, and the `size` prop is gone.
3. **pfp copy.** `milestones.pfp.matchedNarration` drops "Check the People tab."
4. **Intro copy.** "only whether a choice landed or backfired" now reads "only how they react". This text lives in `IntroStep.tsx`.

One engine action was added: `goToIntro`, for the profile step's "← Back". It mirrors `goToCreate`.

### Session layer

The design's component state (current location, per-location message logs, day dividers, DM ordering, typing, the summary and profile popout, the start-of-day snapshot) is `Session` in `src/app/session/types.ts`. `createSessionReducer` wraps the game reducer. Each action ports one of the design's methods (`launch`, `pick`, `advance`, `askPick`, `confPick`, `evDo`, …): it runs the game reducer, then reads the new state and posts lines to the log, as the design does after calling `choose()`/`doEv()`.

- **Scene locations.** Scenes map to channels and DMs by title, through `LOC` in `src/app/session/locations.ts`, copied from the handoff's table.
- **When text is fixed.** Chat text is resolved when it's posted. Dynamic lines are no longer re-evaluated on every render.
- **Moods.** A message keeps the mood its speaker had when it was posted (`moodOverrides` first, as with `S.tm`).
- **Timers.** `pick()` in `GameProvider` dispatches the reply, then `showTyping` at 700 ms and `advance` at 2,000 ms. The timers live at the root so switching to Chirp doesn't cancel them. The reducer ignores a stale `advance`.
- **Keys.** 1–3 are handled by a window listener in `Lobby.tsx`.
- **Browser tab.** The tab comes from the game's `view`: `'feed'` is Chirp and anything else is Midnight Lobby. `setView('feed')` already does what the design's `openChirp` does.

### Styling

- Inline styles are copied from the design element by element.
- The design runtime turns `style-hover` into a class with `:hover{… !important}`. `app.css` does the same with one `hv-*` class per hover style.
- Figtree loads from Google Fonts in `index.html`, as in the design.
- Icons are still `@tabler/icons-react` inside the `.ti` metric wrapper.

### Deliberate differences from the prototype

- No "Skip to Sunday night (prototype)" link, and no `support.js`.
- "Send to X" and "Start Wednesday" use a single space. The design runtime renders each `{{ }}` value as its own flex item, which adds the flex gap after "Send to" and "Start". These are the only two places in the design where that happens.

### What changed compared with the original port's UI

- No affection chips. The reaction portrait is the only signal during the week.
- The People screen became the profile popout.
- The ending tag pluralises ("1 heart").
- The creation sliders update on every input.

### Verification

Run in headless Chromium at 1280×800 and 1100×720:

- **Setup.** The prototype and the production build were driven in lockstep through four scripted weeks: Nyx, Goldie, Rhea, and a Nyx-chasing week that ends in Rhea's confrontation. Both used the same seed. On the prototype page, `engine.js` drew from its own seeded stream, because the page's other scripts also call `Math.random`.
- **Coverage.** Each week covered every scene, evenings, sub-lists, Chirp likes, the summary, the ask-out, the confrontation, the recap and "Play again".
- **Result.** Every screenshot pair matches apart from icon antialiasing (SVG vs webfont, at most about 1,300 pixels). The exception is the end-of-day summary, which also differs by the removed skip link (up to about 1,700 pixels).
- **Hover.** Hover states matched as well.

