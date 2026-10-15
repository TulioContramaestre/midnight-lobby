import { choice, narrate, say, scene, sequence } from '@/content/helpers'
import type { Scene } from '@/content/types'

export const friday: Scene[] = [
  scene({
    id: 'd5-game-night',
    title: 'Game night',
    day: 4,
    slot: 0,
    cast: ['rhea', 'goldie', 'nyx'],
    lines: [
      narrate('Game night. All three are in the lobby for the first time since the drama.'),
      say('rhea', 'Someone pick the game. Not you, Goldie.'),
      say('goldie', 'HEY!! Petal Valley is a real game!!'),
      say('nyx', "whatever. i'll play anything."),
    ],
    choices: [
      sequence("don't care. someone else pick.", { nyx: 1, goldie: 0, rhea: -2 }, [
        [
          say('rhea', "Spineless. I'll pick then."),
        ],
        [
          say('rhea', 'Wow. Leadership of a houseplant.'),
          say('nyx', 'lol same tbh'),
        ],
      ]),
      sequence("Goldie's pick! She's been waiting all week!", { nyx: -1, goldie: 2, rhea: -1 }, [
        [
          say('goldie', 'I LOVE U. i mean. i love this choice.'),
          say('nyx', 'cringe but ok'),
        ],
        [
          say('goldie', 'MY PICK?? best night ever!!'),
          say('rhea', "Unbelievable. We're farming turnips."),
        ],
      ]),
      sequence("Vanguard Protocol. Goldie, Rhea, you're with me. Nyx, carry the other team.", { nyx: 0, goldie: 1, rhea: 1 }, [
        [
          say('rhea', 'Finally, a man with a plan.'),
          say('nyx', "cool, so i'm losing tonight."),
        ],
        [
          say('rhea', 'Good call.'),
          say('goldie', "yay i'm with u!!"),
        ],
      ]),
    ],
  }),
  scene({
    id: 'd5-live-on-stream',
    title: 'Live on stream',
    day: 4,
    slot: 1,
    cast: ['mika'],
    lines: [
      narrate("Mika, Nyx's best friend and co-streamer, pulls you onto her live stream. 2,400 viewers."),
      say('mika', "chat wants to know: is nyx actually as mean as she pretends? careful. she's watching."),
    ],
    choices: [
      choice("She's not mean. She just doesn't waste words.", { mika: 2, nyx: 1 }, [
        'CHAT. did you hear that. clip it.',
        "ok that's the most accurate thing anyone's said about her.",
      ], "Nyx types in chat: “...ok that's fair.”"),
      choice("I'm not here to talk about people who aren't on the call.", { rhea: 1 }, [
        'boooring. but respectable i guess.',
        'ok diplomat.',
      ]),
      choice("yeah she's kinda mean lol", { mika: -1, nyx: -2 }, [
        'oh no. oh no no no.',
        'you did NOT just say that on stream.',
      ], 'Nyx has left the chat.'),
    ],
  }),
  scene({
    id: 'd5-the-leaked-screenshot',
    title: 'The leaked screenshot',
    day: 4,
    slot: 2,
    cast: ['nyx', 'rhea', 'goldie'],
    lines: [
      narrate('Someone posts a screenshot of your late-night DMs in the group chat. The name is cropped out.'),
      say('rhea', "Interesting. Who's “the only one who gets you”?"),
      say('goldie', 'wait... who is it??'),
      say('nyx', 'lol. drama.'),
    ],
    choices: [
      sequence('I can explain!! Please nobody be mad at me!!', { nyx: -1, goldie: 1, rhea: -2 }, [
        [
          say('rhea', 'Explaining yourself to a group chat. Embarrassing.'),
        ],
        [
          say('rhea', "Nobody's mad. Yet. Keep talking."),
          say('goldie', "it's ok!! ...who was it tho"),
        ],
      ]),
      sequence("Yeah, that's mine. Got a problem with it? Whoever leaked it, speak up.", { nyx: 0, goldie: 0, rhea: 2 }, [
        [
          say('rhea', 'Owning it. Respect.'),
          say('nyx', "...it wasn't me btw."),
        ],
        [
          say('rhea', "That's how you handle a leak."),
          narrate('The leaker deletes the screenshot within a minute.'),
        ],
      ]),
      sequence("old screenshot. don't care.", { nyx: 2, goldie: -1, rhea: 0 }, [
        [
          say('nyx', 'unbothered king.'),
          say('goldie', 'oh... ok'),
        ],
        [
          say('nyx', "lmao he doesn't care. icon."),
          say('rhea', 'Dodging. Noted.'),
        ],
      ]),
    ],
  }),
]
