import type { CSSProperties } from 'react'
import { useGame } from '@/app/useGame'
import { Icon } from '@/ui/components/Icon'
import { ON, ON_FG } from '@/ui/theme'
import { IntroStep } from './IntroStep'
import { ProfileStep } from './ProfileStep'

const CONTROL: CSSProperties = { width: 40, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }
const TASK: CSSProperties = { width: 44, height: 44, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }
const PILL: CSSProperties = { padding: '3px 9px', borderRadius: 10, whiteSpace: 'nowrap' }
const STEP_ON = { background: ON, color: ON_FG }
const STEP_OFF = { background: 'oklch(0.27 0.01 270)', color: 'oklch(0.72 0.01 270)' }

export function Desktop() {
  const { state, dispatch } = useGame()
  const isIntro = state.phase === 'intro'
  const isCreate = state.phase === 'create'
  const named = !!state.player.name.trim()
  const err = !!state.createError
  const tipText = isIntro
    ? 'Finish setting up first'
    : err
      ? 'Pick a gamertag first'
      : named
        ? 'Click to log on'
        : 'Set a gamertag, then click here'
  const tipBg = err && isCreate ? 'oklch(0.6 0.18 25)' : isCreate && named ? ON : 'oklch(0.3 0.01 270)'
  const tipFg = err && isCreate ? 'white' : isCreate && named ? ON_FG : 'oklch(0.9 0 0)'
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        minWidth: 1100,
        minHeight: 720,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Figtree',
        color: 'oklch(0.93 0.005 270)',
        background:
          'radial-gradient(ellipse 120% 85% at 50% 0%, oklch(0.36 0.09 320), oklch(0.21 0.05 285) 55%, oklch(0.13 0.02 270))',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '0 0 56px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <div
          style={{
            width: 'min(1060px,100%)',
            borderRadius: 10,
            overflow: 'hidden',
            background: 'oklch(0.245 0.01 270)',
            boxShadow: '0 30px 90px oklch(0 0 0 / 0.55),0 0 0 1px oklch(0.32 0.01 270)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              height: 38,
              flex: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '0 6px 0 14px',
              background: 'oklch(0.17 0.01 270)',
              font: '600 13px Figtree',
              color: 'oklch(0.8 0.01 270)',
            }}
          >
            <Icon name="user-circle" style={{ fontSize: 16, color: 'oklch(0.75 0.13 350)' }} />
            New player
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginLeft: 14, font: '600 12px Figtree' }}>
              <span style={{ ...PILL, ...(isIntro ? STEP_ON : STEP_OFF) }}>1 · Meet the lobby</span>
              <Icon name="chevron-right" style={{ fontSize: 12, color: 'oklch(0.5 0.01 270)' }} />
              <span style={{ ...PILL, ...(isCreate ? STEP_ON : STEP_OFF) }}>2 · Your profile</span>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex' }}>
              <span style={CONTROL}>
                <Icon name="minus" />
              </span>
              <span style={CONTROL}>
                <Icon name="square" />
              </span>
              <span style={CONTROL}>
                <Icon name="x" />
              </span>
            </div>
          </div>
          {isIntro && <IntroStep />}
          {isCreate && <ProfileStep />}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 56,
          background: 'oklch(0.15 0.01 270 / 0.85)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid oklch(0.3 0.01 270 / 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        <div style={{ ...TASK, color: 'oklch(0.8 0.1 230)' }}>
          <Icon name="layout-grid" style={{ fontSize: 22 }} />
        </div>
        <div style={{ ...TASK, color: 'oklch(0.8 0.01 270)' }}>
          <Icon name="search" style={{ fontSize: 20 }} />
        </div>
        <div style={{ ...TASK, color: 'oklch(0.82 0.13 80)' }}>
          <Icon name="folder-filled" style={{ fontSize: 22 }} />
        </div>
        <div style={{ ...TASK, background: 'oklch(0.3 0.01 270 / 0.7)', color: 'oklch(0.85 0.01 270)', position: 'relative' }}>
          <Icon name="user-circle" style={{ fontSize: 22 }} />
          <span
            style={{
              position: 'absolute',
              bottom: 2,
              width: 16,
              height: 3,
              borderRadius: 2,
              background: 'oklch(0.75 0.13 350)',
            }}
          />
        </div>
        <div
          className="hv-prism"
          onClick={() => dispatch({ type: 'launch' })}
          title="Prism"
          style={{ ...TASK, position: 'relative', cursor: 'pointer' }}
        >
          {isCreate && named && (
            <span
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 10,
                border: '2px solid ' + ON,
                animation: 'mlpulse 1.4s ease-out infinite',
              }}
            />
          )}
          <span
            style={{
              position: 'relative',
              width: 28,
              height: 28,
              borderRadius: '50%',
              background:
                'conic-gradient(oklch(0.68 0.16 350) 0 120deg, oklch(0.8 0.1 230) 0 240deg, oklch(0.82 0.13 80) 0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: 'oklch(0.95 0 0)',
                boxShadow: '0 0 0 2px oklch(0.15 0.01 270)',
              }}
            />
          </span>
          <div
            style={{
              position: 'absolute',
              bottom: 56,
              left: '50%',
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap',
              padding: '8px 12px',
              borderRadius: 8,
              background: tipBg,
              color: tipFg,
              font: '700 13px Figtree',
              boxShadow: '0 8px 24px oklch(0 0 0 / 0.4)',
              pointerEvents: 'none',
            }}
          >
            {tipText}
            <span
              style={{
                position: 'absolute',
                left: '50%',
                bottom: -5,
                width: 10,
                height: 10,
                transform: 'translateX(-50%) rotate(45deg)',
                background: tipBg,
              }}
            />
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            right: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            color: 'oklch(0.85 0.01 270)',
            font: '500 12px Figtree',
          }}
        >
          <Icon name="wifi" style={{ fontSize: 16 }} />
          <Icon name="volume" style={{ fontSize: 16 }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.3 }}>
            <span>8:58 PM</span>
            <span>Mon</span>
          </div>
        </div>
      </div>
    </div>
  )
}
