import type { CharacterId, ContentRegistry, LoveInterest, Rival, ScoreSubject } from '@/content/types'
import {
  ENDING_FRIENDS_MIN,
  ENDING_GOOD_MIN,
  EPILOGUE_HIGH_MIN,
  EPILOGUE_MID_MIN,
  RIVAL_ENDING_MIN,
} from './constants'
import { characterName } from './names'
import { fill } from './template'
import type { EndingTier, GameState, Tier } from './types'

export interface Modifier {
  label: string
  value: number
}

export interface Score {
  base: number
  mods: Modifier[]
  final: number
}

function subjectId(li: LoveInterest, subject: ScoreSubject): CharacterId {
  if (subject.kind === 'bestFriend') return li.bestFriend
  if (subject.kind === 'rival') return li.rival
  return subject.id
}

export function score(content: ContentRegistry, s: GameState, g: CharacterId): Score {
  const li = content.loveInterest(g)
  const base = s.affection[g]
  const mods: Modifier[] = []
  if (!li) return { base, mods, final: base }
  const names = (ids: CharacterId[]) => ids.map((k) => characterName(content, k)).join(' and ')

  for (const rule of content.scoring.modifiers) {
    if (rule.kind === 'threshold') {
      const id = subjectId(li, rule.subject)
      const v = s.affection[id]
      const name = characterName(content, id)
      if (v >= rule.high.gte) mods.push({ label: fill(rule.high.label, { name }), value: rule.high.value })
      else if (v <= rule.low.lte) mods.push({ label: fill(rule.low.label, { name }), value: rule.low.value })
    } else if (rule.kind === 'matched') {
      if (s.matched === g) mods.push({ label: rule.label, value: rule.value })
    } else if (rule.kind === 'sleptWithOthers') {
      const o = s.slept.filter((k) => k !== g)
      if (o.length) mods.push({ label: fill(rule.label, { names: names(o) }), value: rule.value })
    } else if (rule.kind === 'pfpWithOthers') {
      const o = s.pfpAll.filter((k) => k !== g)
      if (o.length) mods.push({ label: fill(rule.label, { names: names(o) }), value: rule.value })
    } else if (s.confrontation) {
      const c = li.confrontation.choices[s.confrontation.choiceIndex]
      if (c) mods.push({ label: c.label, value: c.modifier })
    }
  }

  return { base, mods, final: base + mods.reduce((a, m) => a + m.value, 0) }
}

export function endingTier(final: number): EndingTier {
  return final >= ENDING_GOOD_MIN ? 'good' : final >= ENDING_FRIENDS_MIN ? 'friends' : 'left'
}

export function epilogueTier(value: number): Tier {
  return value >= EPILOGUE_HIGH_MIN ? 'high' : value >= EPILOGUE_MID_MIN ? 'mid' : 'low'
}

export function rivalEndings(content: ContentRegistry, s: GameState, g: CharacterId, tier: EndingTier): Rival[] {
  return content.rivals.filter((r) => s.affection[r.id] >= RIVAL_ENDING_MIN && (r.target !== g || tier !== 'good'))
}
