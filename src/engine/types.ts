import type { CharacterId, Deltas, HairStyle, MilestoneId } from '@/content/types'

export type Tier = 'low' | 'mid' | 'high'
export type Mood = 'happy' | 'neutral' | 'upset'
export type EndingTier = 'good' | 'friends' | 'left'
export type FlagValue = boolean | number

export type Phase = 'intro' | 'create' | 'scene' | 'react' | 'evening' | 'confront' | 'ending'
export type View = 'story' | 'feed' | 'people'

export interface Player {
  name: string
  age: number
  height: number
  ethnicity: string
  skin: string
  hair: string
  hairStyle: HairStyle
  vibe: string
}

export interface ResolvedLine {
  speaker: CharacterId | null
  text: string
}

export interface Post {
  id: string
  author: CharacterId
  text: string
  day: number
  likes: number
  liked: boolean
  reply: string | null
}

export interface EveningResult {
  lines: ResolvedLine[]
  deltas: Deltas
}

export interface GameState {
  phase: Phase
  view: View
  day: number
  slot: number
  rng: number
  player: Player
  createError: string
  affection: Record<CharacterId, number>
  likeCount: Record<CharacterId, number>
  likedToday: boolean
  matched: CharacterId | null
  pfpAll: CharacterId[]
  slept: CharacterId[]
  flags: Record<string, FlagValue>
  moodOverrides: Record<CharacterId, Mood> | null
  scene: { sceneId: string; variant: number } | null
  lastChoice: { text: string; deltas: Deltas } | null
  lastReaction: ResolvedLine[] | null
  evening: {
    selected: CharacterId | null
    mode: string | null
    result: EveningResult | null
  }
  pick: CharacterId | null
  confrontation: { choiceIndex: number; reply: string } | null
  feed: Post[]
  unseen: number
  feedDay: number
  note: string
}

export type EditablePlayer = Omit<Player, 'name'>

export type EveningAction = { kind: 'activity'; id: string } | { kind: 'milestone'; id: MilestoneId }

export type Action =
  | { type: 'reset'; seed: number }
  | { type: 'goToCreate' }
  | { type: 'setName'; name: string }
  | { [K in keyof EditablePlayer]: { type: 'setPlayerField'; field: K; value: EditablePlayer[K] } }[keyof EditablePlayer]
  | { type: 'begin' }
  | { type: 'setView'; view: View }
  | { type: 'choose'; index: number }
  | { type: 'continue' }
  | { type: 'selectEveningGirl'; who: CharacterId }
  | { type: 'setEveningMode'; mode: string | null }
  | { type: 'doEvening'; action: EveningAction }
  | { type: 'nextDay' }
  | { type: 'setFeedDay'; day: number }
  | { type: 'stepFeedDay'; delta: number }
  | { type: 'like'; postId: string }
  | { type: 'confront'; index: number }
  | { type: 'seeEnding' }
