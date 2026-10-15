import { describe, expect, it } from 'vitest'
import { createRegistry } from '@/content/createRegistry'
import { choice, say, scene } from '@/content/helpers'
import { registry } from '@/content/registry'
import type { ContentParts } from '@/content/types'
import { validate } from '@/content/validate'

const parts = (): ContentParts => ({
  loveInterests: registry.loveInterests,
  supporting: registry.supporting,
  rivals: registry.rivals,
  scenes: registry.scenes,
  activityModes: registry.activityModes,
  activities: registry.activities,
  milestones: registry.milestones,
  creation: registry.creation,
  scoring: registry.scoring,
  feedNotes: registry.feedNotes,
})

describe('content validator', () => {
  it('passes for the shipped content', () => {
    expect(validate(registry)).toEqual([])
  })

  it('reports unknown characters, missing scenes and ambiguous slots', () => {
    const p = parts()
    const broken = createRegistry({
      ...p,
      scenes: [
        ...p.scenes.filter((s) => !(s.day === 2 && s.slot === 1)),
        scene({
          id: 'extra',
          title: 'Extra',
          day: 0,
          slot: 0,
          cast: ['nobody'],
          lines: [say('ghost', 'boo')],
          choices: [choice('ok', { phantom: 1 }, ['ok'])],
        }),
      ],
    })
    const errors = validate(broken)
    expect(errors).toContain('Scene "extra": unknown character "nobody"')
    expect(errors).toContain('Scene "extra", variant 1, line 1: unknown character "ghost"')
    expect(errors).toContain('Scene "extra", variant 1, choice 1: unknown character "phantom"')
    expect(errors).toContain('Day 2 slot 1: no scene')
    expect(errors).toContain('Day 0 slot 0: "d1-the-new-guy-in-voice-chat" and "extra" both apply with the same priority')
  })

  it('reports incomplete love interests and activities', () => {
    const p = parts()
    const [nyx, ...rest] = p.loveInterests
    const broken = createRegistry({
      ...p,
      loveInterests: [{ ...nyx, feed: { posts: nyx.feed.posts.slice(0, 6), replies: [] }, bestFriend: 'ezra' }, ...rest],
      activities: p.activities.map((a) => (a.id === 'spike' ? { ...a, reactions: { nyx: a.reactions.nyx } } : a)),
    })
    const errors = validate(broken)
    expect(errors).toContain('Love interest "nyx": no post for day 6')
    expect(errors).toContain('Love interest "nyx": no like replies')
    expect(errors).toContain('Love interest "nyx": best friend "ezra" is not a supporting character')
    expect(errors).toContain('Activity "spike": no reactions for "goldie"')
  })

  it('a flag-gated scene with higher priority is not ambiguous', () => {
    const p = parts()
    const withFlag = createRegistry({
      ...p,
      scenes: [
        ...p.scenes,
        { ...scene({ id: 'secret', title: 'Secret', day: 3, slot: 0, cast: ['nyx'], lines: [], choices: [choice('ok', {}, ['ok'])] }), when: { flag: 'secret' }, priority: 1 },
      ],
    })
    expect(validate(withFlag)).toEqual([])
  })

  it('tries affection between tier thresholds and the values a flag is compared with', () => {
    const p = parts()
    const thursday = p.scenes.find((s) => s.day === 3 && s.slot === 0)!
    const friday = p.scenes.find((s) => s.day === 4 && s.slot === 0)!
    const ok = [choice('ok', {}, ['ok'])]
    const broken = createRegistry({
      ...p,
      scenes: [
        ...p.scenes.filter((s) => s !== thursday),
        {
          ...thursday,
          variants: [
            { when: { affection: { who: 'nyx', gte: 5 } }, lines: [], choices: ok },
            { when: { affection: { who: 'nyx', lte: 3 } }, lines: [], choices: ok },
          ],
        },
        scene({ id: 'count', title: 'Count', day: 4, slot: 0, cast: ['nyx'], when: { flag: 'count', is: 2 }, lines: [], choices: ok }),
      ],
    })
    expect(validate(broken)).toEqual([
      `Day 3 slot 0: no variant of "${thursday.id}" matches when nyx at 4`,
      `Day 4 slot 0: "${friday.id}" and "count" both apply with the same priority when count = 2`,
    ])
  })

  it('checks each slot only against the flags its scenes use', () => {
    const p = parts()
    const events = Array.from({ length: 42 }, (_, i) =>
      scene({
        id: `event-${i}`,
        title: 'Event',
        day: Math.floor(i / 3) % 7,
        slot: i % 3,
        cast: ['nyx'],
        when: { flag: `event-${i}` },
        priority: 1 + Math.floor(i / 21),
        lines: [],
        choices: [choice('ok', {}, ['ok'])],
      }),
    )
    expect(validate(createRegistry({ ...p, scenes: [...p.scenes, ...events] }))).toEqual([])
  })
})
