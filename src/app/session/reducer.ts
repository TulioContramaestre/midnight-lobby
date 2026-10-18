import type { CharacterId, ContentRegistry } from '@/content/types'
import { DAY_NAMES } from '@/engine/constants'
import { canDoEvening } from '@/engine/evening'
import type { Reducer } from '@/engine/reducer'
import type { Selectors } from '@/engine/selectors'
import type { Action, EveningAction, GameState, ResolvedLine } from '@/engine/types'
import { EVE_TIME, LOC, TIMES, type Loc } from './locations'
import { canConfPick, canPick, currentSceneDef, isPickScene, nextSceneDef, sceneLoc } from './queries'
import type { LogEntry, Session, SessionAction, SysIcon } from './types'

export function createSession(game: GameState): Session {
  return {
    game,
    loc: 'ch:welcome',
    lastCh: 'ch:welcome',
    lastDm: 'dm:goldie',
    logs: {},
    lastDay: {},
    active: {},
    n: 0,
    seen: {},
    typing: false,
    summary: false,
    profileOpen: false,
    daySnap: {},
  }
}

export function createSessionReducer(content: ContentRegistry, reducer: Reducer, selectors: Selectors) {
  function draft(s: Session): Session {
    return { ...s, logs: { ...s.logs }, lastDay: { ...s.lastDay }, active: { ...s.active }, seen: { ...s.seen } }
  }

  function run(x: Session, action: Action): void {
    x.game = reducer(x.game, action)
  }

  function push(x: Session, loc: Loc, entry: LogEntry): void {
    const log = [...(x.logs[loc] ?? [])]
    if (x.lastDay[loc] !== x.game.day) {
      x.lastDay[loc] = x.game.day
      log.push({ kind: 'divider', text: DAY_NAMES[x.game.day].toUpperCase() })
    }
    log.push(entry)
    x.logs[loc] = log
    x.active[loc] = ++x.n
  }

  function pushLine(x: Session, loc: Loc, l: ResolvedLine, time: string): void {
    if (!l.speaker) return push(x, loc, { kind: 'narr', text: l.text })
    const id = l.speaker
    const mood = content.loveInterest(id) ? selectors.mood(x.game, id) : 'neutral'
    push(x, loc, { kind: 'msg', id, mood, text: l.text, time: 'Today at ' + time })
  }

  function syncScene(x: Session): void {
    const g = x.game
    if (g.phase !== 'scene' || !g.scene) return
    const key = g.day + '-' + g.slot
    if (x.seen[key]) return
    x.seen[key] = true
    const loc = sceneLoc(content, g)
    const cur = selectors.currentScene(g)
    if (!loc || loc === 'pick' || !cur) return
    for (const l of cur.lines) pushLine(x, loc, l, TIMES[g.slot])
  }

  function go(x: Session, loc: Loc): void {
    x.loc = loc
    if (loc.startsWith('ch:')) x.lastCh = loc
    else x.lastDm = loc
    x.profileOpen = false
  }

  function snap(x: Session): void {
    x.daySnap = Object.fromEntries(content.loveInterests.map((li) => [li.id, x.game.affection[li.id]]))
  }

  function eveningLine(who: CharacterId, action: EveningAction): { icon: SysIcon; text: string } {
    const nm = selectors.name(who)
    if (action.kind === 'milestone') {
      return action.id === 'pfp'
        ? { icon: 'photo', text: 'You asked ' + nm + ' to match profile pictures.' }
        : { icon: 'phone-call', text: 'You started a sleep call with ' + nm + '.' }
    }
    const a = content.activity(action.id)!
    return a.mode === 'queue'
      ? { icon: 'device-gamepad-2', text: 'You invited ' + nm + ' to ' + a.name + '.' }
      : { icon: 'device-tv', text: 'You put on ' + a.name.charAt(0).toLowerCase() + a.name.slice(1) + ' with ' + nm + '.' }
  }

  return function sessionReducer(s: Session, action: SessionAction): Session {
    switch (action.type) {
      case 'game':
        return { ...s, game: reducer(s.game, action.action) }

      case 'launch': {
        if (s.game.phase !== 'create') return s
        const game = reducer(s.game, { type: 'begin' })
        if (game.phase !== 'scene') return { ...s, game }
        const x = createSession(game)
        push(x, 'ch:welcome', { kind: 'join', time: 'Today at 9:02 PM' })
        snap(x)
        syncScene(x)
        return x
      }

      case 'go': {
        const x = draft(s)
        go(x, action.loc)
        return x
      }

      case 'pick': {
        if (!canPick(content, s, action.index)) return s
        const x = draft(s)
        const loc = s.loc
        const t = TIMES[s.game.slot]
        const text = selectors.currentScene(s.game)!.choices[action.index]
        push(x, loc, { kind: 'msg', id: 'you', mood: 'neutral', text, time: 'Today at ' + t })
        run(x, { type: 'choose', index: action.index })
        for (const l of x.game.lastReaction ?? []) pushLine(x, loc, l, t)
        return x
      }

      case 'showTyping': {
        if (s.game.phase !== 'react') return s
        const nxt = nextSceneDef(content, s.game)
        return nxt && LOC[nxt.title] === s.loc ? { ...s, typing: true } : s
      }

      case 'advance': {
        if (s.game.phase !== 'react') return s
        const x = draft(s)
        x.typing = false
        run(x, { type: 'continue' })
        syncScene(x)
        return x
      }

      case 'askPick': {
        const cur = isPickScene(content, s.game) ? currentSceneDef(content, s.game) : null
        const c = cur?.variant.choices[action.index]
        const pick = c?.effects.find((e) => e.type === 'pickDate')
        if (!c || !pick) return s
        const g = pick.who
        const loc: Loc = `dm:${g}`
        const x = draft(s)
        const text = c.text.replace(/^Message \w+: /, '').replace(/^“|”$/g, '')
        push(x, loc, { kind: 'msg', id: 'you', mood: 'neutral', text, time: 'Today at 11:58 PM' })
        run(x, { type: 'choose', index: action.index })
        if (x.game.phase === 'confront') {
          for (const l of selectors.confrontation(x.game)?.lines ?? []) pushLine(x, loc, l, '11:59 PM')
        }
        go(x, loc)
        return x
      }

      case 'confPick': {
        if (!canConfPick(content, s, action.index)) return s
        const g = s.game.pick!
        const loc: Loc = `dm:${g}`
        const x = draft(s)
        const text = selectors.confrontation(s.game)!.choices[action.index]
        push(x, loc, { kind: 'msg', id: 'you', mood: 'neutral', text, time: 'Today at 11:59 PM' })
        run(x, { type: 'confront', index: action.index })
        pushLine(x, loc, { speaker: g, text: x.game.confrontation!.reply }, '11:59 PM')
        return x
      }

      case 'evMode': {
        const x = draft(s)
        run(x, { type: 'selectEveningGirl', who: action.who })
        run(x, { type: 'setEveningMode', mode: action.mode })
        return x
      }

      case 'evDo': {
        const x = draft(s)
        run(x, { type: 'selectEveningGirl', who: action.who })
        if (!canDoEvening(content, x.game, action.action)) return s
        const loc: Loc = `dm:${action.who}`
        const sys = eveningLine(action.who, action.action)
        push(x, loc, { kind: 'sys', icon: sys.icon, text: sys.text, time: EVE_TIME })
        run(x, { type: 'doEvening', action: action.action })
        for (const l of x.game.evening.result?.lines ?? []) pushLine(x, loc, l, EVE_TIME)
        return x
      }

      case 'endNight':
        return { ...s, summary: true, profileOpen: false }

      case 'startNextDay': {
        const x = draft(s)
        run(x, { type: 'nextDay' })
        snap(x)
        x.summary = false
        syncScene(x)
        return x
      }

      case 'toggleProfile':
        return { ...s, profileOpen: !s.profileOpen }

      case 'playAgain':
        return createSession(reducer(s.game, { type: 'reset', seed: action.seed }))
    }
  }
}
