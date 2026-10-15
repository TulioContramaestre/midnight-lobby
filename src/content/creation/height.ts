import type { Bracket } from '@/content/types'

export const heightRange = { min: 60, max: 80 }

export const heightBrackets: Bracket[] = [
  { max: 66, effects: { nyx: 1, rhea: -1 }, why: 'Under 5′7″: Nyx says short kings are underrated. Rhea disagrees.' },
  { max: 70, effects: { goldie: 1 }, why: '5′7″ to 5′10″: Goldie calls it perfect hug height.' },
  { max: 74, effects: { rhea: 1 }, why: '5′11″ to 6′2″: Rhea likes tall.' },
  { effects: { rhea: 2, nyx: -1 }, why: '6′3″ and up: Rhea really likes tall. Nyx finds it intimidating.' },
]

export const heightLabel = (i: number): string => Math.floor(i / 12) + '′' + (i % 12) + '″ (' + Math.round(i * 2.54) + ' cm)'
