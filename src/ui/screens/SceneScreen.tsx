import { useGame } from '@/app/useGame'
import { SLOTS_PER_DAY } from '@/engine/constants'
import { Card } from '@/ui/components/Card'
import { ChoiceButton } from '@/ui/components/ChoiceButton'
import { DeltaChips } from '@/ui/components/DeltaChips'
import { DialogueLine } from '@/ui/components/DialogueLine'
import { Icon } from '@/ui/components/Icon'
import { PortraitRow } from '@/ui/components/PortraitRow'

export function SceneScreen() {
  const { state, dispatch, selectors } = useGame()
  const sc = selectors.currentScene(state)
  if (!sc) return null
  return (
    <>
      <PortraitRow ids={sc.cast} />
      <Card>
        <p style={{ margin: '0 0 8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          {`Scene ${sc.slot + 1} of ${SLOTS_PER_DAY} · ${sc.title}`}
        </p>
        {sc.lines.map((l, i) => (
          <DialogueLine key={i} line={l} />
        ))}
      </Card>
      {state.phase === 'scene' ? (
        <div style={{ marginTop: '8px' }}>
          {sc.choices.map((text, i) => (
            <ChoiceButton key={i} onClick={() => dispatch({ type: 'choose', index: i })}>
              {text}
            </ChoiceButton>
          ))}
        </div>
      ) : (
        <>
          <Card style={{ marginTop: '12px' }}>
            <p className="ln" style={{ color: 'var(--text-secondary)', marginTop: 0 }}>
              {'You: ' + state.lastChoice?.text}
            </p>
            {state.lastReaction?.map((l, i) => (
              <DialogueLine key={i} line={l} />
            ))}
            <DeltaChips deltas={state.lastChoice?.deltas ?? {}} />
          </Card>
          <button style={{ marginTop: '12px' }} onClick={() => dispatch({ type: 'continue' })}>
            Continue <Icon name="arrow-right" />
          </button>
        </>
      )}
    </>
  )
}
