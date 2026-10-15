import { createRegistry } from '@/content/createRegistry'
import { choice, narrate, pickDate, say, sequence, tiered } from '@/content/helpers'
import type {
  Activity,
  CharacterId,
  ContentParts,
  ContentRegistry,
  LoveInterest,
  PostText,
  Rival,
  Scene,
  Supporting,
} from '@/content/types'
import { PFP_MIN, SLEEP_MIN } from '@/engine/constants'
import { createReducer } from '@/engine/reducer'
import { createInitialState } from '@/engine/initialState'
import type { Action, GameState } from '@/engine/types'

function loveInterest(id: CharacterId, name: string, bestFriend: CharacterId, rival: CharacterId): LoveInterest {
  const posts: PostText[] = [`${id} day0`]
  for (let d = 1; d < 7; d++) posts.push({ warm: `${id} day${d} warm`, cold: `${id} day${d} cold!` })
  const tierLines = (mode: string) => ({ low: [`${id} ${mode} low`], mid: [`${id} ${mode} mid`], high: [`${id} ${mode} high`] })
  return {
    kind: 'loveInterest',
    id,
    name,
    handle: '@' + id,
    type: 'tester',
    age: 21,
    tint: 'violet',
    tintFallback: { bg: '#ffffff', text: '#000000' },
    bio: `${name} bio`,
    bestFriend,
    rival,
    portrait: {
      palette: { bg: '#111111', hair: '#222222', hair2: '#333333', eye: '#444444', shirt: '#555555', acc: '#666666', browUpset: '#777777' },
      hairLength: 190,
      ears: 'none',
      bangsOutline: false,
      streak: false,
      eyeLid: 'arched',
      winged: false,
      browTilt: 'angry',
      mouth: { happy: 'smirk', neutral: 'smirk' },
      details: [],
    },
    avatarTheme: { ears: 'cat', earColor: '#000001', earInner: '#000002', bg: `#bg${id}` },
    eveningLines: { queue: tierLines('queue'), watch: tierLines('watch') },
    milestones: {
      pfp: { gain: id === 'ivy' ? 3 : 2, lines: { mid: [`${id} pfp mid`], high: [`${id} pfp high`] } },
      sleep: { gain: 2, lines: [`${id} sleep line`] },
    },
    feed: { posts, replies: [`${id} reply a`, `${id} reply b`] },
    confrontation: {
      lines: [narrate(`${name} calls.`), say(id, (ctx) => 'heard about ' + ctx.describeOffenses(id) + '.')],
      choices: [
        { text: 'honest', modifier: 2, label: 'You were honest', replies: ['fair'] },
        { text: 'grovel', modifier: -1, label: 'You groveled', replies: ['worse'] },
        { text: 'lie', modifier: -3, label: 'You lied', replies: ['liar'] },
      ],
    },
    endings: {
      good: { title: `${name} good`, text: 'good text' },
      friends: { title: `${name} friends`, text: 'friends text' },
      left: { title: `${name} left`, text: 'left text' },
    },
    epilogue: { high: `${name} high`, mid: `${name} mid`, low: `${name} low` },
  }
}

const avatar = { skin: '#aaaaaa', hair: '#bbbbbb', style: 'short', bg: '#cccccc', shirt: '#dddddd', acc: 'none' } as const

function supporting(id: CharacterId, posts: Supporting['posts'] = []): Supporting {
  return { kind: 'supporting', id, name: id.toUpperCase(), handle: '@' + id, role: `${id} role`, avatar, posts }
}

function rival(id: CharacterId, target: CharacterId, posts: Rival['posts'] = []): Rival {
  return { kind: 'rival', id, name: id.toUpperCase(), handle: '@' + id, role: `${id} role`, avatar, target, rivalEnding: `${id} ending`, posts }
}

