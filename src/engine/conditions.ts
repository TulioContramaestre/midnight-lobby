import type { Condition } from '@/content/types'
import { tierOf } from './affection'
import type { GameState } from './types'

function inRange(value: number | undefined, range: { gte?: number; lte?: number; is?: number }): boolean {
  if (value === undefined) return false
  if (range.is !== undefined && value !== range.is) return false
  if (range.gte !== undefined && !(value >= range.gte)) return false
  if (range.lte !== undefined && !(value <= range.lte)) return false
  return true
}

export function evaluate(condition: Condition | undefined, s: GameState): boolean {
  if (!condition) return true
  if ('all' in condition) return condition.all.every((c) => evaluate(c, s))
  if ('any' in condition) return condition.any.some((c) => evaluate(c, s))
  if ('not' in condition) return !evaluate(condition.not, s)
  if ('affection' in condition) return inRange(s.affection[condition.affection.who], condition.affection)
  if ('tier' in condition) return tierOf(s, condition.tier.who) === condition.tier.is
  if ('flag' in condition) {
    const value = s.flags[condition.flag]
    return condition.is === undefined ? Boolean(value) : (value ?? false) === condition.is
  }
  return inRange(s.day, condition.day)
}
