import { useEffect, useRef } from 'react'
import { isFinePointer, prefersReducedMotion } from '../utils/env.js'

// Custom cursor: dot + trailing ring. Only on fine pointers (mouse); never on touch devices.
export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    if (!isFinePointer()) return undefined
    const root = document.documentElement
    root.classList.add('has-cursor')
    const reduced = prefersReducedMotion()
    let mx = -100, my = -100, rx = -100, ry = -100, raf = 0

    const loop = () => {
      rx += (mx - rx) * (reduced ? 1 : 0.18)
      ry += (my - ry) * (reduced ? 1 : 0.18)
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px,${ry}px,0)`
      if (Math.abs(mx - rx) > 0.1 || Math.abs(my - ry) > 0.1) raf = requestAnimationFrame(loop)
      else raf = 0
    }
    const move = (e) => {
      mx = e.clientX; my = e.clientY
      if (dot.current) dot.current.style.transform = `translate3d(${mx}px,${my}px,0)`
      root.style.setProperty('--px', `${mx}px`)
      root.style.setProperty('--py', `${my}px`)
      if (!raf) raf = requestAnimationFrame(loop)
    }
    const over = (e) => {
      const t = e.target instanceof Element ? e.target.closest('a,button,input,textarea,select,summary,[data-cursor]') : null
      ring.current?.classList.toggle('is-hot', !!t)
      dot.current?.classList.toggle('is-hot', !!t)
    }
    const down = () => ring.current?.classList.add('is-down')
    const up = () => ring.current?.classList.remove('is-down')
    const leave = () => { if (dot.current) dot.current.style.opacity = 0; if (ring.current) ring.current.style.opacity = 0 }
    const enter = () => { if (dot.current) dot.current.style.opacity = 1; if (ring.current) ring.current.style.opacity = 1 }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    document.addEventListener('pointerleave', leave)
    document.addEventListener('pointerenter', enter)
    return () => {
      cancelAnimationFrame(raf)
      root.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      document.removeEventListener('pointerleave', leave)
      document.removeEventListener('pointerenter', enter)
    }
  }, [])

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
