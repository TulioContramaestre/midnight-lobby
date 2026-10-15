import { useGame } from '@/app/useGame'
import { Card } from '@/ui/components/Card'
import { ChoiceButton } from '@/ui/components/ChoiceButton'
import { DialogueLine } from '@/ui/components/DialogueLine'
import { DeltaChipList } from '@/ui/components/DeltaChips'
import { Icon } from '@/ui/components/Icon'
import { PortraitRow } from '@/ui/components/PortraitRow'

export function ConfrontationScreen() {
  const { state, dispatch, selectors } = useGame()
  const cf = selectors.confrontation(state)
  if (!cf) return null
  return (
    <>
      <PortraitRow ids={[cf.who]} />
      <Card>
        <p style={{ margin: '0 0 8px', fontSize: '13px', color: 'var(--text-secondary)' }}>Sunday night · She found out</p>
        {cf.lines.map((l, i) => (
          <DialogueLine key={i} line={l} />
        ))}
      </Card>
      {!cf.chosen ? (
        <div style={{ marginTop: '8px' }}>
          {cf.choices.map((text, i) => (
            <ChoiceButton key={i} onClick={() => dispatch({ type: 'confront', index: i })}>
              {text}
            </ChoiceButton>
          ))}
        </div>
      ) : (
        <>
          <Card style={{ marginTop: '12px' }}>
            <p className="ln" style={{ color: 'var(--text-secondary)', marginTop: 0 }}>
              {'You: ' + cf.chosen.text}
            </p>
            <DialogueLine line={{ speaker: cf.who, text: cf.chosen.reply }} />
            <DeltaChipList chips={cf.chosen.chips} />
          </Card>
          <button style={{ marginTop: '12px' }} onClick={() => dispatch({ type: 'seeEnding' })}>
            See how it ends <Icon name="arrow-right" />
          </button>
        </>
      )}
    </>
  )
}
