import { choice, narrate, say, scene, tiered } from '@/content/helpers'
import type { Scene } from '@/content/types'

export const wednesday: Scene[] = [
  tiered({
    id: 'd3-2am-voice-chat',
    title: '2am voice chat',
    day: 2,
    slot: 0,
    who: 'nyx',
    low: {
      lines: [
        narrate('2:14am. Nyx is alone in a voice channel.'),
        say('nyx', "can't sleep. talk or don't. idc."),
      ],
      choices: [
        choice("Go to sleep. You have class tomorrow. I'm serious.", { nyx: -1 }, [
          "ok dad. ...you're not wrong tho.",
          'who invited the hall monitor',
          'wow. bossy. log off.',
        ]),
        choice('*joins, says nothing, puts on a lo-fi playlist*', { nyx: 2 }, [
          "this is nice. don't make it weird.",
          '...ok this playlist goes hard. who are you.',
          "i'll stay 5 more minutes. maybe 10.",
        ], 'You both stay in the call until sunrise. Neither of you says a word.'),
        choice("I'll stay up ALL night with you! Tell me everything about your feelings!", { nyx: -2 }, [
          "my feelings are that i'm logging off.",
          'no. absolutely not. goodnight.',
          'feelings? at 2am? with you? bold.',
        ]),
      ],
    },
    mid: {
      lines: [
        narrate('2:14am. Nyx is in a voice channel. Yours is the only name she invited.'),
        say('nyx', "oh it's u. ...i was kinda hoping u'd join."),
      ],
      choices: [
        choice("WAIT you were hoping I'd join?? That's the nicest thing anyone's ever said to me!!", { nyx: -2 }, [
          'and now i regret saying it.',
          'delete that from your memory.',
          "this is why i don't say things.",
        ]),
        choice('figured. move over.', { nyx: 2 }, [
          "lol. there's no 'over' in a voice call. ...stay tho.",
          'ok that was smooth. i hate it.',
          'fine. ur playlist this time.',
        ]),
        choice("Good. I'm here. Now tell me what's keeping you up.", { nyx: 0 }, [
          '...nothing. everything. idk.',
          "bossy. but ok. it's school stuff.",
        ]),
      ],
    },
    high: {
      lines: [
        narrate('2:14am. Your phone buzzes. Nyx is calling you directly.'),
        say('nyx', "can't sleep again. ...stay on with me?"),
      ],
      choices: [
        choice('yeah. not going anywhere.', { nyx: 2 }, [
          'good. ...i mean. ok.',
          '...thanks. seriously.',
          "i like that ur always here. don't let it go to ur head.",
        ]),
        choice('Kinda tired tbh. Maybe tomorrow.', { nyx: -2 }, [
          'oh. ok. never mind.',
          'right. forget i asked.',
          'cool. logging off.',
        ]),
        choice("Of course!! I'll stay forever!! You're my favorite person!!", { nyx: -1 }, [
          'ok forever is a lot. tonight is fine.',
          "...cringe. but i'll allow it once.",
        ]),
      ],
    },
  }),
  scene({
    id: 'd3-the-best-friend-talk',
    title: 'The best friend talk',
    day: 2,
    slot: 1,
    cast: ['theo'],
    lines: [
      narrate("Goldie's best friend Theo DMs you. His profile picture is a frog in a cowboy hat."),
      say('theo', "real talk. goldie is the nicest person on this server. if you're just messing around with her, i will know. what's your deal?"),
    ],
    choices: [
      choice('Mind your business, man.', { theo: -2, goldie: -1 }, [
        "oh it's my business now. i'm telling her you said that.",
        'wrong answer, buddy.',
      ]),
      choice("Honest answer? I'm still figuring it out, but I'm not going to play her.", { theo: 2 }, [
        '...ok. honest. i can work with honest.',
        "that's the first real answer anyone's given me.",
      ]),
      choice("Dude I'm literally obsessed with her, you HAVE to help me!!", { theo: 1, goldie: 1 }, [
        "that is... a lot. but at least it's sincere. fine.",
        'ok calm down romeo. but fine.',
      ]),
    ],
  }),
  tiered({
    id: 'd3-cookie-emergency',
    title: 'Cookie emergency',
    day: 2,
    slot: 2,
    who: 'goldie',
    low: {
      lines: [
        say('goldie', "I BAKED COOKIES SHAPED LIKE UR GAMERTAG!!! sending a pic!!! do u like them??? be honest!!! (lie if they're bad)"),
      ],
      choices: [
        choice("they're fine.", { goldie: -2 }, [
          'fine... fine is good! fine is... fine. ok.',
          "oh! fine! haha. ok. i'll do better!!",
          'fine is a compliment right?? right??',
        ]),
        choice("I'M FRAMING ONE. Nobody has ever done this for me. You're the best!!", { goldie: 2 }, [
          "AAAAA ok i'm baking a second batch. no i'm not taking questions",
          "FRAMING?? i'm gonna cry. i'm crying",
          'ok this is my new favorite day',
        ]),
        choice("Save me the biggest one. I'm picking it up tomorrow.", { goldie: 1 }, [
          "yes!! it's reserved!! guarding it with my life",
          'the biggest one has ur name on it. literally. in frosting',
        ]),
      ],
    },
    mid: {
      lines: [
        say('goldie', "i baked AGAIN!! this batch has a little heart on yours. only yours. (don't tell the others)"),
      ],
      choices: [
        choice("A HEART?? I'm keeping this secret forever. You're amazing!!", { goldie: 2 }, [
          "ok my tail is wagging so hard it's a hazard",
          "FOREVER?? ok i'm baking u a cake next",
          "eeeee ok i'm screaming into a pillow",
        ]),
        choice('Bring them to game night. Mine stays in your pocket till then.', { goldie: 1 }, [
          'yes!! guarding it!! nobody touches it!!',
          'ur so bossy i love it. i mean. ok!!',
        ]),
        choice('lol ok', { goldie: -2 }, ['oh. ok. haha. ok.', '...was the heart too much?', "i'll just. eat this one."]),
      ],
    },
    high: {
      lines: [
        say('goldie', "i made u a whole box. there's a note inside. read it when ur alone ok?? ok bye!!!"),
      ],
      choices: [
        choice('will read later maybe', { goldie: -2 }, [
          'oh. maybe. ok.',
          "...it's kinda important tho",
          'ok. no rush. (there was a rush)',
        ]),
        choice("Read it. I'm keeping it forever. Can I call you right now??", { goldie: 2 }, [
          'YES CALL ME. wait. let me fix my hair. ok call',
          'u read it already?? omg. ok. yes. call.',
          "i'm shaking. call me",
        ]),
        choice("Reading it now. Then you're telling me the rest in person.", { goldie: 1 }, [
          'in person?? ok. ok!! yes!!',
          "ur so confident it's not fair",
        ]),
      ],
    },
  }),
]
