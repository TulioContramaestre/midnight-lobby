import type { PortraitSpec } from '@/content/types'

export const portrait: PortraitSpec = {
  palette: {
    bg: '#CECBF6',
    hair: '#2C2C2A',
    hair2: '#444441',
    eye: '#7F77DD',
    shirt: '#2C2C2A',
    acc: '#D4537E',
    browUpset: '#444441',
  },
  hairLength: 192,
  ears: 'cat',
  bangsOutline: false,
  streak: true,
  eyeLid: 'arched',
  winged: true,
  browTilt: 'angry',
  mouth: { happy: 'cat', neutral: 'flat' },
  details: ['heart', 'choker'],
}
