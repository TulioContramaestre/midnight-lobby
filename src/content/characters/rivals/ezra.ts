import type { Rival } from '@/content/types'

export const ezra: Rival = {
  kind: 'rival',
  id: 'ezra',
  name: 'Ezra',
  handle: '@ezra.lowercase',
  role: 'E-boy with painted nails, wants Nyx',
  avatar: { skin: '#FCE4D6', hair: '#2C2C2A', style: 'messy', bg: '#AFA9EC', shirt: '#26215C', acc: 'earring' },
  target: 'nyx',
  rivalEnding: 'Ezra and Nyx have matching pfps now. Black cat ears on both.',
  posts: [
    { day: 0, order: 1, text: 'nail polish chipped. day ruined. anyway.' },
    { day: 3, order: 1, text: '2am is my time. everyone knows that.' },
  ],
}
