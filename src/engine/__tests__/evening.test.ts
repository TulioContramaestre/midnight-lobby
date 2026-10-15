import { describe, expect, it } from 'vitest'
import { createSelectors } from '@/engine/selectors'
import type { EveningAction, GameState } from '@/engine/types'
import { atEvening, content, reducer, run, withAffection } from './fixtures'

const selectors = createSelectors(content)
const doEvening = (s: GameState, action: EveningAction) => reducer(s, { type: 'doEvening', action })
const pfp: EveningAction = { kind: 'milestone', id: 'pfp' }
const sleep: EveningAction = { kind: 'milestone', id: 'sleep' }

describe('evening', () => {
  it('queue: reaction, narration, and a pre-action tier line only when her effect is positive', () => {
    const s = withAffection(atEvening(), { ivy: 5, zoe: 4 })
    const ivy = doEvening(s, { kind: 'activity', id: 'duel' })
    expect(ivy.evening.result?.lines).toEqual([
      { speaker: 'ivy', text: 'ivy duel' },
      { speaker: null, text: expect.stringMatching(/^You win \d\.$/) },
      { speaker: 'ivy', text: 'ivy queue mid' },
    ])
    expect(ivy.affection.ivy).toBe(7)
    expect(ivy.evening.mode).toBeNull()

    const zoe = doEvening(run(s, { type: 'selectEveningGirl', who: 'zoe' }), { kind: 'activity', id: 'duel' })
    expect(zoe.evening.result?.lines).toHaveLength(2)
    expect(zoe.evening.result?.deltas).toEqual({ zoe: -1, ace: -1 })
  })

  it('watch uses the watch tier lines', () => {
    const s = withAffection(atEvening(), { ivy: 8 })
    const out = doEvening(s, { kind: 'activity', id: 'film' })
    expect(out.evening.result?.lines.at(-1)).toEqual({ speaker: 'ivy', text: 'ivy watch high' })
  })

  it('every evening action costs her rival 1', () => {
    const s = withAffection(atEvening(), { ivy: 8 })
    for (const action of [{ kind: 'activity', id: 'duel' }, { kind: 'activity', id: 'film' }, pfp, sleep] as EveningAction[]) {
      expect(doEvening(s, action).affection.rex).toBe(s.affection.rex - 1)
    }
  })

  it('pfp unlocks at 6 and sleep at 8', () => {
    const s = atEvening()
    expect(doEvening(withAffection(s, { ivy: 5 }), pfp)).toEqual(withAffection(s, { ivy: 5 }))
    expect(doEvening(withAffection(s, { ivy: 6 }), pfp).matched).toBe('ivy')
    expect(doEvening(withAffection(s, { ivy: 7 }), sleep)).toEqual(withAffection(s, { ivy: 7 }))
    expect(doEvening(withAffection(s, { ivy: 8 }), sleep).slept).toEqual(['ivy'])
  })

  it('the menu shows the locked pfp, the sleep hint and the sleep option at the right values', () => {
    const s = atEvening()
    const at = (v: number) => selectors.evening(withAffection(s, { ivy: v }))
    expect(at(5).pfp).toEqual({ unlocked: false, label: 'Match with Ivy · locked' })
    expect(at(5).sleepHint).toBeNull()
    expect(at(6).pfp).toEqual({ unlocked: true, label: 'Match with Ivy', icon: 'photo' })
    expect(at(6).sleepHint).toBe('Hint.')
    expect(at(7).sleep).toBeNull()
    expect(at(7).sleepHint).toBe('Hint.')
    expect(at(8).sleep).toEqual({ label: 'Sleep call with Ivy', icon: 'moon' })
    expect(at(8).sleepHint).toBeNull()
    expect(selectors.evening({ ...withAffection(s, { ivy: 8 }), matched: 'ivy' }).pfp).toBeNull()
  })

  it('switching pfps costs the previous match 3 and records both', () => {
    const s: GameState = { ...withAffection(atEvening(), { ivy: 6, mae: 6 }), matched: 'mae', pfpAll: ['mae'] }
    const out = doEvening(s, pfp)
    expect(out.evening.result?.deltas).toEqual({ ivy: 3, mae: -3, rex: -1 })
    expect(Object.keys(out.evening.result!.deltas)).toEqual(['ivy', 'mae', 'rex'])
    expect(out.evening.result?.lines).toEqual([
      { speaker: 'ivy', text: 'ivy pfp mid' },
      { speaker: null, text: 'Mae noticed you switched to Ivy.' },
      { speaker: null, text: 'Matched.' },
    ])
    expect(out.matched).toBe('ivy')
    expect(out.pfpAll).toEqual(['mae', 'ivy'])
    expect(out.affection).toMatchObject({ ivy: 9, mae: 3 })
    expect(out.moodOverrides).toEqual({ ivy: 'happy', mae: 'upset' })
    expect(out.flags).toMatchObject({ 'matched:mae': false, 'matched:ivy': true, 'pfp:ivy': true })
    expect(selectors.deltaChips(out.evening.result!.deltas)).toEqual([
      { id: 'ivy', label: 'Ivy', good: true, up: true },
      { id: 'mae', label: 'Mae', good: false, up: false },
      { id: 'rex', label: "REX's odds", good: true, up: false },
    ])
  })

  it('the pfp line pool is high only at the high tier', () => {
    const s = withAffection(atEvening(), { ivy: 7 })
    expect(doEvening(s, pfp).evening.result?.lines[0]).toEqual({ speaker: 'ivy', text: 'ivy pfp high' })
  })

  it('a repeat sleep call gives +1 instead of the full gain', () => {
    const s = withAffection(atEvening(), { ivy: 8 })
    const first = doEvening(s, sleep)
    expect(first.evening.result?.deltas.ivy).toBe(2)
    expect(first.evening.result?.lines).toEqual([
      { speaker: 'ivy', text: 'ivy sleep line' },
      { speaker: null, text: 'zzz' },
    ])
    expect(first.flags['slept:ivy']).toBe(true)
    const again = doEvening(run(first, { type: 'nextDay' }, { type: 'continue' }, { type: 'continue' }, { type: 'continue' }), sleep)
    expect(again.evening.result?.deltas.ivy).toBe(1)
    expect(again.slept).toEqual(['ivy'])
  })

  it('one action per evening', () => {
    const s = withAffection(atEvening(), { ivy: 8 })
    const once = doEvening(s, { kind: 'activity', id: 'film' })
    expect(doEvening(once, sleep)).toBe(once)
  })

  it('switching girls keeps the open activity list', () => {
    const s = run(atEvening(), { type: 'setEveningMode', mode: 'queue' }, { type: 'selectEveningGirl', who: 'mae' })
    expect(s.evening.mode).toBe('queue')
    expect(selectors.evening(s).mode?.prompt).toBe('Queue what with Mae?')
    expect(selectors.evening(s).mode?.activities.map((a) => a.id)).toEqual(['duel'])
  })
})
