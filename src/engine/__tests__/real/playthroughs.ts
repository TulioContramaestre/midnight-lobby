import { registry } from '@/content/registry'
import type { CharacterId } from '@/content/types'
import { createInitialState } from '@/engine/initialState'
import { createReducer } from '@/engine/reducer'
import { createSelectors } from '@/engine/selectors'
import type { Action, EditablePlayer, GameState } from '@/engine/types'

export const reducer = createReducer(registry)
export const selectors = createSelectors(registry)

export interface Policy {
  seed: number
  name: string
  player: Partial<EditablePlayer>
  favorite: CharacterId
  scene: 'favorite' | 'first'
  evening: { who: CharacterId; milestones: boolean; mode: 'queue' | 'watch'; activity: string } | null
  likeFavorite: boolean
  pick: CharacterId
  confront: number
}

export function play(policy: Policy): { actions: Action[]; state: GameState } {
  const actions: Action[] = []
  let s = createInitialState(registry, policy.seed)
  const act = (a: Action) => {
    actions.push(a)
    s = reducer(s, a)
  }
  act({ type: 'goToCreate' })
  act({ type: 'setName', name: policy.name })
  for (const [field, value] of Object.entries(policy.player)) {
    act({ type: 'setPlayerField', field, value } as Action)
  }
  act({ type: 'begin' })

  while (s.phase !== 'ending') {
    if (s.phase === 'scene') {
      if (s.slot === 0 && policy.likeFavorite && !s.likedToday) {
        act({ type: 'setView', view: 'feed' })
        const post = s.feed.find((p) => p.day === s.day && p.author === policy.favorite)
        if (post) act({ type: 'like', postId: post.id })
        act({ type: 'setView', view: 'story' })
      }
      const ref = s.scene!
      const choices = registry.scene(ref.sceneId)!.variants[ref.variant].choices
      const pickIndex = choices.findIndex((c) => c.effects.some((e) => e.type === 'pickDate' && e.who === policy.pick))
      if (pickIndex >= 0) {
        act({ type: 'choose', index: pickIndex })
        continue
      }
      const gain = (i: number) =>
        choices[i].effects.reduce((a, e) => a + (e.type === 'affection' ? (e.deltas[policy.favorite] ?? 0) : 0), 0)
      const index = policy.scene === 'first' ? 0 : choices.map((_, i) => i).reduce((best, i) => (gain(i) > gain(best) ? i : best), 0)
      act({ type: 'choose', index })
    } else if (s.phase === 'react') {
      act({ type: 'continue' })
    } else if (s.phase === 'evening') {
      const plan = policy.evening
      if (plan) {
        act({ type: 'selectEveningGirl', who: plan.who })
        const menu = selectors.evening(s)
        if (plan.milestones && menu.sleep) act({ type: 'doEvening', action: { kind: 'milestone', id: 'sleep' } })
        else if (plan.milestones && menu.pfp?.unlocked) act({ type: 'doEvening', action: { kind: 'milestone', id: 'pfp' } })
        else {
          act({ type: 'setEveningMode', mode: plan.mode })
          act({ type: 'doEvening', action: { kind: 'activity', id: plan.activity } })
        }
      }
      act({ type: 'nextDay' })
    } else if (s.phase === 'confront') {
      act({ type: 'confront', index: policy.confront })
      act({ type: 'seeEnding' })
    } else {
      throw new Error(`Unexpected phase ${s.phase}`)
    }
  }
  return { actions, state: s }
}

export const policies: Record<'nyx' | 'goldie' | 'rhea', Policy> = {
  nyx: {
    seed: 20251015,
    name: 'nightowl',
    player: { age: 22, height: 64, vibe: 'gamer' },
    favorite: 'nyx',
    scene: 'favorite',
    evening: { who: 'nyx', milestones: true, mode: 'queue', activity: 'spike' },
    likeFavorite: true,
    pick: 'nyx',
    confront: 0,
  },
  goldie: {
    seed: 4242,
    name: 'pupper',
    player: { age: 19, height: 68, vibe: 'soft' },
    favorite: 'goldie',
    scene: 'first',
    evening: { who: 'goldie', milestones: false, mode: 'watch', activity: 'esports' },
    likeFavorite: false,
    pick: 'goldie',
    confront: 0,
  },
  rhea: {
    seed: 777,
    name: 'kingpin',
    player: { age: 30, height: 76, vibe: 'gym' },
    favorite: 'nyx',
    scene: 'favorite',
    evening: { who: 'nyx', milestones: true, mode: 'queue', activity: 'spike' },
    likeFavorite: true,
    pick: 'rhea',
    confront: 1,
  },
}
