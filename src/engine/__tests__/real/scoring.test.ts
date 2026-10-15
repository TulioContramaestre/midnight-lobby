import { describe, expect, it } from 'vitest'
import { registry } from '@/content/registry'
import { createInitialState } from '@/engine/initialState'
import { endingTier, score } from '@/engine/scoring'
import type { GameState } from '@/engine/types'

const neutral = { mika: 0, theo: 0, jade: 0, benji: 0, ezra: 2, dex: 2, kai: 2 }
const state = (affection: Record<string, number>, extra: Partial<GameState> = {}): GameState => ({
  ...createInitialState(registry, 1),
  affection: { nyx: 5, goldie: 5, rhea: 5, ...neutral, ...affection },
  ...extra,
})

describe('score with real content', () => {
  it('every positive modifier', () => {
    const s = state({ nyx: 6, mika: 2, benji: 2, ezra: 0 }, { matched: 'nyx' })
    expect(score(registry, s, 'nyx')).toEqual({
      base: 6,
      mods: [
        { label: 'Mika vouched for you', value: 2 },
        { label: 'Benji the mod put in a good word', value: 1 },
        { label: 'You outshone Ezra', value: 1 },
        { label: 'Your matching pfps sealed it', value: 1 },
      ],
      final: 11,
    })
  })

  it('every negative modifier, including the confrontation', () => {
    const s = state(
      { goldie: 9, theo: -2, benji: -2, dex: 4 },
      { pick: 'goldie', slept: ['nyx', 'rhea'], pfpAll: ['rhea', 'goldie'], matched: 'goldie', confrontation: { choiceIndex: 2, reply: 'wow. ok.' } },
    )
    expect(score(registry, s, 'goldie')).toEqual({
      base: 9,
      mods: [
        { label: 'Theo warned her about you', value: -2 },
        { label: 'Benji spread gossip about you', value: -1 },
        { label: 'Dex was serious competition', value: -2 },
        { label: 'Your matching pfps sealed it', value: 1 },
        { label: 'Your sleep call with Nyx and Rhea', value: -3 },
        { label: 'Your matching pfps with Rhea', value: -2 },
        { label: 'You brushed it off in the confrontation', value: -2 },
      ],
      final: -2,
    })
  })

  it("Rhea's friend and rival", () => {
    expect(score(registry, state({ jade: 3, kai: 5 }), 'rhea').mods).toEqual([
      { label: 'Jade vouched for you', value: 2 },
      { label: 'Kai was serious competition', value: -2 },
    ])
    expect(score(registry, state({ jade: -3, kai: -1 }), 'rhea').mods).toEqual([
      { label: 'Jade warned her about you', value: -2 },
      { label: 'You outshone Kai', value: 1 },
    ])
  })

  it('no modifier just inside each threshold', () => {
    expect(score(registry, state({ mika: 1, benji: -1, ezra: 3 }), 'nyx').mods).toEqual([])
    expect(score(registry, state({ mika: -1, benji: 1, ezra: 1 }), 'nyx').mods).toEqual([])
  })

  it('ending boundaries at 3/4 and 8/9', () => {
    for (const [base, tier] of [[3, 'left'], [4, 'friends'], [8, 'friends'], [9, 'good']] as const) {
      const sc = score(registry, state({ nyx: base }), 'nyx')
      expect(sc.final).toBe(base)
      expect(endingTier(sc.final)).toBe(tier)
    }
    expect(registry.scoring.tierLabels).toEqual({
      good: { label: 'Good ending', tone: 'success' },
      friends: { label: 'Friends ending', tone: 'warning' },
      left: { label: 'Bad ending', tone: 'danger' },
    })
  })
})
