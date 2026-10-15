import type { ContentRegistry, Scene } from '@/content/types'
import { evaluate } from './conditions'
import type { GameState } from './types'

export function candidateScenes(content: ContentRegistry, s: GameState, day: number, slot: number): Scene[] {
  return content.scenes
    .filter((sc) => sc.day === day && sc.slot === slot && evaluate(sc.when, s))
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
}

export function pickScene(
  content: ContentRegistry,
  s: GameState,
  day: number,
  slot: number,
): { sceneId: string; variant: number } | null {
  const scene = candidateScenes(content, s, day, slot)[0]
  if (!scene) return null
  const variant = scene.variants.findIndex((v) => evaluate(v.when, s))
  return variant < 0 ? null : { sceneId: scene.id, variant }
}
