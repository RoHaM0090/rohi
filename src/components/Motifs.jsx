import { BASE } from '../utils/env.js'

/** The RH panther emblem. tone="orange" paints it with the accent gradient via CSS mask. */
export function Emblem({ size = 40, tone = 'orange', className = '', style }) {
  const url = `url(${BASE}assets/logo-white.png)`
  if (tone === 'white') {
    return (
      <img
        className={`emblem emblem--white ${className}`}
        src={`${BASE}assets/logo-white.png`}
        alt=""
        width={size}
        height={Math.round(size * 1.178)}
        style={style}
        draggable="false"
      />
    )
  }
  return (
    <span
      className={`emblem emblem--orange ${className}`}
      style={{ '--logo': url, width: size, height: Math.round(size * 1.178), ...style }}
      aria-hidden="true"
    />
  )
}

/** Technical wrench line-art with measurement ticks. Decorative. */
export function WrenchArt({ className = '' }) {
  return (
    <svg className={`wrench-art ${className}`} viewBox="0 0 400 400" fill="none" aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="200" cy="200" r="150" strokeDasharray="2 8" opacity=".5" />
        <circle cx="200" cy="200" r="120" opacity=".25" />
        <g transform="rotate(-38 200 200)">
          <path d="M170 52c-22 6-36 26-36 48 0 14 6 26 15 35l-3 18h48l-3-18c9-9 15-21 15-35 0-22-14-42-36-48v34h-20z" />
          <rect x="176" y="153" width="48" height="190" rx="24" />
          <circle cx="200" cy="318" r="9" />
          <path d="M176 180h48M176 200h48M176 220h48" opacity=".45" />
        </g>
        <path d="M44 200h18M338 200h18M200 44v18M200 338v18" opacity=".7" />
      </g>
    </svg>
  )
}

/** Two sharp panther eyes. Pupils follow `--ex/--ey` custom properties if provided. */
export function PantherEyes({ className = '' }) {
  return (
    <svg className={`panther-eyes ${className}`} viewBox="0 0 240 70" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffb066" />
          <stop offset="1" stopColor="#ff6a00" />
        </radialGradient>
      </defs>
      <g className="pe-eye pe-eye--l"><path d="M8 46C34 14 74 8 108 26c-20 22-60 30-100 20z" fill="url(#eyeGlow)" /><ellipse className="pe-pupil" cx="78" cy="29" rx="5" ry="12" fill="#07070a" /></g>
      <g className="pe-eye pe-eye--r"><path d="M232 46c-26-32-66-38-100-20 20 22 60 30 100 20z" fill="url(#eyeGlow)" /><ellipse className="pe-pupil" cx="162" cy="29" rx="5" ry="12" fill="#07070a" /></g>
    </svg>
  )
}

/** Three claw slashes — used in transitions and the Easter egg. */
export function Claws({ className = '' }) {
  return (
    <svg className={`claws ${className}`} viewBox="0 0 300 300" fill="none" aria-hidden="true" focusable="false">
      <path d="M70 20L190 280" /><path d="M120 10L240 270" /><path d="M170 0L290 260" />
    </svg>
  )
}
