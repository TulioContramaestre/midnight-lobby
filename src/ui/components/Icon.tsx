import {
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconBarbell,
  IconBell,
  IconCalendar,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconCirclePlus,
  IconDeviceFloppy,
  IconDeviceGamepad2,
  IconDeviceTv,
  IconDots,
  IconFeather,
  IconFlower,
  IconFolderFilled,
  IconGuitarPick,
  IconHash,
  IconHeadphones,
  IconHeart,
  IconHeartFilled,
  IconLayoutGrid,
  IconLock,
  IconMessageCircle,
  IconMessages,
  IconMenu2,
  IconMicrophone,
  IconMinus,
  IconMoon,
  IconPhoneCall,
  IconPhoto,
  IconPin,
  IconPlus,
  IconRefresh,
  IconReload,
  IconRepeat,
  IconSearch,
  IconSend,
  IconShare2,
  IconSquare,
  IconUserCircle,
  IconUsers,
  IconVolume,
  IconWifi,
  IconX,
  type TablerIcon,
} from '@tabler/icons-react'
import type { CSSProperties } from 'react'
import type { IconName } from '@/content/types'

export type UiIconName =
  | IconName
  | 'arrow-down'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-up'
  | 'barbell'
  | 'bell'
  | 'calendar'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'circle-plus'
  | 'device-floppy'
  | 'device-gamepad-2'
  | 'device-tv'
  | 'dots'
  | 'feather'
  | 'flower'
  | 'folder-filled'
  | 'guitar-pick'
  | 'hash'
  | 'headphones'
  | 'heart'
  | 'heart-filled'
  | 'layout-grid'
  | 'lock'
  | 'message-circle'
  | 'messages'
  | 'menu-2'
  | 'microphone'
  | 'minus'
  | 'moon'
  | 'phone-call'
  | 'photo'
  | 'pin'
  | 'plus'
  | 'refresh'
  | 'reload'
  | 'repeat'
  | 'search'
  | 'send'
  | 'share-2'
  | 'square'
  | 'user-circle'
  | 'users'
  | 'volume'
  | 'wifi'
  | 'x'

const ICONS: Record<UiIconName, TablerIcon> = {
  'arrow-down': IconArrowDown,
  'arrow-left': IconArrowLeft,
  'arrow-right': IconArrowRight,
  'arrow-up': IconArrowUp,
  barbell: IconBarbell,
  bell: IconBell,
  calendar: IconCalendar,
  'chevron-down': IconChevronDown,
  'chevron-left': IconChevronLeft,
  'chevron-right': IconChevronRight,
  'circle-plus': IconCirclePlus,
  'device-floppy': IconDeviceFloppy,
  'device-gamepad-2': IconDeviceGamepad2,
  'device-tv': IconDeviceTv,
  dots: IconDots,
  feather: IconFeather,
  flower: IconFlower,
  'folder-filled': IconFolderFilled,
  'guitar-pick': IconGuitarPick,
  hash: IconHash,
  headphones: IconHeadphones,
  heart: IconHeart,
  'heart-filled': IconHeartFilled,
  'layout-grid': IconLayoutGrid,
  lock: IconLock,
  'message-circle': IconMessageCircle,
  messages: IconMessages,
  'menu-2': IconMenu2,
  microphone: IconMicrophone,
  minus: IconMinus,
  moon: IconMoon,
  'phone-call': IconPhoneCall,
  photo: IconPhoto,
  pin: IconPin,
  plus: IconPlus,
  refresh: IconRefresh,
  reload: IconReload,
  repeat: IconRepeat,
  search: IconSearch,
  send: IconSend,
  'share-2': IconShare2,
  square: IconSquare,
  'user-circle': IconUserCircle,
  users: IconUsers,
  volume: IconVolume,
  wifi: IconWifi,
  x: IconX,
}

export function Icon({ name, label, style }: { name: UiIconName; label?: string; style?: CSSProperties }) {
  const Svg = ICONS[name]
  const a11y = label ? { 'aria-label': label } : { 'aria-hidden': true }
  return (
    <i className={`ti ti-${name}`} {...a11y} style={style}>
      <Svg size="1em" stroke={2} aria-hidden="true" />
    </i>
  )
}
