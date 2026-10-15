import { describe, expect, it } from 'vitest'
import { addPostsForDay } from '@/engine/feed'
import type { GameState } from '@/engine/types'
import { atEvening, content, run, started, withAffection } from './fixtures'

describe('addPostsForDay', () => {
  it('inserts love interests then extras by order, newest first', () => {
    const s = started()
    expect(s.feed.map((p) => p.id)).toEqual(['p0sam', 'p0mod', 'p0zoe', 'p0mae', 'p0ivy'])
    expect(s.feed.map((p) => p.likes)).toEqual([5 + 11, 5 + 9, 19, 19, 19])
    expect(s.feed.every((p) => p.day === 0 && !p.liked && p.reply === null)).toBe(true)
  })

  it('picks warm at >= 3 and uses the reference like formulas', () => {
    const s = structuredClone(withAffection(started(), { ivy: 3, mae: 2 }))
    s.feed = []
    s.unseen = 0
    addPostsForDay(content, s, 1)
    const byId = Object.fromEntries(s.feed.map((p) => [p.id, p]))
    expect(byId.p1ivy.text).toBe('ivy day1 warm')
    expect(byId.p1ivy.likes).toBe(14 + ((1 * 37 + 3 * 29 + 13) % 90))
    expect(byId.p1mae.text).toBe('mae day1 cold!')
    expect(byId.p1mae.likes).toBe(14 + ((1 * 37 + 3 * 29 + 14) % 90))
    expect(byId.p1rex.likes).toBe(5 + ((1 * 13 + 9) % 60))
    expect(s.unseen).toBe(5)
  })
})

describe('like', () => {
  const like = (s: GameState, postId: string) => run(s, { type: 'like', postId })

  it('a love interest gets +1, the others -1, and she replies', () => {
    const s = started()
    const out = like(s, 'p0ivy')
    expect(out.affection.ivy).toBe(s.affection.ivy + 1)
    expect(out.affection.mae).toBe(s.affection.mae - 1)
    expect(out.affection.zoe).toBe(s.affection.zoe - 1)
    expect(out.likeCount).toEqual({ ivy: 1, mae: 0, zoe: 0 })
    const post = out.feed.find((p) => p.id === 'p0ivy')!
    expect(post).toMatchObject({ liked: true, likes: 20 })
    expect(['ivy reply a', 'ivy reply b']).toContain(post.reply)
    expect(out.note).toBe('Liked Ivy · Mae and Zoe')
    expect(out.likedToday).toBe(true)
  })

  it('one like per day, checked after already-liked', () => {
    const s = like(started(), 'p0ivy')
    expect(like(s, 'p0ivy').note).toBe('already')
    const again = like(s, 'p0mae')
    expect(again.note).toBe('used')
    expect(again.affection).toEqual(s.affection)
  })

  it('supporting characters and rivals get +1', () => {
    const s = started()
    const sam = like(s, 'p0sam')
    expect(sam.affection.sam).toBe(1)
    expect(sam.note).toBe('Liked SAM')
    expect(sam.feed.find((p) => p.id === 'p0sam')?.reply).toBeNull()

    const day1 = run(atEvening(), { type: 'nextDay' })
    const rex = like(day1, 'p1rex')
    expect(rex.affection.rex).toBe(day1.affection.rex + 1)
    expect(rex.note).toBe('Hyped REX for Ivy')
  })

  it('likes are refused once the week is over', () => {
    const s = like(started(), 'p0ivy')
    for (const phase of ['confront', 'ending'] as const) {
      const ended = { ...s, phase, likedToday: false }
      const out = like(ended, 'p0mae')
      expect(out.note).toBe('over')
      expect(out.affection).toEqual(ended.affection)
      expect(like(ended, 'p0ivy').note).toBe('over')
    }
  })
})
