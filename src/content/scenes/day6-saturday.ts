import { nyxLine } from '@/content/characters/love-interests/nyx/lines'
import { choice, narrate, say, scene, tiered } from '@/content/helpers'
import type { Scene } from '@/content/types'

export const saturday: Scene[] = [
  tiered({
    id: 'd6-suspicious-timing',
    title: 'Suspicious timing',
    day: 5,
    slot: 0,
    who: 'nyx',
    low: {
      lines: [
        say('nyx', nyxLine),
      ],
      choices: [
        choice("Nyx, you're the only one I care about, I swear!!", { nyx: -2 }, [
          'whoa. calm down. i was barely asking.',
          'oh no. not the speech.',
          'ok that was a lot. bye.',
        ]),
        choice('You care. Just admit it.', { nyx: 0 }, ['...no comment.', 'lol. no.', 'admit nothing. ever.']),
        choice('noted.', { nyx: 2 }, [
          "noted. ...lol. ok you're cool.",
          "that's it? ...ok respect.",
          'lmao. ok fine. you win.',
        ]),
      ],
    },
    mid: {
      lines: [
        say('nyx', nyxLine),
        say('nyx', '...anyway. what r u doing tmrw.'),
      ],
      choices: [
        choice('noted. and nothing yet.', { nyx: 2 }, [
          'nothing yet. ok. interesting.',
          'cool. keep it that way. maybe.',
          "ok. don't make plans. i mean. whatever.",
        ]),
        choice("Why?? Do you want to hang out?? I'm free ALL day!!", { nyx: -2 }, [
          'forget i asked.',
          'too fast. way too fast.',
          'the enthusiasm is scaring me.',
        ]),
        choice("Depends who's asking.", { nyx: 0 }, ['lol. me. obviously.', "don't be weird."]),
      ],
    },
    high: {
      lines: [
        say('nyx', nyxLine),
        say('nyx', "...ok fine. maybe i care a little. don't make it a thing."),
      ],
      choices: [
        choice('not making it a thing. ...i care too.', { nyx: 2 }, [
          '...ok. cool. cool cool.',
          "that's. ok. good. i'm logging off to scream.",
          'fine. we both care. gross.',
        ]),
        choice("OMG Nyx admitted she cares!! I'm screenshotting this!!", { nyx: -2 }, [
          'delete it. DELETE IT.',
          'i take it back. all of it.',
          "this is why i don't say things.",
        ]),
        choice("Too late. It's a thing now.", { nyx: 1 }, ["...ugh. fine. it's a thing.", 'bossy. ...ok.']),
      ],
    },
  }),
  scene({
    id: 'd6-the-40-slide-plan',
    title: 'The 40-slide plan',
    day: 5,
    slot: 1,
    cast: ['dex'],
    lines: [
      narrate('Dex, a sweet but very intense guy, messages you.'),
      say('dex', "bro i need help. i'm confessing to goldie tomorrow with a 40-slide powerpoint. do you think she'll like it??"),
    ],
    choices: [
      choice("She's with me, man. Sorry.", { dex: -1 }, [
        "oh. ok. ...she hasn't said that though, right?",
        "we'll see, i guess.",
      ]),
      choice('Honestly? Skip the slides. Just be real with her.', { dex: 1, theo: 1, benji: 1 }, [
        "bro you're a real one. thank you.",
        'ok. no slides. just me. terrifying.',
      ], 'Word gets around that you helped your own competition. People respect it.'),
      choice('Bro, she told me she hates PowerPoints.', { dex: -2, theo: -2, benji: -1 }, [
        'WHAT. deleting it. all 40 slides.',
        'NO. i spent 9 hours on transitions.',
      ], "Theo was in the group DM. He knows that's not true."),
    ],
  }),
  tiered({
    id: 'd6-the-ultimatum',
    title: 'The ultimatum',
    day: 5,
    slot: 2,
    who: 'rhea',
    low: {
      lines: [
        say('rhea', "The week ends tomorrow. I don't wait around for anyone. So, are you mine or not?"),
      ],
      choices: [
        choice("we'll see.", { rhea: -1 }, ["Then maybe I won't be there to see.", "We'll see? Cute."]),
        choice('Of course!! Anything you want, whenever you want!!', { rhea: -2 }, [
          "Too easy. I don't want easy.",
          "Desperation isn't a personality.",
        ]),
        choice("Wrong question. You're mine. Tomorrow, 8pm. Don't be late.", { rhea: 2 }, [
          '...Okay. 8pm.',
          'Hm. ...Fine. 8pm.',
        ], 'For the first time all week, she logs off without having the last word.'),
      ],
    },
    mid: {
      lines: [
        say('rhea', "Tomorrow's Sunday. I'm not waiting around. Convince me."),
      ],
      choices: [
        choice("Please, just give me one chance, I'll do anything!!", { rhea: -2 }, [
          "Anything? That's the problem.",
          'Begging. Wrong answer.',
        ]),
        choice('if it happens it happens.', { rhea: -1 }, [
          "That's not convincing. That's a weather report.",
          'Riveting.',
        ]),
        choice("I don't convince. Tomorrow, 8pm. Be ready.", { rhea: 2 }, [
          "...You don't convince. Noted. I'll be ready.",
          "Fine. 8pm. Don't you dare be late.",
        ], 'She changes her status to “busy Sunday night.”'),
      ],
    },
    high: {
      lines: [
        say('rhea', "Tomorrow's Sunday. I already know my answer. Do you know yours?"),
      ],
      choices: [
        choice("I knew mine on Tuesday. 8pm. Don't be late.", { rhea: 2 }, [
          '...Tuesday. Okay. 8pm.',
          'You remember Tuesday. Good. 8pm.',
        ], "She doesn't log off for another hour. She just sits in the lobby, idle."),
        choice('maybe.', { rhea: -2 }, ['Maybe. ...Wow. Okay.', "You're lucky I don't block for less."]),
        choice("Yes yes yes, I'll be there whenever you want!", { rhea: -1 }, [
          'Whenever I want is 8pm. Relax.',
          'Calm down. I already said yes in my head.',
        ]),
      ],
    },
  }),
]
