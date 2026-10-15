import { narrate, say } from '@/content/helpers'
import type { Confrontation } from '@/content/types'

export const confrontation: Confrontation = {
  lines: [
    narrate("Rhea doesn't reply to your message. She calls instead."),
    say('rhea', (ctx) => {
      const offenses = ctx.describeOffenses('rhea')
      return 'Jade sent me screenshots. ' + offenses.charAt(0).toUpperCase() + offenses.slice(1) + '. Explain. Now.'
    }),
  ],
  choices: [
    {
      text: "Please don't be mad, I'm sorry, I'll do whatever you want!",
      modifier: -2,
      label: 'You begged in the confrontation',
      replies: ['Begging. Wrong answer.', "That's worse than what you did."],
    },
    {
      text: 'Those screenshots are fake.',
      modifier: -3,
      label: 'You lied in the confrontation',
      replies: ['Jade has the originals. Lying to me is a choice.', "You're lying to ME? Bold. Wrong."],
    },
    {
      text: "Yes. It happened. It's over. I'm here, and I chose you.",
      modifier: 2,
      label: 'You owned it in the confrontation',
      replies: [
        "...You own it. That's the only reason you're still talking to me.",
        "Clean answer. Don't make me ask twice ever again.",
        "Fine. Chosen. Don't make me regret it.",
      ],
    },
  ],
}
