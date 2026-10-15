import { describe, expect, it } from 'vitest'
import * as C from '@/engine/constants'

describe('constants match the reference', () => {
  it('days and slots', () => {
    expect(C.DAY_NAMES).toEqual(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
    expect(C.DAY_COUNT).toBe(7)
    expect(C.SLOTS_PER_DAY).toBe(3)
  })

  it('thresholds', () => {
    expect([C.SCENE_TIER_HIGH_MIN, C.SCENE_TIER_MID_MIN]).toEqual([7, 3])
    expect([C.MOOD_HAPPY_MIN, C.MOOD_UPSET_MAX]).toEqual([6, 0])
    expect([C.PFP_MIN, C.SLEEP_MIN]).toEqual([6, 8])
    expect([C.ENDING_GOOD_MIN, C.ENDING_FRIENDS_MIN]).toEqual([9, 4])
    expect([C.EPILOGUE_HIGH_MIN, C.EPILOGUE_MID_MIN]).toEqual([9, 4])
    expect(C.RIVAL_ENDING_MIN).toBe(3)
    expect(C.POST_WARM_MIN).toBe(3)
    expect(C.UNSEEN_PER_DAY).toBe(5)
  })

  it('starting affection for the supporting cast and rivals', () => {
    expect(C.SUPPORTING_START_AFFECTION).toBe(0)
    expect(C.RIVAL_START_AFFECTION).toBe(2)
  })
})