function defaultScene(day: number, slot: number): Scene {
  return {
    id: `d${day}s${slot}`,
    title: `Day ${day} slot ${slot}`,
    day,
    slot,
    cast: ['ivy'],
    variants: [
      {
        lines: [narrate(`It is day ${day}.`), say('ivy', (ctx) => `hi ${ctx.playerName}`)],
        choices: [
          choice('up', { ivy: 1, mae: 0, zoe: 0 }, ['yay', 'woo']),
          choice('down', { ivy: -1, sam: 2 }, ['boo'], 'She logs off.'),
          sequence('both', { mae: 2, rex: 1 }, [[say('mae', 'a'), say('ivy', 'b')], [say('mae', 'c')]]),
        ],
      },
    ],
  }
}

const scenes: Scene[] = []
for (let day = 0; day < 7; day++) {
  for (let slot = 0; slot < 3; slot++) {
    if (day === 1 && slot === 0) continue
    if (day === 6 && slot === 2) continue
    scenes.push(defaultScene(day, slot))
  }
}
scenes.push(
  tiered({
    id: 'mae-tiered',
    title: 'Tiered',
    day: 1,
    slot: 0,
    who: 'mae',
    low: { lines: [say('mae', 'low')], choices: [choice('l', { mae: 1 }, ['l!'])] },
    mid: { lines: [say('mae', 'mid')], choices: [choice('m', { mae: 1 }, ['m!'])] },
    high: { lines: [say('mae', 'high')], choices: [choice('h', { mae: 1 }, ['h!'])] },
  }),
  {
    id: 'secret',
    title: 'Secret',
    day: 2,
    slot: 1,
    cast: ['zoe'],
    when: { flag: 'secret' },
    priority: 1,
    variants: [{ lines: [say('zoe', 'psst')], choices: [choice('ok', { zoe: 1 }, ['ok'])] }],
  },
  {
    id: 'pick',
    title: 'Pick',
    day: 6,
    slot: 2,
    cast: ['ivy', 'mae', 'zoe'],
    variants: [
      {
        lines: [narrate('Choose.')],
        choices: [pickDate('ivy', 'Ask Ivy'), pickDate('mae', 'Ask Mae'), pickDate('zoe', 'Ask Zoe')],
      },
    ],
  },
)
scenes[0].variants[0].choices.push({
  text: 'flag it',
  effects: [{ type: 'setFlag', flag: 'secret' }, { type: 'affection', deltas: { zoe: 1 } }],
  reaction: { kind: 'fixed', lines: [say('zoe', 'noted')] },
})

const activities: Activity[] = [
  {
    id: 'duel',
    mode: 'queue',
    name: 'Duel',
    desc: 'A duel.',
    effects: { ivy: 2, mae: 0, zoe: -1 },
    reactions: { ivy: ['ivy duel'], mae: ['mae duel'], zoe: ['zoe duel'] },
    narrate: (rng) => `You win ${rng.int(10)}.`,
  },
  {
    id: 'film',
    mode: 'watch',
    name: 'Film',
    desc: 'A film.',
    effects: { ivy: 1, mae: 1, zoe: 1 },
    reactions: { ivy: ['ivy film'], mae: ['mae film'], zoe: ['zoe film'] },
    narrate: () => 'You watch a film.',
  },
]

