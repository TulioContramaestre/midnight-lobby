import { useGame } from '@/app/useGame'
import { Avatar } from '@/ui/art/Avatar'
import { PlayerAvatar } from '@/ui/art/PlayerAvatar'
import { Portrait } from '@/ui/art/Portrait'
import { Card } from '@/ui/components/Card'
import { Icon } from '@/ui/components/Icon'
import { signColor } from '@/ui/components/signColor'
import { Tag } from '@/ui/components/Tag'

const row = { justifyContent: 'space-between', fontSize: '14px' }

export function EndingScreen() {
  const { state, dispatch, selectors } = useGame()
  const e = selectors.ending(state)
  if (!e) return null
  const good = e.tier === 'good'
  return (
    <>
      <Card style={{ textAlign: 'center' }}>
        <div className="row" style={{ justifyContent: 'center', gap: '12px' }}>
          {good && <PlayerAvatar size={130} />}
          <Portrait id={e.who} mood={e.mood} size={good ? 130 : 160} />
        </div>
        <p style={{ margin: '8px 0 4px' }}>
          <Tag bg={`--bg-${e.label.tone}`} fg={`--text-${e.label.tone}`}>
            {`${e.label.label} · ${e.score.final} hearts`}
          </Tag>
        </p>
        <p style={{ fontSize: '18px', fontWeight: 500, margin: '6px 0' }}>{e.ending.title}</p>
        <p style={{ fontSize: '15px', lineHeight: 1.7, margin: 0, textAlign: 'left' }}>{e.ending.text}</p>
      </Card>
      <Card style={{ marginTop: '12px' }}>
        <p style={{ margin: '0 0 6px', fontWeight: 500 }}>The hidden numbers, revealed</p>
        <div className="post" style={row}>
          <span>{'Hearts with ' + e.name}</span>
          <span style={{ fontWeight: 500 }}>{e.score.base}</span>
        </div>
        {e.score.mods.map((m, i) => (
          <div key={i} className="post" style={row}>
            <span>{m.label}</span>
            <span style={{ fontWeight: 500, color: signColor(m.value) }}>
              {(m.value > 0 ? '+' : '−') + Math.abs(m.value)}
            </span>
          </div>
        ))}
        <div className="post" style={row}>
          <span style={{ fontWeight: 500 }}>Final</span>
          <span style={{ fontWeight: 500 }}>{e.score.final}</span>
        </div>
        <p style={{ margin: '8px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>{e.legend}</p>
      </Card>
      <Card style={{ marginTop: '12px' }}>
        <p style={{ margin: '0 0 6px', fontWeight: 500 }}>Meanwhile</p>
        {e.epilogues.map((x) => (
          <div key={x.id} className="post" style={{ alignItems: 'center' }}>
            <Portrait id={x.id} mood={x.mood} size={44} />
            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6 }}>
              <span style={{ color: signColor(x.value), fontWeight: 500 }}>
                {`${x.name} (${x.value})`}
              </span>
              {' \u00a0' + x.text}
            </p>
          </div>
        ))}
        {e.rivals.map((r) => (
          <div key={r.id} className="post" style={{ alignItems: 'center' }}>
            <Avatar spec={r.avatar} size={44} label={r.name} />
            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6 }}>{r.text}</p>
          </div>
        ))}
      </Card>
      <div className="row" style={{ marginTop: '12px' }}>
        <button onClick={() => dispatch({ type: 'reset', seed: Date.now() })}>
          <Icon name="refresh" /> Play again
        </button>
      </div>
    </>
  )
}
