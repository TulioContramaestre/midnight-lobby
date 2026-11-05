import { choice, narrate, say, scene } from '@/content/helpers'
import type { Scene } from '@/content/types'

export const monday: Scene[] = [
  scene({
    id: 'd1-the-new-guy-in-voice-chat',
    title: 'The new guy in voice chat',
    day: 0,
    slot: 0,
    cast: ['nyx'],
    lines: [
      narrate('You join the Midnight Lobby server for the first time. One voice channel is active.'),
      say('nyx', 'oh. new guy. ...hi i guess.'),
    ],
    choices: [
      choice('sup.', { nyx: 2, goldie: -1, rhea: 0 }, [
        "...ok you're kinda chill. you can stay.",
        "sup. ...ok i like you already. don't tell anyone.",
        "finally someone who doesn't scream hello.",
      ]),
      choice("OMG hi!! I've watched literally all your streams, you're SO cool!!", { nyx: -2, goldie: 1, rhea: -1 }, [
        "that's... a lot of energy for a monday.",
        'oh no. a fan. ok.',
        'please lower your volume. emotionally.',
      ], 'She mutes her mic.'),
      choice("I'm carrying this lobby tonight. Stick close and you might win something.", { nyx: 0, goldie: 0, rhea: 1 }, [
        "bold. we'll see.",
        'big talk for someone with a default banner.',
        "ok carry me then. i'm not trying.",
      ]),
    ],
  }),
  scene({
    id: 'd1-house-rules',
    title: 'House rules',
    day: 0,
    slot: 1,
    cast: ['benji'],
    lines: [
      narrate('Benji, the server mod, pings you in #welcome.'),
      say('benji', "yo new guy. house rules: no drama, no begging for mod, and no sliding into everyone's DMs at once. we cool?"),
    ],
    choices: [
      choice("We're cool. Appreciate you keeping this place running.", { benji: 2 }, [
        "finally, someone with manners. you're alright.",
        "respect. you'd be surprised how rare that is.",
      ]),
      choice('lol rules are suggestions', { benji: -2, nyx: 1 }, [
        'noted. and by noted i mean logged.',
        'bold move on day one.',
      ], 'Nyx reacts to your message with a skull.'),
      choice('No promises on the DM thing.', { benji: -1, rhea: 1 }, ["bro. it's day one.", "i'm watching you."]),
    ],
  }),
  scene({
    id: 'd1-a-very-excited-dm',
    title: 'A very excited DM',
    day: 0,
    slot: 2,
    cast: ['goldie'],
    lines: [
      narrate('Your DMs light up. Seventeen messages in eleven seconds.'),
      say('goldie', (ctx) => 'HIIII ' + ctx.playerName + '!!! welcome to the server!!! i saw u join and got so excited. do u wanna be friends??? i have snacks (virtually)'),
    ],
    choices: [
      choice("Sure. Be online at 9, you're on my team.", { nyx: 0, goldie: 1, rhea: 1 }, [
        'yes sir!! 9 sharp!! setting 4 alarms',
        "OKAY!! i'll be there at 8:45 just in case!!",
        "a TEAM?? i'm on a TEAM??",
      ]),
      choice("YES. Best friends already. I'm making you a playlist right now.", { nyx: -1, goldie: 2, rhea: 0 }, [
        'A PLAYLIST?? FOR ME?? *happy tail wagging noises*',
        "i'm literally kicking my feet rn",
        "BEST FRIENDS. it's official. i'm telling everyone",
      ]),
      choice('k', { nyx: 1, goldie: -2, rhea: 0 }, [
        "oh... ok! that's ok! ...k is a whole word right? >_<",
        "k! ...k is fine! i'm fine!",
        'oh. ok. sorry for the 17 messages lol',
      ]),
    ],
  }),
]
