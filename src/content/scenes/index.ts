import { monday } from './day1-monday'
import { tuesday } from './day2-tuesday'
import { wednesday } from './day3-wednesday'
import { thursday } from './day4-thursday'
import { friday } from './day5-friday'
import { saturday } from './day6-saturday'
import { sunday } from './day7-sunday'
import type { Scene } from '@/content/types'

export const scenes: Scene[] = [...monday, ...tuesday, ...wednesday, ...thursday, ...friday, ...saturday, ...sunday]
