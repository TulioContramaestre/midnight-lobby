import { describe, expect, it } from 'vitest'
import { createInitialState } from '@/engine/initialState'
import type { Action, GameState } from '@/engine/types'
import { atEvening, content, reducer, run, started, withAffection } from './fixtures'

function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value)
    for (const v of Object.values(value)) deepFreeze(v)
  }
  return value
}

function playthrough(seed: number, pickIndex: number, check?: (s: GameState, a: Action) => void): GameState {
  let s = createInitialState(content, seed)
  const step = (a: Action) => {
    check?.(s, a)
    s = reducer(s, a)
  }
  step({ type: 'goToCreate' })
  step({ type: 'setName', name: '  tester  ' })
  step({ type: 'setPlayerField', field: 'age', value: 19 })
  step({ type: 'begin' })
  for (let day = 0; day < 7; day++) {
    step({ type: 'setView', view: 'feed' })
    step({ type: 'like', postId: s.feed[day % 5].id })
    step({ type: 'setView', view: 'story' })
    for (let slot = 0; slot < 3; slot++) {
      if (day === 6 && slot === 2) {
        step({ type: 'choose', index: pickIndex })
        if (s.phase === 'confront') {
          step({ type: 'confront', index: 0 })
          step({ type: 'seeEnding' })
        }
        return s
      }
      const ref = s.scene!
      const count = content.scene(ref.sceneId)!.variants[ref.variant].choices.length
      step({ type: 'choose', index: (day + slot) % count })
      step({ type: 'continue' })
    }
    step({ type: 'selectEveningGirl', who: ['ivy', 'mae', 'zoe'][day % 3] })
    step({ type: 'setEveningMode', mode: 'queue' })
    step({ type: 'doEvening', action: day % 2 ? { kind: 'activity', id: 'duel' } : { kind: 'milestone', id: 'pfp' } })
    step({ type: 'doEvening', action: { kind: 'activity', id: 'film' } })
    step({ type: 'nextDay' })
  }
  return s
}

