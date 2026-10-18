import { useLayoutEffect, useRef } from 'react'
import { nextSceneDef } from '@/app/session/queries'
import type { LogEntry } from '@/app/session/types'
import { useGame } from '@/app/useGame'
import { Pic } from '@/ui/art/Pic'
import { Icon } from '@/ui/components/Icon'
import { ON, person } from '@/ui/theme'
import { ComposerArea } from './ComposerArea'
import type { LobbyModel } from './model'

const DEFAULT_TOPIC: Record<string, string> = {
  welcome: 'Read the rules. Benji will check.',
  general: 'Anything goes. Mostly.',
  lfg: 'Looking for group',
  clips: 'Post your plays',
}

export function ChatColumn({ model: m }: { model: LobbyModel }) {
  const { session, state: g, selectors } = useGame()
  const content = selectors.content
  const logRef = useRef<HTMLDivElement>(null)
  const log = session.logs[session.loc] ?? []
  const cur = selectors.currentScene(g)
  const showEvActions = m.evening && !m.evDone && m.inGirlDm
  const topic = m.inServer
    ? m.atScene && cur
      ? cur.title
      : DEFAULT_TOPIC[m.lid]
    : m.atScene && cur
      ? cur.title
      : m.confronting && session.loc === 'dm:' + g.pick
        ? 'Sunday night · She found out'
        : showEvActions
          ? 'Evening'
          : ''
  const nxt = g.phase === 'react' ? nextSceneDef(content, g) : null
  const typingName = nxt ? person(content, g, nxt.cast[0]).name : ''
  const locMood = m.locId && content.loveInterest(m.locId) ? selectors.mood(g, m.locId) : 'neutral'
  const locIconBg = m.locId === 'group' ? ON : 'transparent'

  useLayoutEffect(() => {
    const el = logRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
    requestAnimationFrame(() => {
      if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
    })
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div
        style={{
          height: 48,
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          borderBottom: '1px solid oklch(0.2 0.01 270)',
          flex: 'none',
        }}
      >
        {m.inServer && <Icon name="hash" style={{ fontSize: 22, color: 'oklch(0.6 0.01 270)' }} />}
        {m.locId && (
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              overflow: 'hidden',
              background: locIconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Pic id={m.locId} mood={locMood} />
          </div>
        )}
        <span style={{ font: '700 15px Figtree' }}>{m.locName}</span>
        {!!topic && (
          <>
            <span style={{ width: 1, height: 20, background: 'oklch(0.35 0.01 270)' }} />
            <span style={{ font: '400 14px Figtree', color: 'oklch(0.68 0.01 270)' }}>{topic}</span>
          </>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 16, color: 'oklch(0.75 0 0)', fontSize: 20 }}>
          <Icon name="bell" />
          <Icon name="pin" />
          <Icon name="users" />
        </div>
      </div>
      <div
        ref={logRef}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          padding: '16px 16px 8px',
        }}
      >
        <div style={{ marginTop: 'auto' }} />
        {m.inServer && log.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 0 8px' }}>
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                background: 'oklch(0.32 0.01 270)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="hash" style={{ fontSize: 40 }} />
            </div>
            <span style={{ font: '800 30px Figtree' }}>{'Welcome to #' + m.locName + '!'}</span>
            <span style={{ font: '400 15px Figtree', color: 'oklch(0.7 0.01 270)' }}>
              {'This is the start of the #' + m.locName + " channel. Nothing's happening here tonight."}
            </span>
          </div>
        )}
        {m.locId && log.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 0 8px' }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                overflow: 'hidden',
                background: locIconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Pic id={m.locId} mood={locMood} />
            </div>
            <span style={{ font: '800 30px Figtree' }}>{m.locName}</span>
            <span style={{ font: '400 15px Figtree', color: 'oklch(0.7 0.01 270)' }}>
              This is the beginning of your direct message history with <b style={{ color: 'oklch(0.93 0 0)' }}>{m.locName}</b>.
            </span>
          </div>
        )}
        {log.map((e, i) => (
          <Entry key={i} e={e} />
        ))}
        {session.typing && (
          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              paddingLeft: 56,
              font: '500 13px Figtree',
              color: 'oklch(0.7 0.01 270)',
            }}
          >
            <Icon name="dots" style={{ fontSize: 18 }} />
            <b style={{ color: 'oklch(0.9 0 0)' }}>{typingName}</b> is typing…
          </div>
        )}
      </div>
      <ComposerArea model={m} />
    </div>
  )
}

function Entry({ e }: { e: LogEntry }) {
  const { state: g, selectors } = useGame()
  switch (e.kind) {
    case 'join':
      return (
        <div
          style={{
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            paddingLeft: 14,
            color: 'oklch(0.68 0.01 270)',
            fontSize: 15,
          }}
        >
          <Icon name="arrow-right" style={{ color: 'oklch(0.72 0.17 150)', fontSize: 18 }} />
          <span>
            <b style={{ color: 'oklch(0.93 0 0)' }}>{g.player.name.trim() || 'nightowl99'}</b> just slid into the server.
          </span>
          <span style={{ fontSize: 12 }}>{e.time}</span>
        </div>
      )
    case 'sys':
      return (
        <div
          style={{
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            paddingLeft: 12,
            color: 'oklch(0.72 0.01 270)',
            fontSize: 15,
          }}
        >
          <Icon name={e.icon} style={{ color: 'oklch(0.8 0.1 230)', fontSize: 20 }} />
          <span>{e.text}</span>
          <span style={{ fontSize: 12, color: 'oklch(0.6 0.01 270)' }}>{e.time}</span>
        </div>
      )
    case 'narr':
      return (
        <div
          style={{
            marginLeft: 56,
            padding: '10px 14px',
            borderRadius: 8,
            background: 'oklch(0.27 0.01 270)',
            font: 'italic 400 15px Figtree',
            color: 'oklch(0.78 0.01 270)',
            maxWidth: 560,
            lineHeight: 1.45,
            textWrap: 'pretty',
          }}
        >
          {e.text}
        </div>
      )
    case 'divider':
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            color: 'oklch(0.62 0.01 270)',
            font: '700 12px Figtree',
            letterSpacing: '0.04em',
          }}
        >
          <div style={{ flex: 1, height: 1, background: 'oklch(0.32 0.01 270)' }} />
          {e.text}
          <div style={{ flex: 1, height: 1, background: 'oklch(0.32 0.01 270)' }} />
        </div>
      )
    case 'msg': {
      const P = person(selectors.content, g, e.id)
      return (
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', flex: 'none' }}>
            <Pic id={e.id} mood={e.mood} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
              <span style={{ font: '600 16px Figtree', color: P.color }}>{P.name}</span>
              <span style={{ font: '400 12px Figtree', color: 'oklch(0.6 0.01 270)' }}>{e.time}</span>
            </div>
            <div style={{ font: '400 16px Figtree', lineHeight: 1.45, textWrap: 'pretty' }}>{e.text}</div>
          </div>
        </div>
      )
    }
  }
}
