import { useGame } from '@/app/useGame'
import type { CharacterId } from '@/content/types'
import { CharacterPicture } from '@/ui/art/CharacterPicture'

export function PortraitRow({ ids }: { ids: readonly CharacterId[] }) {
  const { state, selectors } = useGame()
  const size = ids.length === 1 ? 150 : ids.length === 2 ? 130 : 110
  return (
    <div className="row" style={{ justifyContent: 'center', gap: '16px', marginBottom: '1rem' }}>
      {selectors.cast(state, ids).map((c) => (
        <div key={c.id} style={{ textAlign: 'center' }}>
          <CharacterPicture id={c.id} mood={c.mood} size={size} />
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {c.name + (c.rival ? ' · rival' : '')}
          </div>
        </div>
      ))}
    </div>
  )
}
