import type { Activity, ActivityMode } from '@/content/types'

export const queueMode: ActivityMode = {
  id: 'queue',
  menuLabel: 'Queue a game with {n}',
  prompt: 'What are you queuing with {n}?',
  icon: 'device-gamepad-2',
}

export const MAPS = ['Glasshouse', 'Bonehaven', 'Ascent Ridge', 'Saltwind Port', 'Neon Rift']

export const games: Activity[] = [
  {
    id: 'spike',
    mode: 'queue',
    name: 'Spikefall',
    desc: '5v5 tactical shooter. Plant the spike, hold the site.',
    effects: { nyx: 2, goldie: 0, rhea: 1 },
    reactions: {
      nyx: [
        "finally a real game. don't peek without me.",
        "ur crosshair placement is... acceptable. don't let it go to ur head.",
        "i'll entry. u trade. don't miss.",
      ],
      goldie: [
        "i don't know what a spike is but i'm planting it!!",
        "everyone's so quiet in this game it's scary lol",
        'i threw my flash at a wall and blinded myself >_<',
      ],
      rhea: [
        "Tactical. Good. Don't push alone.",
        'Call your utility. I want to hear every flash.',
        "Hold the angle. Don't you dare peek.",
      ],
    },
    narrate: (rng) =>
      rng.next() < 0.65
        ? `You win 13–${2 + rng.int(10)} on ${rng.pick(MAPS)}. ${rng.pick([
            'Your 1v3 clutch gets clipped.',
            'She tops the scoreboard by a mile.',
            'The enemy team rage-quits at match point.',
            'You defuse with 0.4 seconds left.',
          ])}`
        : `You lose ${9 + rng.int(3)}–13 on ${rng.pick(MAPS)}. ${rng.pick([
            'Overtime, so close.',
            'The enemy duelist was suspiciously good.',
            'She blames your teammates, not you.',
          ])}`,
  },
  {
    id: 'lanes',
    mode: 'queue',
    name: 'Arcanum Lanes',
    desc: '5v5 MOBA. Three lanes, one ancient to destroy.',
    effects: { nyx: 0, goldie: -1, rhea: 2 },
    reactions: {
      nyx: ['5v5 with randoms. my favorite way to lose faith in humanity.', "i'm mid. don't argue."],
      goldie: ['why is everyone yelling at me in all chat :(', "what's a jungle and why am i in it"],
      rhea: [
        'Ranked. Finally something worth my time.',
        "Ward the river. I'm not asking twice.",
        "You support. I carry. That's the arrangement.",
      ],
    },
    narrate: (rng) =>
      rng.next() < 0.6
        ? `Victory in ${22 + rng.int(18)} minutes. ${rng.pick([
            'She goes ' + (8 + rng.int(10)) + '/' + rng.int(4) + '/' + (4 + rng.int(12)) + ' in mid.',
            'You steal the Elder Wyrm with a perfect smite.',
            'You end on a backdoor while everyone else is fighting.',
            'Your bot lane stomps so hard the enemy surrenders at 20.',
          ])}`
        : `Defeat at ${26 + rng.int(16)} minutes. ${rng.pick([
            'Your top laner went 0/9 and blamed the jungler.',
            'They stole the Elder Wyrm.',
            'The surrender vote passed 4–1. She voted no.',
          ])}`,
  },
  {
    id: 'vanguard',
    mode: 'queue',
    name: 'Vanguard Protocol',
    desc: '6v6 hero shooter. Push the payload, stack ultimates.',
    effects: { nyx: 1, goldie: 1, rhea: 1 },
    reactions: {
      nyx: ["i'm playing the sniper. heal me or don't. idc.", 'no one ever peels for me. u better peel.'],
      goldie: ["I'M HEALER!! everyone stay alive for me!!", "i'll keep u alive no matter what!! (please stay near me)"],
      rhea: ["I'm tank. You follow my engage.", 'Hold your ultimate until I say. Not before.'],
    },
    narrate: (rng) =>
      rng.pick([
        `You push the payload through the last checkpoint with ${3 + rng.int(27)} seconds left.`,
        `Your ultimates combo and wipe the whole enemy team on ${rng.pick(['Kingsrow Tower', 'Nebula Dock', 'Ironvale'])}.`,
        `You lose in overtime after holding the last point for forty seconds.`,
        `Play of the game goes to her. She doesn't let you forget it.`,
        `You win ${1 + rng.int(2)}–0 and get carried by a random healer named “mom.”`,
      ]),
  },
  {
    id: 'omni',
    mode: 'queue',
    name: 'Omniverse Clash',
    desc: 'Superhero team shooter with team-up abilities.',
    effects: { nyx: 1, goldie: 2, rhea: 0 },
    reactions: {
      nyx: ["i'm the shadow assassin. obviously.", 'team-up abilities are cringe. ...ok ours is cool.'],
      goldie: [
        "LET'S DO A TEAM-UP!! my hero buffs yours!!",
        'i picked the bubbly healer with the robot dog!!',
        'our heroes are canonically best friends!!',
      ],
      rhea: ["Superheroes. Fine. I'm the villain.", "Comic book nonsense. ...I'm still winning."],
    },
    narrate: (rng) =>
      rng.pick([
        `You both pick heroes with a team-up ability and wipe the enemy team ${2 + rng.int(4)} times.`,
        `She heals you all match and you finish with ${15 + rng.int(25)} eliminations.`,
        `You get spawn-camped on ${rng.pick(['Neo Atlantis', 'Skyforge Citadel', 'the Moonbase'])}. She can't stop laughing.`,
        `Your team-up ultimate hits five people at once. The lobby goes silent.`,
      ]),
  },
  {
    id: 'petal',
    mode: 'queue',
    name: 'Petal Valley',
    desc: 'Co-op farming sim. Crops, festivals, fishing.',
    effects: { nyx: -1, goldie: 2, rhea: -1 },
    reactions: {
      nyx: [
        "i'm not farming turnips at midnight. ...ok one season.",
        "this is so peaceful i'm gonna fall asleep. not a compliment.",
      ],
      goldie: [
        "WE'RE FARMERS NOW!! i named our cow after u!!",
        "u water the left field and i'll water the right!!",
        'our farm is called Sunny Paws Ranch, no takebacks',
      ],
      rhea: ["There's no ranked mode. Why are we here.", "I optimized your crop layout. You're welcome."],
    },
    narrate: (rng) =>
      rng.pick([
        `You plant ${10 + rng.int(40)} turnips. She names one after you.`,
        `You finally fix the bridge to the east meadow.`,
        `The harvest festival happens. She wins the pie contest. You lose the fishing contest to a child NPC.`,
        `You build a little bench by the river and just sit there for ten minutes.`,
      ]),
  },
]
