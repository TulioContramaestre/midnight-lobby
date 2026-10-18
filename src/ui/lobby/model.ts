import type { Loc } from '@/app/session/locations'
import { isPickScene, sceneLoc } from '@/app/session/queries'
import type { Session } from '@/app/session/types'
import type { ContentRegistry } from '@/content/types'
import { person } from '@/ui/theme'

export function lobbyModel(content: ContentRegistry, s: Session) {
  const g = s.game
  const lid = s.loc.slice(3)
  const inServer = s.loc.startsWith('ch:')
  const inDms = !inServer
  const sl = sceneLoc(content, g)
  const pickScene = isPickScene(content, g)
  const atScene = sl === s.loc
  const pending: Loc | null = g.phase === 'scene' && !pickScene && !atScene && sl && sl !== 'pick' ? sl : null
  const evening = g.phase === 'evening'
  const evDone = evening && !!g.evening.result
  const locId = inDms ? lid : null
  return {
    lid,
    inServer,
    inDms,
    sceneLoc: sl,
    pickScene,
    atScene,
    pending,
    evening,
    evDone,
    inGirlDm: inDms && !!content.loveInterest(lid),
    confronting: g.phase === 'confront',
    locId,
    locName: locId ? person(content, g, locId).name : lid,
  }
}

export type LobbyModel = ReturnType<typeof lobbyModel>
