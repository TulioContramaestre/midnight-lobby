import type { AvatarSpec, CharacterId, ContentRegistry, Deltas } from '@/content/types'
import { mood, tierOf } from './affection'
import { DAY_NAMES } from './constants'
import { contentContext } from './context'
import { startingAffection } from './creation'
import { characterName } from './names'
import { resolveLine } from './reactions'
import { endingTier, epilogueTier, rivalEndings, score } from './scoring'
import { fill } from './template'
import type { GameState, Mood, Player } from './types'

export interface DeltaChip {
  id: CharacterId
  label: string
  good: boolean
  up: boolean
}

export function createSelectors(content: ContentRegistry) {
  const name = (id: CharacterId) => characterName(content, id)

  const deltaChips = (deltas: Deltas): DeltaChip[] =>
    Object.entries(deltas)
      .filter(([, d]) => d)
      .map(([id, d]) => {
        const rival = content.rival(id) !== undefined
        return { id, label: rival ? name(id) + "'s odds" : name(id), good: rival ? d < 0 : d > 0, up: d > 0 }
      })

  return {
    content,
    name,
    deltaChips,
    tier: (s: GameState, id: CharacterId) => tierOf(s, id),
    mood: (s: GameState, id: CharacterId) => mood(s, id),

    header: (s: GameState) => ({
      day: s.day,
      dayName: DAY_NAMES[s.day],
      evening: s.phase === 'evening',
      unseen: s.unseen,
    }),

    cast: (s: GameState, ids: readonly CharacterId[]) =>
      ids.map((id) => ({
        id,
        name: name(id),
        rival: content.rival(id) !== undefined,
        mood: mood(s, id),
      })),

    currentScene: (s: GameState) => {
      const scene = s.scene ? content.scene(s.scene.sceneId) : undefined
      const variant = scene && s.scene ? scene.variants[s.scene.variant] : undefined
      if (!scene || !variant) return null
      const ctx = contentContext(content, s)
      return {
        title: scene.title,
        slot: s.slot,
        cast: scene.cast,
        lines: variant.lines.map((l) => resolveLine(l, ctx)),
        choices: variant.choices.map((c) => c.text),
      }
    },

    firstImpressions: (player: Pick<Player, 'age' | 'height' | 'vibe'>) => {
      const { affection, why } = startingAffection(content, player)
      return {
        entries: content.loveInterests.map((li) => {
          const value = affection[li.id]
          const m: Mood = value > 0 ? 'happy' : value < 0 ? 'upset' : 'neutral'
          return { id: li.id, name: li.name, value, mood: m }
        }),
        why,
      }
    },

    evening: (s: GameState) => {
      const g = s.evening.selected
      const li = g ? content.loveInterest(g) : undefined
      const v = g ? s.affection[g] : 0
      const n = li?.name ?? ''
      const { pfp, sleep } = content.milestones
      const mode = s.evening.mode ? content.activityMode(s.evening.mode) : undefined
      return {
        girls: content.loveInterests.map((l) => ({ id: l.id, name: l.name, mood: mood(s, l.id), selected: l.id === g })),
        name: n,
        modes: content.activityModes.map((m) => ({ id: m.id, label: fill(m.menuLabel, { n }), icon: m.icon })),
        mode: mode
          ? {
              id: mode.id,
              prompt: fill(mode.prompt, { n }),
              activities: content.activities
                .filter((a) => a.mode === mode.id)
                .map((a) => ({ id: a.id, name: a.name, desc: a.desc })),
            }
          : null,
        pfp:
          s.matched === g
            ? null
            : v >= pfp.min
              ? { unlocked: true as const, label: fill(pfp.label, { n }), icon: pfp.icon }
              : { unlocked: false as const, label: fill(pfp.lockedLabel, { n }) },
        sleep: v >= sleep.min ? { label: fill(sleep.label, { n }), icon: sleep.icon } : null,
        sleepHint: v < sleep.min && v >= sleep.hintMin ? sleep.hint : null,
        result: s.evening.result,
        nextDayName: DAY_NAMES[s.day + 1],
        likedToday: s.likedToday,
      }
    },

    feed: (s: GameState) => ({
      days: Array.from({ length: s.day + 1 }, (_, d) => ({ day: d, label: DAY_NAMES[d].slice(0, 3), selected: d === s.feedDay })),
      dayName: DAY_NAMES[s.feedDay],
      isToday: s.feedDay === s.day,
      likedToday: s.likedToday,
      note: s.note,
      posts: s.feed
        .filter((p) => p.day === s.feedDay)
        .map((p) => ({ ...p, name: name(p.author), handle: content.character(p.author)?.handle ?? '' })),
    }),

    people: (s: GameState) => ({
      player: s.player,
      heightLabel: content.creation.heightLabel(s.player.height),
      vibeLabel: content.creation.vibes.find((v) => v.id === s.player.vibe)?.label ?? '',
      matchedName: s.matched ? name(s.matched) : null,
      sleptNames: s.slept.map(name),
      friends: content.supporting,
      competition: content.rivals,
    }),

    confrontation: (s: GameState) => {
      const g = s.pick
      const li = g ? content.loveInterest(g) : undefined
      if (!g || !li) return null
      const ctx = contentContext(content, s)
      const chosen = s.confrontation ? li.confrontation.choices[s.confrontation.choiceIndex] : undefined
      return {
        who: g,
        lines: li.confrontation.lines.map((l) => resolveLine(l, ctx)),
        choices: li.confrontation.choices.map((c) => c.text),
        chosen:
          chosen && s.confrontation
            ? { text: chosen.text, reply: s.confrontation.reply, chips: deltaChips({ [g]: chosen.modifier }) }
            : null,
      }
    },

    ending: (s: GameState) => {
      const g = s.pick
      const li = g ? content.loveInterest(g) : undefined
      if (!g || !li) return null
      const sc = score(content, s, g)
      const tier = endingTier(sc.final)
      const m: Mood = tier === 'good' ? 'happy' : tier === 'friends' ? 'neutral' : 'upset'
      return {
        who: g,
        name: li.name,
        tier,
        mood: m,
        label: content.scoring.tierLabels[tier],
        legend: content.scoring.legend,
        score: sc,
        ending: li.endings[tier],
        epilogues: content.loveInterests
          .filter((k) => k.id !== g)
          .map((k) => {
            const value = s.affection[k.id]
            const t = epilogueTier(value)
            const em: Mood = t === 'mid' ? 'neutral' : 'upset'
            return { id: k.id, name: k.name, value, mood: em, text: k.epilogue[t] }
          }),
        rivals: rivalEndings(content, s, g, tier).map((r) => ({ id: r.id, name: r.name, avatar: r.avatar, text: r.rivalEnding })),
      }
    },

    playerAvatar: (s: GameState): { spec: AvatarSpec; label: string } => {
      const theme = s.matched ? content.loveInterest(s.matched)?.avatarTheme : undefined
      const base = content.creation.playerAvatar
      return {
        spec: {
          skin: s.player.skin,
          hair: s.player.hair,
          style: s.player.hairStyle,
          bg: theme ? theme.bg : base.bg,
          shirt: base.shirt,
          acc: 'none',
          ears: theme ? theme.ears : null,
          earColor: theme ? theme.earColor : '',
          earInner: theme ? theme.earInner : '',
        },
        label: (s.player.name || 'Your') + ' avatar',
      }
    },
  }
}

export type Selectors = ReturnType<typeof createSelectors>
