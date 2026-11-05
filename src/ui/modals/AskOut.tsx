import { currentSceneDef } from '@/app/session/queries'
import { useGame } from '@/app/useGame'
import { Pic } from '@/ui/art/Pic'
import { Icon } from '@/ui/components/Icon'
import { NAMECOL } from '@/ui/theme'

export function AskOut() {
  const { state: g, dispatch, selectors } = useGame()
  const cur = selectors.currentScene(g)
  const def = currentSceneDef(selectors.content, g)
  if (!cur || !def) return null
  const sub = cur.lines.find((l) => !l.speaker)?.text ?? ''
  return (
    <div
      className="m-overlay"
      style={{
        position: 'absolute',
        inset: 0,
        background: 'oklch(0.1 0.01 270 / 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 6,
      }}
    >
      <div
        className="m-modal"
        style={{
          width: 820,
          borderRadius: 12,
          background: 'oklch(0.245 0.01 270)',
          boxShadow: '0 30px 80px oklch(0 0 0 / 0.5)',
          padding: 28,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ font: '700 12px Figtree', letterSpacing: '0.06em', color: 'oklch(0.68 0.01 270)' }}>
            SUNDAY · 11:58 PM
          </span>
          <span style={{ font: '800 28px Figtree' }}>One message. Who gets it?</span>
          <span style={{ font: '400 15px Figtree', color: 'oklch(0.75 0.01 270)' }}>{sub}</span>
        </div>
        <div className="m-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 14 }}>
          {def.variant.choices.map((c, i) => {
            const pick = c.effects.find((e) => e.type === 'pickDate')
            if (!pick) return null
            const name = selectors.name(pick.who)
            return (
              <div
                key={pick.who}
                className="hv-ask"
                onClick={() => dispatch({ type: 'askPick', index: i })}
                style={{
                  borderRadius: 10,
                  background: 'oklch(0.21 0.01 270)',
                  padding: '20px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                  cursor: 'pointer',
                  boxShadow: 'inset 0 0 0 1px oklch(0.3 0.01 270)',
                }}
              >
                <div className="m-askpic" style={{ width: 112, height: 112, borderRadius: '50%', overflow: 'hidden' }}>
                  <Pic id={pick.who} mood={selectors.mood(g, pick.who)} />
                </div>
                <span style={{ font: '800 18px Figtree', color: NAMECOL[pick.who] }}>{name}</span>
                <div
                  style={{
                    alignSelf: 'stretch',
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: 'oklch(0.29 0.01 270)',
                    font: '400 14px Figtree',
                    lineHeight: 1.45,
                    flex: 1,
                  }}
                >
                  {c.text.replace(/^Message \w+: /, '')}
                </div>
                <span
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    padding: '9px 0',
                    borderRadius: 8,
                    background: 'oklch(0.68 0.16 350)',
                    color: 'oklch(0.16 0.02 350)',
                    font: '700 14px Figtree',
                    display: 'flex',
                    gap: 6,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name="send" />
                  {'Send to ' + name}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
