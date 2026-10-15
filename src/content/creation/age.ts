import type { Bracket } from '@/content/types'

export const ageRange = { min: 18, max: 35 }

export const ageBrackets: Bracket[] = [
  { max: 20, effects: { goldie: 1, rhea: -1 }, why: "18 to 20: Goldie likes guys her age. Rhea thinks you're a baby." },
  { max: 24, effects: { nyx: 1, goldie: 1 }, why: "21 to 24: Nyx and Goldie like that you're their age." },
  { max: 29, effects: { rhea: 1 }, why: "25 to 29: Rhea likes a guy who's a little older." },
  { effects: { rhea: 1, nyx: -1, goldie: -1 }, why: "30 and up: Rhea likes older. Nyx and Goldie think you're “basically a dad.”" },
]
