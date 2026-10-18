import { useGame } from '@/app/useGame'
import { Avatar } from './Avatar'

export function PlayerAvatar() {
  const { state, selectors } = useGame()
  const { spec, label } = selectors.playerAvatar(state)
  return <Avatar spec={spec} label={label} />
}
