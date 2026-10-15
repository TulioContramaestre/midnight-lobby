import { useGame } from '@/app/useGame'
import { Portrait } from '@/ui/art/Portrait'
import { Card } from '@/ui/components/Card'
import { Icon } from '@/ui/components/Icon'

export function IntroScreen() {
  const { dispatch, selectors } = useGame()
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '12px', marginBottom: '1rem' }}>
        {selectors.content.loveInterests.map((x) => (
          <Card key={x.id} style={{ textAlign: 'center' }}>
            <Portrait id={x.id} mood="neutral" size={110} />
            <p style={{ margin: '8px 0 0', fontWeight: 500 }}>{x.name}</p>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
              {`${x.type} · ${x.age} · ${x.handle}`}
            </p>
            <p style={{ fontSize: '14px', margin: '8px 0 0', lineHeight: 1.5 }}>{x.bio}</p>
          </Card>
        ))}
      </div>
      <Card style={{ fontSize: '14px', lineHeight: 1.7, marginBottom: '1rem' }}>
        <p style={{ margin: '0 0 6px', fontWeight: 500 }}>How the week works</p>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
          Seven days, three scenes a day. You never see exact numbers, only whether a choice landed or backfired. Each night you DM
          one girl to queue a game or watch something, and each girl has favorites. Getting closer unlocks matching profile
          pictures and, eventually, sleep calls. Be careful: best friends talk, and whoever you choose on Sunday will hear about
          anything you did with the others. You get one Chirp like per day.
        </p>
      </Card>
      <button onClick={() => dispatch({ type: 'goToCreate' })}>
        Create your character <Icon name="arrow-right" />
      </button>
    </>
  )
}
