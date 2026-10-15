import type { ContentRegistry } from '@/content/types'
import { LIKE_GAIN, LIKE_OTHERS_DELTA, POST_WARM_MIN, UNSEEN_PER_DAY } from './constants'
import { characterName } from './names'
import type { Rng } from './rng'
import { fill } from './template'
import type { GameState } from './types'

export function addPostsForDay(content: ContentRegistry, s: GameState, d: number): void {
  for (const li of content.loveInterests) {
    const p = li.feed.posts[d]
    const t = typeof p === 'string' ? p : s.affection[li.id] >= POST_WARM_MIN ? p.warm : p.cold
    s.feed.unshift({
      id: 'p' + d + li.id,
      author: li.id,
      text: t,
      day: d,
      likes: 14 + ((d * 37 + li.id.length * 29 + t.length) % 90),
      liked: false,
      reply: null,
    })
  }
  const extras = [...content.supporting, ...content.rivals]
    .flatMap((c) => c.posts.filter((p) => p.day === d).map((p) => ({ author: c.id, ...p })))
    .sort((a, b) => a.order - b.order)
  for (const x of extras) {
    s.feed.unshift({
      id: 'p' + d + x.author,
      author: x.author,
      text: x.text,
      day: d,
      likes: 5 + ((d * 13 + x.text.length) % 60),
      liked: false,
      reply: null,
    })
  }
  s.unseen += UNSEEN_PER_DAY
}

export function canLike(s: GameState): boolean {
  return s.phase !== 'ending' && s.phase !== 'confront'
}

export function like(content: ContentRegistry, s: GameState, postId: string, rng: Rng): void {
  const notes = content.feedNotes
  const p = s.feed.find((q) => q.id === postId)
  if (!canLike(s)) {
    s.note = notes.weekOver
    return
  }
  if (!p) return
  if (p.liked) {
    s.note = notes.alreadyLiked
    return
  }
  if (s.likedToday) {
    s.note = notes.likeUsed
    return
  }
  s.likedToday = true
  p.liked = true
  p.likes++
  const c = p.author
  const li = content.loveInterest(c)
  const rival = content.rival(c)
  if (li) {
    const others = content.loveInterests.map((k) => k.id).filter((k) => k !== c)
    s.affection[c] += LIKE_GAIN
    for (const k of others) s.affection[k] += LIKE_OTHERS_DELTA
    s.likeCount[c]++
    p.reply = rng.pick(li.feed.replies)
    s.note = fill(notes.likedLoveInterest, {
      name: li.name,
      others: others.map((k) => characterName(content, k)).join(' and '),
    })
  } else if (rival) {
    s.affection[c] += LIKE_GAIN
    s.note = fill(notes.likedRival, { name: rival.name, target: characterName(content, rival.target) })
  } else {
    s.affection[c] += LIKE_GAIN
    s.note = fill(notes.likedSupporting, { name: characterName(content, c) })
  }
}
