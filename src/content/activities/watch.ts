import type { Activity, ActivityMode } from '@/content/types'

export const watchMode: ActivityMode = {
  id: 'watch',
  menuLabel: 'Watch something with {n}',
  prompt: 'What are you watching with {n}?',
  icon: 'device-tv',
}

export const watch: Activity[] = [
  {
    id: 'anime',
    mode: 'watch',
    name: 'An anime',
    desc: 'Start a new series together.',
    effects: { nyx: 2, goldie: 1, rhea: 0 },
    reactions: {
      nyx: [
        'no talking during the opening. rules.',
        "ok this studio's animation is insane. shh.",
        'this is my comfort show. judge it and ur dead.',
      ],
      goldie: ['the mascot is SO cute i need merch', "i'm crying at episode 2 is that normal"],
      rhea: ["The protagonist is weak. I'm rooting for the villain.", 'Fine. One episode. ...Three.'],
    },
    narrate: (rng) =>
      `You watch ${2 + rng.int(6)} episodes of ${rng.pick([
        'Starlight Requiem',
        'Blade of the Quiet Moon',
        'My Roommate Is a Dungeon Boss',
        'Ghost Shift',
      ])}. ${rng.pick([
        'You both skip the ending song every time.',
        "Neither of you says it, but you're hooked.",
        'She makes you promise not to watch ahead.',
      ])}`,
  },
  {
    id: 'horror',
    mode: 'watch',
    name: 'A horror movie',
    desc: 'Lights off, volume up.',
    effects: { nyx: 1, goldie: -1, rhea: 1 },
    reactions: {
      nyx: ["i'm not scared. ur scared.", 'the dog lives right?? ...not that i care'],
      goldie: [
        'why would she go in the BASEMENT',
        "i'm watching through my fingers. through ur voice actually",
        "that's it i'm sleeping with the lights on forever",
      ],
      rhea: ['I called the twist in minute four.', 'You flinched. I heard it.'],
    },
    narrate: (rng) =>
      `You watch ${rng.pick(['The Hollow Below', 'Room Zero', 'Static Bloom', 'Do Not Answer'])}. ${rng.pick([
        'Neither of you sleeps well after.',
        'She jumps at the same scare you do.',
        'The last jump scare gets you both.',
      ])}`,
  },
  {
    id: 'cozy',
    mode: 'watch',
    name: 'A cozy animated movie',
    desc: 'Blankets, snacks, happy endings.',
    effects: { nyx: 0, goldie: 2, rhea: -1 },
    reactions: {
      nyx: ['...ok the little robot is kinda cute.', "this is so wholesome i'm gonna be sick. (keep it on)"],
      goldie: [
        'I CRIED AT THE OPENING CREDITS',
        'the dog part. THE DOG PART.',
        'this is the best night of my life (again)',
      ],
      rhea: ['This is for children.', "I'm not crying. The room is dusty."],
    },
    narrate: (rng) =>
      `You watch ${rng.pick(['Paper Lanterns', 'The Little Lighthouse', 'Sprout and the Moon'])}. ${rng.pick([
        'You both rewind the best scene.',
        'She falls asleep before the credits.',
        'You end up quoting it all night.',
      ])}`,
  },
  {
    id: 'esports',
    mode: 'watch',
    name: 'Esports finals',
    desc: 'A pro Arcanum Lanes grand final.',
    effects: { nyx: 0, goldie: 0, rhea: 2 },
    reactions: {
      nyx: ['watching other ppl play games. wild hobby. ...that play was clean tho', "i'm only here for the drama"],
      goldie: ['which team are we rooting for!! the blue ones!!', "everyone's screaming so i'm screaming!!"],
      rhea: [
        "Watch their jungle pathing. That's how you win.",
        "That draft was a mistake. I'd have banned that hero.",
        "Someday that'll be us on that stage.",
      ],
    },
    narrate: (rng) =>
      `${rng.pick(['Team Nightjar', 'Crimson Vow', 'Zero Latency'])} wins ${rng.pick([
        '3–2 in a game-five thriller',
        '3–0, a clean sweep',
        '3–1 after a huge comeback',
      ])}. ${rng.pick(['You both lose your voices.', 'She predicts the winner before game one.', 'Chat spams your inside joke.'])}`,
  },
]
