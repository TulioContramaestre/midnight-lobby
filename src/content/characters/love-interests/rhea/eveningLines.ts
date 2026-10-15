import type { EveningLines } from '@/content/types'

export const eveningLines: EveningLines = {
  queue: {
    low: ["Adequate. We'll see if it lasts.", 'Keep up or get left.'],
    mid: ["Not bad. You're growing on me. Like mold.", 'You actually listened to my calls. Rare.'],
    high: [
      "You're the only duo I don't have to babysit.",
      "Same time tomorrow. That's not a question.",
      "I let you shot-call tonight. Don't get used to it. ...Actually, do.",
    ],
  },
  watch: {
    low: ['Acceptable use of an evening.', "If it's boring next time, I'm leaving."],
    mid: ["I didn't hate it. Write that down.", "Your pick next time. Don't waste it."],
    high: ['You can pick next time. Only you.', 'Same time next week. I already blocked it out.'],
  },
}
