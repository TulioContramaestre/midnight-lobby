import type { CSSProperties, ReactNode } from 'react'
import { currentSceneDef } from '@/app/session/queries'
import { useGame } from '@/app/useGame'
import type { EveningAction } from '@/engine/types'
import { fill } from '@/engine/template'
import { Pic } from '@/ui/art/Pic'
import { Icon, type UiIconName } from '@/ui/components/Icon'
import { NAMECOL, person } from '@/ui/theme'
import type { LobbyModel } from './model'

const LABEL: CSSProperties = {
  font: '700 12px Figtree',
  letterSpacing: '0.04em',
  color: 'oklch(0.68 0.01 270)',
  padding: '0 4px 2px',
}
const BTN_PINK: CSSProperties = {
  padding: '9px 16px',
  borderRadius: 8,
  background: 'oklch(0.68 0.16 350)',
  color: 'oklch(0.16 0.02 350)',
  font: '700 15px Figtree',
  cursor: 'pointer',
}
const BLUE_CARD: CSSProperties = {
  borderRadius: 8,
  background: 'oklch(0.27 0.03 230)',
  boxShadow: 'inset 0 0 0 1px oklch(0.45 0.08 230)',
}

type EvItem =
  | { kind: 'opt'; icon: UiIconName; label: string; sub?: string; pick: () => void }
  | { kind: 'locked'; label: string }
  | { kind: 'hint'; label: string }
  | { kind: 'back'; pick: () => void }

