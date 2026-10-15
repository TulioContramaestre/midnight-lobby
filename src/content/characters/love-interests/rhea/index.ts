import type { LoveInterest } from '@/content/types'
import { avatarTheme } from './avatarTheme'
import { confrontation } from './confrontation'
import { endings, epilogue } from './endings'
import { eveningLines } from './eveningLines'
import { feed } from './feed'
import { milestones } from './milestones'
import { portrait } from './portrait'
import { profile } from './profile'

export const rhea: LoveInterest = {
  kind: 'loveInterest',
  id: 'rhea',
  ...profile,
  bestFriend: 'jade',
  rival: 'kai',
  portrait,
  avatarTheme,
  eveningLines,
  milestones,
  feed,
  confrontation,
  endings,
  epilogue,
}
