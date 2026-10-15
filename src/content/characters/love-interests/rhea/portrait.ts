import type { PortraitSpec } from '@/content/types'

export const portrait: PortraitSpec = {
  palette: {
    bg: '#F4C0D1',
    hair: '#F1EFE8',
    hair2: '#D3D1C7',
    eye: '#A32D2D',
    shirt: '#3C3489',
    acc: '#ED93B1',
    browUpset: '#888780',
  },
  hairLength: 196,
  ears: 'bunny',
  bangsOutline: true,
  streak: false,
  eyeLid: 'heavy',
  winged: false,
  browTilt: 'angry',
  mouth: { happy: 'smirk', neutral: 'smirk' },
  details: ['collar', 'mole'],
}
