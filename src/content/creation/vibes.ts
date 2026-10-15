import type { Vibe } from '@/content/types'

export const vibes: Vibe[] = [
  { id: 'gamer', label: 'Gamer', effects: { nyx: 1 }, why: 'Nyx respects a real gamer.' },
  { id: 'gym', label: 'Gym rat', effects: { rhea: 1 }, why: 'Rhea respects discipline.' },
  { id: 'soft', label: 'Soft boy', effects: { goldie: 1 }, why: 'Goldie loves a soft boy.' },
  { id: 'music', label: 'Bedroom musician', effects: { nyx: 1, goldie: 1, rhea: -1 }, why: 'Nyx and Goldie love a musician. Rhea calls it “a phase.”' },
]