export function ComposerArea({ model: m }: { model: LobbyModel }) {
  const { session, state: g, dispatch, selectors, pick } = useGame()
  const content = selectors.content

  let choices: { n: number; x: string; pick: () => void }[] = []
  let choiceLabel = 'PICK A REPLY'
  const choosingScene = g.phase === 'scene' && m.atScene && !m.pickScene
  if (choosingScene) choices = (selectors.currentScene(g)?.choices ?? []).map((x, i) => ({ n: i + 1, x, pick: () => pick(i) }))
  const confChoosing = m.confronting && !g.confrontation && session.loc === 'dm:' + g.pick
  if (confChoosing) {
    choices = (selectors.confrontation(g)?.choices ?? []).map((x, i) => ({
      n: i + 1,
      x,
      pick: () => dispatch({ type: 'confPick', index: i }),
    }))
    choiceLabel = 'SHE FOUND OUT'
  }

  const showEvActions = m.evening && !m.evDone && m.inGirlDm
  let evItems: EvItem[] = []
  let evLabel = ''
  if (showEvActions) {
    const who = m.lid
    const n = selectors.name(who)
    const v = g.affection[who]
    const evDo = (action: EveningAction) => dispatch({ type: 'evDo', who, action })
    const mode = g.evening.mode && g.evening.selected === who ? content.activityMode(g.evening.mode) : undefined
    if (mode) {
      evLabel = fill(mode.prompt, { n }).toUpperCase()
      evItems = content.activities
        .filter((a) => a.mode === mode.id)
        .map((a) => ({ kind: 'opt', icon: mode.icon, label: a.name, sub: a.desc, pick: () => evDo({ kind: 'activity', id: a.id }) }))
      evItems.push({
        kind: 'back',
        pick: () => dispatch({ type: 'game', action: { type: 'setEveningMode', mode: null } }),
      })
    } else {
      const { pfp, sleep } = content.milestones
      evLabel = "TONIGHT'S HANGOUT · ONE PER NIGHT"
      evItems = content.activityModes.map((md) => ({
        kind: 'opt',
        icon: md.icon,
        label: fill(md.menuLabel, { n }),
        pick: () => dispatch({ type: 'evMode', who, mode: md.id }),
      }))
      if (g.matched !== who) {
        if (v >= pfp.min) {
          evItems.push({
            kind: 'opt',
            icon: pfp.icon,
            label: fill(pfp.label, { n }),
            pick: () => evDo({ kind: 'milestone', id: 'pfp' }),
          })
        } else evItems.push({ kind: 'locked', label: fill(pfp.lockedLabel, { n }) })
      }
      if (v >= sleep.min) {
        evItems.push({
          kind: 'opt',
          icon: sleep.icon,
          label: fill(sleep.label, { n }),
          pick: () => evDo({ kind: 'milestone', id: 'sleep' }),
        })
      } else if (v >= sleep.hintMin) evItems.push({ kind: 'hint', label: sleep.hint })
    }
  }

  const endNight = () => dispatch({ type: 'endNight' })

  return (
    <div className="m-composer" style={{ padding: '0 16px 20px', display: 'flex', flexDirection: 'column', gap: 6, flex: 'none' }}>
      {(choosingScene || confChoosing) && (
        <>
          <div style={LABEL}>
            {choiceLabel}
            <span className="m-hide"> · PRESS 1–3</span>
          </div>
          {choices.map((c) => (
            <div
              key={c.n}
              className="hv-reply"
              onClick={c.pick}
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                padding: '10px 14px',
                borderRadius: 8,
                background: 'oklch(0.29 0.01 270)',
                font: '400 15px Figtree',
                lineHeight: 1.4,
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  flex: 'none',
                  borderRadius: 5,
                  background: 'oklch(0.2 0.01 270)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  font: '700 12px Figtree',
                  color: 'oklch(0.75 0 0)',
                }}
              >
                {c.n}
              </span>
              {c.x}
            </div>
          ))}
        </>
      )}
      {showEvActions && (
        <>
          <div style={{ ...LABEL, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="moon" style={{ fontSize: 14, color: 'oklch(0.8 0.1 230)' }} />
            {evLabel}
          </div>
          {evItems.map((e, i) => (
            <EveningRow key={i} e={e} />
          ))}
        </>
      )}
      {m.confronting && !!g.confrontation && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div
            className="hv-pink"
            onClick={() => dispatch({ type: 'game', action: { type: 'seeEnding' } })}
            style={{ ...BTN_PINK, padding: '10px 18px', display: 'flex', gap: 8, alignItems: 'center' }}
          >
            See how it ends
            <Icon name="arrow-right" />
          </div>
        </div>
      )}
      {m.pending && <PingCard model={m} />}
      {m.evening && !m.evDone && !m.inGirlDm && (
        <div style={{ ...BLUE_CARD, display: 'flex', flexDirection: 'column', gap: 12, padding: 14 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Icon name="moon" style={{ fontSize: 20, color: 'oklch(0.8 0.1 230)' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ font: '700 15px Figtree' }}>Evening. One hangout tonight.</span>
              <span style={{ font: '400 14px Figtree', color: 'oklch(0.8 0.02 230)' }}>
                DM one of them to queue a game or watch something.
              </span>
            </div>
          </div>
          <div className="m-wrap" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {content.loveInterests.map((li) => (
              <div
                key={li.id}
                className="hv-pill"
                onClick={() => dispatch({ type: 'go', loc: `dm:${li.id}` })}
                style={{
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                  padding: '4px 14px 4px 4px',
                  borderRadius: 20,
                  background: 'oklch(0.21 0.01 270)',
                  cursor: 'pointer',
                  font: '600 14px Figtree',
                  color: NAMECOL[li.id],
                }}
              >
                <div style={{ width: 30, height: 30, borderRadius: '50%', overflow: 'hidden' }}>
                  <Pic id={li.id} mood={selectors.mood(g, li.id)} />
                </div>
                {li.name}
              </div>
            ))}
            <span
              onClick={endNight}
              style={{
                marginLeft: 'auto',
                font: '600 13px Figtree',
                color: 'oklch(0.75 0.02 230)',
                cursor: 'pointer',
                textDecoration: 'underline',
                textUnderlineOffset: 3,
              }}
            >
              Log off without a hangout
            </span>
          </div>
        </div>
      )}
      {m.evDone && (
        <div className="m-wrap" style={{ ...BLUE_CARD, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px' }}>
          <Icon name="moon" style={{ fontSize: 20, color: 'oklch(0.8 0.1 230)' }} />
          <span className="m-full" style={{ font: '500 15px Figtree', flex: 1 }}>
            {g.likedToday ? "That's your night." : "That's your night. One last scroll before bed?"}
          </span>
          {!g.likedToday && (
            <div
              onClick={() => dispatch({ type: 'game', action: { type: 'setView', view: 'feed' } })}
              style={{
                padding: '9px 16px',
                borderRadius: 8,
                background: 'oklch(0.8 0.1 230)',
                color: 'oklch(0.17 0.03 230)',
                font: '700 15px Figtree',
                display: 'flex',
                gap: 8,
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <Icon name="feather" />
              Switch to Chirp tab
            </div>
          )}
          <div onClick={endNight} style={BTN_PINK}>
            Log off
          </div>
        </div>
      )}
      <div
        className="m-hide"
        style={{
          height: 44,
          borderRadius: 8,
          background: 'oklch(0.29 0.01 270)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '0 14px',
          color: 'oklch(0.55 0.01 270)',
          font: '400 15px Figtree',
          marginTop: 6,
        }}
      >
        <Icon name="circle-plus" style={{ fontSize: 22 }} />
        {'Message ' + (m.inServer ? '#' + m.lid : '@' + m.locName)}
      </div>
    </div>
  )
}

function EveningRow({ e }: { e: EvItem }): ReactNode {
  switch (e.kind) {
    case 'opt':
      return (
        <div
          className="hv-reply-blue"
          onClick={e.pick}
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            padding: '10px 14px',
            borderRadius: 8,
            background: 'oklch(0.29 0.01 270)',
            cursor: 'pointer',
          }}
        >
          <Icon name={e.icon} style={{ fontSize: 20, color: 'oklch(0.8 0.1 230)', flex: 'none' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <span style={{ font: '500 15px Figtree' }}>{e.label}</span>
            {e.sub !== undefined && (
              <span style={{ font: '400 13px Figtree', color: 'oklch(0.68 0.01 270)' }}>{e.sub}</span>
            )}
          </div>
        </div>
      )
    case 'locked':
      return (
        <div
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px dashed oklch(0.38 0.01 270)',
            color: 'oklch(0.6 0.01 270)',
            font: '500 15px Figtree',
          }}
        >
          <Icon name="lock" style={{ fontSize: 18 }} />
          {e.label}
        </div>
      )
    case 'hint':
      return (
        <div
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            padding: '4px 4px 0',
            font: '400 13px Figtree',
            color: 'oklch(0.62 0.01 270)',
          }}
        >
          <Icon name="lock" style={{ fontSize: 14 }} />
          {e.label}
        </div>
      )
    case 'back':
      return (
        <div
          className="hv-item"
          onClick={e.pick}
          style={{
            alignSelf: 'flex-start',
            display: 'flex',
            gap: 6,
            alignItems: 'center',
            padding: '6px 10px',
            borderRadius: 6,
            font: '600 14px Figtree',
            color: 'oklch(0.75 0.01 270)',
            cursor: 'pointer',
          }}
        >
          <Icon name="arrow-left" />
          Back
        </div>
      )
  }
}

function PingCard({ model: m }: { model: LobbyModel }) {
  const { state: g, dispatch, selectors } = useGame()
  const content = selectors.content
  const cur = selectors.currentScene(g)
  const def = currentSceneDef(content, g)
  if (!m.pending || !cur || !def) return null
  const loc = m.pending
  const pid = loc.slice(3)
  const first = cur.lines.find((l) => l.speaker) ?? { speaker: cur.cast[0], text: cur.title }
  const who = first.speaker!
  const staticText = def.variant.lines.map((l) => (typeof l.text === 'string' ? l.text : '')).join('\n')
  const where =
    loc === 'dm:group'
      ? 'New message in nyx, goldie, rhea'
      : loc.startsWith('dm:')
        ? 'New DM from ' + person(content, g, pid).name
        : (first.text.includes('@') || /tags you|pings you/.test(staticText)
            ? person(content, g, who).name + ' mentioned you in #'
            : 'New message in #') + pid
  return (
    <div
      className="hv-ping"
      onClick={() => dispatch({ type: 'go', loc })}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 14px',
        borderRadius: 8,
        background: 'oklch(0.27 0.03 350)',
        boxShadow: 'inset 0 0 0 1px oklch(0.5 0.12 350)',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          overflow: 'hidden',
          flex: 'none',
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Pic id={who} mood={content.loveInterest(who) ? selectors.mood(g, who) : 'neutral'} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <span style={{ font: '700 13px Figtree', color: 'oklch(0.85 0.08 350)' }}>{where}</span>
        <span style={{ font: '400 15px Figtree', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {first.text}
        </span>
      </div>
      <span
        style={{
          padding: '8px 14px',
          borderRadius: 8,
          background: 'oklch(0.68 0.16 350)',
          color: 'oklch(0.16 0.02 350)',
          font: '700 14px Figtree',
          display: 'flex',
          gap: 6,
          alignItems: 'center',
          flex: 'none',
        }}
      >
        Jump
        <Icon name="arrow-right" />
      </span>
    </div>
  )
}
