import type { ContentRegistry } from '@/content/types'
import { RIVAL_START_AFFECTION, SLOTS_PER_DAY, SUPPORTING_START_AFFECTION } from './constants'
import { chooseConfrontation, shouldConfront } from './confrontation'
import { contentContext } from './context'
import { startingAffection } from './creation'
import { applyEffects, mergeDeltas } from './effects'
import { canDoEvening, resolveEvening } from './evening'
import { addPostsForDay, like } from './feed'
import { createInitialState } from './initialState'
import { resolveReaction } from './reactions'
import { createRng } from './rng'
import { pickScene } from './scheduler'
import type { Action, GameState } from './types'

export type Reducer = (state: GameState, action: Action) => GameState

export function createReducer(content: ContentRegistry): Reducer {
  function loadScene(s: GameState): void {
    const ref = pickScene(content, s, s.day, s.slot)
    if (!ref) throw new Error(`No scene for day ${s.day} slot ${s.slot}`)
    s.scene = ref
  }

  function currentVariant(s: GameState) {
    const scene = s.scene ? content.scene(s.scene.sceneId) : undefined
    const variant = scene && s.scene ? scene.variants[s.scene.variant] : undefined
    return scene && variant ? { scene, variant } : undefined
  }

  return function reducer(state, action) {
    if (action.type === 'reset') return createInitialState(content, action.seed)
    const s = structuredClone(state)

    switch (action.type) {
      case 'goToCreate':
        s.phase = 'create'
        return s

      case 'setName':
        s.player.name = action.name
        if (s.createError) s.createError = ''
        return s

      case 'setPlayerField':
        Object.assign(s.player, { [action.field]: action.value })
        return s

      case 'begin': {
        const n = s.player.name.trim()
        if (!n) {
          s.createError = content.creation.nameRequired
          return s
        }
        s.player.name = n
        const st = startingAffection(content, s.player).affection
        for (const li of content.loveInterests) s.affection[li.id] = st[li.id]
        for (const c of content.supporting) s.affection[c.id] = SUPPORTING_START_AFFECTION
        for (const c of content.rivals) s.affection[c.id] = RIVAL_START_AFFECTION
        addPostsForDay(content, s, 0)
        loadScene(s)
        s.phase = 'scene'
        return s
      }

      case 'setView':
        s.view = action.view
        if (action.view === 'feed') {
          s.unseen = 0
          s.feedDay = s.day
        }
        s.note = ''
        return s

      case 'choose': {
        const cur = currentVariant(s)
        const c = cur?.variant.choices[action.index]
        if (!cur || !c) return state
        const pick = c.effects.find((e) => e.type === 'pickDate')
        if (pick) {
          const g = pick.who
          s.pick = g
          s.view = 'story'
          const off = shouldConfront(s, g)
          s.phase = off ? 'confront' : 'ending'
          s.moodOverrides = off ? { [g]: 'upset' } : null
          return s
        }
        const rng = createRng(s.rng)
        s.lastReaction = resolveReaction(c, cur.scene.cast[0], rng, contentContext(content, s))
        applyEffects(content, s, c.effects)
        s.lastChoice = { text: c.text, deltas: mergeDeltas(c.effects) }
        s.phase = 'react'
        s.rng = rng.state
        return s
      }

      case 'continue':
        s.moodOverrides = null
        s.slot++
        if (s.slot >= SLOTS_PER_DAY) {
          s.phase = 'evening'
          s.evening.result = null
          s.evening.mode = null
        } else {
          loadScene(s)
          s.phase = 'scene'
        }
        return s

      case 'selectEveningGirl':
        s.evening.selected = action.who
        return s

      case 'setEveningMode':
        s.evening.mode = action.mode
        return s

      case 'doEvening': {
        if (!canDoEvening(content, s, action.action)) return state
        const rng = createRng(s.rng)
        resolveEvening(content, s, action.action, rng)
        s.rng = rng.state
        return s
      }

      case 'nextDay':
        s.day++
        s.slot = 0
        s.moodOverrides = null
        s.likedToday = false
        s.evening.result = null
        s.evening.mode = null
        addPostsForDay(content, s, s.day)
        loadScene(s)
        s.phase = 'scene'
        s.view = 'story'
        return s

      case 'setFeedDay':
        s.feedDay = action.day
        s.note = ''
        return s

      case 'stepFeedDay':
        s.feedDay = Math.max(0, Math.min(s.day, s.feedDay + action.delta))
        s.note = ''
        return s

      case 'like': {
        const rng = createRng(s.rng)
        like(content, s, action.postId, rng)
        s.rng = rng.state
        return s
      }

      case 'confront': {
        const rng = createRng(s.rng)
        chooseConfrontation(content, s, action.index, rng)
        s.rng = rng.state
        return s
      }

      case 'seeEnding':
        s.phase = 'ending'
        s.moodOverrides = null
        return s
    }
  }
}
