import { useGame } from '@/app/useGame'
import type { ResolvedLine } from '@/engine/types'

export function DialogueLine({ line }: { line: ResolvedLine }) {
  const { selectors } = useGame()
  if (!line.speaker) {
    return (
      <p className="ln" style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
        {line.text}
      </p>
    )
  }
  const li = selectors.content.loveInterest(line.speaker)
  const color = li ? `var(--text-tint-${li.tint},${li.tintFallback.text})` : 'var(--text-primary)'
  return (
    <p className="ln">
      <span style={{ fontWeight: 500, color }}>{selectors.name(line.speaker)}</span>
      {' \u00a0' + line.text}
    </p>
  )
}
