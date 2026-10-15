import type { Rng } from '@/engine/rng'
import type { EndingTier, FlagValue, Mood, Tier } from '@/engine/types'

export type { EndingTier, FlagValue, Mood, Tier }

export type CharacterId = string
export type Deltas = Record<CharacterId, number>

export type IconName =
  | 'calendar'
  | 'message-circle'
  | 'hash'
  | 'users'
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-up'
  | 'arrow-down'
  | 'minus'
  | 'device-gamepad-2'
  | 'device-tv'
  | 'photo'
  | 'moon'
  | 'lock'
  | 'chevron-left'
  | 'chevron-right'
  | 'heart'
  | 'refresh'

export interface ContentContext {
  readonly playerName: string
  readonly day: number
  readonly loveInterests: readonly CharacterId[]
  readonly slept: readonly CharacterId[]
  readonly pfpAll: readonly CharacterId[]
  readonly matched: CharacterId | null
  readonly flags: Readonly<Record<string, FlagValue>>
  affection(id: CharacterId): number
  likeCount(id: CharacterId): number
  name(id: CharacterId): string
  describeOffenses(id: CharacterId): string
}

export type LineText = string | ((ctx: ContentContext) => string)
export interface Line {
  speaker: CharacterId | null
  text: LineText
}

export type Condition =
  | { all: Condition[] }
  | { any: Condition[] }
  | { not: Condition }
  | { affection: { who: CharacterId; gte?: number; lte?: number } }
  | { tier: { who: CharacterId; is: Tier } }
  | { flag: string; is?: FlagValue }
  | { day: { gte?: number; lte?: number; is?: number } }

export type Effect =
  | { type: 'affection'; deltas: Deltas }
  | { type: 'setFlag'; flag: string; value?: FlagValue }
  | { type: 'pickDate'; who: CharacterId }

export type Reaction =
  | { kind: 'oneOf'; speaker?: CharacterId; options: string[] }
  | { kind: 'sequenceOf'; options: Line[][] }
  | { kind: 'fixed'; lines: Line[] }

export interface Choice {
  text: string
  effects: Effect[]
  reaction?: Reaction
  narration?: string
}

export interface SceneVariant {
  when?: Condition
  lines: Line[]
  choices: Choice[]
}

export interface Scene {
  id: string
  title: string
  day: number
  slot: number
  cast: CharacterId[]
  when?: Condition
  priority?: number
  variants: SceneVariant[]
}

export type HairStyle = 'short' | 'messy' | 'buzz' | 'long'
export type AvatarAccessory = 'none' | 'glasses' | 'beanie' | 'headset' | 'earring' | 'bow'
export type AvatarEars = 'cat' | 'dog' | 'bunny'

export interface AvatarSpec {
  skin: string
  hair: string
  style: HairStyle
  bg: string
  shirt: string
  acc: AvatarAccessory
  ears?: AvatarEars | null
  earColor?: string
  earInner?: string
}

export interface AvatarTheme {
  ears: AvatarEars
  earColor: string
  earInner: string
  bg: string
}

export type PortraitEars = 'cat' | 'bunny' | 'dog' | 'none'
export type PortraitDetail = 'heart' | 'choker' | 'bow' | 'freckles' | 'collar' | 'mole'

export interface PortraitSpec {
  palette: {
    bg: string
    hair: string
    hair2: string
    eye: string
    shirt: string
    acc: string
    browUpset: string
    freckles?: string
  }
  hairLength: number
  ears: PortraitEars
  bangsOutline: boolean
  streak: boolean
  eyeLid: 'arched' | 'heavy'
  winged: boolean
  browTilt: 'angry' | 'sad'
  mouth: { happy: 'cat' | 'open' | 'smirk'; neutral: 'flat' | 'smile' | 'smirk' }
  details: PortraitDetail[]
}

export interface LoveInterestProfile {
  name: string
  handle: string
  type: string
  age: number
  tint: string
  tintFallback: { bg: string; text: string }
  bio: string
}

export type TierLines = Record<Tier, string[]>
export type EveningLines = Record<string, TierLines>

export interface LoveInterestMilestones {
  pfp: { gain: number; lines: { mid: string[]; high: string[] } }
  sleep: { gain: number; lines: string[] }
}

export type PostText = string | { warm: string; cold: string }

export interface LoveInterestFeed {
  posts: PostText[]
  replies: string[]
}

export interface ConfrontationChoice {
  text: string
  modifier: number
  label: string
  replies: string[]
}

export interface Confrontation {
  lines: Line[]
  choices: ConfrontationChoice[]
}

