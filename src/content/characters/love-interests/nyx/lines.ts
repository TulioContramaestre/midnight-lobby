import type { ContentContext } from '@/content/types'

export function nyxLine(ctx: ContentContext): string {
  const top = [...ctx.loveInterests].sort((x, y) => ctx.likeCount(y) - ctx.likeCount(x))[0]
  if (!ctx.likeCount(top)) return "u don't even like posts. mysterious. or lame. haven't decided."
  if (top === 'nyx') return 'u keep liking my posts. weird. ...cool i guess. not that i care.'
  return 'saw u liking ' + ctx.name(top) + "'s posts all week. not that i care. at all."
}
