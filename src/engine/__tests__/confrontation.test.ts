import { describe, expect, it } from 'vitest'
import { describeOffenses, shouldConfront } from '@/engine/confrontation'
import { score } from '@/engine/scoring'
import { createSelectors } from '@/engine/selectors'
import type { GameState } from '@/engine/types'
import { content, run, started } from './fixtures'

const selectors = createSelectors(content)

function atPick(extra: Partial<GameState> = {}): GameState {
  return { ...started(), day: 6, slot: 2, scene: { sceneId: 'pick', variant: 0 }, ...extra }
}

describe('describeOffenses', () => {
  it('describes one offense', () => {
    expect(describeOffenses(content, atPick({ slept: ['mae'] }), 'ivy')).toBe('the sleep call with Mae')
    expect(describeOffenses(content, atPick({ pfpAll: ['zoe'] }), 'ivy')).toBe('the matching pfps with Zoe')
  })

  it('describes two offenses and skips the picked girl', () => {
    const s = atPick({ slept: ['mae', 'ivy', 'zoe'], pfpAll: ['ivy', 'zoe'] })
    expect(describeOffenses(content, s, 'ivy')).toBe('the sleep call with Mae and Zoe and the matching pfps with Zoe')
  })
})

describe('the Sunday pick', () => {
  it('goes straight to the ending when you only did things with her', () => {
    const s = atPick({ slept: ['ivy'], pfpAll: ['ivy'], matched: 'ivy' })
    expect(shouldConfront(s, 'ivy')).toBe(false)
    const out = run(s, { type: 'choose', index: 0 })
    expect(out).toMatchObject({ pick: 'ivy', phase: 'ending', moodOverrides: null, view: 'story' })
  })

  it('confronts you with her portrait upset otherwise', () => {
    const out = run(atPick({ pfpAll: ['mae'], view: 'feed' }), { type: 'choose', index: 0 })
    expect(out).toMatchObject({ pick: 'ivy', phase: 'confront', moodOverrides: { ivy: 'upset' }, view: 'story' })
    expect(selectors.confrontation(out)?.lines).toEqual([
      { speaker: null, text: 'Ivy calls.' },
      { speaker: 'ivy', text: 'heard about the matching pfps with Mae.' },
    ])
  })

  it('a confrontation choice changes her mood, replies, and only counts in scoring', () => {
    const s = run(atPick({ pfpAll: ['mae'] }), { type: 'choose', index: 0 })
    const honest = run(s, { type: 'confront', index: 0 })
    expect(honest.confrontation).toEqual({ choiceIndex: 0, reply: 'fair' })
    expect(honest.moodOverrides).toEqual({ ivy: 'neutral' })
    expect(honest.affection).toEqual(s.affection)
    expect(selectors.confrontation(honest)?.chosen?.chips).toEqual([{ id: 'ivy', label: 'Ivy', good: true, up: true }])
    expect(score(content, honest, 'ivy').mods.at(-1)).toEqual({ label: 'You were honest', value: 2 })

    const lied = run(s, { type: 'confront', index: 2 })
    expect(lied.moodOverrides).toEqual({ ivy: 'upset' })
    const ended = run(lied, { type: 'seeEnding' })
    expect(ended.phase).toBe('ending')
    expect(ended.moodOverrides).toBeNull()
  })
})
