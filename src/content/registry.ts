import { activities, activityModes, milestones } from './activities'
import { loveInterests, rivals, supporting } from './characters'
import { createRegistry } from './createRegistry'
import { creation } from './creation'
import { feedNotes } from './feedNotes'
import { scenes } from './scenes'
import { scoring } from './scoring'

export const registry = createRegistry({
  loveInterests,
  supporting,
  rivals,
  scenes,
  activityModes,
  activities,
  milestones,
  creation,
  scoring,
  feedNotes,
})
