import type { ReactNode } from 'react'
import { Icon } from './Icon'

export function LockedOption({ children }: { children: ReactNode }) {
  return (
    <div className="locked">
      <Icon name="lock" style={{ marginRight: '8px', verticalAlign: '-2px' }} />
      {children}
    </div>
  )
}
