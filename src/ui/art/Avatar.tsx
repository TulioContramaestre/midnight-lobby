import { useId } from 'react'
import { useGame } from '@/app/useGame'
import type { AvatarSpec } from '@/content/types'

const INK = '#2C2C2A'

export function Avatar({ spec: o, label }: { spec: AvatarSpec; label: string }) {
  const { selectors } = useGame()
  const clip = 'cp' + useId().replace(/[^A-Za-z0-9_-]/g, '')
  const earColor = o.earColor ?? ''
  const earInner = o.earInner ?? ''
  return (
    <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" viewBox="0 0 200 200" role="img" aria-label={label}>
      <defs>
        <clipPath id={clip}>
          <circle cx="100" cy="100" r="98" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <rect width="200" height="200" fill={o.bg} />
        {o.ears === 'cat' && (
          <>
            <path d="M54 80 L56 18 L94 50 Z" fill={earColor} />
            <path d="M146 80 L144 18 L106 50 Z" fill={earColor} />
            <path d="M62 66 L63 32 L84 52 Z" fill={earInner} />
            <path d="M138 66 L137 32 L116 52 Z" fill={earInner} />
          </>
        )}
        {o.ears === 'bunny' && (
          <>
            <g transform="rotate(-12 80 50)">
              <ellipse cx="80" cy="16" rx="13" ry="38" fill={earColor} stroke="#D3D1C7" strokeWidth="1.5" />
              <ellipse cx="80" cy="20" rx="6" ry="27" fill={earInner} />
            </g>
            <g transform="rotate(16 122 50)">
              <ellipse cx="122" cy="16" rx="13" ry="38" fill={earColor} stroke="#D3D1C7" strokeWidth="1.5" />
              <ellipse cx="122" cy="20" rx="6" ry="27" fill={earInner} />
            </g>
          </>
        )}
        {o.style === 'long' && <path d="M50 100 Q46 38 100 36 Q154 38 150 100 L156 186 Q100 196 44 186 Z" fill={o.hair} />}
        <path d="M28 210 Q34 160 100 158 Q166 160 172 210 Z" fill={o.shirt} />
        <rect x="89" y="134" width="22" height="28" fill={o.skin} />
        <rect x="89" y="134" width="22" height="28" fill="#000000" opacity="0.1" />
        <ellipse cx="100" cy="100" rx="42" ry="46" fill={o.skin} />
        <path d={selectors.content.creation.hairPaths[o.style]} fill={o.hair} />
        {o.ears === 'dog' && (
          <>
            <ellipse cx="50" cy="96" rx="13" ry="30" transform="rotate(18 50 96)" fill={earColor} />
            <ellipse cx="150" cy="96" rx="13" ry="30" transform="rotate(-18 150 96)" fill={earColor} />
          </>
        )}
        <circle cx="84" cy="104" r="5" fill={INK} />
        <circle cx="116" cy="104" r="5" fill={INK} />
        <circle cx="85.8" cy="102.2" r="1.6" fill="#FFFFFF" />
        <circle cx="117.8" cy="102.2" r="1.6" fill="#FFFFFF" />
        <path d="M77 93 L90 91" stroke={INK} strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
        <path d="M123 93 L110 91" stroke={INK} strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
        <path d="M92 124 Q100 130 108 124" stroke={INK} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        {o.acc === 'glasses' && (
          <>
            <circle cx="84" cy="104" r="11" stroke={INK} strokeWidth="2.5" fill="none" />
            <circle cx="116" cy="104" r="11" stroke={INK} strokeWidth="2.5" fill="none" />
            <path d="M95 104 L105 104" stroke={INK} strokeWidth="2.5" />
          </>
        )}
        {o.acc === 'beanie' && (
          <>
            <path d="M54 82 Q54 30 100 30 Q146 30 146 82 Z" fill="#E24B4A" />
            <rect x="52" y="74" width="96" height="12" rx="4" fill="#A32D2D" />
          </>
        )}
        {o.acc === 'headset' && (
          <>
            <path d="M56 100 Q56 44 100 44 Q144 44 144 100" stroke={INK} strokeWidth="6" fill="none" />
            <rect x="48" y="92" width="14" height="24" rx="4" fill={INK} />
            <rect x="138" y="92" width="14" height="24" rx="4" fill={INK} />
          </>
        )}
        {o.acc === 'earring' && (
          <>
            <circle cx="58" cy="118" r="3.5" fill="#B4B2A9" />
            <circle cx="142" cy="118" r="3.5" fill="#B4B2A9" />
          </>
        )}
        {o.acc === 'bow' && (
          <>
            <path d="M118 44 L132 52 L118 60 Z" fill="#D4537E" />
            <path d="M146 44 L132 52 L146 60 Z" fill="#D4537E" />
            <circle cx="132" cy="52" r="3" fill="#993556" />
          </>
        )}
      </g>
    </svg>
  )
}
