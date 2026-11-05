import type { CSSProperties } from 'react'
import { useGame } from '@/app/useGame'
import { Pic } from '@/ui/art/Pic'
import { BANNER, NAMECOL, ON, person, STATUS, TEXT } from '@/ui/theme'
import type { LobbyModel } from './model'

const HEAD: CSSProperties = { font: '700 12px Figtree', letterSpacing: '0.04em', color: 'oklch(0.68 0.01 270)' }
const EXPLAIN: CSSProperties = {
  font: '400 12px Figtree',
  lineHeight: 1.45,
  color: 'oklch(0.6 0.01 270)',
  padding: '0 8px 4px',
}
const ROW: CSSProperties = { display: 'flex', gap: 10, alignItems: 'center', padding: '6px 8px' }
const AV34: CSSProperties = { width: 34, height: 34, borderRadius: '50%', overflow: 'hidden', flex: 'none' }
const SUB: CSSProperties = { font: '400 12px Figtree', lineHeight: 1.35, color: 'oklch(0.68 0.01 270)' }

export function MemberPanel({ model: m }: { model: LobbyModel }) {
  const { session, state: g, dispatch, selectors } = useGame()
  const content = selectors.content
  return (
    <div
      className="m-members"
      data-open={session.panel === 'members' || undefined}
      style={{ background: 'oklch(0.21 0.01 270)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}
    >
      {m.inServer && (
        <div style={{ padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ ...HEAD, padding: '4px 8px' }}>THE GIRLS — 3</div>
          {content.loveInterests.map((li) => (
            <div
              key={li.id}
              className="hv-item"
              onClick={() => dispatch({ type: 'go', loc: `dm:${li.id}` })}
              style={{ ...ROW, borderRadius: 4, cursor: 'pointer' }}
            >
              <div style={{ position: 'relative', flex: 'none' }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', overflow: 'hidden' }}>
                  <Pic id={li.id} mood={selectors.mood(g, li.id)} />
                </div>
                <span
                  style={{
                    position: 'absolute',
                    right: -2,
                    bottom: -2,
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    border: '3px solid oklch(0.21 0.01 270)',
                    background: STATUS[li.id][0],
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <span style={{ font: '600 15px Figtree', color: NAMECOL[li.id] }}>{li.name}</span>
                <span
                  style={{
                    font: '400 12px Figtree',
                    color: 'oklch(0.68 0.01 270)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {STATUS[li.id][1]}
                </span>
              </div>
            </div>
          ))}
          <div style={{ ...HEAD, padding: '16px 8px 2px' }}>FRIENDS &amp; INFLUENCERS — 4</div>
          <div style={EXPLAIN}>
            Keep them on your side and they'll vouch for you. Cross them and they'll warn her about you.
          </div>
          {content.supporting.map((c) => (
            <div key={c.id} style={ROW}>
              <div style={AV34}>
                <Pic id={c.id} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <span
                  style={{
                    font: '600 15px Figtree',
                    display: 'flex',
                    gap: 6,
                    alignItems: 'center',
                    color: NAMECOL[c.id] ?? TEXT,
                  }}
                >
                  {c.name}
                  {c.id === 'benji' && (
                    <span
                      style={{
                        font: '800 10px Figtree',
                        background: 'oklch(0.55 0.12 160)',
                        color: 'white',
                        padding: '1px 5px',
                        borderRadius: 4,
                      }}
                    >
                      MOD
                    </span>
                  )}
                </span>
                <span style={SUB}>{c.role}</span>
              </div>
            </div>
          ))}
          <div style={{ ...HEAD, padding: '16px 8px 2px' }}>COMPETITION — 3</div>
          <div style={EXPLAIN}>
            Let them get comfortable and they'll steal her. Spending evenings with his crush keeps him in check.
          </div>
          {content.rivals.map((r) => (
            <div key={r.id} style={{ ...ROW, opacity: 0.75 }}>
              <div style={AV34}>
                <Pic id={r.id} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <span style={{ font: '600 15px Figtree' }}>{r.name}</span>
                <span style={SUB}>{r.role}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {m.locId && <DmProfile id={m.locId} />}
    </div>
  )
}

function DmProfile({ id }: { id: string }) {
  const { state: g, selectors } = useGame()
  const content = selectors.content
  const P = person(content, g, id)
  return (
    <>
      <div style={{ height: 110, flex: 'none', background: BANNER[id] ?? 'oklch(0.4 0.03 270)' }} />
      <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 12, marginTop: -44 }}>
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: '50%',
            overflow: 'hidden',
            boxShadow: '0 0 0 6px oklch(0.21 0.01 270)',
            background: id === 'group' ? ON : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Pic id={id} mood={content.loveInterest(id) ? selectors.mood(g, id) : 'neutral'} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ font: '800 20px Figtree', color: P.color }}>{P.name}</span>
          <span style={{ font: '400 14px Figtree', color: 'oklch(0.72 0.01 270)' }}>{P.handle}</span>
        </div>
        <div
          style={{
            padding: 12,
            borderRadius: 8,
            background: 'oklch(0.17 0.01 270)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={HEAD}>{P.side ? 'ROLE' : 'ABOUT ME'}</span>
            <span style={{ font: '400 14px Figtree', lineHeight: 1.45 }}>{P.bio}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={HEAD}>MUTUAL SERVER</span>
            <span style={{ font: '400 14px Figtree' }}>Midnight Lobby</span>
          </div>
        </div>
      </div>
    </>
  )
}
