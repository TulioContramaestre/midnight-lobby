import type { ContentRegistry, Deltas, Effect } from '@/content/types'
import { applyDeltas } from './affection'
import type { GameState } from './types'

export function mergeDeltas(effects: readonly Effect[]): Deltas {
  const out: Deltas = {}
  for (const e of effects) {
    if (e.type !== 'affection') continue
    for (const [id, d] of Object.entries(e.deltas)) out[id] = (out[id] ?? 0) + d
  }
  return out
}

export function applyEffects(content: ContentRegistry, s: GameState, effects: readonly Effect[]): Deltas {
  const deltas = mergeDeltas(effects)
  applyDeltas(content, s, deltas)
  for (const e of effects) {
    if (e.type === 'setFlag') s.flags[e.flag] = e.value ?? true
  }
  return deltas
}
