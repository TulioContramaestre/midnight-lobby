import { describe, expect, it } from 'vitest'
import { createRng } from '@/engine/rng'

function canonicalMulberry32(a: number) {
  return () => {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

describe('rng', () => {
  it('produces the mulberry32 sequence', () => {
    const rng = createRng(1)
    expect([rng.next(), rng.next(), rng.next()]).toEqual([0.6270739405881613, 0.002735721180215478, 0.5274470399599522])
  })

  it('matches a canonical mulberry32 for many draws and seeds', () => {
    for (const seed of [0, 1, 42, 1760000000000, -5]) {
      const rng = createRng(seed)
      const ref = canonicalMulberry32(seed | 0)
      for (let i = 0; i < 500; i++) expect(rng.next()).toBe(ref())
    }
  })

  it('continues the same sequence from a saved state', () => {
    const a = createRng(99)
    a.next()
    a.next()
    const b = createRng(a.state)
    expect(b.next()).toBe(a.next())
  })

  it('int and pick use floor(next * n)', () => {
    const ref = canonicalMulberry32(7)
    const rng = createRng(7)
    for (let i = 0; i < 200; i++) {
      const items = ['a', 'b', 'c']
      if (i % 2) expect(rng.int(10)).toBe(Math.floor(ref() * 10))
      else expect(rng.pick(items)).toBe(items[Math.floor(ref() * 3)])
    }
  })
})
