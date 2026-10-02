import Icon from './Icon.jsx'
import { TLink } from './PageTransition.jsx'
import { useMagnetic } from '../hooks/useMagnetic.js'
import { sound } from '../utils/sound.js'

/** Magnetic button. Pass `to` (internal route), `href` (external) or `onClick`. */
export default function Btn({ to, href, onClick, variant = 'primary', icon, quick, external, className = '', type = 'button', children, ...rest }) {
  const m = useMagnetic(0.22)
  const cls = `btn btn--${variant} ${className}`
  const click = (e) => { sound.play('click'); onClick?.(e) }
  const inner = (
    <>
      <span className="btn-label">{children}</span>
      {icon && <Icon name={icon} size={18} />}
    </>
  )
  const mag = { ref: m.ref, onPointerMove: m.onPointerMove, onPointerLeave: m.onPointerLeave }
  if (to) return <TLink to={to} quick={quick} className={cls} onClick={click} {...mag} {...rest}>{inner}</TLink>
  if (href) {
    return (
      <a href={href} className={cls} onClick={click} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} {...mag} {...rest}>
        {inner}
      </a>
    )
  }
  return <button type={type} className={cls} onClick={click} {...mag} {...rest}>{inner}</button>
}
