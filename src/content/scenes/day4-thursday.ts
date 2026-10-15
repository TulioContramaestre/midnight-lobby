import { choice, narrate, say, scene, sequence, tiered } from '@/content/helpers'
import type { Scene } from '@/content/types'

export const thursday: Scene[] = [
  scene({
    id: 'd4-mid',
    title: 'Mid',
    day: 3,
    slot: 0,
    cast: ['rhea', 'nyx'],
    lines: [
      say('rhea', "Nyx told the whole server you're “mid.” Are you going to let that slide?"),
      say('nyx', 'i said what i said.'),
    ],
    choices: [
      sequence('Wait, did she really?? I thought we were cool, Nyx... :(', { nyx: -1, goldie: 1, rhea: -2 }, [
        [
          say('rhea', 'Pathetic.'),
          say('nyx', 'lmao.'),
        ],
        [
          say('rhea', 'Grow a spine.'),
          say('nyx', 'see. mid.'),
        ],
      ]),
      sequence('she can think what she wants.', { nyx: 2, goldie: 0, rhea: -1 }, [
        [
          say('nyx', "...ok that's actually kinda cool. i mean. whatever."),
          say('rhea', 'Boring.'),
        ],
        [
          say('nyx', 'unbothered. respect.'),
          say('rhea', "Silence isn't strength."),
        ],
      ]),
      sequence("Nyx. Private call. Now. Rhea, I've got this.", { nyx: -1, goldie: 0, rhea: 2 }, [
        [
          say('rhea', "Now that's more like it."),
          say('nyx', '...fine. calling.'),
        ],
        [
          say('rhea', 'Good. Handle it.'),
          say('nyx', 'ugh. ok. call me i guess.'),
        ],
      ]),
    ],
  }),
  scene({
    id: 'd4-the-1v1',
    title: 'The 1v1',
    day: 3,
    slot: 1,
    cast: ['kai'],
    lines: [
      narrate("Kai, the server's second-ranked Spikefall player, tags you in #general in front of everyone."),
      say('kai', "Rhea's duo slot is mine by Sunday. Unless you think you can take me in a 1v1? Didn't think so."),
    ],
    choices: [
      choice("Dude, you're way better than me. I'd get destroyed.", { kai: 2, rhea: -1 }, [
        'At least you know your place.',
        'Smart. Stay humble.',
      ], "Rhea leaves a single “lol” under his message. It isn't for him."),
      sequence('Name the time. Loser stays out of her DMs.', { kai: -2, rhea: 1 }, [
        [
          narrate('You win 3–1. Kai leaves without typing gg.'),
          narrate('Rhea pins the clip in #highlights.'),
        ],
        [
          narrate('You win 3–2 on the last round. The server chat explodes.'),
          say('kai', '...Lag. That was lag.'),
        ],
      ]),
      choice('not doing your little 1v1.', { kai: 1 }, ['Forfeit accepted.', 'Scared. Noted.']),
    ],
  }),
  tiered({
    id: 'd4-goldies-rough-night',
    title: "Goldie's rough night",
    day: 3,
    slot: 2,
    who: 'goldie',
    low: {
      lines: [
        say('goldie', "everyone's fighting and i hate it. i just want everyone to be friends. is it my fault?? it feels like it's my fault"),
      ],
      choices: [
        choice("I'll fix it. Tomorrow everyone's in one lobby, no excuses.", { goldie: 1 }, [
          'ok... u always know what to do',
          "u'd do that?? ok. thank u",
        ]),
        choice("it'll blow over.", { goldie: -1 }, [
          'yeah... probably.',
          "ok. i'll just. wait it out then.",
          'right. sorry for bothering u',
        ]),
        choice('Hey. None of this is your fault. You matter way more than this drama. Want to call?', { goldie: 2 }, [
          'yes please. ...thank you. really.',
          "...i didn't know i needed to hear that.",
          'calling!! (crying a little)',
        ], 'You talk for two hours. She falls asleep mid-sentence.'),
      ],
    },
    mid: {
      lines: [
        say('goldie', "everyone's fighting again. ur the only person i wanted to talk to about it"),
      ],
      choices: [
        choice('ugh, drama. anyway.', { goldie: -2 }, ['oh. ok. sorry.', 'right. never mind lol', '...anyway. yeah.']),
        choice("I'm right here. Tell me everything, I'm not going anywhere.", { goldie: 2 }, [
          'ok. ok. thank u. starting from the beginning',
          'u always make it better. always',
          "i'm sending a voice memo. it's 9 minutes. sorry",
        ]),
        choice("Give me names. I'll sort it out tomorrow.", { goldie: 1 }, [
          'ur like my knight. a gamer knight',
          "ok but don't be scary about it!!",
        ]),
      ],
    },
    high: {
      lines: [
        say('goldie', "i don't even care about the fighting anymore. i just wanted to hear ur voice"),
      ],
      choices: [
        choice("Then I'm calling. Right now. Pick up.", { goldie: 2 }, [
          'picked up before it even rang lol',
          "hiiiii. ok i'm better already",
          "ur voice fixes everything. it's science",
        ]),
        choice('lol ur so dramatic', { goldie: -2 }, [
          'oh. ok. haha. yeah.',
          'that kinda hurt ngl',
          'never mind. goodnight.',
        ]),
        choice("Calling. And tomorrow nobody's fighting. I promise.", { goldie: 1 }, [
          'u promise?? ok. i believe u',
          'my hero. my weird gamer hero',
        ]),
      ],
    },
  }),
]
