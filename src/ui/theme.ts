import type { CharacterId, ContentRegistry } from '@/content/types'
import type { GameState } from '@/engine/types'
import type { UiIconName } from '@/ui/components/Icon'

export const ON = 'oklch(0.68 0.16 350)'
export const ONBG = 'oklch(0.3 0.04 350)'
export const ON_FG = 'oklch(0.16 0.02 350)'
export const TEXT = 'oklch(0.93 0.005 270)'

export const NAMECOL: Record<CharacterId, string> = {
  nyx: 'oklch(0.76 0.13 295)',
  goldie: 'oklch(0.82 0.13 80)',
  rhea: 'oklch(0.78 0.13 350)',
  benji: 'oklch(0.78 0.12 160)',
}

export const BANNER: Record<CharacterId, string> = {
  nyx: 'oklch(0.45 0.12 295)',
  goldie: 'oklch(0.6 0.12 80)',
  rhea: 'oklch(0.5 0.13 350)',
  mika: 'oklch(0.5 0.1 350)',
  theo: 'oklch(0.48 0.1 140)',
  jade: 'oklch(0.45 0.08 175)',
  benji: 'oklch(0.45 0.1 160)',
  ezra: 'oklch(0.35 0.03 270)',
  dex: 'oklch(0.55 0.1 60)',
  kai: 'oklch(0.45 0.08 240)',
  group: 'oklch(0.45 0.12 350)',
}

export const STATUS: Record<CharacterId, [string, string]> = {
  nyx: ['oklch(0.62 0.2 300)', 'Streaming · ranked-grind'],
  goldie: ['oklch(0.72 0.17 150)', 'Online'],
  rhea: ['oklch(0.72 0.17 150)', 'Playing Arcanum Lanes'],
}

export const VIBE_ICON: Record<string, UiIconName> = {
  gamer: 'device-gamepad-2',
  gym: 'barbell',
  soft: 'flower',
  music: 'guitar-pick',
}

export const VIBE_SHORT: Record<string, string> = { gamer: 'Gamer', gym: 'Gym rat', soft: 'Soft boy', music: 'Musician' }

export interface Person {
  name: string
  color: string
  handle: string
  bio: string
  meta: string
  side: boolean
}

export function person(content: ContentRegistry, game: GameState, id: CharacterId): Person {
  if (id === 'you') return { name: game.player.name, color: TEXT, handle: '', bio: '', meta: '', side: false }
  if (id === 'group') {
    return {
      name: 'nyx, goldie, rhea',
      color: TEXT,
      handle: 'Group DM · 4 members',
      bio: 'You, Nyx, Goldie and Rhea. What could go wrong.',
      meta: '',
      side: false,
    }
  }
  const c = content.character(id)
  if (c?.kind === 'loveInterest') {
    return { name: c.name, color: NAMECOL[id], handle: c.handle, bio: c.bio, meta: c.type + ' · ' + c.age, side: false }
  }
  return { name: c?.name ?? '', color: NAMECOL[id] ?? TEXT, handle: c?.handle ?? '', bio: c?.role ?? '', meta: '', side: true }
}

export function meSub(p: { age: number; height: number; vibe: string }, heightLabel: (i: number) => string): string {
  return p.age + ' · ' + heightLabel(p.height).split(' ')[0] + ' · ' + VIBE_SHORT[p.vibe]
}
