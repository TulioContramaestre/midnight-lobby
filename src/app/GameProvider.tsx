import { useMemo, useReducer, type ReactNode } from 'react'
import { registry } from '@/content/registry'
import { createInitialState } from '@/engine/initialState'
import { createReducer } from '@/engine/reducer'
import { createSelectors } from '@/engine/selectors'
import { GameContext } from './gameContext'

const reducer = createReducer(registry)
const selectors = createSelectors(registry)
const init = (seed: number) => createInitialState(registry, seed)

export function GameProvider({ seed, children }: { seed: number; children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, seed, init)
  const value = useMemo(() => ({ state, dispatch, selectors }), [state])
  return <GameContext value={value}>{children}</GameContext>
}
