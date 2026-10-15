import { useGame } from '@/app/useGame'
import type { Deltas } from '@/content/types'
import type { DeltaChip } from '@/engine/selectors'
import { Icon } from './Icon'
import { Tag } from './Tag'

export function DeltaChipList({ chips }: { chips: DeltaChip[] }) {
  return (
    <div className="row" style={{ marginTop: '10px' }}>
      {chips.map((c) => (
        <Tag key={c.id} bg={c.good ? '--bg-success' : '--bg-danger'} fg={c.good ? '--text-success' : '--text-danger'}>
          {c.label + ' '}
          <Icon name={c.up ? 'arrow-up' : 'arrow-down'} label={c.up ? 'went up' : 'went down'} />
        </Tag>
      ))}
    </div>
  )
}

export function DeltaChips({ deltas }: { deltas: Deltas }) {
  const { selectors } = useGame()
  return <DeltaChipList chips={selectors.deltaChips(deltas)} />
}
