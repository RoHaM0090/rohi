import Icon from './Icon.jsx'
import { socials } from '../data/socials.js'
import { sound } from '../utils/sound.js'
import { useMagnetic } from '../hooks/useMagnetic.js'

function SocialIcon({ s, showHandle }) {
  const m = useMagnetic(0.3)
  const external = !s.url.startsWith('mailto:')
  return (
    <a
      ref={m.ref}
      onPointerMove={m.onPointerMove}
      onPointerLeave={m.onPointerLeave}
      onClick={() => sound.play('click')}
      className={`social ${showHandle ? 'social--wide' : ''}`}
      href={s.url}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      aria-label={`${s.label}: ${s.username}`}
      title={s.label}
    >
      <Icon name={s.icon} size={20} />
      {showHandle && <span className="social-handle latin">{s.id === 'email' ? s.username : `@${s.username}`}</span>}
    </a>
  )
}

/** Icon-only social links by default. Edit the list in src/data/socials.js */
export default function SocialLinks({ showHandle = false, className = '' }) {
  return (
    <ul className={`socials ${className}`}>
      {socials.map((s) => (
        <li key={s.id}><SocialIcon s={s} showHandle={showHandle} /></li>
      ))}
    </ul>
  )
}
