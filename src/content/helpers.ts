import type { CharacterId, Choice, Deltas, Line, LineText, Scene, SceneVariant, Tier } from './types'

export const say = (speaker: CharacterId, text: LineText): Line => ({ speaker, text })

export const narrate = (text: LineText): Line => ({ speaker: null, text })

export const choice = (text: string, deltas: Deltas, options: string[], narration?: string): Choice => ({
  text,
  effects: [{ type: 'affection', deltas }],
  reaction: { kind: 'oneOf', options },
  ...(narration === undefined ? {} : { narration }),
})

export const sequence = (text: string, deltas: Deltas, options: Line[][]): Choice => ({
  text,
  effects: [{ type: 'affection', deltas }],
  reaction: { kind: 'sequenceOf', options },
})

export const pickDate = (who: CharacterId, text: string): Choice => ({
  text,
  effects: [{ type: 'pickDate', who }],
})

export function scene(scene: {
  id: string
  title: string
  day: number
  slot: number
  cast: CharacterId[]
  lines: Line[]
  choices: Choice[]
}): Scene {
  const { lines, choices, ...rest } = scene
  return { ...rest, variants: [{ lines, choices }] }
}

type TierVariant = Omit<SceneVariant, 'when'>

export function tiered(scene: {
  id: string
  title: string
  day: number
  slot: number
  who: CharacterId
  low: TierVariant
  mid: TierVariant
  high: TierVariant
}): Scene {
  const variant = (is: Tier): SceneVariant => ({ when: { tier: { who: scene.who, is } }, ...scene[is] })
  return {
    id: scene.id,
    title: scene.title,
    day: scene.day,
    slot: scene.slot,
    cast: [scene.who],
    variants: [variant('low'), variant('mid'), variant('high')],
  }
}
