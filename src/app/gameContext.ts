import { createContext, type Dispatch } from 'react'
import type { Session, SessionAction } from '@/app/session/types'
import type { Selectors } from '@/engine/selectors'
import type { GameState } from '@/engine/types'

export interface GameContextValue {
  session: Session
  state: GameState
  dispatch: Dispatch<SessionAction>
  selectors: Selectors
  pick: (index: number) => void
}

export const GameContext = createContext<GameContextValue | null>(null)
