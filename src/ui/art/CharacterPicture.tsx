import { useGame } from '@/app/useGame'
import type { CharacterId, Mood } from '@/content/types'
import { Avatar } from './Avatar'
import { Portrait } from './Portrait'

export function CharacterPicture({ id, mood }: { id: CharacterId; mood: Mood }) {
  const { selectors } = useGame()
  const c = selectors.content.character(id)
  if (!c) return null
  if (c.kind === 'loveInterest') return <Portrait id={id} mood={mood} />
  return <Avatar spec={c.avatar} label={'Portrait of ' + c.name} />
}
