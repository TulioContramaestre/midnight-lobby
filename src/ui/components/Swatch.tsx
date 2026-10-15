export function Swatch({ color, label, selected, onClick }: { color: string; label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      style={{
        width: '30px',
        height: '30px',
        minWidth: 0,
        padding: 0,
        borderRadius: '50%',
        background: color,
        border: selected ? '2.5px solid var(--border-stronger)' : '0.5px solid var(--border-strong)',
      }}
    />
  )
}
