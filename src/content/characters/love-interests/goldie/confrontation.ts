import { narrate, say } from '@/content/helpers'
import type { Confrontation } from '@/content/types'

export const confrontation: Confrontation = {
  lines: [
    narrate('Goldie replies with a voice memo. Her voice is shaky.'),
    say('goldie', (ctx) => 'theo told me about ' + ctx.describeOffenses('goldie').toLowerCase() + '... is it true?? please just tell me the truth'),
  ],
  choices: [
    {
      text: "That wasn't me. Theo's got it wrong.",
      modifier: -3,
      label: 'You lied in the confrontation',
      replies: ['theo SAW it. why are u lying to me??', '...i thought u were different'],
    },
    {
      text: "You deserve the truth. Yes, it happened, and I'm sorry. You're the one I want, and I'll prove it.",
      modifier: 2,
      label: 'You were honest in the confrontation',
      replies: [
        '...ok. i believe u. i want to believe u.',
        "thank u for being honest. i'm still sad. but ok.",
        'ok. prove it then. starting now.',
      ],
    },
    {
      text: "it's not that deep.",
      modifier: -2,
      label: 'You brushed it off in the confrontation',
      replies: ["it's deep to me.", 'wow. ok.'],
    },
  ],
}
