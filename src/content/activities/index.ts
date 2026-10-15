import type { Activity, ActivityMode } from '@/content/types'
import { games, queueMode } from './games'
import { watch, watchMode } from './watch'

export { milestones } from './milestones'

export const activityModes: ActivityMode[] = [queueMode, watchMode]
export const activities: Activity[] = [...games, ...watch]
