import { describe, expect, it } from 'vitest'
import { registry } from '@/content/registry'
import { createInitialState } from '@/engine/initialState'
import { createReducer } from '@/engine/reducer'
import { createSelectors } from '@/engine/selectors'
import type { CharacterId } from '@/content/types'
import { LOC, type Loc } from '../locations'
import { isPickScene, sceneLoc } from '../queries'
import { createSession, createSessionReducer } from '../reducer'
import type { LogEntry, Session, SessionAction } from '../types'

const selectors = createSelectors(registry)
const reducer = createSessionReducer(registry, createReducer(registry), selectors)

function start(seed = 7): Session {
  let s = createSession(createInitialState(registry, seed))
  s = reducer(s, { type: 'game', action: { type: 'goToCreate' } })
  s = reducer(s, { type: 'game', action: { type: 'setName', name: 'kai_fan' } })
  return reducer(s, { type: 'launch' })
}

function apply(s: Session, ...actions: SessionAction[]): Session {
  return actions.reduce(reducer, s)
}

function playScene(s: Session, index = 0): Session {
  const loc = sceneLoc(registry, s.game) as Loc
  return apply(s, { type: 'go', loc }, { type: 'pick', index }, { type: 'showTyping' }, { type: 'advance' })
}

function playToAskOut(s: Session, eveningWith: CharacterId = 'goldie'): Session {
  while (!isPickScene(registry, s.game)) {
    if (s.game.phase === 'scene') s = playScene(s)
    else if (s.game.phase === 'evening') {
      s = apply(
        s,
        { type: 'go', loc: `dm:${eveningWith}` },
        { type: 'evDo', who: eveningWith, action: { kind: 'activity', id: 'spike' } },
        { type: 'endNight' },
        { type: 'startNextDay' },
      )
    } else throw new Error('unexpected phase ' + s.game.phase)
  }
  return s
}

const msgs = (log: LogEntry[] | undefined) => (log ?? []).filter((e) => e.kind === 'msg')

