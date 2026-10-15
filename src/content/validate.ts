import { evaluate } from '@/engine/conditions'
import { DAY_COUNT, SCENE_TIER_HIGH_MIN, SCENE_TIER_MID_MIN, SLOTS_PER_DAY } from '@/engine/constants'
import { createInitialState } from '@/engine/initialState'
import { candidateScenes } from '@/engine/scheduler'
import type { GameState } from '@/engine/types'
import type { CharacterId, Choice, Condition, ContentRegistry, FlagValue, Line, Tier } from './types'

const TIERS: Tier[] = ['low', 'mid', 'high']
const ENDING_TIERS = ['good', 'friends', 'left'] as const

export function validate(content: ContentRegistry): string[] {
  const errors: string[] = []
  const fail = (message: string) => {
    if (!errors.includes(message)) errors.push(message)
  }

  const ids = new Set<string>()
  for (const c of content.characters) {
    if (ids.has(c.id)) fail(`Duplicate character id "${c.id}"`)
    ids.add(c.id)
  }
  const known = (id: string, where: string) => {
    if (!ids.has(id)) fail(`${where}: unknown character "${id}"`)
  }
  const knownKeys = (record: Record<string, unknown>, where: string) => {
    for (const id of Object.keys(record)) known(id, where)
  }
  const checkLines = (lines: Line[], where: string) => {
    lines.forEach((l, i) => {
      if (l.speaker !== null) known(l.speaker, `${where}, line ${i + 1}`)
    })
  }
  const checkCondition = (c: Condition | undefined, where: string): void => {
    if (!c) return
    if ('all' in c) c.all.forEach((x) => checkCondition(x, where))
    else if ('any' in c) c.any.forEach((x) => checkCondition(x, where))
    else if ('not' in c) checkCondition(c.not, where)
    else if ('affection' in c) known(c.affection.who, where)
    else if ('tier' in c) known(c.tier.who, where)
  }
  const checkChoice = (choice: Choice, where: string) => {
    const pick = choice.effects.filter((e) => e.type === 'pickDate')
    if (pick.length && choice.effects.length > 1) fail(`${where}: a pickDate choice cannot have other effects`)
    for (const e of choice.effects) {
      if (e.type === 'affection') knownKeys(e.deltas, where)
      if (e.type === 'pickDate' && !content.loveInterest(e.who)) fail(`${where}: "${e.who}" is not a love interest`)
    }
    const r = choice.reaction
    if (!r && !pick.length) fail(`${where}: no reaction`)
    if (r?.kind === 'oneOf') {
      if (!r.options.length) fail(`${where}: empty reaction`)
      if (r.speaker) known(r.speaker, where)
    }
    if (r?.kind === 'sequenceOf') {
      if (!r.options.length || r.options.some((o) => !o.length)) fail(`${where}: empty reaction`)
      r.options.forEach((o) => checkLines(o, where))
    }
    if (r?.kind === 'fixed') checkLines(r.lines, where)
  }

  for (const li of content.loveInterests) {
    const w = `Love interest "${li.id}"`
    if (!li.name || !li.handle || !li.type || !li.tint || !li.bio || !li.age) fail(`${w}: incomplete profile`)
    if (!li.portrait) fail(`${w}: no portrait`)
    if (!li.avatarTheme) fail(`${w}: no avatar theme`)
    if (!content.supportingCharacter(li.bestFriend)) fail(`${w}: best friend "${li.bestFriend}" is not a supporting character`)
    const rival = content.rival(li.rival)
    if (!rival) fail(`${w}: rival "${li.rival}" is not a rival`)
    else if (rival.target !== li.id) fail(`${w}: rival "${rival.id}" targets "${rival.target}"`)
    for (const mode of content.activityModes) {
      for (const t of TIERS) if (!li.eveningLines[mode.id]?.[t]?.length) fail(`${w}: no ${mode.id} evening lines for ${t}`)
    }
    if (!li.milestones.pfp.lines.mid.length || !li.milestones.pfp.lines.high.length) fail(`${w}: missing pfp lines`)
    if (!li.milestones.sleep.lines.length) fail(`${w}: missing sleep-call lines`)
    for (let d = 0; d < DAY_COUNT; d++) if (!li.feed.posts[d]) fail(`${w}: no post for day ${d}`)
    if (!li.feed.replies.length) fail(`${w}: no like replies`)
    if (!li.confrontation.lines.length) fail(`${w}: no confrontation lines`)
    checkLines(li.confrontation.lines, `${w} confrontation`)
    if (!li.confrontation.choices.length) fail(`${w}: no confrontation choices`)
    li.confrontation.choices.forEach((c, i) => {
      if (!c.replies.length) fail(`${w}: confrontation choice ${i + 1} has no replies`)
    })
    for (const t of ENDING_TIERS) if (!li.endings[t]?.title || !li.endings[t]?.text) fail(`${w}: missing ${t} ending`)
    for (const t of TIERS) if (!li.epilogue[t]) fail(`${w}: missing ${t} epilogue`)
  }

  for (const r of content.rivals) {
    if (!content.loveInterest(r.target)) fail(`Rival "${r.id}": target "${r.target}" is not a love interest`)
    if (!r.rivalEnding) fail(`Rival "${r.id}": no rival ending`)
  }

  for (let d = 0; d < DAY_COUNT; d++) {
    const orders = new Set<number>()
    for (const c of [...content.supporting, ...content.rivals]) {
      for (const p of c.posts.filter((x) => x.day === d)) {
        if (orders.has(p.order)) fail(`Day ${d}: two extra posts share order ${p.order}`)
        orders.add(p.order)
      }
    }
  }
  for (const c of [...content.supporting, ...content.rivals]) {
    for (const p of c.posts) if (p.day < 0 || p.day >= DAY_COUNT) fail(`"${c.id}" has a post on day ${p.day}`)
  }

  for (const a of content.activities) {
    const w = `Activity "${a.id}"`
    if (!content.activityMode(a.mode)) fail(`${w}: unknown mode "${a.mode}"`)
    knownKeys(a.effects, w)
    knownKeys(a.reactions, w)
    for (const li of content.loveInterests) {
      if (a.effects[li.id] === undefined) fail(`${w}: no effect for "${li.id}"`)
      if (!a.reactions[li.id]?.length) fail(`${w}: no reactions for "${li.id}"`)
    }
  }

  for (const b of [...content.creation.age, ...content.creation.height, ...content.creation.vibes]) {
    knownKeys(b.effects, 'Character creation')
  }
  for (const rule of content.scoring.modifiers) {
    if (rule.kind === 'threshold' && rule.subject.kind === 'character') known(rule.subject.id, 'Scoring rule')
  }

  const sceneIds = new Set<string>()
  for (const sc of content.scenes) {
    const w = `Scene "${sc.id}"`
    if (sceneIds.has(sc.id)) fail(`Duplicate scene id "${sc.id}"`)
    sceneIds.add(sc.id)
    if (sc.day < 0 || sc.day >= DAY_COUNT || sc.slot < 0 || sc.slot >= SLOTS_PER_DAY) fail(`${w}: day/slot out of range`)
    if (!sc.cast.length) fail(`${w}: empty cast`)
    sc.cast.forEach((id) => known(id, w))
    checkCondition(sc.when, w)
    if (!sc.variants.length) fail(`${w}: no variants`)
    sc.variants.forEach((v, vi) => {
      const vw = `${w}, variant ${vi + 1}`
      checkCondition(v.when, vw)
      checkLines(v.lines, vw)
      if (!v.choices.length) fail(`${vw}: no choices`)
      v.choices.forEach((c, ci) => checkChoice(c, `${vw}, choice ${ci + 1}`))
    })
  }

  const base = createInitialState(content, 0)
  for (let day = 0; day < DAY_COUNT; day++) {
    for (let slot = 0; slot < SLOTS_PER_DAY; slot++) {
      const error = checkSlot(content, base, day, slot)
      if (error) fail(`Day ${day} slot ${slot}: ${error}`)
    }
  }

  return errors
}

