import type { CSSProperties } from 'react'
import { CHANNELS, type Loc } from '@/app/session/locations'
import { useGame } from '@/app/useGame'
import { DAY_NAMES } from '@/engine/constants'
import { Pic } from '@/ui/art/Pic'
import { Icon } from '@/ui/components/Icon'
import { meSub, ON, person, STATUS } from '@/ui/theme'
import type { LobbyModel } from './model'

const LABEL: CSSProperties = { font: '700 12px Figtree', letterSpacing: '0.04em' }
const UNREAD: CSSProperties = {
  minWidth: 18,
  height: 18,
  padding: '0 5px',
  borderRadius: 9,
  background: 'oklch(0.62 0.21 25)',
  font: '700 11px Figtree',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}
const VOICE: CSSProperties = { display: 'flex', gap: 6, alignItems: 'center', padding: '6px 8px' }
const VOICE_USER: CSSProperties = {
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  padding: '4px 8px 4px 32px',
  color: 'oklch(0.85 0 0)',
  fontSize: 14,
}

export function Sidebar({ model: m }: { model: LobbyModel }) {
  const { session, state: g, dispatch, selectors } = useGame()
  const content = selectors.content
  const go = (loc: Loc) => dispatch({ type: 'go', loc })
  const sceneIdx = g.phase === 'evening' ? 3 : g.slot
  const progressLabel =
    g.phase === 'evening' ? 'Evening' : g.phase === 'confront' || g.phase === 'ending' ? 'The end' : 'Scene ' + (g.slot + 1) + '/3'
  return (
    <div style={{ background: 'oklch(0.21 0.01 270)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {m.inServer && (
        <>
          <div
            style={{
              height: 48,
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid oklch(0.17 0.01 270)',
              font: '700 15px Figtree',
              flex: 'none',
            }}
          >
            Midnight Lobby
            <Icon name="chevron-down" />
          </div>
          <div
            style={{
              padding: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              font: '500 15px Figtree',
              color: 'oklch(0.68 0.01 270)',
              overflowY: 'auto',
            }}
          >
            <div style={{ ...LABEL, padding: '8px 8px 4px' }}>TEXT CHANNELS</div>
            {CHANNELS.map((name) => {
              const id: Loc = `ch:${name}`
              const on = session.loc === id
              const unread = m.pending === id
              return (
                <div
                  key={name}
                  className="hv-channel"
                  onClick={() => go(id)}
                  style={{
                    display: 'flex',
                    gap: 6,
                    alignItems: 'center',
                    padding: '6px 8px',
                    borderRadius: 4,
                    background: on ? 'oklch(0.3 0.01 270)' : 'transparent',
                    color: on || unread ? 'oklch(0.96 0 0)' : 'oklch(0.68 0.01 270)',
                    fontWeight: on || unread ? 600 : 500,
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  {unread && (
                    <span
                      style={{
                        position: 'absolute',
                        left: -8,
                        width: 4,
                        height: 8,
                        borderRadius: '0 4px 4px 0',
                        background: 'oklch(0.93 0 0)',
                      }}
                    />
                  )}
                  <Icon name="hash" style={{ fontSize: 18 }} />
                  {name}
                  {unread && <span style={{ ...UNREAD, marginLeft: 'auto' }}>1</span>}
                </div>
              )
            })}
            <div style={{ ...LABEL, padding: '16px 8px 4px' }}>VOICE CHANNELS</div>
            <div style={VOICE}>
              <Icon name="volume" style={{ fontSize: 18 }} />
              ranked-grind
            </div>
            <div style={VOICE_USER}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  boxShadow: '0 0 0 2px oklch(0.72 0.17 150)',
                }}
              >
                <Pic id="nyx" mood={selectors.mood(g, 'nyx')} />
              </div>
              Nyx
              <span
                style={{
                  marginLeft: 'auto',
                  font: '800 10px Figtree',
                  background: 'oklch(0.62 0.21 25)',
                  color: 'white',
                  padding: '2px 5px',
                  borderRadius: 4,
                }}
              >
                LIVE
              </span>
            </div>
            <div style={VOICE_USER}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', overflow: 'hidden' }}>
                <Pic id="mika" />
              </div>
              Mika
            </div>
            <div style={VOICE}>
              <Icon name="volume" style={{ fontSize: 18 }} />
              movie-night
            </div>
          </div>
        </>
      )}
      {m.inDms && (
        <>
          <div
            style={{
              height: 48,
              padding: '0 10px',
              display: 'flex',
              alignItems: 'center',
              borderBottom: '1px solid oklch(0.17 0.01 270)',
              flex: 'none',
            }}
          >
            <div
              style={{
                flex: 1,
                height: 28,
                borderRadius: 4,
                background: 'oklch(0.16 0.01 270)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 8px',
                font: '400 13px Figtree',
                color: 'oklch(0.6 0.01 270)',
              }}
            >
              Find or start a conversation
            </div>
          </div>
          <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
            <div
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                padding: '8px 10px',
                borderRadius: 4,
                font: '500 15px Figtree',
                color: 'oklch(0.68 0.01 270)',
              }}
            >
              <Icon name="users" style={{ fontSize: 20 }} />
              Friends
            </div>
            <div
              style={{
                ...LABEL,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: 'oklch(0.68 0.01 270)',
                padding: '14px 8px 4px',
              }}
            >
              DIRECT MESSAGES
              <Icon name="plus" style={{ fontSize: 14 }} />
            </div>
            {dmList(session.logs, m, session.loc, content.loveInterests.map((li) => li.id))
              .sort((a, b) => (session.active[b] ?? 0) - (session.active[a] ?? 0))
              .map((id) => {
                const pid = id.slice(3)
                const P = person(content, g, pid)
                const on = session.loc === id
                const unread = m.pending === id
                const girl = !!content.loveInterest(pid)
                const stt = STATUS[pid]
                return (
                  <div
                    key={id}
                    className="hv-item"
                    onClick={() => go(id)}
                    style={{
                      display: 'flex',
                      gap: 10,
                      alignItems: 'center',
                      padding: '6px 8px',
                      borderRadius: 4,
                      background: on ? 'oklch(0.3 0.01 270)' : 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ position: 'relative', flex: 'none' }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          overflow: 'hidden',
                          background: pid === 'group' ? ON : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Pic id={pid} mood={girl ? selectors.mood(g, pid) : 'neutral'} />
                      </div>
                      {pid !== 'group' && (
                        <span
                          style={{
                            position: 'absolute',
                            right: -2,
                            bottom: -2,
                            width: 12,
                            height: 12,
                            borderRadius: 6,
                            border: '3px solid oklch(0.21 0.01 270)',
                            background: stt ? stt[0] : 'oklch(0.72 0.17 150)',
                          }}
                        />
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                      <span
                        style={{
                          font: (on || unread ? 700 : 500) + ' 15px Figtree',
                          color: on || unread ? 'oklch(0.96 0 0)' : 'oklch(0.75 0.01 270)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {P.name}
                      </span>
                      <span
                        style={{
                          font: '400 12px Figtree',
                          color: 'oklch(0.62 0.01 270)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {stt ? stt[1] : pid === 'group' ? '4 members' : P.bio}
                      </span>
                    </div>
                    {m.evening && !m.evDone && girl && (
                      <Icon name="moon" style={{ fontSize: 16, color: 'oklch(0.8 0.1 230)' }} />
                    )}
                    {unread && <span style={UNREAD}>1</span>}
                  </div>
                )
              })}
          </div>
        </>
      )}
      <div
        style={{
          marginTop: 'auto',
          padding: '10px 12px',
          flex: 'none',
          borderTop: '1px solid oklch(0.17 0.01 270)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            font: '600 12px Figtree',
            color: 'oklch(0.75 0.01 270)',
          }}
        >
          <span>{'Day ' + (g.day + 1) + ' · ' + DAY_NAMES[g.day]}</span>
          <span>{progressLabel}</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{ flex: 1, height: 4, borderRadius: 2, background: i <= sceneIdx ? ON : 'oklch(0.34 0.01 270)' }}
            />
          ))}
        </div>
      </div>
      <div
        className="hv-userbar"
        onClick={() => dispatch({ type: 'toggleProfile' })}
        style={{
          height: 56,
          flex: 'none',
          background: 'oklch(0.19 0.01 270)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 10px',
          cursor: 'pointer',
        }}
      >
        <div style={{ width: 34, height: 34, borderRadius: '50%', overflow: 'hidden', flex: 'none' }}>
          <Pic id="you" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
          <span style={{ font: '600 14px Figtree' }}>{g.player.name.trim() || 'nightowl99'}</span>
          <span style={{ font: '400 12px Figtree', color: 'oklch(0.68 0.01 270)' }}>
            {meSub(g.player, content.creation.heightLabel)}
          </span>
        </div>
        <Icon name="microphone" style={{ fontSize: 18, color: 'oklch(0.75 0 0)' }} />
        <Icon name="headphones" style={{ fontSize: 18, color: 'oklch(0.75 0 0)' }} />
      </div>
    </div>
  )
}

function dmList(logs: Partial<Record<Loc, unknown>>, m: LobbyModel, loc: Loc, girls: string[]): Loc[] {
  const ids = new Set(Object.keys(logs).filter((k): k is Loc => k.startsWith('dm:')))
  if (m.pending?.startsWith('dm:')) ids.add(m.pending)
  if (m.evening) for (const g of girls) ids.add(`dm:${g}`)
  if (m.inDms) ids.add(loc)
  return [...ids]
}
