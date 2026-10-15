import { describe, expect, it } from 'vitest'
import { registry } from '@/content/registry'
import { describeOffenses, shouldConfront } from '@/engine/confrontation'
import { createInitialState } from '@/engine/initialState'
import type { GameState } from '@/engine/types'
import { reducer, selectors } from './playthroughs'

const at = (pick: string, slept: string[], pfpAll: string[]): GameState => ({ ...createInitialState(registry, 1), pick, slept, pfpAll })
const spoken = (s: GameState) => selectors.confrontation(s)!.lines[1].text

describe('describeOffenses and the confrontation lines', () => {
  it('Nyx lower-cases everything', () => {
    const one = at('nyx', ['goldie'], [])
    expect(describeOffenses(registry, one, 'nyx')).toBe('the sleep call with Goldie')
    expect(spoken(one)).toBe("mika sent me screenshots. the sleep call with goldie. i'm not mad. ...ok i'm a little mad.")
    const two = at('nyx', ['goldie', 'rhea'], ['rhea'])
    expect(describeOffenses(registry, two, 'nyx')).toBe('the sleep call with Goldie and Rhea and the matching pfps with Rhea')
    expect(spoken(two)).toBe(
      "mika sent me screenshots. the sleep call with goldie and rhea and the matching pfps with rhea. i'm not mad. ...ok i'm a little mad.",
    )
    expect(selectors.confrontation(one)!.lines[0]).toEqual({ speaker: null, text: 'Before you can send anything else, Nyx calls. She never calls.' })
  })

  it('Goldie lower-cases everything', () => {
    const one = at('goldie', [], ['nyx'])
    expect(describeOffenses(registry, one, 'goldie')).toBe('the matching pfps with Nyx')
    expect(spoken(one)).toBe('theo told me about the matching pfps with nyx... is it true?? please just tell me the truth')
    const two = at('goldie', ['nyx', 'goldie'], ['rhea', 'goldie'])
    expect(describeOffenses(registry, two, 'goldie')).toBe('the sleep call with Nyx and the matching pfps with Rhea')
    expect(spoken(two)).toBe(
      'theo told me about the sleep call with nyx and the matching pfps with rhea... is it true?? please just tell me the truth',
    )
  })

  it('Rhea capitalises the first letter only', () => {
    const one = at('rhea', ['nyx'], [])
    expect(spoken(one)).toBe('Jade sent me screenshots. The sleep call with Nyx. Explain. Now.')
    const two = at('rhea', ['nyx', 'goldie'], ['goldie'])
    expect(describeOffenses(registry, two, 'rhea')).toBe('the sleep call with Nyx and Goldie and the matching pfps with Goldie')
    expect(spoken(two)).toBe('Jade sent me screenshots. The sleep call with Nyx and Goldie and the matching pfps with Goldie. Explain. Now.')
  })
})

describe('the Sunday pick', () => {
  const sunday = (extra: Partial<GameState>): GameState => ({
    ...createInitialState(registry, 1),
    phase: 'scene',
    day: 6,
    slot: 2,
    scene: { sceneId: 'd7-who-do-you-choose', variant: 0 },
    ...extra,
  })

  it('skips the confrontation when the sleep call and pfps were only with her', () => {
    const s = sunday({ slept: ['goldie'], pfpAll: ['goldie'], matched: 'goldie' })
    expect(shouldConfront(s, 'goldie')).toBe(false)
    expect(reducer(s, { type: 'choose', index: 1 })).toMatchObject({ pick: 'goldie', phase: 'ending' })
  })

  it('confronts you about anyone else', () => {
    const s = sunday({ slept: ['goldie'], pfpAll: ['goldie'], matched: 'goldie' })
    expect(reducer(s, { type: 'choose', index: 0 })).toMatchObject({ pick: 'nyx', phase: 'confront', moodOverrides: { nyx: 'upset' } })
  })
})
