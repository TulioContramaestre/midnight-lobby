import { Header } from '@/ui/layout/Header'
import { FeedPanel } from '@/ui/panels/FeedPanel'
import { PeoplePanel } from '@/ui/panels/PeoplePanel'
import { ConfrontationScreen } from '@/ui/screens/ConfrontationScreen'
import { CreateScreen } from '@/ui/screens/CreateScreen'
import { EndingScreen } from '@/ui/screens/EndingScreen'
import { EveningScreen } from '@/ui/screens/EveningScreen'
import { IntroScreen } from '@/ui/screens/IntroScreen'
import { SceneScreen } from '@/ui/screens/SceneScreen'
import { useGame } from './useGame'

function Screen() {
  const { state } = useGame()
  if (state.phase === 'intro') return <IntroScreen />
  if (state.phase === 'create') return <CreateScreen />
  return (
    <>
      <Header />
      {state.view === 'feed' ? (
        <FeedPanel />
      ) : state.view === 'people' ? (
        <PeoplePanel />
      ) : state.phase === 'ending' ? (
        <EndingScreen />
      ) : state.phase === 'confront' ? (
        <ConfrontationScreen />
      ) : state.phase === 'evening' ? (
        <EveningScreen />
      ) : (
        <SceneScreen />
      )}
    </>
  )
}

export default function App() {
  return (
    <>
      <h2 className="sr-only">
        A week-long browser dating simulator with hidden affection, custom games and shows to share, a confrontation before
        the ending, and a day-by-day social feed.
      </h2>
      <div className="ed" id="app" style={{ padding: '1rem 0' }}>
        <Screen />
      </div>
    </>
  )
}
