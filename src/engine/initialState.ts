import type { ContentRegistry } from '@/content/types'
import type { GameState } from './types'

export function createInitialState(content: ContentRegistry, seed: number): GameState {
  const d = content.creation.defaults
  return {
    phase: 'intro',
    view: 'story',
    day: 0,
    slot: 0,
    rng: seed | 0,
    player: {
      name: d.name,
      age: d.age,
      height: d.height,
      ethnicity: d.ethnicity,
      skin: d.skin,
      hair: d.hair,
      hairStyle: d.hairStyle,
      vibe: d.vibe,
    },
    createError: '',
    affection: {},
    likeCount: Object.fromEntries(content.loveInterests.map((li) => [li.id, 0])),
    likedToday: false,
    matched: null,
    pfpAll: [],
    slept: [],
    flags: {},
    moodOverrides: null,
    scene: null,
    lastChoice: null,
    lastReaction: null,
    evening: { selected: content.loveInterests[0]?.id ?? null, mode: null, result: null },
    pick: null,
    confrontation: null,
    feed: [],
    unseen: 0,
    feedDay: 0,
    note: '',
  }
}
