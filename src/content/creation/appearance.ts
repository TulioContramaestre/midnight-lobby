import type { HairStyle } from '@/content/types'

export const skins: string[] = ['#FCE4D6', '#F1C9A5', '#D9A577', '#B07A4F', '#7A5134', '#4E3322']

export const hairs: string[] = ['#2C2C2A', '#633806', '#BA7517', '#993C1D', '#378ADD', '#F1EFE8']

export const hairStyles: { id: HairStyle; label: string }[] = [
  { id: 'short', label: 'Short' },
  { id: 'messy', label: 'Messy' },
  { id: 'buzz', label: 'Buzz cut' },
  { id: 'long', label: 'Long' },
]

export const hairPaths: Record<HairStyle, string> = {
  short: 'M56 92 Q54 46 100 44 Q146 46 144 92 Q136 70 118 64 Q100 74 80 66 Q64 74 56 92 Z',
  messy: 'M54 94 Q46 52 70 46 L66 34 L84 42 L92 28 L104 42 L118 30 L122 44 L140 38 L136 54 Q150 66 146 94 Q138 72 122 66 Q104 78 84 68 Q66 76 54 94 Z',
  buzz: 'M58 84 Q58 50 100 48 Q142 50 142 84 Q120 66 100 66 Q80 66 58 84 Z',
  long: 'M56 98 Q52 44 100 42 Q148 44 144 98 Q138 74 124 66 Q116 80 100 78 Q84 76 78 64 Q64 76 56 98 Z',
}

export const playerAvatar = { bg: '#D3D1C7', shirt: '#185FA5' }