export const parts: ContentParts = {
  loveInterests: [loveInterest('ivy', 'Ivy', 'sam', 'rex'), loveInterest('mae', 'Mae', 'lou', 'vic'), loveInterest('zoe', 'Zoe', 'kit', 'ace')],
  supporting: [
    supporting('sam', [{ day: 0, order: 1, text: 'sam says hi' }]),
    supporting('lou'),
    supporting('kit'),
    supporting('mod', [{ day: 0, order: 0, text: 'mod rules' }]),
  ],
  rivals: [rival('rex', 'ivy', [{ day: 1, order: 0, text: 'rex brags' }]), rival('vic', 'mae'), rival('ace', 'zoe')],
  scenes,
  activityModes: [
    { id: 'queue', menuLabel: 'Queue with {n}', prompt: 'Queue what with {n}?', icon: 'device-gamepad-2' },
    { id: 'watch', menuLabel: 'Watch with {n}', prompt: 'Watch what with {n}?', icon: 'device-tv' },
  ],
  activities,
  milestones: {
    pfp: {
      label: 'Match with {n}',
      icon: 'photo',
      min: PFP_MIN,
      lockedLabel: 'Match with {n} · locked',
      switchPenalty: -3,
      switchedNarration: '{prev} noticed you switched to {name}.',
      matchedNarration: 'Matched.',
    },
    sleep: {
      label: 'Sleep call with {n}',
      icon: 'moon',
      min: SLEEP_MIN,
      hintMin: PFP_MIN,
      hint: 'Hint.',
      repeatGain: 1,
      narration: ['zzz'],
    },
  },
  creation: {
    nameRequired: 'Name required',
    nameMaxLength: 16,
    ageRange: { min: 18, max: 35 },
    heightRange: { min: 60, max: 80 },
    age: [
      { max: 20, effects: { mae: 1 }, why: 'young' },
      { effects: { ivy: 1, zoe: -1 }, why: 'older' },
    ],
    height: [
      { max: 66, effects: { zoe: -1 }, why: 'short' },
      { effects: { zoe: 2 }, why: 'tall' },
    ],
    heightLabel: (i) => `${i} in`,
    vibes: [
      { id: 'calm', label: 'Calm', effects: { ivy: 1, mae: -1 }, why: 'calm vibe' },
      { id: 'loud', label: 'Loud', effects: { mae: 2 }, why: 'loud vibe' },
    ],
    ethnicities: ['Prefer not to say', 'Other'],
    skins: ['#s1', '#s2'],
    hairs: ['#h1', '#h2'],
    hairStyles: [{ id: 'short', label: 'Short' }],
    hairPaths: { short: 'M0 0', messy: 'M0 0', buzz: 'M0 0', long: 'M0 0' },
    playerAvatar: { bg: '#D3D1C7', shirt: '#185FA5' },
    defaults: {
      name: '',
      age: 22,
      height: 70,
      ethnicity: 'Prefer not to say',
      skin: '#s2',
      hair: '#h1',
      hairStyle: 'short',
      vibe: 'calm',
    },
  },
  scoring: {
    modifiers: [
      {
        kind: 'threshold',
        subject: { kind: 'bestFriend' },
        high: { gte: 2, label: '{name} vouched', value: 2 },
        low: { lte: -2, label: '{name} warned', value: -2 },
      },
      {
        kind: 'threshold',
        subject: { kind: 'character', id: 'mod' },
        high: { gte: 2, label: 'Mod liked you', value: 1 },
        low: { lte: -2, label: 'Mod gossiped', value: -1 },
      },
      {
        kind: 'threshold',
        subject: { kind: 'rival' },
        high: { gte: 4, label: '{name} competed', value: -2 },
        low: { lte: 0, label: 'You outshone {name}', value: 1 },
      },
      { kind: 'matched', label: 'Matched pfps', value: 1 },
      { kind: 'sleptWithOthers', label: 'Slept with {names}', value: -3 },
      { kind: 'pfpWithOthers', label: 'Pfps with {names}', value: -2 },
      { kind: 'confrontation' },
    ],
    tierLabels: {
      good: { label: 'Good', tone: 'success' },
      friends: { label: 'Friends', tone: 'warning' },
      left: { label: 'Bad', tone: 'danger' },
    },
    legend: 'legend',
  },
  feedNotes: {
    weekOver: 'over',
    alreadyLiked: 'already',
    likeUsed: 'used',
    likedLoveInterest: 'Liked {name} · {others}',
    likedSupporting: 'Liked {name}',
    likedRival: 'Hyped {name} for {target}',
  },
}

export const content: ContentRegistry = createRegistry(parts)
export const reducer = createReducer(content)

export function run(state: GameState, ...actions: Action[]): GameState {
  return actions.reduce(reducer, state)
}

export function started(seed = 1, name = 'tester'): GameState {
  return run(createInitialState(content, seed), { type: 'goToCreate' }, { type: 'setName', name }, { type: 'begin' })
}

export function withAffection(s: GameState, values: Record<CharacterId, number>): GameState {
  return { ...s, affection: { ...s.affection, ...values } }
}

export function atEvening(seed = 1): GameState {
  return run(started(seed), { type: 'choose', index: 0 }, { type: 'continue' }, { type: 'choose', index: 0 }, { type: 'continue' }, { type: 'choose', index: 0 }, { type: 'continue' })
}