export interface Ending {
  title: string
  text: string
}

export type Endings = Record<EndingTier, Ending>
export type Epilogue = Record<Tier, string>

export interface LoveInterest extends LoveInterestProfile {
  kind: 'loveInterest'
  id: CharacterId
  bestFriend: CharacterId
  rival: CharacterId
  portrait: PortraitSpec
  avatarTheme: AvatarTheme
  eveningLines: EveningLines
  milestones: LoveInterestMilestones
  feed: LoveInterestFeed
  confrontation: Confrontation
  endings: Endings
  epilogue: Epilogue
}

export interface ExtraPost {
  day: number
  order: number
  text: string
}

export interface Supporting {
  kind: 'supporting'
  id: CharacterId
  name: string
  handle: string
  role: string
  avatar: AvatarSpec
  posts: ExtraPost[]
}

export interface Rival {
  kind: 'rival'
  id: CharacterId
  name: string
  handle: string
  role: string
  avatar: AvatarSpec
  target: CharacterId
  rivalEnding: string
  posts: ExtraPost[]
}

export type Character = LoveInterest | Supporting | Rival

export interface ActivityMode {
  id: string
  menuLabel: string
  prompt: string
  icon: IconName
}

export interface Activity {
  id: string
  mode: string
  name: string
  desc: string
  effects: Deltas
  reactions: Record<CharacterId, string[]>
  narrate: (rng: Rng) => string
}

export interface PfpMilestone {
  label: string
  icon: IconName
  min: number
  lockedLabel: string
  switchPenalty: number
  switchedNarration: string
  matchedNarration: string
}

export interface SleepMilestone {
  label: string
  icon: IconName
  min: number
  hintMin: number
  hint: string
  repeatGain: number
  narration: string[]
}

export interface Milestones {
  pfp: PfpMilestone
  sleep: SleepMilestone
}

export type MilestoneId = keyof Milestones

export interface Bracket {
  max?: number
  effects: Deltas
  why: string
}

export interface Vibe {
  id: string
  label: string
  effects: Deltas
  why: string
}

export interface PlayerDefaults {
  name: string
  age: number
  height: number
  ethnicity: string
  skin: string
  hair: string
  hairStyle: HairStyle
  vibe: string
}

export interface CreationContent {
  nameRequired: string
  nameMaxLength: number
  ageRange: { min: number; max: number }
  heightRange: { min: number; max: number }
  age: Bracket[]
  height: Bracket[]
  heightLabel: (inches: number) => string
  vibes: Vibe[]
  ethnicities: string[]
  skins: string[]
  hairs: string[]
  hairStyles: { id: HairStyle; label: string }[]
  hairPaths: Record<HairStyle, string>
  playerAvatar: { bg: string; shirt: string }
  defaults: PlayerDefaults
}

export type ScoreSubject = { kind: 'bestFriend' } | { kind: 'rival' } | { kind: 'character'; id: CharacterId }

export type EndingModifierRule =
  | {
      kind: 'threshold'
      subject: ScoreSubject
      high: { gte: number; label: string; value: number }
      low: { lte: number; label: string; value: number }
    }
  | { kind: 'matched'; label: string; value: number }
  | { kind: 'sleptWithOthers'; label: string; value: number }
  | { kind: 'pfpWithOthers'; label: string; value: number }
  | { kind: 'confrontation' }

export interface ScoringContent {
  modifiers: EndingModifierRule[]
  tierLabels: Record<EndingTier, { label: string; tone: 'success' | 'warning' | 'danger' }>
  legend: string
}

export interface FeedNotes {
  weekOver: string
  alreadyLiked: string
  likeUsed: string
  likedLoveInterest: string
  likedSupporting: string
  likedRival: string
}

export interface ContentParts {
  loveInterests: LoveInterest[]
  supporting: Supporting[]
  rivals: Rival[]
  scenes: Scene[]
  activityModes: ActivityMode[]
  activities: Activity[]
  milestones: Milestones
  creation: CreationContent
  scoring: ScoringContent
  feedNotes: FeedNotes
}

export interface ContentRegistry extends Readonly<ContentParts> {
  readonly characters: readonly Character[]
  character(id: CharacterId): Character | undefined
  loveInterest(id: CharacterId): LoveInterest | undefined
  supportingCharacter(id: CharacterId): Supporting | undefined
  rival(id: CharacterId): Rival | undefined
  scene(id: string): Scene | undefined
  activity(id: string): Activity | undefined
  activityMode(id: string): ActivityMode | undefined
}