describe('reducer flow', () => {
  it('starts on the intro with defaults', () => {
    const s = createInitialState(content, 5)
    expect(s.phase).toBe('intro')
    expect(s.evening.selected).toBe('ivy')
    expect(s.likeCount).toEqual({ ivy: 0, mae: 0, zoe: 0 })
    expect(s.player).toMatchObject({ name: '', age: 22, height: 70, skin: '#s2', hair: '#h1', vibe: 'calm' })
  })

  it('requires a trimmed gamertag and clears the error on typing', () => {
    let s = run(createInitialState(content, 1), { type: 'goToCreate' }, { type: 'begin' })
    expect(s.phase).toBe('create')
    expect(s.createError).toBe('Name required')
    s = reducer(s, { type: 'setName', name: '   ' })
    expect(s.createError).toBe('')
    s = reducer(s, { type: 'begin' })
    expect(s.createError).toBe('Name required')
    expect(s.player.name).toBe('   ')
  })

  it('begin sets starting affection, day 0 posts and the first scene', () => {
    const s = run(createInitialState(content, 1), { type: 'goToCreate' }, { type: 'setName', name: '  neo ' }, { type: 'begin' })
    expect(s.player.name).toBe('neo')
    expect(s.affection).toEqual({ ivy: 2, mae: -1, zoe: 1, sam: 0, lou: 0, kit: 0, mod: 0, rex: 2, vic: 2, ace: 2 })
    expect(s.feed).toHaveLength(5)
    expect(s.unseen).toBe(5)
    expect(s.scene).toEqual({ sceneId: 'd0s0', variant: 0 })
    expect(s.phase).toBe('scene')
  })

  it('choose resolves the reaction, applies deltas and records chips', () => {
    const s = run(started(), { type: 'choose', index: 1 })
    expect(s.phase).toBe('react')
    expect(s.lastReaction).toEqual([
      { speaker: 'ivy', text: 'boo' },
      { speaker: null, text: 'She logs off.' },
    ])
    expect(s.lastChoice).toEqual({ text: 'down', deltas: { ivy: -1, sam: 2 } })
    expect(s.affection.ivy).toBe(1)
    expect(s.affection.sam).toBe(2)
    expect(s.moodOverrides).toEqual({ ivy: 'upset' })
  })

  it('a sequence reaction uses one whole sequence', () => {
    const s = run(started(), { type: 'choose', index: 2 })
    expect([
      [
        { speaker: 'mae', text: 'a' },
        { speaker: 'ivy', text: 'b' },
      ],
      [{ speaker: 'mae', text: 'c' }],
    ]).toContainEqual(s.lastReaction)
  })

  it('continue clears moods and moves through the slots to the evening', () => {
    let s = run(started(), { type: 'choose', index: 0 }, { type: 'continue' })
    expect(s.moodOverrides).toBeNull()
    expect(s.slot).toBe(1)
    expect(s.scene?.sceneId).toBe('d0s1')
    s = run(s, { type: 'choose', index: 0 }, { type: 'continue' }, { type: 'choose', index: 0 }, { type: 'continue' })
    expect(s.phase).toBe('evening')
    expect(s.evening.result).toBeNull()
  })

  it('fixes the tiered variant when the scene loads', () => {
    let s = run(atEvening(), { type: 'nextDay' })
    expect(s.scene).toEqual({ sceneId: 'mae-tiered', variant: 0 })
    s = withAffection(s, { mae: 9 })
    expect(run(s, { type: 'setView', view: 'feed' }, { type: 'setView', view: 'story' }).scene).toEqual({
      sceneId: 'mae-tiered',
      variant: 0,
    })
  })

  it('nextDay resets the daily state and keeps the evening girl', () => {
    let s = run(atEvening(), { type: 'selectEveningGirl', who: 'zoe' }, { type: 'setEveningMode', mode: 'watch' })
    s = run(s, { type: 'doEvening', action: { kind: 'activity', id: 'film' } }, { type: 'like', postId: s.feed[0].id })
    expect(s.likedToday).toBe(true)
    s = run(s, { type: 'setView', view: 'feed' }, { type: 'nextDay' })
    expect(s.day).toBe(1)
    expect(s.slot).toBe(0)
    expect(s.likedToday).toBe(false)
    expect(s.moodOverrides).toBeNull()
    expect(s.evening).toEqual({ selected: 'zoe', mode: null, result: null })
    expect(s.feed).toHaveLength(9)
    expect(s.view).toBe('story')
    expect(s.phase).toBe('scene')
  })

  it('setView resets the unseen counter and jumps the feed to today', () => {
    let s = run(atEvening(), { type: 'nextDay' })
    expect(s.unseen).toBe(10)
    s = run(s, { type: 'setFeedDay', day: 0 }, { type: 'setView', view: 'feed' })
    expect(s.unseen).toBe(0)
    expect(s.feedDay).toBe(1)
    s = run(s, { type: 'like', postId: 'p1ivy' }, { type: 'like', postId: 'p1mae' })
    expect(s.note).toBe('used')
    expect(run(s, { type: 'setView', view: 'people' }).note).toBe('')
    expect(run(s, { type: 'setFeedDay', day: 0 }).note).toBe('')
  })

  it('stepFeedDay clamps between Monday and today', () => {
    let s = run(atEvening(), { type: 'nextDay' }, { type: 'setView', view: 'feed' })
    s = run(s, { type: 'stepFeedDay', delta: 1 })
    expect(s.feedDay).toBe(1)
    s = run(s, { type: 'stepFeedDay', delta: -1 }, { type: 'stepFeedDay', delta: -1 })
    expect(s.feedDay).toBe(0)
  })

  it('reset starts over with the new seed', () => {
    const s = reducer(started(), { type: 'reset', seed: 77 })
    expect(s).toEqual(createInitialState(content, 77))
  })

  it('setPlayerField updates one field', () => {
    const s = run(createInitialState(content, 1), { type: 'setPlayerField', field: 'hairStyle', value: 'long' })
    expect(s.player.hairStyle).toBe('long')
  })
})

describe('purity', () => {
  it('never mutates its input and gives the same result when called twice', () => {
    for (const pick of [0, 1, 2]) {
      playthrough(31 + pick, pick, (s, a) => {
        deepFreeze(s)
        expect(reducer(s, a)).toEqual(reducer(s, a))
      })
    }
  })

  it('is deterministic for a seed', () => {
    expect(playthrough(1234, 1)).toEqual(playthrough(1234, 1))
    expect(playthrough(1234, 1).phase).toBe('ending')
  })

  it('returns the same state object for impossible actions', () => {
    const s = started()
    expect(reducer(s, { type: 'choose', index: 9 })).toBe(s)
    expect(reducer(s, { type: 'doEvening', action: { kind: 'milestone', id: 'sleep' } })).toBe(s)
  })
})
