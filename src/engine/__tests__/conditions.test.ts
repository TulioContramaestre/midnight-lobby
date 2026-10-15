import { describe, expect, it } from 'vitest'
import { evaluate } from '@/engine/conditions'
import { started, withAffection } from './fixtures'

describe('evaluate', () => {
  const s = { ...withAffection(started(), { ivy: 5, mae: 7 }), day: 3, flags: { met: true, count: 2, off: false } }

  it('passes when there is no condition', () => {
    expect(evaluate(undefined, s)).toBe(true)
  })

  it('affection ranges', () => {
    expect(evaluate({ affection: { who: 'ivy', gte: 5 } }, s)).toBe(true)
    expect(evaluate({ affection: { who: 'ivy', gte: 6 } }, s)).toBe(false)
    expect(evaluate({ affection: { who: 'ivy', lte: 5 } }, s)).toBe(true)
    expect(evaluate({ affection: { who: 'ivy', gte: 1, lte: 4 } }, s)).toBe(false)
    expect(evaluate({ affection: { who: 'nobody', gte: 0 } }, s)).toBe(false)
  })

  it('tiers', () => {
    expect(evaluate({ tier: { who: 'ivy', is: 'mid' } }, s)).toBe(true)
    expect(evaluate({ tier: { who: 'mae', is: 'high' } }, s)).toBe(true)
    expect(evaluate({ tier: { who: 'mae', is: 'low' } }, s)).toBe(false)
  })

  it('flags', () => {
    expect(evaluate({ flag: 'met' }, s)).toBe(true)
    expect(evaluate({ flag: 'off' }, s)).toBe(false)
    expect(evaluate({ flag: 'missing' }, s)).toBe(false)
    expect(evaluate({ flag: 'missing', is: false }, s)).toBe(true)
    expect(evaluate({ flag: 'off', is: false }, s)).toBe(true)
    expect(evaluate({ flag: 'count', is: 2 }, s)).toBe(true)
    expect(evaluate({ flag: 'count', is: 3 }, s)).toBe(false)
  })

  it('days', () => {
    expect(evaluate({ day: { is: 3 } }, s)).toBe(true)
    expect(evaluate({ day: { gte: 4 } }, s)).toBe(false)
    expect(evaluate({ day: { lte: 3, gte: 1 } }, s)).toBe(true)
  })

  it('combinators', () => {
    expect(evaluate({ all: [{ flag: 'met' }, { day: { is: 3 } }] }, s)).toBe(true)
    expect(evaluate({ all: [{ flag: 'met' }, { day: { is: 2 } }] }, s)).toBe(false)
    expect(evaluate({ any: [{ flag: 'off' }, { day: { is: 3 } }] }, s)).toBe(true)
    expect(evaluate({ not: { flag: 'met' } }, s)).toBe(false)
  })
})
