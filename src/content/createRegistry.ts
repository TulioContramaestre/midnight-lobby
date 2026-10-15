import type { Character, ContentParts, ContentRegistry } from './types'

export function createRegistry(parts: ContentParts): ContentRegistry {
  const characters: Character[] = [...parts.loveInterests, ...parts.supporting, ...parts.rivals]
  const byId = new Map(characters.map((c) => [c.id, c]))
  const scenes = new Map(parts.scenes.map((s) => [s.id, s]))
  const activities = new Map(parts.activities.map((a) => [a.id, a]))
  const modes = new Map(parts.activityModes.map((m) => [m.id, m]))

  return {
    ...parts,
    characters,
    character: (id) => byId.get(id),
    loveInterest: (id) => {
      const c = byId.get(id)
      return c?.kind === 'loveInterest' ? c : undefined
    },
    supportingCharacter: (id) => {
      const c = byId.get(id)
      return c?.kind === 'supporting' ? c : undefined
    },
    rival: (id) => {
      const c = byId.get(id)
      return c?.kind === 'rival' ? c : undefined
    },
    scene: (id) => scenes.get(id),
    activity: (id) => activities.get(id),
    activityMode: (id) => modes.get(id),
  }
}
