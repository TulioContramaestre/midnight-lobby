import { describe, expect, it } from 'vitest'
import { registry } from '@/content/registry'
import { BANNER, NAMECOL, STATUS } from '@/ui/theme'
import { LOC } from '../locations'

describe('scene locations', () => {
  it('maps every scene title to a location', () => {
    const missing = registry.scenes.map((s) => s.title).filter((t) => !(t in LOC))
    expect(missing).toEqual([])
  })

  it('sends only the pick scene to the ask-out modal', () => {
    const picks = registry.scenes.filter((s) => LOC[s.title] === 'pick')
    expect(picks.map((s) => s.id)).toEqual(['d7-who-do-you-choose'])
  })
})

describe('per-character theme', () => {
  it('gives every love interest a name colour, banner and status', () => {
    const missing = registry.loveInterests
      .map((li) => li.id)
      .filter((id) => !(id in NAMECOL) || !(id in BANNER) || !(id in STATUS))
    expect(missing).toEqual([])
  })
})
