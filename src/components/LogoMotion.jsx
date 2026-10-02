import { useRef } from 'react'
import { BASE } from '../utils/env.js'

/**
 * Wraps the ORIGINAL logo-reveal animation (public/assets/logo-motion) in an iframe.
 * The animation itself is untouched — we only set its playback speed and hide its key hints.
 * To change the animation, edit files inside public/assets/logo-motion (see its README / config.js).
 */
export default function LogoMotion({ speed = 1, className = '' }) {
  const ref = useRef(null)

  const onLoad = () => {
    try {
      const w = ref.current?.contentWindow
      if (w?.REVEAL_CONFIG) {
        w.REVEAL_CONFIG.speed = speed
        w.REVEAL_CONFIG.hints = false
      }
      w?.document.getElementById('hint')?.remove()
    } catch {
      /* cross-origin or blocked: the animation still plays at normal speed */
    }
  }

  return (
    <iframe
      ref={ref}
      className={`logo-motion ${className}`}
      src={`${BASE}assets/logo-motion/index.html?transparent=1`}
      title="ROHI logo animation"
      aria-hidden="true"
      tabIndex={-1}
      onLoad={onLoad}
    />
  )
}
