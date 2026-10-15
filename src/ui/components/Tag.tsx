import type { ReactNode } from 'react'

export function Tag({ bg, fg, children }: { bg: string; fg: string; children: ReactNode }) {
  return (
    <span className="tag" style={{ background: `var(${bg})`, color: `var(${fg})` }}>
      {children}
    </span>
  )
}
