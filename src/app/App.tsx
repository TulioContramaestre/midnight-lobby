import { Browser } from '@/ui/browser/Browser'
import { Desktop } from '@/ui/desktop/Desktop'
import { useGame } from './useGame'

export default function App() {
  const { state } = useGame()
  return (
    <>
      <h2 className="sr-only">
        A week-long browser dating simulator with hidden affection, custom games and shows to share, a confrontation before
        the ending, and a day-by-day social feed.
      </h2>
      {state.phase === 'intro' || state.phase === 'create' ? <Desktop /> : <Browser />}
    </>
  )
}
