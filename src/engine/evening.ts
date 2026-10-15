import type { CharacterId, ContentRegistry, Deltas } from '@/content/types'
import { applyDeltas, tierOf } from './affection'
import { EVENING_RIVAL_DELTA } from './constants'
import { characterName } from './names'
import type { Rng } from './rng'
import { fill } from './template'
import type { EveningAction, GameState, ResolvedLine } from './types'

export function isMilestoneUnlocked(content: ContentRegistry, s: GameState, id: 'pfp' | 'sleep', who: CharacterId): boolean {
  return s.affection[who] >= content.milestones[id].min
}

export function canDoEvening(content: ContentRegistry, s: GameState, action: EveningAction): boolean {
  const g = s.evening.selected
  if (!g || !content.loveInterest(g) || s.evening.result) return false
  if (action.kind === 'activity') return content.activity(action.id) !== undefined
  return isMilestoneUnlocked(content, s, action.id, g)
}

function addOnce(list: CharacterId[], id: CharacterId): void {
  if (!list.includes(id)) list.push(id)
}

export function resolveEvening(content: ContentRegistry, s: GameState, action: EveningAction, rng: Rng): void {
  const g = s.evening.selected
  const li = g ? content.loveInterest(g) : undefined
  if (!g || !li) return
  const d: Deltas = {}
  const t = tierOf(s, g)
  const lines: ResolvedLine[] = []

  if (action.kind === 'activity') {
    const L = content.activity(action.id)
    if (!L) return
    d[g] = L.effects[g]
    lines.push({ speaker: g, text: rng.pick(L.reactions[g]) })
    lines.push({ speaker: null, text: L.narrate(rng) })
    if (L.effects[g] > 0) lines.push({ speaker: g, text: rng.pick(li.eveningLines[L.mode][t]) })
  } else if (action.id === 'pfp') {
    const A = content.milestones.pfp
    if (s.affection[g] < A.min) return
    d[g] = li.milestones.pfp.gain
    lines.push({ speaker: g, text: rng.pick(li.milestones.pfp.lines[t === 'high' ? 'high' : 'mid']) })
    if (s.matched && s.matched !== g) {
      d[s.matched] = A.switchPenalty
      lines.push({
        speaker: null,
        text: fill(A.switchedNarration, { prev: characterName(content, s.matched), name: characterName(content, g) }),
      })
      s.flags['matched:' + s.matched] = false
    }
    s.matched = g
    s.flags['matched:' + g] = true
    addOnce(s.pfpAll, g)
    s.flags['pfp:' + g] = true
    lines.push({ speaker: null, text: A.matchedNarration })
  } else {
    const A = content.milestones.sleep
    if (s.affection[g] < A.min) return
    d[g] = s.slept.includes(g) ? A.repeatGain : li.milestones.sleep.gain
    lines.push({ speaker: g, text: rng.pick(li.milestones.sleep.lines) })
    lines.push({ speaker: null, text: rng.pick(A.narration) })
    addOnce(s.slept, g)
    s.flags['slept:' + g] = true
  }

  d[li.rival] = EVENING_RIVAL_DELTA
  applyDeltas(content, s, d)
  s.evening.result = { lines, deltas: d }
  s.evening.mode = null
}
