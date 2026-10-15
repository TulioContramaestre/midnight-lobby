import { useGame } from '@/app/useGame'
import type { Rival, Supporting } from '@/content/types'
import { Avatar } from '@/ui/art/Avatar'
import { PlayerAvatar } from '@/ui/art/PlayerAvatar'
import { Card } from '@/ui/components/Card'

function PersonRow({ c }: { c: Supporting | Rival }) {
  return (
    <div className="post" style={{ alignItems: 'center' }}>
      <Avatar spec={c.avatar} size={44} label={c.name} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: '14px' }}>
          <span style={{ fontWeight: 500 }}>{c.name}</span> <span style={{ color: 'var(--text-secondary)' }}>{c.handle}</span>
        </p>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>{c.role}</p>
      </div>
    </div>
  )
}

export function PeoplePanel() {
  const { state, selectors } = useGame()
  const p = selectors.people(state)
  return (
    <>
      <Card style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
        <PlayerAvatar size={80} />
        <div>
          <p style={{ margin: 0, fontWeight: 500 }}>{p.player.name}</p>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
            {`${p.player.age} · ${p.heightLabel} · ${p.player.ethnicity} · ${p.vibeLabel}`}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
            {(p.matchedName ? 'Matching pfp with ' + p.matchedName : 'No matching pfp') +
              (p.sleptNames.length ? ' · Sleep calls: ' + p.sleptNames.join(', ') : '')}
          </p>
        </div>
      </Card>
      <Card style={{ marginBottom: '12px' }}>
        <p style={{ margin: '0 0 4px', fontWeight: 500 }}>Friends and influencers</p>
        <p style={{ margin: '0 0 6px', fontSize: '13px', color: 'var(--text-muted)' }}>
          Keep them on your side and they&apos;ll vouch for you. Cross them and they&apos;ll warn her about you. They also see
          everything.
        </p>
        {p.friends.map((c) => (
          <PersonRow key={c.id} c={c} />
        ))}
      </Card>
      <Card>
        <p style={{ margin: '0 0 4px', fontWeight: 500 }}>Competition</p>
        <p style={{ margin: '0 0 6px', fontSize: '13px', color: 'var(--text-muted)' }}>
          Let them get comfortable and they&apos;ll steal her. Spending evenings with his crush keeps him in check.
        </p>
        {p.competition.map((c) => (
          <PersonRow key={c.id} c={c} />
        ))}
      </Card>
    </>
  )
}
