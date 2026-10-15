import { choice, narrate, say, scene, sequence, tiered } from '@/content/helpers'
import type { Scene } from '@/content/types'

export const tuesday: Scene[] = [
  tiered({
    id: 'd2-ranked-with-the-bunny',
    title: 'Ranked with the bunny',
    day: 1,
    slot: 0,
    who: 'rhea',
    low: {
      lines: [
        narrate('Rhea invites you to a ranked Arcanum Lanes match. Her profile has a title most players never reach.'),
        say('rhea', "So you're the one everyone keeps whispering about. Prove you're not another guy who folds the second I look at him."),
      ],
      choices: [
        choice("Whatever you want! You're honestly the best player I've ever seen!", { rhea: -2 }, [
          'And there it is. Folded in one sentence.',
          "You're applying to be my fan, not my duo. Rejected.",
          "I've met furniture with more backbone.",
        ]),
        choice("Follow my calls. I'll show you what I am.", { rhea: 2 }, [
          "...Fine. Lead. Don't make me regret it.",
          'Hm. Okay. Show me.',
          "Bold. I'll allow it. Once.",
        ], 'You win the match. Rhea says nothing, but she sends a friend request.'),
        choice("don't really care what they whisper.", { rhea: 0 }, [
          'Detached. Not the worst. Not impressive either.',
          "Indifference isn't confidence. Learn the difference.",
          'Okay, mysterious. Queue up.',
        ]),
      ],
    },
    mid: {
      lines: [
        narrate("Rhea's invite pops up again. Her usual duo is offline."),
        say('rhea', "You again. My duo's offline. Don't read into it."),
      ],
      choices: [
        choice("Good. I'm taking his spot tonight. Permanently.", { rhea: 2 }, [
          "Permanently? ...We'll see how you play.",
          'Confident. I like that more than I should.',
          'Fine. Earn it.',
        ]),
        choice('*accepts the invite without saying anything*', { rhea: 0 }, [
          '...Hello to you too.',
          "Silent type. Okay. Don't be silent on comms.",
        ]),
        choice("Lucky me!! I'll play support, whatever you need, I'm just happy you asked!!", { rhea: -2 }, [
          'Whatever I need is someone with a spine.',
          "Support. Of course you'd pick support.",
          "You're making this too easy. It's boring.",
        ]),
      ],
    },
    high: {
      lines: [
        narrate("It's not even 8pm and Rhea is already sitting in your lobby."),
        say('rhea', "I cleared my whole night for ranked with you. Don't mention it to anyone."),
      ],
      choices: [
        choice('Cool. Queue up.', { rhea: 1 }, [
          "Cool. ...Cool? That's all I get?",
          "Fine. But you're calling shots tonight.",
        ]),
        choice("That's so sweet!! Are you sure you want to waste your night on me??", { rhea: -2 }, [
          "Waste? Don't make me regret clearing it.",
          'Why are you shrinking? I picked you.',
          "Insecurity isn't cute. It's lag.",
        ]),
        choice("Already told everyone. You're my duo now, Rhea.", { rhea: 2 }, [
          '...You did WHAT. ...Okay. Fine. Yes.',
          'Bold. Annoyingly bold. Keep doing it.',
          "You're lucky I like that.",
        ]),
      ],
    },
  }),
  scene({
    id: 'd2-the-other-e-boy',
    title: 'The other e-boy',
    day: 1,
    slot: 1,
    cast: ['ezra'],
    lines: [
      narrate('A guy with painted nails and an all-lowercase username joins your voice channel.'),
      say('ezra', 'so ur the new guy nyx keeps mentioning. relax. she only does 2am calls with me.'),
    ],
    choices: [
      choice("Oh, my bad. I didn't know you two were a thing.", { ezra: 2 }, [
        "yeah. we're a thing. (we're not a thing yet.) (but we will be.)",
        'glad we understand each other.',
      ]),
      choice('cool story.', { ezra: -1, nyx: 1 }, ['...k.', 'wow. ok. rude.'], 'Later, Nyx DMs you: “heard u ignored ezra. iconic.”'),
      choice("Bet. Let's see who she's talking to by Sunday.", { ezra: -2 }, [
        '...whatever man.',
        "we'll see. (he sounds nervous.)",
      ], 'He leaves the call. His status changes to “do not disturb.”'),
    ],
  }),
  scene({
    id: 'd2-group-chat-incident',
    title: 'Group chat incident',
    day: 1,
    slot: 2,
    cast: ['nyx', 'goldie'],
    lines: [
      say('nyx', 'some people are SO loud in vc. like, my ears.'),
      say('goldie', 'wait... is that about me? :('),
      narrate('The group chat goes silent. Everyone is waiting to see what you say.'),
    ],
    choices: [
      sequence('lol ignore it', { nyx: 1, goldie: -1, rhea: 0 }, [
        [
          say('nyx', 'see, he gets it.'),
          say('goldie', '...ok.'),
        ],
        [
          say('nyx', 'finally someone normal.'),
          say('goldie', "oh. ok. i'll be quieter."),
        ],
      ]),
      sequence("Nyx, say it to her directly or drop it. We're not doing passive-aggressive here.", { nyx: -1, goldie: 1, rhea: 2 }, [
        [
          say('nyx', 'ugh. fine. dropped.'),
          narrate('Rhea, who was lurking, reacts to your message with a single crown.'),
        ],
        [
          say('nyx', '...ok. sorry goldie. whatever.'),
          say('goldie', 'thank u for sticking up for me!!'),
        ],
      ]),
      sequence("Goldie you're not loud, you're literally sunshine and we love you!!", { nyx: -1, goldie: 2, rhea: -1 }, [
        [
          say('goldie', "I'M CRYING. ok ur my favorite person"),
          say('nyx', 'gross.'),
        ],
        [
          say('goldie', "SUNSHINE?? ok i'm framing this message"),
          say('nyx', "i'm gonna throw up."),
        ],
      ]),
    ],
  }),
]
