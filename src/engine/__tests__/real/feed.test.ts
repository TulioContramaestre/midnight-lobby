import { describe, expect, it } from 'vitest'
import { registry } from '@/content/registry'
import { addPostsForDay } from '@/engine/feed'
import { createInitialState } from '@/engine/initialState'
import type { GameState } from '@/engine/types'
import { reducer } from './playthroughs'

const begun = (): GameState =>
  [{ type: 'goToCreate' }, { type: 'setName', name: 'x' }, { type: 'begin' }].reduce(
    (s, a) => reducer(s, a as Parameters<typeof reducer>[1]),
    createInitialState(registry, 1),
  )

describe('Chirp with real content', () => {
  it('Monday shows the extras newest first, then Rhea, Goldie, Nyx', () => {
    expect(begun().feed.map((p) => [p.id, p.likes, p.text])).toEqual([
      ['p0ezra', 45, 'nail polish chipped. day ruined. anyway.'],
      ['p0benji', 57, 'welcome to midnight lobby. read the rules. yes, you.'],
      ['p0rhea', 74, "New player. Let's see if he lasts."],
      ['p0goldie', 64, 'NEW FRIEND ALERT!! the server is growing!! best day ever'],
      ['p0nyx', 48, "new person in the server. jury's out."],
    ])
  })

  it('Tuesday picks warm or cold by affection and counts likes from the text', () => {
    const s = structuredClone(begun())
    Object.assign(s.affection, { nyx: 3, goldie: 2, rhea: 3 })
    addPostsForDay(registry, s, 1)
    expect(s.feed.filter((p) => p.day === 1).map((p) => [p.id, p.likes, p.text])).toEqual([
      ['p1mika', 21, 'nyx said one nice thing on stream today. clipped it. framed it.'],
      ['p1kai', 58, 'Spikefall rank 2. Rank 1 is a formality.'],
      ['p1rhea', 45, 'Played with someone who can actually follow a call. Noted.'],
      ['p1goldie', 15, 'is it weird to want people to be excited back? asking for me'],
      ['p1nyx', 96, 'someone in vc actually has taste in music. rare.'],
    ])
    expect(s.unseen).toBe(10)
  })

  it('like notes', () => {
    const s = begun()
    expect(reducer(s, { type: 'like', postId: 'p0nyx' }).note).toBe('Liked. Nyx ↑ · Goldie and Rhea noticed ↓')
    expect(reducer(s, { type: 'like', postId: 'p0rhea' }).note).toBe('Liked. Rhea ↑ · Nyx and Goldie noticed ↓')
    expect(reducer(s, { type: 'like', postId: 'p0benji' }).note).toBe("Liked. Benji's opinion of you ↑")
    expect(reducer(s, { type: 'like', postId: 'p0ezra' }).note).toBe("You hyped up your own competition. Ezra's odds with Nyx ↑")
    const liked = reducer(s, { type: 'like', postId: 'p0nyx' })
    expect(registry.loveInterest('nyx')!.feed.replies).toContain(liked.feed.find((p) => p.id === 'p0nyx')!.reply)
    expect(reducer(liked, { type: 'like', postId: 'p0nyx' }).note).toBe('You already liked that one.')
    expect(reducer(liked, { type: 'like', postId: 'p0goldie' }).note).toBe("You've used today's like. You get a new one tomorrow.")
    expect(reducer({ ...liked, phase: 'ending' }, { type: 'like', postId: 'p0goldie' }).note).toBe("The week is over. Likes don't count anymore.")
  })
})
