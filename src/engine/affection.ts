import type { CharacterId, ContentRegistry, Deltas } from '@/content/types'
import { MOOD_HAPPY_MIN, MOOD_UPSET_MAX, SCENE_TIER_HIGH_MIN, SCENE_TIER_MID_MIN } from './constants'
import type { GameState, Mood, Tier } from './types'

export function tier(value: number | undefined): Tier {
  if (value === undefined) return 'low'
  return value >= SCENE_TIER_HIGH_MIN ? 'high' : value >= SCENE_TIER_MID_MIN ? 'mid' : 'low'
}

export function tierOf(s: GameState, id: CharacterId): Tier {
  return tier(s.affection[id])
}

export function mood(s: GameState, id: CharacterId): Mood {
  const override = s.moodOverrides?.[id]
  if (override) return override
  const h = s.affection[id]
  if (h === undefined) return 'neutral'
  return h >= MOOD_HAPPY_MIN ? 'happy' : h <= MOOD_UPSET_MAX ? 'upset' : 'neutral'
}

export function applyDeltas(content: ContentRegistry, s: GameState, deltas: Deltas): void {
  const overrides: Record<CharacterId, Mood> = {}
  for (const [id, d] of Object.entries(deltas)) {
    s.affection[id] += d
    if (content.loveInterest(id) && d) overrides[id] = d > 0 ? 'happy' : 'upset'
  }
  s.moodOverrides = overrides
}
