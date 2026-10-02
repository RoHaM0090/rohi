import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../utils/env.js'

// Fixed ambient dust. ~30fps, paused when the tab is hidden, static when reduced-motion is on.
export default function Ambient() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduced = prefersReducedMotion()
    let w = 0, h = 0, dpr = 1, parts = [], raf = 0, last = 0, running = true

    const make = () => {
      const n = Math.max(26, Math.min(64, Math.round(w / 22)))
      parts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: 0.5 + Math.random() * 1.5, v: 0.12 + Math.random() * 0.35,
        a: 0.12 + Math.random() * 0.5, o: Math.random() < 0.28, p: Math.random() * 6.28,
      }))
    }
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = window.innerWidth; h = window.innerHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      make(); draw(0)
    }
    const draw = (t) => {
      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        const tw = 0.6 + 0.4 * Math.sin(t / 900 + p.p)
        ctx.fillStyle = p.o ? `rgba(255,120,20,${p.a * tw})` : `rgba(235,235,240,${p.a * 0.6 * tw})`
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill()
      }
    }
    const step = (now) => {
      raf = requestAnimationFrame(step)
      if (now - last < 33) return
      last = now
      for (const p of parts) {
        p.y -= p.v; p.x += Math.sin(now / 3000 + p.p) * 0.12
        if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w }
      }
      draw(now)
    }
    const onVis = () => {
      if (reduced) return
      if (document.hidden) { cancelAnimationFrame(raf); running = false }
      else if (!running) { running = true; raf = requestAnimationFrame(step) }
    }
    resize()
    if (!reduced) raf = requestAnimationFrame(step)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVis)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); document.removeEventListener('visibilitychange', onVis) }
  }, [])
  return <canvas ref={ref} className="ambient" aria-hidden="true" />
}
