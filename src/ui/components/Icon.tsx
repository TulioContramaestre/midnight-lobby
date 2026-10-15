import {
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconDeviceGamepad2,
  IconDeviceTv,
  IconHash,
  IconHeart,
  IconLock,
  IconMessageCircle,
  IconMinus,
  IconMoon,
  IconPhoto,
  IconRefresh,
  IconUsers,
  type TablerIcon,
} from '@tabler/icons-react'
import type { CSSProperties } from 'react'
import type { IconName } from '@/content/types'

const ICONS: Record<IconName, TablerIcon> = {
  calendar: IconCalendar,
  'message-circle': IconMessageCircle,
  hash: IconHash,
  users: IconUsers,
  'arrow-right': IconArrowRight,
  'arrow-left': IconArrowLeft,
  'arrow-up': IconArrowUp,
  'arrow-down': IconArrowDown,
  minus: IconMinus,
  'device-gamepad-2': IconDeviceGamepad2,
  'device-tv': IconDeviceTv,
  photo: IconPhoto,
  moon: IconMoon,
  lock: IconLock,
  'chevron-left': IconChevronLeft,
  'chevron-right': IconChevronRight,
  heart: IconHeart,
  refresh: IconRefresh,
}

export function Icon({ name, label, style }: { name: IconName; label?: string; style?: CSSProperties }) {
  const Svg = ICONS[name]
  const a11y = label ? { 'aria-label': label } : { 'aria-hidden': true }
  return (
    <i className={`ti ti-${name}`} {...a11y} style={style}>
      <Svg size="1em" stroke={2} aria-hidden="true" />
    </i>
  )
}
