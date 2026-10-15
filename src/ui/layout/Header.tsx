import { useGame } from '@/app/useGame'
import { DAY_COUNT } from '@/engine/constants'
import type { View } from '@/engine/types'
import { Icon } from '@/ui/components/Icon'

export function Header() {
  const { state, dispatch, selectors } = useGame()
  const h = selectors.header(state)
  const tab = (view: View) => ({
    className: state.view === view ? 'on' : '',
    onClick: () => dispatch({ type: 'setView', view }),
  })
  return (
    <div className="row" style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
      <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
        <Icon name="calendar" style={{ verticalAlign: '-2px' }} />
        {` Day ${h.day + 1} of ${DAY_COUNT} · ${h.dayName}${h.evening ? ' evening' : ''}`}
      </div>
      <div className="row tabs">
        <button {...tab('story')}>
          <Icon name="message-circle" /> Story
        </button>
        <button {...tab('feed')}>
          <Icon name="hash" />
          {h.unseen ? ' Chirp ' : ' Chirp'}
          {h.unseen ? (
            <>
              <span
                style={{
                  fontSize: '12px',
                  padding: '1px 7px',
                  borderRadius: 'var(--radius)',
                  background: 'var(--bg-accent)',
                  color: 'var(--text-accent)',
                }}
              >
                {h.unseen}
              </span>
            </>
          ) : (
            ''
          )}
        </button>
        <button {...tab('people')}>
          <Icon name="users" /> People
        </button>
      </div>
    </div>
  )
}
