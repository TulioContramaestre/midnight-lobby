import { useEffect, useEffectEvent } from 'react'
import { canConfPick, canPick } from '@/app/session/queries'
import { useGame } from '@/app/useGame'
import { ChatColumn } from './ChatColumn'
import { MemberPanel } from './MemberPanel'
import type { LobbyModel } from './model'
import { ProfilePopout } from './ProfilePopout'
import { ServerRail } from './ServerRail'
import { Sidebar } from './Sidebar'

export function Lobby({ model }: { model: LobbyModel }) {
  const { session, dispatch, selectors, pick } = useGame()
  const onKey = useEffectEvent((e: KeyboardEvent) => {
    const n = parseInt(e.key, 10)
    if (!(n >= 1 && n <= 3) || session.summary) return
    if (canPick(selectors.content, session, n - 1)) pick(n - 1)
    else if (canConfPick(selectors.content, session, n - 1)) dispatch({ type: 'confPick', index: n - 1 })
  })
  useEffect(() => {
    const handler = (e: KeyboardEvent) => onKey(e)
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
  return (
    <div
      className="m-lobby"
      style={{
        flex: 1,
        minHeight: 0,
        display: 'grid',
        gridTemplateColumns: '72px 240px minmax(0,1fr) 260px',
        background: 'oklch(0.245 0.01 270)',
        position: 'relative',
      }}
    >
      <div className="m-nav" data-open={session.panel === 'nav' || undefined}>
        <ServerRail model={model} />
        <Sidebar model={model} />
      </div>
      <ChatColumn model={model} />
      <MemberPanel model={model} />
      {session.panel && <div className="m-scrim" onClick={() => dispatch({ type: 'setPanel', panel: null })} />}
      {session.profileOpen && <ProfilePopout />}
    </div>
  )
}
