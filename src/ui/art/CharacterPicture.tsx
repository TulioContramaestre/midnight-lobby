import { useGame } from '@/app/useGame'
import type { CharacterId, Mood } from '@/content/types'
import { Avatar } from './Avatar'
import { Portrait } from './Portrait'

export function CharacterPicture({ id, mood, size }: { id: CharacterId; mood: Mood; size: number }) {
  const { selectors } = useGame()
  const c = selectors.content.character(id)
  if (!c) return null
  if (c.kind === 'loveInterest') return <Portrait id={id} mood={mood} size={size} />
  return <Avatar spec={c.avatar} size={size} label={'Portrait of ' + c.name} />
}
