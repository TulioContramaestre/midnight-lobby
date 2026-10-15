import { describe, expect, it } from 'vitest'
import { registry } from '@/content/registry'
import { endingTier, score } from '@/engine/scoring'
import { play, policies } from './playthroughs'

describe('scripted playthroughs with fixed seeds', () => {
  it('Nyx: sleep calls only with her, good ending', () => {
    const { state } = play(policies.nyx)
    const sc = score(registry, state, 'nyx')
    expect(state.confrontation).toBeNull()
    expect(state.slept).toEqual(['nyx'])
    expect(sc).toEqual({
      base: 35,
      mods: [
        { label: 'Mika vouched for you', value: 2 },
        { label: 'Benji spread gossip about you', value: -1 },
        { label: 'You outshone Ezra', value: 1 },
      ],
      final: 37,
    })
    expect(endingTier(sc.final)).toBe('good')
  })

  it('Goldie: lukewarm week, friends ending on the boundary', () => {
    const { state } = play(policies.goldie)
    const sc = score(registry, state, 'goldie')
    expect(state.confrontation).toBeNull()
    expect(sc).toEqual({
      base: 4,
      mods: [
        { label: 'Theo warned her about you', value: -2 },
        { label: 'Benji the mod put in a good word', value: 1 },
        { label: 'You outshone Dex', value: 1 },
      ],
      final: 4,
    })
    expect(endingTier(sc.final)).toBe('friends')
  })

  it('Rhea: chased Nyx all week, got confronted, lied, bad ending', () => {
    const { state } = play(policies.rhea)
    const sc = score(registry, state, 'rhea')
    expect(state.confrontation?.choiceIndex).toBe(1)
    expect(sc).toEqual({
      base: -7,
      mods: [
        { label: 'Benji spread gossip about you', value: -1 },
        { label: 'Kai was serious competition', value: -2 },
        { label: 'Your sleep call with Nyx', value: -3 },
        { label: 'You lied in the confrontation', value: -3 },
      ],
      final: -16,
    })
    expect(endingTier(sc.final)).toBe('left')
  })
})
