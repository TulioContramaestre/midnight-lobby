import type { ReactNode } from 'react'

export function ChoiceButton({ onClick, sub, children }: { onClick: () => void; sub?: string; children: ReactNode }) {
  return (
    <button className="ch" onClick={onClick}>
      {children}
      {sub !== undefined && <span className="sub">{sub}</span>}
    </button>
  )
}
