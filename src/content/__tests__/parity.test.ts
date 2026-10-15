import { describe, expect, it } from 'vitest'
import { registry } from '@/content/registry'

const byId = <T extends { id: string }>(items: T[]) => Object.fromEntries(items.map((x) => [x.id, x]))

describe('content counts match the reference', () => {
  it('scenes, variants and choices', () => {
    expect(registry.scenes).toHaveLength(21)
    expect(registry.scenes.filter((s) => s.variants.length === 3)).toHaveLength(6)
    expect(registry.scenes.reduce((n, s) => n + s.variants.length, 0)).toBe(33)
    for (const s of registry.scenes) for (const v of s.variants) expect(v.choices).toHaveLength(3)
    const tiered = registry.scenes
      .filter((s) => s.variants.length === 3)
      .map((s) => [s.day, s.slot, s.cast[0]])
    expect(tiered).toEqual([
      [1, 0, 'rhea'],
      [2, 0, 'nyx'],
      [2, 2, 'goldie'],
      [3, 2, 'goldie'],
      [5, 0, 'nyx'],
      [5, 2, 'rhea'],
    ])
  })

  it('activities', () => {
    expect(registry.activities.filter((a) => a.mode === 'queue').map((a) => a.id)).toEqual(['spike', 'lanes', 'vanguard', 'omni', 'petal'])
    expect(registry.activities.filter((a) => a.mode === 'watch').map((a) => a.id)).toEqual(['anime', 'horror', 'cozy', 'esports'])
  })

  it('posts per day', () => {
    for (let d = 0; d < 7; d++) {
      const girls = registry.loveInterests.map((li) => li.feed.posts[d])
      const extras = [...registry.supporting, ...registry.rivals].flatMap((c) => c.posts.filter((p) => p.day === d))
      expect(girls.filter(Boolean)).toHaveLength(3)
      expect(extras).toHaveLength(2)
      for (const p of girls) expect(typeof p === 'string').toBe(d === 0)
    }
  })

  it('endings, epilogues and rival endings', () => {
    expect(registry.loveInterests.flatMap((li) => Object.keys(li.endings))).toHaveLength(9)
    expect(registry.loveInterests.flatMap((li) => Object.keys(li.epilogue))).toHaveLength(9)
    expect(registry.rivals.filter((r) => r.rivalEnding)).toHaveLength(3)
  })

  it('evening, milestone, reply and confrontation lines', () => {
    const li = byId(registry.loveInterests)
    const counts = (id: string, mode: string) => ['low', 'mid', 'high'].map((t) => li[id].eveningLines[mode][t as 'low'].length)
    expect(['nyx', 'goldie', 'rhea'].map((id) => counts(id, 'queue'))).toEqual([
      [2, 3, 3],
      [2, 2, 3],
      [2, 2, 3],
    ])
    expect(['nyx', 'goldie', 'rhea'].map((id) => counts(id, 'watch'))).toEqual([
      [2, 2, 2],
      [2, 2, 2],
      [2, 2, 2],
    ])
    for (const g of registry.loveInterests) {
      expect(g.feed.replies).toHaveLength(4)
      expect([g.milestones.pfp.lines.mid.length, g.milestones.pfp.lines.high.length]).toEqual([2, 2])
      expect(g.milestones.sleep.lines).toHaveLength(3)
      expect(g.confrontation.choices).toHaveLength(3)
    }
    expect(registry.milestones.sleep.narration).toHaveLength(4)
  })

  it('character creation', () => {
    expect(registry.creation.ethnicities).toHaveLength(11)
    expect(registry.creation.vibes).toHaveLength(4)
    expect(registry.creation.skins).toHaveLength(6)
    expect(registry.creation.hairs).toHaveLength(6)
    expect(registry.creation.hairStyles).toHaveLength(4)
    expect(registry.creation.age).toHaveLength(4)
    expect(registry.creation.height).toHaveLength(4)
  })

  it('cast', () => {
    expect(registry.loveInterests.map((c) => c.id)).toEqual(['nyx', 'goldie', 'rhea'])
    expect(registry.supporting.map((c) => c.id)).toEqual(['mika', 'theo', 'jade', 'benji'])
    expect(registry.rivals.map((c) => c.id)).toEqual(['ezra', 'dex', 'kai'])
  })
})
