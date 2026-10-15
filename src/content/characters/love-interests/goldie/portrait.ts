import type { PortraitSpec } from '@/content/types'

export const portrait: PortraitSpec = {
  palette: {
    bg: '#FAC775',
    hair: '#BA7517',
    hair2: '#854F0B',
    eye: '#633806',
    shirt: '#FAEEDA',
    acc: '#E24B4A',
    browUpset: '#854F0B',
    freckles: '#BA7517',
  },
  hairLength: 158,
  ears: 'dog',
  bangsOutline: false,
  streak: false,
  eyeLid: 'arched',
  winged: false,
  browTilt: 'sad',
  mouth: { happy: 'open', neutral: 'smile' },
  details: ['bow', 'freckles'],
}
