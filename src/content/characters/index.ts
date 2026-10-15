import { nyx } from './love-interests/nyx'
import { goldie } from './love-interests/goldie'
import { rhea } from './love-interests/rhea'
import { ezra } from './rivals/ezra'
import { dex } from './rivals/dex'
import { kai } from './rivals/kai'
import { mika } from './supporting/mika'
import { theo } from './supporting/theo'
import { jade } from './supporting/jade'
import { benji } from './supporting/benji'
import type { LoveInterest, Rival, Supporting } from '@/content/types'

export const loveInterests: LoveInterest[] = [nyx, goldie, rhea]
export const supporting: Supporting[] = [mika, theo, jade, benji]
export const rivals: Rival[] = [ezra, dex, kai]
