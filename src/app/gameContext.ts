import { createContext, type Dispatch } from 'react'
import type { Selectors } from '@/engine/selectors'
import type { Action, GameState } from '@/engine/types'

export interface GameContextValue {
  state: GameState
  dispatch: Dispatch<Action>
  selectors: Selectors
}

export const GameContext = createContext<GameContextValue | null>(null)
