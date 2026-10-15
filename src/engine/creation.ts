import type { Bracket, CharacterId, ContentRegistry } from '@/content/types'
import type { Player } from './types'

export function bracketFor(brackets: readonly Bracket[], value: number): Bracket | undefined {
  return brackets.find((b) => b.max === undefined || value <= b.max)
}

export function startingAffection(
  content: ContentRegistry,
  player: Pick<Player, 'age' | 'height' | 'vibe'>,
): { affection: Record<CharacterId, number>; why: string[] } {
  const affection: Record<CharacterId, number> = {}
  for (const li of content.loveInterests) affection[li.id] = 0
  const why: string[] = []
  const parts = [
    bracketFor(content.creation.age, player.age),
    bracketFor(content.creation.height, player.height),
    content.creation.vibes.find((v) => v.id === player.vibe),
  ]
  for (const x of parts) {
    if (!x) continue
    for (const [k, d] of Object.entries(x.effects)) affection[k] += d
    why.push(x.why)
  }
  return { affection, why }
}
