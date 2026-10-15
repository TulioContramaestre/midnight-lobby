import type { Rival } from '@/content/types'

export const dex: Rival = {
  kind: 'rival',
  id: 'dex',
  name: 'Dex',
  handle: '@dexterous',
  role: 'Sweet but intense, wants Goldie',
  avatar: { skin: '#B07A4F', hair: '#633806', style: 'messy', bg: '#F5C4B3', shirt: '#993C1D', acc: 'glasses' },
  target: 'goldie',
  rivalEnding: "Dex's 40-slide confession worked. Goldie said yes on slide 12.",
  posts: [
    { day: 2, order: 1, text: 'learning guitar to impress someone. day 1. fingers hurt.' },
    { day: 5, order: 1, text: 'big plans tomorrow. 40 slides. no notes.' },
  ],
}
