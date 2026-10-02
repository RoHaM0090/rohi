import { useCallback, useRef } from 'react'
import { isFinePointer, prefersReducedMotion } from '../utils/env.js'

// 3D tilt + light position, written straight to CSS variables (no React re-render).
export function useTilt(max = 8) {
  const ref = useRef(null)
  const onPointerMove = useCallback(
    (e) => {
      const el = ref.current
      if (!el || e.pointerType === 'touch' || !isFinePointer() || prefersReducedMotion()) return
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = (e.clientY - r.top) / r.height
      el.style.setProperty('--ry', `${(x - 0.5) * max * 2}deg`)
      el.style.setProperty('--rx', `${(0.5 - y) * max * 2}deg`)
      el.style.setProperty('--mx', `${x * 100}%`)
      el.style.setProperty('--my', `${y * 100}%`)
    },
    [max],
  )
  const onPointerLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--ry', '0deg')
    el.style.setProperty('--rx', '0deg')
  }, [])
  return { ref, onPointerMove, onPointerLeave }
}
