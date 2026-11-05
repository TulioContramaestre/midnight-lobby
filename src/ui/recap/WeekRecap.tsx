import type { CSSProperties } from 'react'
import { useGame } from '@/app/useGame'
import { Pic } from '@/ui/art/Pic'
import { Icon } from '@/ui/components/Icon'
import { BANNER, NAMECOL } from '@/ui/theme'

const HEAD: CSSProperties = { font: '700 12px Figtree', letterSpacing: '0.04em', color: 'oklch(0.72 0.01 270)' }
const CARD: CSSProperties = { borderRadius: 12, background: 'oklch(0.21 0.01 270)', padding: 20, display: 'flex', flexDirection: 'column' }
const RING: CSSProperties = {
  width: 128,
  height: 128,
  borderRadius: '50%',
  overflow: 'hidden',
  boxShadow: '0 0 0 7px oklch(0.21 0.01 270)',
}
const TAG: Record<string, [string, string]> = {
  good: ['oklch(0.35 0.08 150)', 'oklch(0.9 0.1 150)'],
  friends: ['oklch(0.36 0.07 80)', 'oklch(0.9 0.1 85)'],
  left: ['oklch(0.33 0.08 25)', 'oklch(0.88 0.1 25)'],
}

const signColor = (v: number) => (v > 0 ? 'oklch(0.8 0.13 150)' : v < 0 ? 'oklch(0.75 0.14 25)' : 'oklch(0.75 0.01 270)')

export function WeekRecap() {
  const { state: g, dispatch, selectors } = useGame()
  const e = selectors.ending(g)
  if (!e) return null
  const h = e.score.final
  const together = e.tier === 'good'
  const others = [
    ...e.epilogues.map((o) => ({ id: o.id, name: o.name, color: NAMECOL[o.id], score: ' (' + o.value + ')', mood: o.mood, t: o.text })),
    ...e.rivals.map((r) => ({ id: r.id, name: r.name, color: 'oklch(0.85 0.01 270)', score: '', mood: 'neutral' as const, t: r.text })),
  ]
  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', background: 'oklch(0.245 0.01 270)' }}>
      <div
        className="m-stack m-recap"
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: '36px 32px 48px',
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1.25fr) minmax(0,1fr)',
          gap: 20,
          alignItems: 'start',
        }}
      >
        <div style={{ borderRadius: 12, overflow: 'hidden', background: 'oklch(0.21 0.01 270)' }}>
          <div style={{ height: 150, background: BANNER[e.who], position: 'relative' }}>
            <div style={{ position: 'absolute', left: 28, bottom: -60, display: 'flex' }}>
              {together && (
                <div style={{ ...RING, position: 'relative', zIndex: 1 }}>
                  <Pic id="you" />
                </div>
              )}
              <div style={{ ...RING, marginLeft: together ? '-28px' : '0px' }}>
                <Pic id={e.who} mood={e.mood} />
              </div>
            </div>
          </div>
          <div style={{ padding: '76px 28px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <span
                style={{
                  font: '700 13px Figtree',
                  padding: '4px 10px',
                  borderRadius: 6,
                  whiteSpace: 'nowrap',
                  flex: 'none',
                  background: TAG[e.tier][0],
                  color: TAG[e.tier][1],
                }}
              >
                {e.label.label + ' · ' + h + (Math.abs(h) === 1 ? ' heart' : ' hearts')}
              </span>
              <span style={{ font: '600 13px Figtree', color: 'oklch(0.65 0.01 270)' }}>{'You asked ' + e.name + ' out'}</span>
            </div>
            <span style={{ font: '800 34px Figtree', letterSpacing: '-0.01em', textWrap: 'balance' }}>{e.ending.title}</span>
            <p
              style={{
                margin: 0,
                font: '400 17px Figtree',
                lineHeight: 1.65,
                color: 'oklch(0.86 0.005 270)',
                textWrap: 'pretty',
              }}
            >
              {e.ending.text}
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <div
                onClick={() => dispatch({ type: 'playAgain', seed: Date.now() })}
                style={{
                  padding: '11px 18px',
                  borderRadius: 8,
                  background: 'oklch(0.68 0.16 350)',
                  color: 'oklch(0.16 0.02 350)',
                  font: '700 15px Figtree',
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <Icon name="refresh" />
                Play again
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ ...CARD, gap: 4 }}>
            <span style={{ ...HEAD, paddingBottom: 8 }}>THE HIDDEN NUMBERS, REVEALED</span>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '9px 0',
                borderBottom: '1px solid oklch(0.28 0.01 270)',
                font: '700 15px Figtree',
              }}
            >
              <span>{'Hearts with ' + e.name}</span>
              <span>{e.score.base}</span>
            </div>
            {e.score.mods.length > 0 && (
              <>
                <span style={{ ...HEAD, padding: '14px 0 2px' }}>MODIFIERS</span>
                {e.score.mods.map((r, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 12,
                      padding: '9px 0',
                      borderBottom: '1px solid oklch(0.28 0.01 270)',
                      font: '400 15px Figtree',
                    }}
                  >
                    <span>{r.label}</span>
                    <span style={{ fontWeight: 700, color: signColor(r.value) }}>
                      {(r.value > 0 ? '+' : '−') + Math.abs(r.value)}
                    </span>
                  </div>
                ))}
              </>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 4px', font: '800 16px Figtree' }}>
              <span>Final</span>
              <span>{h}</span>
            </div>
            <span style={{ font: '400 13px Figtree', color: 'oklch(0.62 0.01 270)' }}>{e.legend}</span>
          </div>
          <div style={{ ...CARD, gap: 14 }}>
            <span style={HEAD}>MEANWHILE</span>
            {others.map((o) => (
              <div key={o.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', flex: 'none' }}>
                  <Pic id={o.id} mood={o.mood} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ font: '700 14px Figtree', color: o.color }}>
                    {o.name}
                    <span style={{ fontWeight: 500, color: 'oklch(0.62 0.01 270)' }}>{o.score}</span>
                  </span>
                  <span style={{ font: '400 14px Figtree', lineHeight: 1.5, color: 'oklch(0.84 0.005 270)' }}>{o.t}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
