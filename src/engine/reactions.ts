import type { CharacterId, Choice, ContentContext, Line } from '@/content/types'
import type { Rng } from './rng'
import type { ResolvedLine } from './types'

export function resolveLine(line: Line, ctx: ContentContext): ResolvedLine {
  return { speaker: line.speaker, text: typeof line.text === 'function' ? line.text(ctx) : line.text }
}

export function resolveReaction(
  choice: Choice,
  defaultSpeaker: CharacterId,
  rng: Rng,
  ctx: ContentContext,
): ResolvedLine[] {
  const r = choice.reaction
  let out: ResolvedLine[] = []
  if (r?.kind === 'sequenceOf') out = rng.pick(r.options).map((l) => resolveLine(l, ctx))
  else if (r?.kind === 'oneOf') out = [{ speaker: r.speaker ?? defaultSpeaker, text: rng.pick(r.options) }]
  else if (r?.kind === 'fixed') out = r.lines.map((l) => resolveLine(l, ctx))
  if (choice.narration) out.push({ speaker: null, text: choice.narration })
  return out
}
