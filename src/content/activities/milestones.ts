import { PFP_MIN, SLEEP_MIN } from '@/engine/constants'
import type { Milestones } from '@/content/types'

export const milestones: Milestones = {
  pfp: {
    label: 'Ask {n} to match profile pictures',
    icon: 'photo',
    min: PFP_MIN,
    lockedLabel: 'Match profile pictures with {n} · get closer to unlock',
    switchPenalty: -3,
    switchedNarration: '{prev} noticed you switched to matching pfps with {name}. She changed hers back within the minute.',
    matchedNarration: 'Your profile picture now matches hers. Check the People tab.',
  },
  sleep: {
    label: 'Ask {n} for a sleep call',
    icon: 'moon',
    min: SLEEP_MIN,
    hintMin: PFP_MIN,
    hint: "Something even more personal unlocks when she's really into you.",
    repeatGain: 1,
    narration: [
      'You fall asleep with the call still connected. Call length: 6h 41m.',
      'You wake up to the call still running and a “gm” in chat.',
      'At some point you both stop talking. Neither of you hangs up.',
      "She's asleep before midnight. You stay on anyway. Call length: 8h 12m.",
    ],
  },
}
