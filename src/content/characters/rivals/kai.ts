import type { Rival } from '@/content/types'

export const kai: Rival = {
  kind: 'rival',
  id: 'kai',
  name: 'Kai',
  handle: '@kai.rank2',
  role: '#2 ranked player, wants Rhea',
  avatar: { skin: '#D9A577', hair: '#444441', style: 'short', bg: '#B5D4F4', shirt: '#0C447C', acc: 'headset' },
  target: 'rhea',
  rivalEnding: "Kai finally got Rhea's duo slot. They're climbing together.",
  posts: [
    { day: 1, order: 0, text: 'Spikefall rank 2. Rank 1 is a formality.' },
    { day: 4, order: 1, text: 'Some people get lucky in a 1v1 once. Once.' },
  ],
}