describe('session reducer', () => {
  it('launches into #welcome with a join line and posts the first scene in #general', () => {
    const s = start()
    expect(s.game.phase).toBe('scene')
    expect(s.loc).toBe('ch:welcome')
    expect(s.logs['ch:welcome']).toEqual([
      { kind: 'divider', text: 'MONDAY' },
      { kind: 'join', time: 'Today at 9:02 PM' },
    ])
    const cur = selectors.currentScene(s.game)!
    expect(LOC[cur.title]).toBe('ch:general')
    expect(s.logs['ch:general']?.[0]).toEqual({ kind: 'divider', text: 'MONDAY' })
    expect(s.logs['ch:general']?.length).toBe(cur.lines.length + 1)
    expect(s.seen).toEqual({ '0-0': true })
  })

  it('refuses a launch without a gamertag and keeps the error', () => {
    let s = createSession(createInitialState(registry, 1))
    s = apply(s, { type: 'game', action: { type: 'goToCreate' } }, { type: 'launch' })
    expect(s.game.phase).toBe('create')
    expect(s.game.createError).toBe(registry.creation.nameRequired)
    expect(s.logs).toEqual({})
  })

  it('ignores a reply while the scene is in another location', () => {
    const s = start()
    expect(reducer(s, { type: 'pick', index: 0 })).toBe(s)
  })

  it('posts the reply and the reaction, then the next scene after advancing', () => {
    let s = start()
    s = apply(s, { type: 'go', loc: 'ch:general' }, { type: 'pick', index: 0 })
    expect(s.game.phase).toBe('react')
    const log = s.logs['ch:general']!
    const reply = log.findIndex((e) => e.kind === 'msg' && e.id === 'you')
    expect(log[reply]).toMatchObject({ text: selectors.currentScene(s.game)!.choices[0], time: 'Today at 9:14 PM' })
    expect(log.length - reply - 1).toBe(s.game.lastReaction!.length)
    for (const e of log.slice(reply + 1)) {
      if (e.kind === 'msg' && registry.loveInterest(e.id)) expect(e.mood).toBe(selectors.mood(s.game, e.id))
    }
    expect(reducer(s, { type: 'pick', index: 0 })).toBe(s)
    s = apply(s, { type: 'showTyping' }, { type: 'advance' })
    expect(s.game.phase).toBe('scene')
    expect(s.game.slot).toBe(1)
    expect(s.typing).toBe(false)
    expect(selectors.currentScene(s.game)!.title).toBe('House rules')
    expect(s.logs['ch:welcome']!.at(-1)).toMatchObject({ time: 'Today at 10:32 PM' })
  })

  it('shows typing only when the next scene happens where the player is', () => {
    let s = start()
    s = apply(s, { type: 'go', loc: 'ch:general' }, { type: 'pick', index: 0 }, { type: 'showTyping' })
    expect(s.typing).toBe(false)
    s = apply(s, { type: 'advance' }, { type: 'go', loc: 'ch:welcome' }, { type: 'pick', index: 0 })
    s = apply(s, { type: 'go', loc: 'dm:goldie' }, { type: 'showTyping' })
    expect(s.typing).toBe(true)
  })

  it('posts each scene once, in its mapped location, across the week', () => {
    const s = playToAskOut(start(11))
    const scenes = registry.scenes.filter((sc) => LOC[sc.title] !== 'pick')
    const replies = Object.values(s.logs).flatMap((log) => msgs(log).filter((e) => e.id === 'you'))
    expect(replies.length).toBe(scenes.length)
    expect(Object.keys(s.seen).length).toBe(scenes.length + 1)
    for (const day of [0, 1, 2, 3, 4, 5, 6]) {
      const name = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'][day]
      for (const [loc, log] of Object.entries(s.logs)) {
        expect(log!.filter((e) => e.kind === 'divider' && e.text === name).length, loc).toBeLessThanOrEqual(1)
      }
    }
  })

  it('logs the evening hangout as a system line followed by her lines', () => {
    let s = start(3)
    while (s.game.phase !== 'evening') s = playScene(s)
    s = apply(s, { type: 'go', loc: 'dm:nyx' }, { type: 'evMode', who: 'nyx', mode: 'watch' })
    expect(s.game.evening).toMatchObject({ selected: 'nyx', mode: 'watch' })
    s = reducer(s, { type: 'evDo', who: 'nyx', action: { kind: 'activity', id: 'horror' } })
    const log = s.logs['dm:nyx']!
    const sys = log.findIndex((e) => e.kind === 'sys')
    expect(log[sys]).toEqual({ kind: 'sys', icon: 'device-tv', text: 'You put on a horror movie with Nyx.', time: '12:20 AM' })
    expect(log.length - sys - 1).toBe(s.game.evening.result!.lines.length)
    expect(reducer(s, { type: 'evDo', who: 'nyx', action: { kind: 'activity', id: 'anime' } })).toBe(s)
    s = apply(s, { type: 'endNight' })
    expect(s.summary).toBe(true)
    s = reducer(s, { type: 'startNextDay' })
    expect(s.summary).toBe(false)
    expect(s.game.day).toBe(1)
    expect(s.daySnap).toEqual({ nyx: s.game.affection.nyx, goldie: s.game.affection.goldie, rhea: s.game.affection.rhea })
  })

  it('asks her out without a confrontation and goes straight to the ending', () => {
    let s = playToAskOut(start(5))
    const i = selectors.currentScene(s.game)!.choices.findIndex((c) => c.startsWith('Message Goldie'))
    s = reducer(s, { type: 'askPick', index: i })
    expect(s.game.phase).toBe('ending')
    expect(s.loc).toBe('dm:goldie')
    expect(s.logs['dm:goldie']!.at(-1)).toEqual({
      kind: 'msg',
      id: 'you',
      mood: 'neutral',
      text: 'Hey!! Can I take you on a real date? Please say yes!!',
      time: 'Today at 11:58 PM',
    })
  })

  it('runs the confrontation in her DM', () => {
    let s = playToAskOut(start(5))
    s = { ...s, game: { ...s.game, pfpAll: ['nyx'] } }
    const i = selectors.currentScene(s.game)!.choices.findIndex((c) => c.startsWith('Message Rhea'))
    s = reducer(s, { type: 'askPick', index: i })
    expect(s.game.phase).toBe('confront')
    expect(s.loc).toBe('dm:rhea')
    const conf = selectors.confrontation(s.game)!
    const log = s.logs['dm:rhea']!
    expect(log.slice(-conf.lines.length).map((e) => (e.kind === 'msg' || e.kind === 'narr' ? e.text : ''))).toEqual(
      conf.lines.map((l) => l.text),
    )
    expect(msgs(log).filter((e) => e.id === 'rhea').at(-1)?.mood).toBe('upset')
    s = reducer(s, { type: 'confPick', index: 2 })
    expect(s.logs['dm:rhea']!.slice(-2)).toEqual([
      { kind: 'msg', id: 'you', mood: 'neutral', text: conf.choices[2], time: 'Today at 11:59 PM' },
      { kind: 'msg', id: 'rhea', mood: selectors.mood(s.game, 'rhea'), text: s.game.confrontation!.reply, time: 'Today at 11:59 PM' },
    ])
    expect(reducer(s, { type: 'confPick', index: 0 })).toBe(s)
    s = apply(s, { type: 'game', action: { type: 'seeEnding' } })
    expect(s.game.phase).toBe('ending')
    s = reducer(s, { type: 'playAgain', seed: 9 })
    expect(s.game.phase).toBe('intro')
    expect(s.logs).toEqual({})
  })

  it('opens a mobile panel and closes it on navigation', () => {
    let s = start()
    expect(s.panel).toBeNull()
    s = reducer(s, { type: 'setPanel', panel: 'nav' })
    expect(s.panel).toBe('nav')
    s = reducer(s, { type: 'setPanel', panel: 'members' })
    expect(s.panel).toBe('members')
    s = reducer(s, { type: 'go', loc: 'ch:general' })
    expect(s.loc).toBe('ch:general')
    expect(s.panel).toBeNull()
  })
})
