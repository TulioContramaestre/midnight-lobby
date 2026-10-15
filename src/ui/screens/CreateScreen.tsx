import { useCallback, useState } from 'react'
import { useGame } from '@/app/useGame'
import type { Action } from '@/engine/types'
import { PlayerAvatar } from '@/ui/art/PlayerAvatar'
import { Portrait } from '@/ui/art/Portrait'
import { Card } from '@/ui/components/Card'
import { Icon } from '@/ui/components/Icon'
import { signColor } from '@/ui/components/signColor'
import { Swatch } from '@/ui/components/Swatch'

type TextField = 'vibe' | 'ethnicity' | 'hairStyle'

function RangeField({
  id,
  label,
  min,
  max,
  value,
  format,
  onCommit,
}: {
  id: string
  label: string
  min: number
  max: number
  value: number
  format: (v: number) => string
  onCommit: (v: number) => void
}) {
  const [live, setLive] = useState<number | null>(null)
  const nativeChange = useCallback(
    (el: HTMLInputElement | null) => {
      if (!el) return
      const commit = () => {
        onCommit(+el.value)
        setLive(null)
      }
      el.addEventListener('change', commit)
      return () => el.removeEventListener('change', commit)
    },
    [onCommit],
  )
  const shown = live ?? value
  return (
    <>
      <label className="lbl" htmlFor={id}>
        <span>{label}</span>
        <span id={id + 'v'} style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
          {format(shown)}
        </span>
      </label>
      <input
        ref={nativeChange}
        id={id}
        type="range"
        min={min}
        max={max}
        step="1"
        value={shown}
        onChange={(e) => setLive(+e.target.value)}
        style={{ width: '100%' }}
      />
    </>
  )
}

export function CreateScreen() {
  const { state, dispatch, selectors } = useGame()
  const c = selectors.content.creation
  const p = state.player
  const impressions = selectors.firstImpressions(p)
  const commitAge = useCallback((value: number) => dispatch({ type: 'setPlayerField', field: 'age', value }), [dispatch])
  const commitHeight = useCallback((value: number) => dispatch({ type: 'setPlayerField', field: 'height', value }), [dispatch])
  const set = (field: TextField, value: string) => dispatch({ type: 'setPlayerField', field, value } as Action)
  const select = (field: TextField, options: { value: string; label: string }[]) => (
    <select style={{ width: '100%' }} value={p[field]} onChange={(e) => set(field, e.target.value)}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
  const swatches = (field: 'skin' | 'hair', list: string[]) => (
    <div className="row">
      {list.map((color, i) => (
        <Swatch
          key={color}
          color={color}
          label={`${field} option ${i + 1}`}
          selected={p[field] === color}
          onClick={() => dispatch({ type: 'setPlayerField', field, value: color })}
        />
      ))}
    </div>
  )
  const vibeLabel = c.vibes.find((v) => v.id === p.vibe)?.label

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '16px' }}>
        <Card>
          <p style={{ margin: 0, fontWeight: 500 }}>Your profile</p>
          <label className="lbl" htmlFor="pname">
            <span>Gamertag</span>
          </label>
          <input
            id="pname"
            type="text"
            maxLength={c.nameMaxLength}
            placeholder="nightowl99"
            value={p.name}
            onChange={(e) => dispatch({ type: 'setName', name: e.target.value })}
            style={{ width: '100%' }}
          />
          <p id="err" style={{ fontSize: '13px', color: 'var(--text-danger)', margin: '4px 0 0' }}>
            {state.createError}
          </p>
          <RangeField id="age" label="Age" min={c.ageRange.min} max={c.ageRange.max} value={p.age} format={String} onCommit={commitAge} />
          <RangeField
            id="ht"
            label="Height"
            min={c.heightRange.min}
            max={c.heightRange.max}
            value={p.height}
            format={c.heightLabel}
            onCommit={commitHeight}
          />
          <label className="lbl">
            <span>Vibe</span>
          </label>
          {select(
            'vibe',
            c.vibes.map((v) => ({ value: v.id, label: v.label })),
          )}
          <label className="lbl">
            <span>Ethnicity</span>
          </label>
          {select(
            'ethnicity',
            c.ethnicities.map((e) => ({ value: e, label: e })),
          )}
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Shown on your profile. Doesn&apos;t change anyone&apos;s interest.
          </p>
          <label className="lbl">
            <span>Skin tone</span>
          </label>
          {swatches('skin', c.skins)}
          <label className="lbl">
            <span>Hair color</span>
          </label>
          {swatches('hair', c.hairs)}
          <label className="lbl">
            <span>Hair style</span>
          </label>
          {select(
            'hairStyle',
            c.hairStyles.map((s) => ({ value: s.id, label: s.label })),
          )}
        </Card>
        <Card style={{ textAlign: 'center' }}>
          <PlayerAvatar size={140} />
          <p id="pvname" style={{ margin: '8px 0 0', fontWeight: 500 }}>
            {p.name || 'Your gamertag'}
          </p>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
            {`${p.age} · ${c.heightLabel(p.height)} · ${vibeLabel}`}
          </p>
          <p style={{ margin: '16px 0 8px', fontSize: '14px', fontWeight: 500, textAlign: 'left' }}>First impressions</p>
          <div className="row" style={{ justifyContent: 'space-around' }}>
            {impressions.entries.map((e) => (
              <div key={e.id}>
                <Portrait id={e.id} mood={e.mood} size={56} />
                <div style={{ fontSize: '13px' }}>
                  {e.name + ' '}
                  <Icon
                    name={e.value > 0 ? 'arrow-up' : e.value < 0 ? 'arrow-down' : 'minus'}
                    style={{ color: signColor(e.value) }}
                    label={e.value > 0 ? 'interested' : e.value < 0 ? 'less interested' : 'neutral'}
                  />
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'left', marginTop: '8px' }}>
            {impressions.why.map((w) => (
              <p key={w} style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0', lineHeight: 1.5 }}>
                {w}
              </p>
            ))}
          </div>
        </Card>
      </div>
      <button style={{ marginTop: '12px' }} onClick={() => dispatch({ type: 'begin' })}>
        Start the week <Icon name="arrow-right" />
      </button>
    </>
  )
}
