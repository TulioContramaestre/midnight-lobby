import { describe, expect, it } from 'vitest'
import { applyDeltas, mood, tier } from '@/engine/affection'
import { content, started, withAffection } from './fixtures'

describe('tier', () => {
  it('uses >= 7 high and >= 3 mid', () => {
    expect(tier(2)).toBe('low')
    expect(tier(3)).toBe('mid')
    expect(tier(6)).toBe('mid')
    expect(tier(7)).toBe('high')
    expect(tier(-4)).toBe('low')
    expect(tier(undefined)).toBe('low')
  })
})

describe('mood', () => {
  it('uses >= 6 happy and <= 0 upset', () => {
    const s = started()
    expect(mood(withAffection(s, { ivy: 0 }), 'ivy')).toBe('upset')
    expect(mood(withAffection(s, { ivy: 1 }), 'ivy')).toBe('neutral')
    expect(mood(withAffection(s, { ivy: 5 }), 'ivy')).toBe('neutral')
    expect(mood(withAffection(s, { ivy: 6 }), 'ivy')).toBe('happy')
  })

  it('prefers a mood override', () => {
    const s = { ...withAffection(started(), { ivy: 9 }), moodOverrides: { ivy: 'upset' as const } }
    expect(mood(s, 'ivy')).toBe('upset')
    expect(mood({ ...s, moodOverrides: {} }, 'ivy')).toBe('happy')
  })

  it('is neutral for someone without affection yet', () => {
    expect(mood(started(), 'nobody')).toBe('neutral')
  })
})

describe('applyDeltas', () => {
  it('adds every delta and overrides moods only for love interests with a nonzero delta', () => {
    const s = structuredClone(started())
    s.moodOverrides = { zoe: 'happy' }
    const before = { ...s.affection }
    applyDeltas(content, s, { ivy: 2, mae: -1, zoe: 0, sam: 3, rex: -1 })
    expect(s.affection.ivy).toBe(before.ivy + 2)
    expect(s.affection.mae).toBe(before.mae - 1)
    expect(s.affection.zoe).toBe(before.zoe)
    expect(s.affection.sam).toBe(before.sam + 3)
    expect(s.affection.rex).toBe(before.rex - 1)
    expect(s.moodOverrides).toEqual({ ivy: 'happy', mae: 'upset' })
  })
})
