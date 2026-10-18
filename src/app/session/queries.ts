import type { ContentRegistry } from '@/content/types'
import { SLOTS_PER_DAY } from '@/engine/constants'
import { pickScene } from '@/engine/scheduler'
import type { GameState } from '@/engine/types'
import { LOC, type Loc } from './locations'
import type { Session } from './types'

export function currentSceneDef(content: ContentRegistry, game: GameState) {
  const scene = game.scene ? content.scene(game.scene.sceneId) : undefined
  const variant = scene && game.scene ? scene.variants[game.scene.variant] : undefined
  return scene && variant ? { scene, variant } : null
}

export function nextSceneDef(content: ContentRegistry, game: GameState) {
  if (game.slot + 1 >= SLOTS_PER_DAY) return null
  const ref = pickScene(content, game, game.day, game.slot + 1)
  return ref ? (content.scene(ref.sceneId) ?? null) : null
}

export function sceneLoc(content: ContentRegistry, game: GameState): Loc | 'pick' | null {
  const cur = game.phase === 'scene' ? currentSceneDef(content, game) : null
  return cur ? LOC[cur.scene.title] : null
}

export function isPickScene(content: ContentRegistry, game: GameState): boolean {
  const cur = game.phase === 'scene' ? currentSceneDef(content, game) : null
  return !!cur && !!cur.variant.choices[0]?.effects.some((e) => e.type === 'pickDate')
}

export function canPick(content: ContentRegistry, s: Session, index: number): boolean {
  const cur = currentSceneDef(content, s.game)
  return sceneLoc(content, s.game) === s.loc && !isPickScene(content, s.game) && !!cur?.variant.choices[index]
}

export function canConfPick(content: ContentRegistry, s: Session, index: number): boolean {
  const g = s.game.pick
  const li = g ? content.loveInterest(g) : undefined
  return s.game.phase === 'confront' && !s.game.confrontation && s.loc === 'dm:' + g && !!li?.confrontation.choices[index]
}
