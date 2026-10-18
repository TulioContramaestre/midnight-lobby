import type { CSSProperties } from 'react'
import { useGame } from '@/app/useGame'
import { Pic } from '@/ui/art/Pic'
import { BANNER } from '@/ui/theme'

const HEAD: CSSProperties = { font: '700 12px Figtree', letterSpacing: '0.04em', color: 'oklch(0.68 0.01 270)' }
const FIELD: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 2 }

export function ProfilePopout() {
  const { state: g, dispatch, selectors } = useGame()
  const p = g.player
  const c = selectors.content.creation
  const me = p.name.trim() || 'nightowl99'
  const close = () => dispatch({ type: 'toggleProfile' })
  return (
    <>
      <div onClick={close} style={{ position: 'absolute', inset: 0, zIndex: 4 }} />
      <div
        style={{
          position: 'absolute',
          left: 80,
          bottom: 64,
          width: 300,
          borderRadius: 10,
          overflow: 'hidden',
          background: 'oklch(0.17 0.01 270)',
          boxShadow: '0 20px 60px oklch(0 0 0 / 0.55),0 0 0 1px oklch(0.28 0.01 270)',
          zIndex: 5,
        }}
      >
        <div style={{ height: 72, background: g.matched ? BANNER[g.matched] : 'oklch(0.45 0.12 350)' }} />
        <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 12, marginTop: -40 }}>
          <div
            style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', boxShadow: '0 0 0 6px oklch(0.17 0.01 270)' }}
          >
            <Pic id="you" />
          </div>
          <div style={FIELD}>
            <span style={{ font: '800 20px Figtree' }}>{me}</span>
            <span style={{ font: '400 14px Figtree', color: 'oklch(0.72 0.01 270)' }}>{'@' + me}</span>
          </div>
          <div
            style={{
              padding: 12,
              borderRadius: 8,
              background: 'oklch(0.21 0.01 270)',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div style={FIELD}>
              <span style={HEAD}>ABOUT ME</span>
              <span style={{ font: '400 14px Figtree', lineHeight: 1.45 }}>
                {p.age +
                  ' · ' +
                  c.heightLabel(p.height) +
                  ' · ' +
                  p.ethnicity +
                  ' · ' +
                  (c.vibes.find((v) => v.id === p.vibe)?.label ?? '')}
              </span>
            </div>
            <div style={FIELD}>
              <span style={HEAD}>MATCHING PFP</span>
              <span style={{ font: '400 14px Figtree' }}>
                {g.matched ? 'Matching with ' + selectors.name(g.matched) : 'None yet'}
              </span>
            </div>
            <div style={FIELD}>
              <span style={HEAD}>SLEEP CALLS</span>
              <span style={{ font: '400 14px Figtree' }}>
                {g.slept.length ? g.slept.map(selectors.name).join(', ') : 'None yet'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
