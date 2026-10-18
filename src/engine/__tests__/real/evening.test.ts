import { describe, expect, it } from 'vitest'
import { registry } from '@/content/registry'
import { createInitialState } from '@/engine/initialState'
import type { GameState } from '@/engine/types'
import { reducer, selectors } from './playthroughs'

const evening = (affection: Record<string, number>, extra: Partial<GameState> = {}): GameState => ({
  ...createInitialState(registry, 3),
  phase: 'evening',
  affection: { nyx: 5, goldie: 5, rhea: 5, mika: 0, theo: 0, jade: 0, benji: 0, ezra: 2, dex: 2, kai: 2, ...affection },
  ...extra,
})

describe('evening with real content', () => {
  it('menu labels', () => {
    const menu = selectors.evening(evening({ nyx: 5 }))
    expect(menu.modes.map((m) => m.label)).toEqual(['Queue a game with Nyx', 'Watch something with Nyx'])
    expect(menu.pfp).toEqual({ unlocked: false, label: 'Match profile pictures with Nyx · get closer to unlock' })
    expect(selectors.evening(evening({ nyx: 6 })).pfp).toEqual({ unlocked: true, label: 'Ask Nyx to match profile pictures', icon: 'photo' })
    expect(selectors.evening(evening({ nyx: 6 })).sleepHint).toBe("Something even more personal unlocks when she's really into you.")
    expect(selectors.evening(evening({ nyx: 8 })).sleep).toEqual({ label: 'Ask Nyx for a sleep call', icon: 'moon' })
    const queue = selectors.evening(evening({}, { evening: { selected: 'rhea', mode: 'queue', result: null } }))
    expect(queue.mode?.prompt).toBe('What are you queuing with Rhea?')
    expect(queue.mode?.activities.map((a) => a.name)).toEqual(['Spikefall', 'Arcanum Lanes', 'Vanguard Protocol', 'Omniverse Clash', 'Petal Valley'])
    const watch = selectors.evening(evening({}, { evening: { selected: 'rhea', mode: 'watch', result: null } }))
    expect(watch.mode?.prompt).toBe('What are you watching with Rhea?')
    expect(watch.mode?.activities.map((a) => a.name)).toEqual(['An anime', 'A horror movie', 'A cozy animated movie', 'Esports finals'])
  })

  it('switching matching pfps from Nyx to Goldie', () => {
    const s = evening({ nyx: 7, goldie: 6 }, { matched: 'nyx', pfpAll: ['nyx'], evening: { selected: 'goldie', mode: null, result: null } })
    const out = reducer(s, { type: 'doEvening', action: { kind: 'milestone', id: 'pfp' } })
    expect(out.evening.result?.deltas).toEqual({ goldie: 2, nyx: -3, dex: -1 })
    expect(out.evening.result?.lines.slice(1)).toEqual([
      { speaker: null, text: 'Nyx noticed you switched to matching pfps with Goldie. She changed hers back within the minute.' },
      { speaker: null, text: 'Your profile picture now matches hers.' },
    ])
    expect(selectors.playerAvatar(out).spec).toMatchObject({ bg: '#FAC775', ears: 'dog', earColor: '#854F0B', earInner: '#854F0B' })
  })

  it("Nyx's pfp gain is 3 and her rival is Ezra", () => {
    const s = evening({ nyx: 6 })
    const out = reducer(s, { type: 'doEvening', action: { kind: 'milestone', id: 'pfp' } })
    expect(out.evening.result?.deltas).toEqual({ nyx: 3, ezra: -1 })
  })
})
