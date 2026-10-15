import type { CSSProperties, ReactNode } from 'react'

export function Card({ style, children }: { style?: CSSProperties; children: ReactNode }) {
  return (
    <div className="card" style={style}>
      {children}
    </div>
  )
}
