import { choice, narrate, pickDate, say, scene, sequence } from '@/content/helpers'
import type { Scene } from '@/content/types'

export const sunday: Scene[] = [
  scene({
    id: 'd7-the-duos-warning',
    title: "The duo's warning",
    day: 6,
    slot: 0,
    cast: ['jade'],
    lines: [
      narrate("Jade, Rhea's duo partner for three seasons, finds you in an empty lobby."),
      say('jade', "rhea doesn't let people in. if she lets you in, don't make her regret it. so what are your intentions?"),
    ],
    choices: [
      choice('uh. idk. vibes?', { jade: -1 }, ['vibes. great. very reassuring.', 'wow. poetry.']),
      choice("I'll do whatever she wants, honestly.", { jade: -2, rhea: -1 }, [
        "that's exactly what she doesn't want.",
        "and that's why you'll lose.",
      ]),
      choice("I'm not here to get picked. I'm here to make it obvious.", { jade: 2, rhea: 1 }, [
        '...ok. i see it now.',
        'huh. she might actually like you.',
      ]),
    ],
  }),
  scene({
    id: 'd7-group-chat-meltdown',
    title: 'Group chat meltdown',
    day: 6,
    slot: 1,
    cast: ['goldie', 'nyx', 'rhea'],
    lines: [
      say('goldie', (ctx) =>
        ctx.slept.length >= 2
          ? "someone's been on sleep calls with more than one person in this server and i'm not naming names"
          : "some people are two-faced and i'm not naming names"),
      say('nyx', 'lol ok'),
      say('rhea', "Both of you, stop. He's here."),
      narrate('Three typing indicators. All of them pointed at you.'),
    ],
    choices: [
      sequence("Guys I love you all, please don't fight!!", { nyx: -2, goldie: 2, rhea: -2 }, [
        [
          say('goldie', 'see?? HE gets it'),
          say('nyx', "i'm gonna be sick."),
        ],
        [
          say('goldie', 'group hug!! virtual group hug!!'),
          say('rhea', 'Absolutely not.'),
        ],
      ]),
      sequence('Everyone, lobby. Now. We talk like adults.', { nyx: -1, goldie: 1, rhea: 2 }, [
        [
          say('rhea', 'You heard him.'),
        ],
        [
          say('rhea', 'Lobby. Now. All of you.'),
          say('nyx', 'ugh. fine.'),
        ],
      ]),
      sequence('*mutes the group chat*', { nyx: 2, goldie: -2, rhea: -1 }, [
        [
          say('nyx', 'he muted us. legend.'),
        ],
        [
          say('nyx', 'lmao he muted the group chat'),
          say('goldie', 'did he just MUTE us??'),
        ],
      ]),
    ],
  }),
  scene({
    id: 'd7-who-do-you-choose',
    title: 'Who do you choose?',
    day: 6,
    slot: 2,
    cast: ['nyx', 'goldie', 'rhea'],
    lines: [
      narrate('Sunday night. One message. One girl. Choose who you ask out.'),
    ],
    choices: [
      pickDate('nyx', 'Message Nyx: “hey. wanna hang out. or not. whatever.”'),
      pickDate('goldie', 'Message Goldie: “Hey!! Can I take you on a real date? Please say yes!!”'),
      pickDate('rhea', "Message Rhea: “8pm. I'm picking you up. Wear something nice.”"),
    ],
  }),
]
