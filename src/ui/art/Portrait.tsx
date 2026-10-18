import { Fragment, useId, type ReactNode } from 'react'
import { useGame } from '@/app/useGame'
import type { CharacterId, Mood, PortraitDetail, PortraitSpec } from '@/content/types'

const SKIN = '#FCE4D6'
const SKIN_SHADE = '#F5C4B3'
const INK = '#2C2C2A'
const Y = 106
const EYES = [82, 118]

function eye(spec: PortraitSpec, mood: Mood, x: number, i: number): ReactNode {
  const P = spec.palette
  const o = i ? 1 : -1
  const brow = spec.browTilt === 'sad' ? [Y - 15, Y - 20] : [Y - 20, Y - 15]
  return (
    <Fragment key={x}>
      {mood === 'happy' ? (
        <path d={`M${x - 8} ${Y + 2} Q${x} ${Y - 8} ${x + 8} ${Y + 2}`} stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : (
        <>
          <ellipse cx={x} cy={Y} rx="7.5" ry="9.5" fill={P.eye} />
          <ellipse cx={x} cy={Y + 1} rx="3.5" ry="5" fill={INK} />
          <circle cx={x + 2.5} cy={Y - 3.5} r="2.5" fill="#FFFFFF" />
          {spec.eyeLid === 'heavy' ? (
            <>
              <rect x={x - 10} y={Y - 13} width="20" height="9" fill={SKIN} />
              <path d={`M${x - 10} ${Y - 4} L${x + 10} ${Y - 4}`} stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : (
            <path d={`M${x - 9} ${Y - 7} Q${x} ${Y - 13} ${x + 9} ${Y - 7}`} stroke={INK} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          )}
        </>
      )}
      {spec.winged && <path d={`M${x + o * 8} ${Y - 5} L${x + o * 15} ${Y - 10}`} stroke={INK} strokeWidth="2.5" strokeLinecap="round" />}
      {mood === 'upset' && (
        <path d={`M${x + o * 9} ${brow[0]} L${x - o * 7} ${brow[1]}`} stroke={P.browUpset} strokeWidth="2.5" strokeLinecap="round" />
      )}
    </Fragment>
  )
}

function mouth(spec: PortraitSpec, mood: Mood): ReactNode {
  const line = { stroke: INK, strokeWidth: '2.2', fill: 'none', strokeLinecap: 'round' } as const
  if (mood === 'upset') return <path d="M93 133 Q100 127 107 133" {...line} />
  if (mood === 'happy') {
    if (spec.mouth.happy === 'cat') return <path d="M92 128 Q96 133 100 128 Q104 133 108 128" {...line} />
    if (spec.mouth.happy === 'open') return <path d="M89 126 Q100 142 111 126 Z" fill="#993556" />
    return <path d="M91 127 Q102 135 111 125" {...line} />
  }
  if (spec.mouth.neutral === 'flat') return <path d="M95 130 L105 130" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
  if (spec.mouth.neutral === 'smile') return <path d="M93 128 Q100 134 107 128" {...line} />
  return <path d="M94 130 Q104 132 109 126" {...line} />
}

function detail(spec: PortraitSpec, d: PortraitDetail): ReactNode {
  const P = spec.palette
  switch (d) {
    case 'heart':
      return <path key={d} d="M128 119 c-2.5 -3 -7 -1 -4 3 l4 4 l4 -4 c3 -4 -1.5 -6 -4 -3 z" fill={P.acc} />
    case 'choker':
      return <rect key={d} x="38" y="180" width="124" height="6" fill={P.acc} />
    case 'bow':
      return <path key={d} d="M78 160 L122 160 L100 184 Z" fill={P.acc} />
    case 'freckles':
      return (
        <Fragment key={d}>
          <circle cx="71" cy="115" r="1.4" fill={P.freckles} />
          <circle cx="77" cy="118" r="1.4" fill={P.freckles} />
          <circle cx="123" cy="118" r="1.4" fill={P.freckles} />
          <circle cx="129" cy="115" r="1.4" fill={P.freckles} />
        </Fragment>
      )
    case 'collar':
      return <path key={d} d="M84 162 L100 182 L116 162 L110 160 L100 172 L90 160 Z" fill="#FFFFFF" />
    case 'mole':
      return <circle key={d} cx="113" cy="124" r="1.6" fill={INK} />
  }
}

export function Portrait({ id, mood }: { id: CharacterId; mood: Mood }) {
  const { selectors } = useGame()
  const clip = 'cp' + useId().replace(/[^A-Za-z0-9_-]/g, '')
  const li = selectors.content.loveInterest(id)
  if (!li) return null
  const spec = li.portrait
  const P = spec.palette
  const L = spec.hairLength
  return (
    <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" viewBox="0 0 200 200" role="img" aria-label={`Portrait of ${li.name}, ${mood}`}>
      <defs>
        <clipPath id={clip}>
          <circle cx="100" cy="100" r="98" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <rect width="200" height="200" fill={P.bg} />
        {spec.ears === 'cat' && (
          <>
            <path d="M52 80 L54 16 L94 50 Z" fill={P.hair} />
            <path d="M148 80 L146 16 L106 50 Z" fill={P.hair} />
            <path d="M60 66 L61 32 L84 52 Z" fill={P.acc} />
            <path d="M140 66 L139 32 L116 52 Z" fill={P.acc} />
          </>
        )}
        {spec.ears === 'bunny' && (
          <>
            <g transform="rotate(-12 80 50)">
              <ellipse cx="80" cy="16" rx="13" ry="38" fill={P.hair} stroke={P.hair2} strokeWidth="1.5" />
              <ellipse cx="80" cy="20" rx="6" ry="27" fill={P.acc} />
            </g>
            <g transform="rotate(16 122 50)">
              <ellipse cx="122" cy="16" rx="13" ry="38" fill={P.hair} stroke={P.hair2} strokeWidth="1.5" />
              <ellipse cx="122" cy="20" rx="6" ry="27" fill={P.acc} />
            </g>
          </>
        )}
        <path d={`M46 104 Q42 36 100 34 Q158 36 154 104 L158 ${L} Q100 ${L + 12} 42 ${L} Z`} fill={P.hair2} />
        <path d="M28 210 Q34 162 100 160 Q166 162 172 210 Z" fill={P.shirt} />
        <rect x="89" y="136" width="22" height="28" fill={SKIN_SHADE} />
        <ellipse cx="100" cy="102" rx="44" ry="47" fill={SKIN} />
        <path
          d="M54 100 Q50 42 100 40 Q150 42 146 100 Q140 76 126 66 Q120 82 102 80 Q86 78 80 64 Q64 76 54 100 Z"
          fill={P.hair}
          {...(spec.bangsOutline ? { stroke: P.hair2, strokeWidth: '1.5' } : {})}
        />
        <path d="M56 90 Q48 130 58 154 L66 152 Q58 122 63 92 Z" fill={P.hair} />
        <path d="M144 90 Q152 130 142 154 L134 152 Q142 122 137 92 Z" fill={P.hair} />
        {spec.streak && (
          <>
            <path d="M86 64 Q78 74 74 92 L81 90 Q83 77 90 66 Z" fill={P.acc} />
            <path d="M58 140 Q57 148 58 154 L66 152 Q63 146 62 138 Z" fill={P.acc} />
          </>
        )}
        {spec.ears === 'dog' && (
          <>
            <ellipse cx="48" cy="98" rx="14" ry="32" transform="rotate(18 48 98)" fill={P.hair2} />
            <ellipse cx="152" cy="98" rx="14" ry="32" transform="rotate(-18 152 98)" fill={P.hair2} />
          </>
        )}
        {EYES.map((x, i) => eye(spec, mood, x, i))}
        <ellipse cx="74" cy="121" rx="7" ry="3.5" fill="#F09595" opacity="0.55" />
        <ellipse cx="126" cy="121" rx="7" ry="3.5" fill="#F09595" opacity="0.55" />
        {mouth(spec, mood)}
        {spec.details.map((d) => detail(spec, d))}
      </g>
    </svg>
  )
}
