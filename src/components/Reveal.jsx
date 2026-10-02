import { useReveal } from '../hooks/useReveal.js'

/** Scroll-reveal wrapper. `kind` picks the animation (see styles: .rv--up / .rv--mask / .rv--fade). */
export default function Reveal({ as: Tag = 'div', kind = 'up', delay = 0, className = '', style, children, ...rest }) {
  const [ref, shown] = useReveal()
  return (
    <Tag ref={ref} className={`rv rv--${kind} ${shown ? 'is-in' : ''} ${className}`} style={{ '--d': `${delay}ms`, ...style }} {...rest}>
      {children}
    </Tag>
  )
}
