import { useCallback, useRef } from 'react'
import { isFinePointer, prefersReducedMotion } from '../utils/env.js'

export function useMagnetic(strength = 0.25) {
  const ref = useRef(null)
  const onPointerMove = useCallback(
    (e) => {
      const el = ref.current
      if (!el || e.pointerType === 'touch' || !isFinePointer() || prefersReducedMotion()) return
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      el.style.setProperty('--tx', `${dx * strength}px`)
      el.style.setProperty('--ty', `${dy * strength}px`)
    },
    [strength],
  )
  const onPointerLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--tx', '0px')
    el.style.setProperty('--ty', '0px')
  }, [])
  return { ref, onPointerMove, onPointerLeave }
}
