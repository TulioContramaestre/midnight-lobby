import type { ContentContext, ContentRegistry } from '@/content/types'
import { describeOffenses } from './confrontation'
import { characterName } from './names'
import type { GameState } from './types'

export function contentContext(content: ContentRegistry, s: GameState): ContentContext {
  return {
    playerName: s.player.name,
    day: s.day,
    loveInterests: content.loveInterests.map((li) => li.id),
    slept: s.slept,
    pfpAll: s.pfpAll,
    matched: s.matched,
    flags: s.flags,
    affection: (id) => s.affection[id],
    likeCount: (id) => s.likeCount[id],
    name: (id) => characterName(content, id),
    describeOffenses: (id) => describeOffenses(content, s, id),
  }
}
