import type { CharacterId, Mood } from '@/content/types'
import { Icon } from '@/ui/components/Icon'
import { ON_FG } from '@/ui/theme'
import { CharacterPicture } from './CharacterPicture'
import { PlayerAvatar } from './PlayerAvatar'

const FILL = { display: 'block', width: '100%', height: '100%', lineHeight: 0 } as const

export function Pic({ id, mood = 'neutral' }: { id: CharacterId; mood?: Mood }) {
  if (id === 'group') return <Icon name="users" style={{ fontSize: 18, color: ON_FG }} />
  return <span style={FILL}>{id === 'you' ? <PlayerAvatar /> : <CharacterPicture id={id} mood={mood} />}</span>
}
