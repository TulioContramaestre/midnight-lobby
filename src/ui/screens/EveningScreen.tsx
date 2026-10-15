import { useGame } from '@/app/useGame'
import { Portrait } from '@/ui/art/Portrait'
import { Card } from '@/ui/components/Card'
import { ChoiceButton } from '@/ui/components/ChoiceButton'
import { DeltaChips } from '@/ui/components/DeltaChips'
import { DialogueLine } from '@/ui/components/DialogueLine'
import { Icon } from '@/ui/components/Icon'
import { LockedOption } from '@/ui/components/LockedOption'

const optionIcon = { marginRight: '8px', verticalAlign: '-2px' }

export function EveningScreen() {
  const { state, dispatch, selectors } = useGame()
  const ev = selectors.evening(state)
  return (
    <>
      <Card>
        <p style={{ margin: '0 0 4px', fontWeight: 500 }}>Evening DMs</p>
        <p style={{ margin: '0 0 10px', fontSize: '14px', color: 'var(--text-secondary)' }}>One hangout per night. Choose who to message.</p>
        {!ev.result ? (
          <>
            <div className="row" style={{ marginBottom: '6px' }}>
              {ev.girls.map((g) => (
                <button
                  key={g.id}
                  onClick={() => dispatch({ type: 'selectEveningGirl', who: g.id })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    height: 'auto',
                    padding: '4px 12px 4px 4px',
                    ...(g.selected ? { borderColor: 'var(--border-stronger)', background: 'var(--surface-1)' } : {}),
                  }}
                >
                  <Portrait id={g.id} mood={g.mood} size={32} />
                  {' ' + g.name}
                </button>
              ))}
            </div>
            {ev.mode ? (
              <>
                <p style={{ margin: '10px 0 0', fontSize: '14px', fontWeight: 500 }}>{ev.mode.prompt}</p>
                {ev.mode.activities.map((a) => (
                  <ChoiceButton
                    key={a.id}
                    sub={a.desc}
                    onClick={() => dispatch({ type: 'doEvening', action: { kind: 'activity', id: a.id } })}
                  >
                    {a.name}
                  </ChoiceButton>
                ))}
                <button style={{ marginTop: '10px' }} onClick={() => dispatch({ type: 'setEveningMode', mode: null })}>
                  <Icon name="arrow-left" /> Back
                </button>
              </>
            ) : (
              <>
                {ev.modes.map((m) => (
                  <ChoiceButton key={m.id} onClick={() => dispatch({ type: 'setEveningMode', mode: m.id })}>
                    <Icon name={m.icon} style={optionIcon} />
                    {m.label}
                  </ChoiceButton>
                ))}
                {ev.pfp &&
                  (ev.pfp.unlocked ? (
                    <ChoiceButton onClick={() => dispatch({ type: 'doEvening', action: { kind: 'milestone', id: 'pfp' } })}>
                      <Icon name={ev.pfp.icon} style={optionIcon} />
                      {ev.pfp.label}
                    </ChoiceButton>
                  ) : (
                    <LockedOption>{ev.pfp.label}</LockedOption>
                  ))}
                {ev.sleep ? (
                  <ChoiceButton onClick={() => dispatch({ type: 'doEvening', action: { kind: 'milestone', id: 'sleep' } })}>
                    <Icon name={ev.sleep.icon} style={optionIcon} />
                    {ev.sleep.label}
                  </ChoiceButton>
                ) : (
                  ev.sleepHint && (
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '10px 0 0' }}>
                      <Icon name="lock" style={{ verticalAlign: '-2px' }} />
                      {' ' + ev.sleepHint}
                    </p>
                  )
                )}
              </>
            )}
          </>
        ) : (
          <>
            {ev.result.lines.map((l, i) => (
              <DialogueLine key={i} line={l} />
            ))}
            <DeltaChips deltas={ev.result.deltas} />
          </>
        )}
      </Card>
      <div className="row" style={{ marginTop: '12px' }}>
        <button onClick={() => dispatch({ type: 'nextDay' })}>
          <Icon name="moon" />
          {' Sleep, go to ' + ev.nextDayName}
        </button>
        <button onClick={() => dispatch({ type: 'setView', view: 'feed' })}>
          {'Chirp · ' + (ev.likedToday ? 'like used today' : '1 like left today')}
        </button>
      </div>
    </>
  )
}
