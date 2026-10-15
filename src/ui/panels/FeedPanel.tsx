import { useGame } from '@/app/useGame'
import { CharacterPicture } from '@/ui/art/CharacterPicture'
import { Card } from '@/ui/components/Card'
import { Icon } from '@/ui/components/Icon'
import { Tag } from '@/ui/components/Tag'

export function FeedPanel() {
  const { state, dispatch, selectors } = useGame()
  const f = selectors.feed(state)
  return (
    <>
      <Card style={{ padding: '0.75rem 1.25rem' }}>
        <div className="row" style={{ justifyContent: 'space-between', paddingBottom: '10px' }}>
          <div>
            <span style={{ fontWeight: 500 }}>Chirp</span>{' '}
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>· Midnight Lobby circle</span>
          </div>
          <Tag bg={f.likedToday ? '--surface-1' : '--bg-accent'} fg={f.likedToday ? '--text-secondary' : '--text-accent'}>
            {f.likedToday ? 'Like used today' : '1 like left today'}
          </Tag>
        </div>
        <div className="row tabs" style={{ paddingBottom: '10px' }}>
          <button aria-label="Previous day" onClick={() => dispatch({ type: 'stepFeedDay', delta: -1 })} style={{ padding: '0 8px' }}>
            <Icon name="chevron-left" />
          </button>
          {f.days.map((d) => (
            <button
              key={d.day}
              className={d.selected ? 'on' : ''}
              onClick={() => dispatch({ type: 'setFeedDay', day: d.day })}
              style={{ padding: '0 10px', fontSize: '13px' }}
            >
              {d.label}
            </button>
          ))}
          <button aria-label="Next day" onClick={() => dispatch({ type: 'stepFeedDay', delta: 1 })} style={{ padding: '0 8px' }}>
            <Icon name="chevron-right" />
          </button>
        </div>
        <p style={{ margin: '0 0 4px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          {`${f.dayName} · ${f.posts.length} posts${f.isToday ? ' · today' : ''}`}
        </p>
        {f.note && <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 8px' }}>{f.note}</p>}
        {f.posts.map((p) => (
          <div key={p.id} className="post">
            <div style={{ flex: 'none' }}>
              <CharacterPicture id={p.author} mood="neutral" size={44} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '14px' }}>
                <span style={{ fontWeight: 500 }}>{p.name}</span> <span style={{ color: 'var(--text-secondary)' }}>{p.handle}</span>
              </div>
              <p style={{ margin: '4px 0 6px', fontSize: '15px', lineHeight: 1.5 }}>{p.text}</p>
              <button
                onClick={() => dispatch({ type: 'like', postId: p.id })}
                aria-label="Like post"
                style={{
                  fontSize: '13px',
                  padding: '2px 10px',
                  height: 'auto',
                  ...(p.liked ? { color: 'var(--text-danger)', borderColor: 'var(--border-danger)' } : {}),
                }}
              >
                <Icon name="heart" style={{ verticalAlign: '-2px' }} />
                {` ${p.likes}${p.liked ? ' · liked' : ''}`}
              </button>
              {p.reply && (
                <p
                  style={{
                    margin: '8px 0 0',
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    paddingLeft: '10px',
                    borderLeft: '2px solid var(--border-strong)',
                    borderRadius: 0,
                  }}
                >
                  <span style={{ fontWeight: 500 }}>{p.name}</span>
                  {' replied: ' + p.reply}
                </p>
              )}
            </div>
          </div>
        ))}
      </Card>
      <button style={{ marginTop: '12px' }} onClick={() => dispatch({ type: 'setView', view: 'story' })}>
        <Icon name="arrow-left" /> Back
      </button>
    </>
  )
}
