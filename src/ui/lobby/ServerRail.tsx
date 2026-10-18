import type { CSSProperties } from 'react'
import { useGame } from '@/app/useGame'
import { Pic } from '@/ui/art/Pic'
import { Icon } from '@/ui/components/Icon'
import { ON, ON_FG, person } from '@/ui/theme'
import type { LobbyModel } from './model'

const PILL: CSSProperties = {
  position: 'absolute',
  left: -12,
  width: 4,
  height: 40,
  borderRadius: '0 4px 4px 0',
  background: 'oklch(0.93 0 0)',
}

const BADGE: CSSProperties = {
  position: 'absolute',
  right: -3,
  bottom: -3,
  minWidth: 22,
  height: 22,
  padding: '0 6px',
  borderRadius: 11,
  background: 'oklch(0.62 0.21 25)',
  border: '3px solid oklch(0.17 0.01 270)',
  font: '700 11px Figtree',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
}

export function ServerRail({ model: m }: { model: LobbyModel }) {
  const { session, state, dispatch, selectors } = useGame()
  const dmPing = m.pending?.startsWith('dm:') ? m.pending : null
  const pingId = dmPing?.slice(3)
  return (
    <div
      style={{
        background: 'oklch(0.17 0.01 270)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: '12px 0',
      }}
    >
      <div
        onClick={() => dispatch({ type: 'go', loc: session.lastDm })}
        title="Direct Messages"
        style={{
          width: 48,
          height: 48,
          borderRadius: m.inDms ? '16px' : '24px',
          background: m.inDms ? ON : 'oklch(0.27 0.01 270)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          cursor: 'pointer',
          transition: 'border-radius .15s,background .15s',
        }}
      >
        <Icon name="messages" style={{ fontSize: 24, color: m.inDms ? ON_FG : 'oklch(0.85 0.01 270)' }} />
        {m.inDms && <div style={PILL} />}
      </div>
      {dmPing && pingId && (
        <div
          onClick={() => dispatch({ type: 'go', loc: dmPing })}
          title={person(selectors.content, state, pingId).name}
          style={{ position: 'relative', width: 48, height: 48, cursor: 'pointer' }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              overflow: 'hidden',
              background: pingId === 'group' ? ON : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Pic id={pingId} />
          </div>
          <div style={{ ...PILL, top: 20, height: 8 }} />
          <span style={BADGE}>1</span>
        </div>
      )}
      <div style={{ width: 32, height: 2, background: 'oklch(0.3 0.01 270)', borderRadius: 1, margin: '2px 0' }} />
      <div
        onClick={() => dispatch({ type: 'go', loc: session.lastCh })}
        title="Midnight Lobby"
        style={{
          width: 48,
          height: 48,
          borderRadius: m.inServer ? '16px' : '24px',
          background: 'oklch(0.68 0.16 350)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          font: '800 16px Figtree',
          color: 'oklch(0.16 0.02 350)',
          position: 'relative',
          cursor: 'pointer',
          transition: 'border-radius .15s',
        }}
      >
        ML
        {m.inServer && <div style={PILL} />}
        {!!m.pending?.startsWith('ch:') && m.inDms && <span style={BADGE}>1</span>}
      </div>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          background: 'oklch(0.27 0.01 270)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'oklch(0.72 0.17 150)',
        }}
      >
        <Icon name="plus" style={{ fontSize: 22 }} />
      </div>
    </div>
  )
}
