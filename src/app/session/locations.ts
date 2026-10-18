export type Loc = `ch:${string}` | `dm:${string}`

export const LOC: Record<string, Loc | 'pick'> = {
  'The new guy in voice chat': 'ch:general',
  'House rules': 'ch:welcome',
  'A very excited DM': 'dm:goldie',
  'Ranked with the bunny': 'dm:rhea',
  'The other e-boy': 'ch:general',
  'Group chat incident': 'dm:group',
  '2am voice chat': 'dm:nyx',
  'The best friend talk': 'dm:theo',
  'Cookie emergency': 'dm:goldie',
  Mid: 'ch:general',
  'The 1v1': 'ch:general',
  "Goldie's rough night": 'dm:goldie',
  'Game night': 'ch:lfg',
  'Live on stream': 'dm:mika',
  'The leaked screenshot': 'dm:group',
  'Suspicious timing': 'dm:nyx',
  'The 40-slide plan': 'dm:dex',
  'The ultimatum': 'dm:rhea',
  "The duo's warning": 'dm:jade',
  'Group chat meltdown': 'dm:group',
  'Who do you choose?': 'pick',
}

export const TIMES = ['9:14 PM', '10:32 PM', '11:47 PM']
export const EVE_TIME = '12:20 AM'
export const DN3 = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const CHANNELS = ['welcome', 'general', 'lfg', 'clips']
