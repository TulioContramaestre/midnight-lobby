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
    expect(errors).toContain('Day 2 slot 1: no scene for some tier/flag combination')
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
})
