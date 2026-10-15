import { describe, expect, it } from 'vitest'
import { registry } from '@/content/registry'
import { startingAffection } from '@/engine/creation'

const start = (age: number, height: number, vibe: string) => startingAffection(registry, { age, height, vibe })

describe('startingAffection', () => {
  it.each([
    [18, { goldie: 1, rhea: -1 }, "18 to 20: Goldie likes guys her age. Rhea thinks you're a baby."],
    [20, { goldie: 1, rhea: -1 }, "18 to 20: Goldie likes guys her age. Rhea thinks you're a baby."],
    [21, { nyx: 1, goldie: 1 }, "21 to 24: Nyx and Goldie like that you're their age."],
    [24, { nyx: 1, goldie: 1 }, "21 to 24: Nyx and Goldie like that you're their age."],
    [25, { rhea: 1 }, "25 to 29: Rhea likes a guy who's a little older."],
    [29, { rhea: 1 }, "25 to 29: Rhea likes a guy who's a little older."],
    [30, { rhea: 1, nyx: -1, goldie: -1 }, "30 and up: Rhea likes older. Nyx and Goldie think you're “basically a dad.”"],
    [35, { rhea: 1, nyx: -1, goldie: -1 }, "30 and up: Rhea likes older. Nyx and Goldie think you're “basically a dad.”"],
  ])('age %i', (age, effects, why) => {
    const bracket = registry.creation.age.find((b) => b.max === undefined || age <= b.max)!
    expect(bracket.effects).toEqual(effects)
    expect(bracket.why).toBe(why)
    expect(start(age, 70, 'gamer').why[0]).toBe(why)
  })

  it.each([
    [60, { nyx: 1, rhea: -1 }, 'Under 5′7″: Nyx says short kings are underrated. Rhea disagrees.'],
    [66, { nyx: 1, rhea: -1 }, 'Under 5′7″: Nyx says short kings are underrated. Rhea disagrees.'],
    [67, { goldie: 1 }, '5′7″ to 5′10″: Goldie calls it perfect hug height.'],
    [70, { goldie: 1 }, '5′7″ to 5′10″: Goldie calls it perfect hug height.'],
    [71, { rhea: 1 }, '5′11″ to 6′2″: Rhea likes tall.'],
    [74, { rhea: 1 }, '5′11″ to 6′2″: Rhea likes tall.'],
    [75, { rhea: 2, nyx: -1 }, '6′3″ and up: Rhea really likes tall. Nyx finds it intimidating.'],
    [80, { rhea: 2, nyx: -1 }, '6′3″ and up: Rhea really likes tall. Nyx finds it intimidating.'],
  ])('height %i', (height, effects, why) => {
    const bracket = registry.creation.height.find((b) => b.max === undefined || height <= b.max)!
    expect(bracket.effects).toEqual(effects)
    expect(bracket.why).toBe(why)
    expect(start(22, height, 'gamer').why[1]).toBe(why)
  })

  it.each([
    ['gamer', { nyx: 1 }, 'Nyx respects a real gamer.'],
    ['gym', { rhea: 1 }, 'Rhea respects discipline.'],
    ['soft', { goldie: 1 }, 'Goldie loves a soft boy.'],
    ['music', { nyx: 1, goldie: 1, rhea: -1 }, 'Nyx and Goldie love a musician. Rhea calls it “a phase.”'],
  ])('vibe %s', (vibe, effects, why) => {
    const v = registry.creation.vibes.find((x) => x.id === vibe)!
    expect(v.effects).toEqual(effects)
    expect(start(25, 71, vibe).why[2]).toBe(why)
  })

  it('sums the three effects for every girl', () => {
    expect(start(22, 70, 'gamer')).toEqual({
      affection: { nyx: 2, goldie: 2, rhea: 0 },
      why: [
        "21 to 24: Nyx and Goldie like that you're their age.",
        '5′7″ to 5′10″: Goldie calls it perfect hug height.',
        'Nyx respects a real gamer.',
      ],
    })
    expect(start(19, 78, 'music').affection).toEqual({ nyx: 0, goldie: 2, rhea: 0 })
    expect(start(33, 62, 'gym').affection).toEqual({ nyx: 0, goldie: -1, rhea: 1 })
  })

  it('labels heights in feet, inches and centimetres', () => {
    expect(registry.creation.heightLabel(60)).toBe('5′0″ (152 cm)')
    expect(registry.creation.heightLabel(70)).toBe('5′10″ (178 cm)')
    expect(registry.creation.heightLabel(80)).toBe('6′8″ (203 cm)')
  })
})
