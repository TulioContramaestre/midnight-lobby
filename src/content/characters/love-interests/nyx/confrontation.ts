import { narrate, say } from '@/content/helpers'
import type { Confrontation } from '@/content/types'

export const confrontation: Confrontation = {
  lines: [
    narrate('Before you can send anything else, Nyx calls. She never calls.'),
    say('nyx', (ctx) => 'mika sent me screenshots. ' + ctx.describeOffenses('nyx').toLowerCase() + ". i'm not mad. ...ok i'm a little mad."),
  ],
  choices: [
    {
      text: 'yeah. it happened. not gonna lie to you about it.',
      modifier: 2,
      label: 'You were honest in the confrontation',
      replies: [
        "...ok. at least u didn't lie. that counts for something.",
        'honesty. annoyingly attractive. still mad tho.',
        'ok. thanks for not making me drag it out of u.',
      ],
    },
    {
      text: "Nyx I'm SO sorry, please don't hate me, I'll do anything!!",
      modifier: -1,
      label: 'You groveled in the confrontation',
      replies: ['the groveling is making it worse.', "stop. please. that's worse."],
    },
    {
      text: "That wasn't me. Someone's messing with you.",
      modifier: -3,
      label: 'You lied in the confrontation',
      replies: ['mika has the timestamps. try again.', 'wow. u lied to my face. ok.'],
    },
  ],
}
