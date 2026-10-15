import { describe, expect, it } from 'vitest'
import { bracketFor, startingAffection } from '@/engine/creation'
import { content } from './fixtures'

describe('bracketFor', () => {
  it('uses inclusive upper bounds and an open last bracket', () => {
    expect(bracketFor(content.creation.age, 20)?.why).toBe('young')
    expect(bracketFor(content.creation.age, 21)?.why).toBe('older')
    expect(bracketFor(content.creation.age, 99)?.why).toBe('older')
  })
})

describe('startingAffection', () => {
  it('sums age, height and vibe effects for every love interest, in that order', () => {
    expect(startingAffection(content, { age: 18, height: 60, vibe: 'loud' })).toEqual({
      affection: { ivy: 0, mae: 3, zoe: -1 },
      why: ['young', 'short', 'loud vibe'],
    })
    expect(startingAffection(content, { age: 30, height: 80, vibe: 'calm' })).toEqual({
      affection: { ivy: 2, mae: -1, zoe: 1 },
      why: ['older', 'tall', 'calm vibe'],
    })
  })
})
