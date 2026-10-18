import { useMemo, useReducer, type ReactNode } from 'react'
import { canPick } from '@/app/session/queries'
import { createSession, createSessionReducer } from '@/app/session/reducer'
import { registry } from '@/content/registry'
import { createInitialState } from '@/engine/initialState'
import { createReducer } from '@/engine/reducer'
import { createSelectors } from '@/engine/selectors'
import { GameContext } from './gameContext'

const selectors = createSelectors(registry)
const reducer = createSessionReducer(registry, createReducer(registry), selectors)
const init = (seed: number) => createSession(createInitialState(registry, seed))

export function GameProvider({ seed, children }: { seed: number; children: ReactNode }) {
  const [session, dispatch] = useReducer(reducer, seed, init)
  const value = useMemo(() => {
    const pick = (index: number) => {
      if (!canPick(registry, session, index)) return
      dispatch({ type: 'pick', index })
      window.setTimeout(() => dispatch({ type: 'showTyping' }), 700)
      window.setTimeout(() => dispatch({ type: 'advance' }), 2000)
    }
    return { session, state: session.game, dispatch, selectors, pick }
  }, [session])
  return <GameContext value={value}>{children}</GameContext>
}
