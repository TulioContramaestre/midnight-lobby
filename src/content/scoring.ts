import type { ScoringContent } from '@/content/types'

export const scoring: ScoringContent = {
  modifiers: [
    {
      kind: 'threshold',
      subject: { kind: 'bestFriend' },
      high: { gte: 2, label: '{name} vouched for you', value: 2 },
      low: { lte: -2, label: '{name} warned her about you', value: -2 },
    },
    {
      kind: 'threshold',
      subject: { kind: 'character', id: 'benji' },
      high: { gte: 2, label: 'Benji the mod put in a good word', value: 1 },
      low: { lte: -2, label: 'Benji spread gossip about you', value: -1 },
    },
    {
      kind: 'threshold',
      subject: { kind: 'rival' },
      high: { gte: 4, label: '{name} was serious competition', value: -2 },
      low: { lte: 0, label: 'You outshone {name}', value: 1 },
    },
    { kind: 'matched', label: 'Your matching pfps sealed it', value: 1 },
    { kind: 'sleptWithOthers', label: 'Your sleep call with {names}', value: -3 },
    { kind: 'pfpWithOthers', label: 'Your matching pfps with {names}', value: -2 },
    { kind: 'confrontation' },
  ],
  tierLabels: {
    good: { label: 'Good ending', tone: 'success' },
    friends: { label: 'Friends ending', tone: 'warning' },
    left: { label: 'Bad ending', tone: 'danger' },
  },
  legend: '9+ good ending · 4 to 8 friends · 3 or less left',
}
