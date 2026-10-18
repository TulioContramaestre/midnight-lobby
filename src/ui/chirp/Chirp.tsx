import type { CSSProperties } from 'react'
import { DN3 } from '@/app/session/locations'
import { useGame } from '@/app/useGame'
import { DAY_NAMES } from '@/engine/constants'
import { Pic } from '@/ui/art/Pic'
import { Icon } from '@/ui/components/Icon'
import { NAMECOL, person } from '@/ui/theme'

const DIV = '1px solid oklch(0.3 0.01 270)'
const CHEVRON: CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 14,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: 'oklch(0.75 0.01 270)',
}
const BAR: CSSProperties = {
  flex: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '14px 20px',
  borderTop: DIV,
  background: 'oklch(0.21 0.01 270)',
}
const SIDE_CARD: CSSProperties = {
  border: DIV,
  borderRadius: 16,
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
}
const AV36: CSSProperties = { width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', flex: 'none' }

export function Chirp() {
  const { state: g, dispatch, selectors } = useGame()
  const content = selectors.content
  const feed = selectors.feed(g)
  const me = g.player.name.trim() || 'nightowl99'
  const evening = g.phase === 'evening'
  const endNight = () => dispatch({ type: 'endNight' })
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: 'grid',
        gridTemplateColumns: 'minmax(220px,1fr) minmax(0,620px) minmax(260px,1fr)',
        background: 'oklch(0.205 0.01 270)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 20px' }}>
        <div style={{ width: 240, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '0 8px' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                background: 'oklch(0.8 0.1 230)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="feather" style={{ fontSize: 22, color: 'oklch(0.17 0.03 230)' }} />
            </div>
            <span style={{ font: '800 22px Figtree' }}>Chirp</span>
          </div>
          <div
            style={{
              padding: 14,
              borderRadius: 12,
              background: 'oklch(0.27 0.03 350)',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <span
              style={{ font: '700 15px Figtree', display: 'flex', gap: 6, alignItems: 'center', color: 'oklch(0.85 0.1 350)' }}
            >
              <Icon name="heart-filled" />
              {g.likedToday ? 'Like used today' : '1 like left today'}
            </span>
            <span style={{ font: '400 14px Figtree', lineHeight: 1.45, color: 'oklch(0.85 0.02 350)' }}>
              Whoever you like notices. So do the other two.
            </span>
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', gap: 10, alignItems: 'center', padding: 8 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', flex: 'none' }}>
              <Pic id="you" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ font: '700 15px Figtree' }}>{me}</span>
              <span style={{ font: '400 14px Figtree', color: 'oklch(0.62 0.01 270)' }}>{'@' + me}</span>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          borderLeft: DIV,
          borderRight: DIV,
          background: 'oklch(0.23 0.01 270)',
        }}
      >
        <div style={{ padding: '16px 20px 0', display: 'flex', alignItems: 'baseline', flex: 'none' }}>
          <span style={{ font: '700 20px Figtree' }}>Home</span>
          <span style={{ marginLeft: 'auto', font: '500 13px Figtree', color: 'oklch(0.68 0.01 270)' }}>
            {DAY_NAMES[g.day] + ' · Day ' + (g.day + 1) + ' of 7'}
          </span>
        </div>
        <div style={{ display: 'flex', borderBottom: DIV, flex: 'none', marginTop: 6 }}>
          <div style={{ flex: 1, textAlign: 'center', padding: '14px 0', font: '700 15px Figtree', position: 'relative' }}>
            Midnight Lobby circle
            <span
              style={{
                position: 'absolute',
                left: '50%',
                bottom: 0,
                transform: 'translateX(-50%)',
                width: 64,
                height: 4,
                borderRadius: 2,
                background: 'oklch(0.8 0.1 230)',
              }}
            />
          </div>
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '14px 0',
              font: '500 15px Figtree',
              color: 'oklch(0.62 0.01 270)',
            }}
          >
            Following
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '10px 14px', borderBottom: DIV, flex: 'none' }}>
          <span
            className="hv-chirp"
            onClick={() => dispatch({ type: 'game', action: { type: 'stepFeedDay', delta: -1 } })}
            style={CHEVRON}
          >
            <Icon name="chevron-left" />
          </span>
          {DN3.map((d, i) =>
            i === g.feedDay ? (
              <span
                key={d}
                style={{
                  padding: '5px 12px',
                  borderRadius: 14,
                  background: 'oklch(0.8 0.1 230)',
                  color: 'oklch(0.17 0.03 230)',
                  font: '700 13px Figtree',
                }}
              >
                {d}
              </span>
            ) : i <= g.day ? (
              <span
                key={d}
                className="hv-chirp"
                onClick={() => dispatch({ type: 'game', action: { type: 'setFeedDay', day: i } })}
                style={{
                  padding: '5px 12px',
                  borderRadius: 14,
                  border: '1px solid oklch(0.35 0.01 270)',
                  color: 'oklch(0.82 0.01 270)',
                  font: '500 13px Figtree',
                  cursor: 'pointer',
                }}
              >
                {d}
              </span>
            ) : (
              <span
                key={d}
                style={{
                  padding: '5px 12px',
                  borderRadius: 14,
                  border: DIV,
                  color: 'oklch(0.5 0.01 270)',
                  font: '500 13px Figtree',
                  display: 'flex',
                  gap: 4,
                  alignItems: 'center',
                }}
              >
                <Icon name="lock" style={{ fontSize: 12 }} />
                {d}
              </span>
            ),
          )}
          <span
            className="hv-chirp"
            onClick={() => dispatch({ type: 'game', action: { type: 'stepFeedDay', delta: 1 } })}
            style={CHEVRON}
          >
            <Icon name="chevron-right" />
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            borderBottom: DIV,
            flex: 'none',
            font: '500 13px Figtree',
            color: 'oklch(0.68 0.01 270)',
          }}
        >
          <span>{feed.dayName + ' · ' + feed.posts.length + ' posts' + (feed.isToday ? ' · today' : '')}</span>
          {!!feed.note && (
            <span
              style={{
                marginLeft: 'auto',
                padding: '4px 10px',
                borderRadius: 12,
                background: 'oklch(0.29 0.01 270)',
                color: 'oklch(0.9 0.01 270)',
                font: '600 13px Figtree',
              }}
            >
              {feed.note}
            </span>
          )}
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          {feed.posts.map((p) => {
            const like = () => dispatch({ type: 'game', action: { type: 'like', postId: p.id } })
            return (
              <div key={p.id} style={{ display: 'flex', gap: 12, padding: '16px 20px', borderBottom: DIV }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', flex: 'none' }}>
                  <Pic id={p.author} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 0 }}>
                  <div style={{ font: '700 16px Figtree' }}>
                    {p.name + ' '}
                    <span style={{ font: '400 15px Figtree', color: 'oklch(0.62 0.01 270)' }}>
                      {p.handle + ' · ' + DN3[p.day]}
                    </span>
                  </div>
                  <div style={{ font: '400 16px Figtree', lineHeight: 1.45, textWrap: 'pretty' }}>{p.text}</div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      maxWidth: 340,
                      font: '500 14px Figtree',
                      color: 'oklch(0.62 0.01 270)',
                    }}
                  >
                    <span>
                      <Icon name="message-circle" />
                    </span>
                    <span>
                      <Icon name="repeat" />
                    </span>
                    {p.liked ? (
                      <span style={{ color: 'oklch(0.72 0.18 10)', fontWeight: 700 }}>
                        <Icon name="heart-filled" />
                        {' ' + p.likes + ' · liked'}
                      </span>
                    ) : g.likedToday ? (
                      <span onClick={like} style={{ opacity: 0.5, cursor: 'pointer' }}>
                        <Icon name="heart" />
                        {' ' + p.likes}
                      </span>
                    ) : (
                      <span
                        className="hv-like"
                        onClick={like}
                        style={{ cursor: 'pointer', padding: '2px 8px', margin: '-2px -8px', borderRadius: 12 }}
                      >
                        <Icon name="heart" />
                        {' ' + p.likes}
                      </span>
                    )}
                    <span>
                      <Icon name="share-2" />
                    </span>
                  </div>
                  {!!p.reply && (
                    <div
                      style={{
                        display: 'flex',
                        gap: 10,
                        alignItems: 'center',
                        marginTop: 6,
                        padding: '10px 12px',
                        borderRadius: 10,
                        background: 'oklch(0.29 0.01 270)',
                      }}
                    >
                      <div style={{ width: 28, height: 28, borderRadius: '50%', overflow: 'hidden', flex: 'none' }}>
                        <Pic id={p.author} mood="happy" />
                      </div>
                      <div style={{ font: '400 15px Figtree', lineHeight: 1.4 }}>
                        <b style={{ color: person(content, g, p.author).color }}>{p.name}</b>
                        {' replied to you: ' + p.reply}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        {evening && (
          <div style={BAR}>
            <Icon name="moon" style={{ fontSize: 20, color: 'oklch(0.8 0.1 230)' }} />
            <span style={{ font: '500 15px Figtree', flex: 1 }}>
              {g.likedToday ? "Like's spent. Time to log off." : 'Log off whenever you’re ready.'}
            </span>
            <div
              onClick={endNight}
              style={{
                padding: '9px 16px',
                borderRadius: 8,
                background: 'oklch(0.68 0.16 350)',
                color: 'oklch(0.16 0.02 350)',
                font: '700 15px Figtree',
                cursor: 'pointer',
              }}
            >
              Log off
            </div>
          </div>
        )}
        {!evening && g.phase !== 'ending' && (
          <div style={BAR}>
            <span style={{ font: '500 15px Figtree', flex: 1, color: 'oklch(0.78 0.01 270)' }}>
              {g.phase === 'confront' ? 'Someone is waiting on you.' : "Tonight's scenes aren't finished yet."}
            </span>
            <div
              onClick={() => dispatch({ type: 'game', action: { type: 'setView', view: 'story' } })}
              style={{
                padding: '9px 16px',
                borderRadius: 8,
                background: 'oklch(0.29 0.01 270)',
                font: '700 15px Figtree',
                cursor: 'pointer',
                display: 'flex',
                gap: 8,
                alignItems: 'center',
              }}
            >
              <Icon name="arrow-left" />
              Midnight Lobby tab
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
        <div
          style={{
            height: 42,
            borderRadius: 21,
            background: 'oklch(0.27 0.01 270)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '0 16px',
            color: 'oklch(0.62 0.01 270)',
            font: '400 15px Figtree',
          }}
        >
          <Icon name="search" />
          Search Chirp
        </div>
        <div style={SIDE_CARD}>
          <span style={{ font: '700 18px Figtree' }}>Who to watch</span>
          {content.loveInterests.map((li) => (
            <div key={li.id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={AV36}>
                <Pic id={li.id} mood={selectors.mood(g, li.id)} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                <span style={{ font: '700 15px Figtree', color: NAMECOL[li.id] }}>{li.name}</span>
                <span style={{ font: '400 13px Figtree', color: 'oklch(0.62 0.01 270)' }}>{li.handle}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={SIDE_CARD}>
          <span style={{ font: '700 18px Figtree' }}>Competition</span>
          {content.rivals.map((r) => (
            <div key={r.id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={AV36}>
                <Pic id={r.id} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                <span style={{ font: '700 15px Figtree' }}>{r.name}</span>
                <span style={{ font: '400 13px Figtree', color: 'oklch(0.62 0.01 270)' }}>{r.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
