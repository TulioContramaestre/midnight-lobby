import { useGame } from '@/app/useGame'
import { Pic } from '@/ui/art/Pic'
import { Chirp } from '@/ui/chirp/Chirp'
import { Icon, type UiIconName } from '@/ui/components/Icon'
import { Lobby } from '@/ui/lobby/Lobby'
import { lobbyModel } from '@/ui/lobby/model'
import { AskOut } from '@/ui/modals/AskOut'
import { DaySummary } from '@/ui/modals/DaySummary'
import { WeekRecap } from '@/ui/recap/WeekRecap'
import { ON, ON_FG } from '@/ui/theme'

interface Tab {
  title: string
  icon: UiIconName
  iconBg: string
  iconFg: string
  open: () => void
  dot: boolean
  on: boolean
}

export function Browser() {
  const { session, state: g, dispatch, selectors } = useGame()
  const m = lobbyModel(selectors.content, session)
  const isLobby = g.view !== 'feed'
  const isEnding = g.phase === 'ending'
  const goLobby = () => dispatch({ type: 'game', action: { type: 'setView', view: 'story' } })
  const goChirp = () => dispatch({ type: 'game', action: { type: 'setView', view: 'feed' } })
  const tabs: Tab[] = [
    {
      title: isEnding
        ? 'Week recap | Midnight Lobby'
        : (m.pending ? '(1) ' : '') + (m.inServer ? '#' + m.lid : '@' + m.locName) + ' | Midnight Lobby',
      icon: 'moon',
      iconBg: ON,
      iconFg: ON_FG,
      open: goLobby,
      dot: false,
      on: isLobby,
    },
    {
      title: (g.unseen ? '(' + g.unseen + ') ' : '') + 'Home / Chirp',
      icon: 'feather',
      iconBg: 'oklch(0.8 0.1 230)',
      iconFg: 'oklch(0.17 0.03 230)',
      open: goChirp,
      dot: m.evDone && !g.likedToday && isLobby,
      on: !isLobby,
    },
  ]
  const urlHost = isLobby ? 'midnightlobby.gg' : 'chirp.social'
  const urlPath = isLobby
    ? isEnding
      ? '/recap'
      : m.inServer
        ? '/channels/midnight-lobby/' + m.lid
        : '/channels/@me/' + m.lid
    : '/home'
  return (
    <div
      className="m-screen"
      style={{
        width: '100vw',
        height: '100vh',
        minWidth: 1100,
        minHeight: 640,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Figtree',
        color: 'oklch(0.93 0.005 270)',
        background: 'oklch(0.14 0.008 270)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div style={{ height: 40, flex: 'none', display: 'flex', alignItems: 'flex-end', gap: 2, padding: '0 8px 0 12px' }}>
        <div className="m-hide" style={{ display: 'flex', gap: 8, alignItems: 'center', height: 40, padding: '0 10px 0 4px' }}>
          <span style={{ width: 12, height: 12, borderRadius: 6, background: 'oklch(0.65 0.18 25)' }} />
          <span style={{ width: 12, height: 12, borderRadius: 6, background: 'oklch(0.8 0.14 85)' }} />
          <span style={{ width: 12, height: 12, borderRadius: 6, background: 'oklch(0.72 0.15 150)' }} />
        </div>
        {tabs.map((t) => (
          <div
            key={t.icon}
            className="hv-tab m-tab"
            onClick={t.open}
            style={{
              width: 240,
              height: 34,
              borderRadius: '8px 8px 0 0',
              background: t.on ? 'oklch(0.21 0.01 270)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '0 10px 0 12px',
              cursor: 'pointer',
              font: '500 13px Figtree',
              color: t.on ? 'oklch(0.95 0 0)' : 'oklch(0.7 0.01 270)',
            }}
          >
            <span
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                background: t.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 'none',
              }}
            >
              <Icon name={t.icon} style={{ fontSize: 12, color: t.iconFg }} />
            </span>
            <span style={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {t.title}
            </span>
            {t.dot && (
              <span style={{ width: 8, height: 8, borderRadius: 4, background: 'oklch(0.65 0.2 25)', flex: 'none' }} />
            )}
            <Icon name="x" style={{ fontSize: 14, color: 'oklch(0.55 0.01 270)' }} />
          </div>
        ))}
        <div
          className="m-hide"
          style={{
            width: 28,
            height: 28,
            margin: '0 0 3px 4px',
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'oklch(0.6 0.01 270)',
          }}
        >
          <Icon name="plus" style={{ fontSize: 16 }} />
        </div>
      </div>
      <div
        className="m-chrome"
        style={{
          height: 40,
          flex: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '0 10px',
          background: 'oklch(0.21 0.01 270)',
          borderBottom: '1px solid oklch(0.14 0.008 270)',
          color: 'oklch(0.7 0.01 270)',
        }}
      >
        <span className="m-hide" style={{ display: 'contents' }}>
          <Icon name="arrow-left" style={{ fontSize: 18, padding: 4 }} />
          <Icon name="arrow-right" style={{ fontSize: 18, padding: 4, opacity: 0.4 }} />
          <Icon name="reload" style={{ fontSize: 18, padding: 4 }} />
        </span>
        <div
          className="m-urlbar"
          style={{
            flex: 1,
            height: 30,
            borderRadius: 15,
            background: 'oklch(0.15 0.008 270)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '0 14px',
            font: '400 14px Figtree',
          }}
        >
          <Icon name="lock" style={{ fontSize: 14 }} />
          <span style={{ color: 'oklch(0.9 0 0)' }}>{urlHost}</span>
          <span style={{ marginLeft: -8 }}>{urlPath}</span>
        </div>
        <div style={{ width: 28, height: 28, borderRadius: '50%', overflow: 'hidden', marginLeft: 4 }}>
          <Pic id="you" />
        </div>
      </div>

      {isLobby && !isEnding && <Lobby model={m} />}
      {isLobby && isEnding && <WeekRecap />}
      {!isLobby && <Chirp />}
      {session.summary && <DaySummary />}
      {isLobby && m.pickScene && <AskOut />}
    </div>
  )
}
