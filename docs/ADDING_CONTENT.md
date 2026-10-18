# Adding content

Everything the player reads lives in `src/content`. The engine (`src/engine`) never names a specific character, scene or game. It reads everything through the registry. Adding a character, a scene or an evening activity therefore mostly means adding or editing files under `src/content`.

The desktop + browser UI has two exceptions, both from the design:

- **Where a scene happens.** `src/app/session/locations.ts` maps every scene title to a channel (`ch:general`) or a DM (`dm:goldie`, `dm:group`). Sunday's ask-out maps to `pick`, which opens the ask-out modal.
- **Per-character styling.** `src/ui/theme.ts` holds each character's name colour (`NAMECOL`) and profile banner (`BANNER`), plus each love interest's status dot and line (`STATUS`).

`src/app/session/__tests__/locations.test.ts` fails if a scene or love interest is missing from these tables.

This guide covers the basics, then three worked examples:

1. [A new game in the evening list](#example-1-a-new-game-in-the-evening-list)
2. [A scene that only appears after an earlier choice](#example-2-a-scene-that-only-appears-after-an-earlier-choice)
3. [A fourth love interest](#example-3-a-fourth-love-interest)

## The basics

### Where things live

| What | Where |
|---|---|
| Love interests | `characters/love-interests/<id>/`, one folder each |
| Best friends and other supporting characters | `characters/supporting/<id>.ts` |
| Rivals | `characters/rivals/<id>.ts` |
| Scenes | `scenes/day<N>-<weekday>.ts` |
| Evening games and shows | `activities/games.ts` and `activities/watch.ts` |
| Pfp and sleep-call milestones | `activities/milestones.ts` |
| Character creation | `creation/` |
| End-of-week scoring | `scoring.ts` |
| Chirp like notes | `feedNotes.ts` |
| Which channel or DM a scene happens in | `src/app/session/locations.ts` (outside `src/content`) |
| Name colours, banners and statuses | `src/ui/theme.ts` (outside `src/content`) |

`registry.ts` collects all of it. The lists in `characters/index.ts`, `scenes/index.ts` and `activities/index.ts` decide what is included and in what order. The type definitions, with every field, are in `src/content/types.ts`.

### Days, slots and ids

- **Days.** A week has 7 days. Each day has 3 story slots and then the evening. In code, `day` is 0-based (Monday is `day: 0`) and `slot` is 0, 1 or 2.
- **Scene ids** follow `d<day>-<slug>` with a 1-based day, for example `d4-the-1v1` for Thursday.
- **Character ids** are short lowercase strings (`nyx`, `theo`, `kai`). They are used in scene casts, speakers, affection deltas and relationships.

### Helpers for writing scenes

`content/helpers.ts` has short forms for the common shapes:

| Helper | What it makes |
|---|---|
| `say(id, text)` | A line spoken by a character |
| `narrate(text)` | A narration line |
| `choice(text, deltas, replies, narration?)` | A choice that changes affection. One reply is picked at random and spoken by the scene's first cast member. The optional narration follows it. |
| `sequence(text, deltas, options)` | A choice whose reaction is one of several multi-line exchanges, picked at random |
| `pickDate(id, text)` | Sunday's final choice: ask this love interest out |
| `scene({...})` | A scene with one version. Optional `when` and `priority` make it replace a slot's usual scene only in some playthroughs. |
| `tiered({...})` | A one-girl scene with `low`, `mid` and `high` versions, picked by her affection when the scene loads |

`text` can be a plain string or a function of the game state, for example `(ctx) => ctx.slept.length >= 2 ? '…' : '…'`. Function lines are evaluated when the line is posted to the chat, and the posted text doesn't change after that.

### How a slot picks its scene

For each day and slot, the scheduler shows the scene with the highest `priority` (default 0) whose `when` condition passes. Shipped content has exactly one scene per slot. Example 2 shows how to add a scene that replaces the default only in some playthroughs.

### Randomness

All randomness comes from a seeded generator stored in the game state, so a seed always replays the same game. Code in content that needs randomness, such as an activity's `narrate`, receives an `rng`. Use only `rng.next()`, `rng.int(n)` and `rng.pick(list)`, and never `Math.random()`.

### Checking your work

- **`npm test`** runs the content validator (`content/validate.ts`) along with the other tests. The validator checks, among other things:
  - every character id exists;
  - every love interest has all her lines;
  - every activity covers every love interest;
  - every day and slot has exactly one winning scene, whatever the affection levels and flags its scenes check.
- **`npm run typecheck`** catches missing or misspelled fields.
- **`npm run dev`** lets you play it.

Some tests pin the shipped content exactly as it was ported from the original game: counts, menu order, feed order, starting affection, and the like notes. These live in `src/content/__tests__/parity.test.ts` and `src/engine/__tests__/real/`. When you add content on purpose, some of them will fail; update their expected values. Each example below lists the ones it breaks.

## Example 1: a new game in the evening list

Games live in `activities/games.ts`. Add an entry to the `games` array; its position in the array is its position in the "Queue a game" menu.

```ts
export const TRACKS = ['Rainbow Ramp', 'Mochi Mountain', 'Neon Rift Speedway']

export const games: Activity[] = [
  // ...the existing games
  {
    id: 'kart',
    mode: 'queue',
    name: 'Turbo Paws Kart',
    desc: 'Chaotic kart racer. Eight racers, far too many banana peels.',
    effects: { nyx: 1, goldie: 2, rhea: -1 },
    reactions: {
      nyx: ['i will blue-shell u and i will not apologize.', 'kart games are just friendship tests. u will fail.'],
      goldie: ['I PICKED THE CORGI KART!!', "u can be on my team!! there are no teams but u can be on it!!"],
      rhea: ['There is no skill in this game. Only luck.', "I'm first. Stay behind me."],
    },
    narrate: (rng) =>
      rng.next() < 0.5
        ? `You finish ${rng.pick(['1st', '2nd', '3rd'])} on ${rng.pick(TRACKS)}. She finishes right behind you.`
        : `A banana peel on the final lap of ${rng.pick(TRACKS)} drops you to ${4 + rng.int(5)}th.`,
  },
]
```

What each field does:

- **`mode`** is the evening menu it appears in: `'queue'` (Queue a game) or `'watch'` (Watch something). To add a show instead, add the entry to `watch` in `activities/watch.ts`.
- **`name` and `desc`** are the menu button's title and subtitle.
- **`effects`** is how much each girl's affection changes when you play this with her. Only the girl you are with is affected.
  - Every love interest needs an entry, even if it's 0. The validator reports any that are missing.
  - A positive value also adds one of her `eveningLines.queue` lines for her current tier.
- **`reactions`** is her opening line. One is picked at random, and every love interest needs at least one.
- **`narrate`** returns the narration line in the middle of the exchange. It may draw from `rng` as much as it likes.

You don't need to do anything for the rival penalty: her rival's −1 for an evening spent with her is applied automatically.

**Tests to update:** `parity.test.ts` › "activities", and `real/evening.test.ts` › "menu labels". Both list the games by name.

## Example 2: a scene that only appears after an earlier choice

Suppose that beating Kai in Thursday's 1v1 should lead to a rematch on Friday, in place of Friday's second scene. That takes two steps: a choice that sets a flag, and a scene that only applies when the flag is set.

### 1. Set a flag in the earlier choice

The helpers only cover affection changes, so write the choice out in full. This is the second choice of `d4-the-1v1` in `scenes/day4-thursday.ts`. It does what `sequence(...)` did before, plus a `setFlag` effect:

```ts
{
  text: 'Name the time. Loser stays out of her DMs.',
  effects: [
    { type: 'affection', deltas: { kai: -2, rhea: 1 } },
    { type: 'setFlag', flag: 'beat-kai' },
  ],
  reaction: {
    kind: 'sequenceOf',
    options: [
      [
        narrate('You win 3–1. Kai leaves without typing gg.'),
        narrate('Rhea pins the clip in #highlights.'),
      ],
      [
        narrate('You win 3–2 on the last round. The server chat explodes.'),
        say('kai', '...Lag. That was lag.'),
      ],
    ],
  },
},
```

A flag is any string. `setFlag` sets it to `true` unless you give a `value`, which can be a boolean or a number.

### 2. Add the scene, gated on the flag

In `scenes/day5-friday.ts`, add a scene for the same day and slot as the one it replaces (`day: 4, slot: 1`, "Live on stream"). Give it a `when` condition and a higher `priority`:

```ts
scene({
  id: 'd5-kais-rematch',
  title: "Kai's rematch",
  day: 4,
  slot: 1,
  cast: ['kai', 'rhea'],
  when: { flag: 'beat-kai' },
  priority: 1,
  lines: [
    narrate('Kai reposts your 1v1 clip in #general. Caption: “rematch. tonight. no lag this time.”'),
    say('kai', 'Best of five. If I win, you stop queuing with Rhea.'),
    say('rhea', "Don't take the bait."),
  ],
  choices: [
    choice('Fine. Best of five.', { kai: -1, rhea: -1 }, ['You got lucky once.', "Let's see it, then."], 'You win 3–2. Rhea leaves you on read.'),
    choice("I already beat you. I don't need to do it twice.", { kai: 1, rhea: 2 }, ['...Coward.', 'Enjoy it while it lasts.']),
    choice('Only if Rhea plays too. 2v2.', { kai: -2, rhea: 1 }, ["That's not how a 1v1 works.", 'Fine. Bring her. I still win.']),
  ],
}),
```

How the slot is chosen:

- **With the flag set**, both scenes are candidates for Friday's second slot, and the rematch wins because its priority is higher.
- **Without the flag**, only "Live on stream" qualifies.
- **The validator tries each combination** of the flag and affection values that the slot's scenes check. It fails if a slot ever ends up with no scene, or with two scenes at the same priority, and names the combination. For example: `Day 4 slot 1: "d5-live-on-stream" and "d5-kais-rematch" both apply with the same priority when beat-kai = true`.

Conditions can be combined:

- `{ all: [...] }`, `{ any: [...] }` and `{ not: ... }` combine other conditions.
- `{ affection: { who: 'rhea', gte: 5 } }` and `{ tier: { who: 'rhea', is: 'high' } }` check how a character feels.
- `{ day: { gte: 3 } }` checks the day.

The engine also maintains some flags itself, so you can gate on them without any `setFlag`:

- `slept:<id>`: a sleep call happened with that girl.
- `pfp:<id>`: you matched pfps with her at some point.
- `matched:<id>`: your pfp currently matches hers.

The validator can't tell whether any choice ever sets a flag, so a misspelled flag name just means the scene never appears. A short test catches that:

```ts
import { expect, it } from 'vitest'
import { registry } from '@/content/registry'
import { createInitialState } from '@/engine/initialState'
import { createReducer } from '@/engine/reducer'
import type { Action, GameState } from '@/engine/types'

const reducer = createReducer(registry)

function playToFriday(choiceIn1v1: number) {
  let s: GameState = createInitialState(registry, 1)
  const run = (a: Action) => (s = reducer(s, a))
  run({ type: 'goToCreate' })
  run({ type: 'setName', name: 'tester' })
  run({ type: 'begin' })
  while (!(s.day === 4 && s.slot === 1)) {
    if (s.phase === 'evening') run({ type: 'nextDay' })
    else if (s.phase === 'react') run({ type: 'continue' })
    else run({ type: 'choose', index: s.scene?.sceneId === 'd4-the-1v1' ? choiceIn1v1 : 0 })
  }
  return s
}

it('swaps in the rematch only after beating Kai', () => {
  expect(playToFriday(1).scene?.sceneId).toBe('d5-kais-rematch')
  expect(playToFriday(0).scene?.sceneId).toBe('d5-live-on-stream')
})
```

The validator checks each slot only against the flags and characters that slot's scenes mention. Adding events or characters elsewhere in the week therefore doesn't slow it down. Within a single slot, each extra flag doubles the work, which only matters if one slot depends on many flags at once.

Finally, say where the scene happens. Kai reposts in #general, so add it to `LOC` in `src/app/session/locations.ts`:

```ts
"Kai's rematch": 'ch:general',
```

**Tests to update:** `parity.test.ts` › "scenes, variants and choices", which counts the scenes. `locations.test.ts` fails until the `LOC` entry exists.

## Example 3: a fourth love interest

This example adds Juno, a wolf girl, along with her best friend Wren and her rival Cole.

### 1. Create her folder

Copy `characters/love-interests/goldie/` to `characters/love-interests/juno/`, then rewrite each file. Every export is typed, so the type checker shows you what each one needs.

| File | What it holds | What the validator requires |
|---|---|---|
| `profile.ts` | Name, handle, type, age, name colour (`tint`), bio | Every field filled in |
| `portrait.ts` | Palette and feature choices for her portrait | Present |
| `avatarTheme.ts` | Ears and colours for the matching-pfp avatar | Present |
| `eveningLines.ts` | Lines per evening mode (`queue`, `watch`) and tier (`low`, `mid`, `high`) | At least one line for every mode and tier |
| `milestones.ts` | Pfp gain and lines (`mid`, `high`); sleep-call gain and lines | At least one line in each list |
| `feed.ts` | Seven posts, days 0–6 (a string, or `{ warm, cold }`, picked by her affection that day), plus like replies | A post for every day and at least one reply |
| `confrontation.ts` | What she says if she finds out you were with someone else, and your three possible answers | Lines, choices and replies |
| `endings.ts` | Endings `good`, `friends` and `left`; epilogues `high`, `mid` and `low` | All six |
| `index.ts` | Puts it together and names her best friend and rival | See below |

`index.ts` is the same as Goldie's, apart from the id and the two relationships:

```ts
export const juno: LoveInterest = {
  kind: 'loveInterest',
  id: 'juno',
  ...profile,
  bestFriend: 'wren',
  rival: 'cole',
  portrait,
  avatarTheme,
  eveningLines,
  milestones,
  feed,
  confrontation,
  endings,
  epilogue,
}
```

The confrontation's opening line can describe exactly what she found out:

```ts
say('juno', (ctx) => 'wren told me about ' + ctx.describeOffenses('juno').toLowerCase() + '. explain. fast.'),
```

Here, `describeOffenses` returns text such as "the sleep call with Nyx and the matching pfps with Goldie".

The portrait renderer combines a fixed set of features, listed in `PortraitSpec` in `src/content/types.ts`. Juno reuses the `dog` ears with a grey palette. A new ear shape or accessory would need drawing code in `src/ui/art/Portrait.tsx`.

### 2. Add her best friend and rival

```ts
// characters/supporting/wren.ts
export const wren: Supporting = {
  kind: 'supporting',
  id: 'wren',
  name: 'Wren',
  handle: '@wren.zip',
  role: "Juno's speedrun co-op partner",
  avatar: { skin: '#E8B98F', hair: '#993C1D', style: 'long', bg: '#E1F5EE', shirt: '#0F6E56', acc: 'earring' },
  posts: [{ day: 3, order: 2, text: 'juno hit a pb and texted someone else before me. interesting.' }],
}

// characters/rivals/cole.ts
export const cole: Rival = {
  kind: 'rival',
  id: 'cole',
  name: 'Cole',
  handle: '@cole.any',
  role: 'Speedrun rival, wants Juno',
  avatar: { skin: '#C68B59', hair: '#2C2C2A', style: 'buzz', bg: '#D3D1C7', shirt: '#444441', acc: 'none' },
  target: 'juno',
  rivalEnding: 'Cole asked Juno to co-run a marathon. She said yes before he finished asking.',
  posts: [{ day: 2, order: 2, text: 'new any% route. sharing it with exactly one person.' }],
}
```

- **The rival's `target` must be her.** Each love interest needs a rival of her own.
- **Posts are optional.** `order` sets where a post goes among the other characters' posts that day, so it must be unique within its day.

### 3. Register them

In `characters/index.ts`, import the three characters and add them to the lists:

```ts
export const loveInterests: LoveInterest[] = [nyx, goldie, rhea, juno]
export const supporting: Supporting[] = [mika, theo, jade, benji, wren]
export const rivals: Rival[] = [ezra, dex, kai, cole]
```

The order of `loveInterests` is the order of the intro, the evening buttons and the ending's "Meanwhile". The feed shows newest first, so it lists the girls in reverse.

### 4. Let the validator list what is missing

Run `npm test`. The validator now fails with one line per gap, for example:

```
Activity "spike": no effect for "juno"
Activity "spike": no reactions for "juno"
Activity "lanes": no effect for "juno"
...
```

Every evening activity needs to know how she feels about it. Add a `juno` entry to `effects` and `reactions` in each one in `games.ts` and `watch.ts`:

```ts
effects: { nyx: 2, goldie: 0, rhea: 1, juno: 2 },
reactions: {
  // ...
  juno: ['spikefall? fine. i already know every lineup.'],
},
```

### 5. Make her someone you can ask out

The validator doesn't require this, but without it nobody can pick her at the end of the week. Add her to Sunday's last scene, `d7-who-do-you-choose` in `scenes/day7-sunday.ts`. Add her to the scene's `cast`, and add a choice:

```ts
pickDate('juno', 'Message Juno: “dinner. 8pm. you pick the place, i pick the route.”'),
```

### 6. Give her a name colour, banner and status

In `src/ui/theme.ts`, add her to `NAMECOL` (her name in chat, lists and the recap), `BANNER` (her profile banner, intro card and recap header) and `STATUS` (the dot colour and status line in the member list and DM list). Wren and Cole can have a `BANNER` entry too, for their DM profile panels. Without one, they get a neutral grey banner.

```ts
juno: 'oklch(0.78 0.11 185)', // NAMECOL
juno: 'oklch(0.45 0.09 185)', // BANNER
juno: ['oklch(0.72 0.17 150)', 'Online'], // STATUS
```

`locations.test.ts` › "per-character theme" fails until all three exist. The profile's `tint` and `tintFallback` fields are no longer used by the UI.

### What you get without extra work

- **Feed.** Her posts appear in Chirp each day, and liking them works.
- **Evenings.** She is in the evening list, with her own pfp and sleep-call milestones.
- **Confrontation.** If you ask her out after a sleep call or matching pfps with someone else, she confronts you with the lines in her `confrontation.ts`.
- **Scoring.** The end-of-week score uses Wren and Cole through the `bestFriend` and `rival` rules in `scoring.ts`.
- **Ending.** She gets a "Meanwhile" epilogue when you pick someone else, and Cole gets his rival ending.
- **Lobby and Chirp lists.** She appears in the intro, the member list, the evening pills, Chirp's "Who to watch" and the ask-out modal. Wren and Cole appear in the member list, and Cole in Chirp's "Competition" card.

Some things are still up to you:

- **Story scenes.** Existing scenes don't mention her. To give her scenes, either rewrite existing ones or add scenes that replace a slot under a condition, as in Example 2. Every day has exactly three slots.
- **Group DM.** The group chat is named "nyx, goldie, rhea" (`person()` in `src/ui/theme.ts`). Rename it if she should be in it.
- **First impressions.** The starting-affection effects in `creation/age.ts`, `creation/height.ts` and `creation/vibes.ts` don't include her, so she starts at 0 unless you add her there.
- **The like note's wording.** It names the other girls joined with " and ", as the original game did: "Liked. Nyx ↑ · Goldie and Rhea and Juno noticed ↓". To change that, edit the note text in `feedNotes.ts` and the engine code that fills in `{others}`.

**Tests to update:**

- `parity.test.ts` › "cast", "posts per day", "endings, epilogues and rival endings" and "evening, milestone, reply and confrontation lines".
- `real/creation.test.ts`: starting affection now includes `juno: 0`.
- `real/feed.test.ts`: Monday's feed order, Tuesday's posts and the like-note text.
