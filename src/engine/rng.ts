export interface Rng {
  next(): number
  int(n: number): number
  pick<T>(items: readonly T[]): T
  readonly state: number
}

export function createRng(state: number): Rng {
  let s = state | 0
  const next = () => {
    s = (s + 0x6d2b79f5) | 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return {
    next,
    int: (n) => Math.floor(next() * n),
    pick: (items) => items[Math.floor(next() * items.length)],
    get state() {
      return s
    },
  }
}
