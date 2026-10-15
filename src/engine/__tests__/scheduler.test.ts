import { describe, expect, it } from 'vitest'
import { pickScene } from '@/engine/scheduler'
import { content, run, started, withAffection } from './fixtures'

describe('pickScene', () => {
  it('returns the only scene for a plain slot', () => {
    expect(pickScene(content, started(), 0, 1)).toEqual({ sceneId: 'd0s1', variant: 0 })
  })

  it('picks the tier variant of a tiered scene', () => {
    const s = started()
    expect(pickScene(content, withAffection(s, { mae: 2 }), 1, 0)).toEqual({ sceneId: 'mae-tiered', variant: 0 })
    expect(pickScene(content, withAffection(s, { mae: 3 }), 1, 0)).toEqual({ sceneId: 'mae-tiered', variant: 1 })
    expect(pickScene(content, withAffection(s, { mae: 7 }), 1, 0)).toEqual({ sceneId: 'mae-tiered', variant: 2 })
  })

  it('prefers a higher-priority scene whose condition passes', () => {
    const s = started()
    expect(pickScene(content, s, 2, 1)?.sceneId).toBe('d2s1')
    expect(pickScene(content, { ...s, flags: { secret: true } }, 2, 1)?.sceneId).toBe('secret')
  })

  it('returns null when nothing is scheduled', () => {
    expect(pickScene(content, started(), 9, 0)).toBeNull()
  })

  it('a choice can set the flag that unlocks a later scene', () => {
    const s = run(started(), { type: 'choose', index: 3 })
    expect(s.flags.secret).toBe(true)
    expect(pickScene(content, s, 2, 1)?.sceneId).toBe('secret')
  })
})
