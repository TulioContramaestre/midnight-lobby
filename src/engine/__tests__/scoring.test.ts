import { describe, expect, it } from 'vitest'
import { endingTier, epilogueTier, rivalEndings, score } from '@/engine/scoring'
import type { GameState } from '@/engine/types'
import { content, started, withAffection } from './fixtures'

const base = (values: Record<string, number>, extra: Partial<GameState> = {}): GameState => ({
  ...withAffection(started(), { ivy: 5, sam: 0, mod: 0, rex: 2, ...values }),
  ...extra,
})

describe('score', () => {
  it('has no modifiers when nothing stands out', () => {
    expect(score(content, base({}), 'ivy')).toEqual({ base: 5, mods: [], final: 5 })
  })

  it('applies every rule in order with its label and value', () => {
    const s = base(
      { sam: 2, mod: -2, rex: 4 },
      { matched: 'ivy', slept: ['ivy', 'mae', 'zoe'], pfpAll: ['mae', 'ivy'], confrontation: { choiceIndex: 1, reply: 'worse' } },
    )
    expect(score(content, s, 'ivy')).toEqual({
      base: 5,
      mods: [
        { label: 'SAM vouched', value: 2 },
        { label: 'Mod gossiped', value: -1 },
        { label: 'REX competed', value: -2 },
        { label: 'Matched pfps', value: 1 },
        { label: 'Slept with Mae and Zoe', value: -3 },
        { label: 'Pfps with Mae', value: -2 },
        { label: 'You groveled', value: -1 },
      ],
      final: -1,
    })
  })

  it('uses the low side of each threshold', () => {
    const mods = score(content, base({ sam: -2, mod: 2, rex: 0 }), 'ivy').mods
    expect(mods).toEqual([
      { label: 'SAM warned', value: -2 },
      { label: 'Mod liked you', value: 1 },
      { label: 'You outshone REX', value: 1 },
    ])
  })

  it('ignores values between the thresholds', () => {
    expect(score(content, base({ sam: 1, mod: -1, rex: 1 }), 'ivy').mods).toEqual([])
    expect(score(content, base({ sam: -1, mod: 1, rex: 3 }), 'ivy').mods).toEqual([])
  })
})

describe('tiers', () => {
  it('ending tiers break at 3/4 and 8/9', () => {
    expect([3, 4, 8, 9].map(endingTier)).toEqual(['left', 'friends', 'friends', 'good'])
  })

  it('epilogue tiers break at 3/4 and 8/9', () => {
    expect([3, 4, 8, 9].map(epilogueTier)).toEqual(['low', 'mid', 'mid', 'high'])
  })
})

describe('rivalEndings', () => {
  it('shows rivals at >= 3 unless he wanted her and you got the good ending', () => {
    const s = base({ rex: 3, vic: 3, ace: 2 })
    expect(rivalEndings(content, s, 'ivy', 'good').map((r) => r.id)).toEqual(['vic'])
    expect(rivalEndings(content, s, 'ivy', 'friends').map((r) => r.id)).toEqual(['rex', 'vic'])
    expect(rivalEndings(content, s, 'mae', 'good').map((r) => r.id)).toEqual(['rex'])
  })
})
