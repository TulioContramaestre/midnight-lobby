import type { CharacterId, Mood } from '@/content/types'
import type { Action, EveningAction, GameState } from '@/engine/types'
import type { Loc } from './locations'

export type SysIcon = 'device-gamepad-2' | 'device-tv' | 'photo' | 'phone-call'

export type LogEntry =
  | { kind: 'divider'; text: string }
  | { kind: 'join'; time: string }
  | { kind: 'narr'; text: string }
  | { kind: 'msg'; id: CharacterId; mood: Mood; text: string; time: string }
  | { kind: 'sys'; icon: SysIcon; text: string; time: string }

export interface Session {
  game: GameState
  loc: Loc
  lastCh: Loc
  lastDm: Loc
  logs: Partial<Record<Loc, LogEntry[]>>
  lastDay: Partial<Record<Loc, number>>
  active: Partial<Record<Loc, number>>
  n: number
  seen: Record<string, true>
  typing: boolean
  summary: boolean
  profileOpen: boolean
  daySnap: Record<CharacterId, number>
}

export type SessionAction =
  | { type: 'game'; action: Action }
  | { type: 'launch' }
  | { type: 'go'; loc: Loc }
  | { type: 'pick'; index: number }
  | { type: 'showTyping' }
  | { type: 'advance' }
  | { type: 'askPick'; index: number }
  | { type: 'confPick'; index: number }
  | { type: 'evMode'; who: CharacterId; mode: string }
  | { type: 'evDo'; who: CharacterId; action: EveningAction }
  | { type: 'endNight' }
  | { type: 'startNextDay' }
  | { type: 'toggleProfile' }
  | { type: 'playAgain'; seed: number }