function checkSlot(content: ContentRegistry, base: GameState, day: number, slot: number): string | null {
  const scenes = content.scenes.filter((sc) => sc.day === day && sc.slot === slot)
  const { affection, flags } = probeValues(scenes.flatMap((sc) => [sc.when, ...sc.variants.map((v) => v.when)]))
  for (const a of product(affection)) {
    for (const f of product(flags)) {
      const s = { ...base, day, slot, affection: a, flags: f }
      const when = describeCase(a, f)
      const [first, second] = candidateScenes(content, s, day, slot)
      if (!first) return `no scene${when}`
      if (second && (second.priority ?? 0) === (first.priority ?? 0)) {
        return `"${first.id}" and "${second.id}" both apply with the same priority${when}`
      }
      if (!first.variants.some((v) => evaluate(v.when, s))) return `no variant of "${first.id}" matches${when}`
    }
  }
  return null
}

function probeValues(conditions: (Condition | undefined)[]) {
  const affection = new Map<CharacterId, Set<number>>()
  const flags = new Map<string, Set<FlagValue>>()
  const around = (who: CharacterId, ...thresholds: number[]) => {
    const values = affection.get(who) ?? new Set([0])
    for (const n of thresholds) values.add(n - 1).add(n)
    affection.set(who, values)
  }
  const walk = (c: Condition | undefined): void => {
    if (!c) return
    if ('all' in c) c.all.forEach(walk)
    else if ('any' in c) c.any.forEach(walk)
    else if ('not' in c) walk(c.not)
    else if ('affection' in c) {
      const { who, gte, lte } = c.affection
      around(who, ...(gte === undefined ? [] : [gte]), ...(lte === undefined ? [] : [lte + 1]))
    } else if ('tier' in c) around(c.tier.who, SCENE_TIER_MID_MIN, SCENE_TIER_HIGH_MIN)
    else if ('flag' in c) {
      const values = flags.get(c.flag) ?? new Set<FlagValue>([false, true])
      if (c.is !== undefined) values.add(c.is)
      flags.set(c.flag, values)
    }
  }
  conditions.forEach(walk)
  return { affection, flags }
}

function product<T>(axes: Map<string, Set<T>>): Record<string, T>[] {
  return [...axes].reduce<Record<string, T>[]>(
    (acc, [key, values]) => acc.flatMap((combo) => [...values].map((v) => ({ ...combo, [key]: v }))),
    [{}],
  )
}

function describeCase(affection: Record<string, number>, flags: Record<string, FlagValue>): string {
  const parts = [
    ...Object.entries(affection).map(([id, v]) => `${id} at ${v}`),
    ...Object.entries(flags).map(([flag, v]) => `${flag} = ${v}`),
  ]
  return parts.length ? ' when ' + parts.join(', ') : ''
}
