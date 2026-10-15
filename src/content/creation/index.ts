import type { CreationContent } from '@/content/types'
import { ageBrackets, ageRange } from './age'
import { hairPaths, hairs, hairStyles, playerAvatar, skins } from './appearance'
import { ethnicities } from './ethnicities'
import { heightBrackets, heightLabel, heightRange } from './height'
import { vibes } from './vibes'

export const creation: CreationContent = {
  nameRequired: 'Enter a gamertag first',
  nameMaxLength: 16,
  ageRange,
  heightRange,
  age: ageBrackets,
  height: heightBrackets,
  heightLabel,
  vibes,
  ethnicities,
  skins,
  hairs,
  hairStyles,
  hairPaths,
  playerAvatar,
  defaults: {
    name: '',
    age: 22,
    height: 70,
    ethnicity: ethnicities[0],
    skin: skins[1],
    hair: hairs[0],
    hairStyle: 'short',
    vibe: 'gamer',
  },
}
