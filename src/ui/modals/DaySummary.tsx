import { useGame } from '@/app/useGame'
import { DAY_NAMES } from '@/engine/constants'
import { Pic } from '@/ui/art/Pic'
import { Icon } from '@/ui/components/Icon'
import { NAMECOL } from '@/ui/theme'

export function DaySummary() {
  const { session, state: g, dispatch, selectors } = useGame()
  return (
    <div
      className="m-overlay"
      style={{
        position: 'absolute',
        inset: 0,
        background: 'oklch(0.1 0.01 270 / 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 6,
      }}
    >
      <div
        className="m-modal"
        style={{
          width: 440,
          borderRadius: 12,
          background: 'oklch(0.245 0.01 270)',
          boxShadow: '0 30px 80px oklch(0 0 0 / 0.5)',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ font: '700 12px Figtree', letterSpacing: '0.06em', color: 'oklch(0.68 0.01 270)' }}>
            {'END OF DAY ' + (g.day + 1)}
          </span>
          <span style={{ font: '800 24px Figtree' }}>{DAY_NAMES[g.day] + ' night, logged off.'}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {selectors.content.loveInterests.map((li) => {
            const d = g.affection[li.id] - (session.daySnap[li.id] ?? g.affection[li.id])
            return (
              <div key={li.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', flex: 'none' }}>
                  <Pic id={li.id} mood={selectors.mood(g, li.id)} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ font: '600 15px Figtree', color: NAMECOL[li.id] }}>{li.name}</span>
                  <span style={{ font: 'italic 400 14px Figtree', color: 'oklch(0.78 0.01 270)' }}>
                    {d > 1
                      ? 'Seemed into you tonight.'
                      : d > 0
                        ? 'Noticed you, a little.'
                        : d < 0
                          ? 'Went quiet on you.'
                          : 'Barely clocked you.'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            onClick={() => dispatch({ type: 'startNextDay' })}
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
            {'Start ' + DAY_NAMES[Math.min(6, g.day + 1)]}
            <Icon name="arrow-right" />
          </div>
        </div>
      </div>
    </div>
  )
}
