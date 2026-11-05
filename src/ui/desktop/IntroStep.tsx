import { useGame } from '@/app/useGame'
import { Pic } from '@/ui/art/Pic'
import { Icon } from '@/ui/components/Icon'
import { BANNER, person } from '@/ui/theme'

export function IntroStep() {
  const { state, dispatch, selectors } = useGame()
  const content = selectors.content
  return (
    <>
      <div className="m-pad" style={{ padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ font: '800 26px Figtree', letterSpacing: '-0.01em' }}>Welcome to Midnight Lobby</span>
          <span style={{ font: '400 15px Figtree', color: 'oklch(0.72 0.01 270)' }}>
            Three girls run this server. You have one week.
          </span>
        </div>
        <div className="m-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 14 }}>
          {content.loveInterests.map((li) => {
            const P = person(content, state, li.id)
            return (
              <div key={li.id} style={{ borderRadius: 10, overflow: 'hidden', background: 'oklch(0.21 0.01 270)' }}>
                <div style={{ height: 64, background: BANNER[li.id] }} />
                <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8, marginTop: -44 }}>
                  <div
                    style={{ width: 88, height: 88, borderRadius: '50%', overflow: 'hidden', boxShadow: '0 0 0 5px oklch(0.21 0.01 270)' }}
                  >
                    <Pic id={li.id} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ font: '800 18px Figtree', color: P.color }}>{P.name}</span>
                    <span style={{ font: '500 13px Figtree', color: 'oklch(0.68 0.01 270)' }}>{P.meta + ' · ' + P.handle}</span>
                  </div>
                  <span
                    style={{ font: '400 14px Figtree', lineHeight: 1.5, color: 'oklch(0.86 0.005 270)', textWrap: 'pretty' }}
                  >
                    {P.bio}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
        <div
          style={{
            borderRadius: 10,
            background: 'oklch(0.21 0.01 270)',
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <span style={{ font: '700 12px Figtree', letterSpacing: '0.04em', color: 'oklch(0.72 0.01 270)' }}>
            HOW THE WEEK WORKS
          </span>
          <span style={{ font: '400 15px Figtree', lineHeight: 1.6, color: 'oklch(0.86 0.005 270)', textWrap: 'pretty' }}>
            {
              'Seven days, three scenes a day. You never see exact numbers, only how they react. Each night you DM one girl to queue a game or watch something, and each girl has favorites. Getting closer unlocks matching profile pictures and, eventually, sleep calls. Be careful: best friends talk, and whoever you choose on Sunday will hear about anything you did with the others. You get one Chirp like per day.'
            }
          </span>
        </div>
      </div>
      <div
        style={{
          height: 56,
          flex: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 20px',
          borderTop: '1px solid oklch(0.2 0.01 270)',
          background: 'oklch(0.21 0.01 270)',
          font: '500 14px Figtree',
          color: 'oklch(0.72 0.01 270)',
        }}
      >
        Step 1 of 2
        <div
          className="hv-pink"
          onClick={() => dispatch({ type: 'game', action: { type: 'goToCreate' } })}
          style={{
            marginLeft: 'auto',
            padding: '10px 18px',
            borderRadius: 8,
            background: 'oklch(0.68 0.16 350)',
            color: 'oklch(0.16 0.02 350)',
            font: '700 15px Figtree',
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          Create your character
          <Icon name="arrow-right" />
        </div>
      </div>
    </>
  )
}
