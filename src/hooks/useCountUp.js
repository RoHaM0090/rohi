import { useEffect, useState } from 'react'
import { prefersReducedMotion } from '../utils/env.js'

// Counts 0 -> target once `active` is true. rAF only runs during the count.
export function useCountUp(target, active, duration = 1400) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active || target == null) return undefined
    if (prefersReducedMotion()) { setValue(target); return undefined }
    let raf
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 4)
      setValue(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, active, duration])
  return value
}
