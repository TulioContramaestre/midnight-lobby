import type { CharacterId, ContentRegistry } from '@/content/types'
import { characterName } from './names'
import type { Rng } from './rng'
import type { GameState } from './types'

export function offensesAgainst(s: GameState, g: CharacterId): { slept: CharacterId[]; pfp: CharacterId[] } {
  return { slept: s.slept.filter((k) => k !== g), pfp: s.pfpAll.filter((k) => k !== g) }
}

export function shouldConfront(s: GameState, g: CharacterId): boolean {
  const o = offensesAgainst(s, g)
  return o.slept.length > 0 || o.pfp.length > 0
}

export function describeOffenses(content: ContentRegistry, s: GameState, g: CharacterId): string {
  const parts: string[] = []
  const o = offensesAgainst(s, g)
  const names = (ids: CharacterId[]) => ids.map((k) => characterName(content, k)).join(' and ')
  if (o.slept.length) parts.push('the sleep call with ' + names(o.slept))
  if (o.pfp.length) parts.push('the matching pfps with ' + names(o.pfp))
  return parts.join(' and ')
}

export function chooseConfrontation(content: ContentRegistry, s: GameState, index: number, rng: Rng): void {
  const g = s.pick
  const c = g ? content.loveInterest(g)?.confrontation.choices[index] : undefined
  if (!g || !c) return
  s.confrontation = { choiceIndex: index, reply: rng.pick(c.replies) }
  s.moodOverrides = { [g]: c.modifier > 0 ? 'neutral' : 'upset' }
}
