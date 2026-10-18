import type { CSSProperties } from 'react'
import { useGame } from '@/app/useGame'
import type { Action, EditablePlayer } from '@/engine/types'
import { Pic } from '@/ui/art/Pic'
import { Icon } from '@/ui/components/Icon'
import { meSub, NAMECOL, ON, ONBG, VIBE_ICON, VIBE_SHORT } from '@/ui/theme'

const LABEL: CSSProperties = { font: '700 12px Figtree', letterSpacing: '0.04em', color: 'oklch(0.72 0.01 270)' }
const COL8: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 8 }
const PAIR: CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }
const RANGE_HEAD: CSSProperties = { ...LABEL, display: 'flex', justifyContent: 'space-between' }

const sel = (on: boolean) => ({
  background: on ? ONBG : 'oklch(0.29 0.01 270)',
  color: on ? 'oklch(0.97 0 0)' : 'oklch(0.8 0.01 270)',
  boxShadow: on ? 'inset 0 0 0 2px ' + ON : 'none',
})

export function ProfileStep() {
  const { state, dispatch, selectors } = useGame()
  const c = selectors.content.creation
  const p = state.player
  const set = <K extends keyof EditablePlayer>(field: K, value: EditablePlayer[K]) =>
    dispatch({ type: 'game', action: { type: 'setPlayerField', field, value } as Action })
  const imp = selectors.firstImpressions(p)
  const ring = (on: boolean, off: string) => (on ? '0 0 0 3px oklch(0.245 0.01 270), 0 0 0 5px ' + ON : off)
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 380px' }}>
        <div style={{ padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ font: '800 26px Figtree', letterSpacing: '-0.01em' }}>Who's logging on tonight?</span>
            <span style={{ font: '400 15px Figtree', color: 'oklch(0.72 0.01 270)' }}>
              They'll size you up before you say a word.
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={LABEL}>GAMERTAG</span>
            <input
              value={p.name}
              onChange={(e) => dispatch({ type: 'game', action: { type: 'setName', name: e.target.value.slice(0, 16) } })}
              maxLength={16}
              placeholder="nightowl99"
              style={{
                height: 42,
                borderRadius: 6,
                border: 'none',
                outline: 'none',
                background: 'oklch(0.17 0.01 270)',
                color: 'oklch(0.95 0 0)',
                font: '500 16px Figtree',
                padding: '0 12px',
                boxShadow: state.createError ? 'inset 0 0 0 2px oklch(0.65 0.18 25)' : 'none',
              }}
            />
            {state.createError && (
              <span style={{ font: '500 13px Figtree', color: 'oklch(0.75 0.15 25)' }}>{state.createError}</span>
            )}
          </div>
          <div style={PAIR}>
            <div style={COL8}>
              <div style={RANGE_HEAD}>
                <span>AGE</span>
                <span style={{ color: 'oklch(0.95 0 0)' }}>{p.age}</span>
              </div>
              <input
                type="range"
                min={c.ageRange.min}
                max={c.ageRange.max}
                step={1}
                value={p.age}
                onChange={(e) => set('age', +e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div style={COL8}>
              <div style={RANGE_HEAD}>
                <span>HEIGHT</span>
                <span style={{ color: 'oklch(0.95 0 0)' }}>{c.heightLabel(p.height)}</span>
              </div>
              <input
                type="range"
                min={c.heightRange.min}
                max={c.heightRange.max}
                step={1}
                value={p.height}
                onChange={(e) => set('height', +e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>
          <div style={COL8}>
            <span style={LABEL}>VIBE</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 8 }}>
              {c.vibes.map((v) => (
                <div
                  key={v.id}
                  onClick={() => set('vibe', v.id)}
                  style={{
                    height: 40,
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    font: '600 14px Figtree',
                    cursor: 'pointer',
                    ...sel(p.vibe === v.id),
                  }}
                >
                  <Icon name={VIBE_ICON[v.id]} style={{ fontSize: 16 }} />
                  {VIBE_SHORT[v.id]}
                </div>
              ))}
            </div>
          </div>
          <div style={PAIR}>
            <div style={COL8}>
              <span style={LABEL}>SKIN TONE</span>
              <div style={{ display: 'flex', gap: 8 }}>
                {c.skins.map((k) => (
                  <div
                    key={k}
                    onClick={() => set('skin', k)}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      background: k,
                      cursor: 'pointer',
                      boxShadow: ring(p.skin === k, 'inset 0 0 0 1px oklch(0 0 0 / 0.2)'),
                    }}
                  />
                ))}
              </div>
            </div>
            <div style={COL8}>
              <span style={LABEL}>HAIR COLOR</span>
              <div style={{ display: 'flex', gap: 8 }}>
                {c.hairs.map((k) => (
                  <div
                    key={k}
                    onClick={() => set('hair', k)}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      background: k,
                      cursor: 'pointer',
                      boxShadow: ring(p.hair === k, 'inset 0 0 0 1px oklch(1 0 0 / 0.15)'),
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div style={PAIR}>
            <div style={COL8}>
              <span style={LABEL}>HAIR STYLE</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 6 }}>
                {c.hairStyles.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => set('hairStyle', h.id)}
                    style={{
                      height: 36,
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      font: '600 13px Figtree',
                      cursor: 'pointer',
                      ...sel(p.hairStyle === h.id),
                    }}
                  >
                    {h.label}
                  </div>
                ))}
              </div>
            </div>
            <div style={COL8}>
              <span style={LABEL}>ETHNICITY</span>
              <select
                value={p.ethnicity}
                onChange={(e) => set('ethnicity', e.target.value)}
                style={{
                  height: 36,
                  borderRadius: 6,
                  border: 'none',
                  outline: 'none',
                  background: 'oklch(0.17 0.01 270)',
                  color: 'oklch(0.95 0 0)',
                  font: '500 14px Figtree',
                  padding: '0 10px',
                }}
              >
                {c.ethnicities.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              <span style={{ font: '400 12px Figtree', color: 'oklch(0.65 0.01 270)' }}>
                Shown on your profile. Doesn't change anyone's interest.
              </span>
            </div>
          </div>
        </div>
        <div style={{ background: 'oklch(0.21 0.01 270)', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ borderRadius: 10, overflow: 'hidden', background: 'oklch(0.17 0.01 270)' }}>
            <div style={{ height: 84, background: 'oklch(0.45 0.12 350)' }} />
            <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 10, marginTop: -46 }}>
              <div
                style={{ width: 92, height: 92, borderRadius: '50%', overflow: 'hidden', boxShadow: '0 0 0 6px oklch(0.17 0.01 270)' }}
              >
                <Pic id="you" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ font: '800 20px Figtree' }}>{p.name.trim() || 'Your gamertag'}</span>
                <span style={{ font: '400 14px Figtree', color: 'oklch(0.72 0.01 270)' }}>{meSub(p, c.heightLabel)}</span>
                <span style={{ font: '400 13px Figtree', color: 'oklch(0.62 0.01 270)' }}>{p.ethnicity}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={LABEL}>FIRST IMPRESSIONS</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {imp.entries.map((g) => (
                <div
                  key={g.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    padding: '10px 6px',
                    borderRadius: 8,
                    background: 'oklch(0.245 0.01 270)',
                  }}
                >
                  <div style={{ width: 56, height: 56, borderRadius: '50%', overflow: 'hidden' }}>
                    <Pic id={g.id} mood={g.mood} />
                  </div>
                  <span
                    style={{ font: '600 14px Figtree', color: NAMECOL[g.id], display: 'flex', gap: 4, alignItems: 'center' }}
                  >
                    {g.name}
                    <Icon
                      name={g.value > 0 ? 'arrow-up' : g.value < 0 ? 'arrow-down' : 'minus'}
                      style={{
                        color:
                          g.value > 0 ? 'oklch(0.78 0.15 150)' : g.value < 0 ? 'oklch(0.72 0.16 25)' : 'oklch(0.65 0.01 270)',
                      }}
                    />
                  </span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {imp.why.map((t) => (
                <span key={t} style={{ font: '400 13px Figtree', lineHeight: 1.5, color: 'oklch(0.78 0.01 270)' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          height: 56,
          flex: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '0 20px',
          borderTop: '1px solid oklch(0.2 0.01 270)',
          background: 'oklch(0.21 0.01 270)',
          font: '500 14px Figtree',
          color: 'oklch(0.78 0.01 270)',
        }}
      >
        <span
          className="hv-bright"
          onClick={() => dispatch({ type: 'game', action: { type: 'goToIntro' } })}
          style={{ display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer', color: 'oklch(0.72 0.01 270)' }}
        >
          <Icon name="arrow-left" />
          Back
        </span>
        <span style={{ width: 1, height: 18, background: 'oklch(0.32 0.01 270)' }} />
        <Icon name="device-floppy" style={{ fontSize: 18, color: 'oklch(0.72 0.17 150)' }} />
        Profile saves automatically.
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center', color: 'oklch(0.9 0.01 270)' }}>
          Open Prism from the taskbar to log on
          <Icon name="arrow-down" />
        </span>
      </div>
    </>
  )
}
