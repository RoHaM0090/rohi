import { useEffect, useRef, useState } from 'react'
import LogoMotion from './LogoMotion.jsx'
import { prefersReducedMotion } from '../utils/env.js'

/*
 * Main loading screen. It plays the existing logo animation (4.5s), shows a progress line,
 * holds briefly, then hands over to the site.
 * Easy to replace: swap <LogoMotion /> for anything else and keep onDone().
 */
const STEPS = [
  [0, 'INITIALIZING'],
  [28, 'LOADING ASSETS'],
  [58, 'CALIBRATING'],
  [88, 'READY'],
]
const ANIM_MS = 4500
const HOLD_MS = 700

export default function LogoLoader({ onDone }) {
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [canSkip, setCanSkip] = useState(false)
  const finished = useRef(false)

  const returning = useRef(false)
  if (typeof window !== 'undefined' && !returning.current) {
    try { returning.current = sessionStorage.getItem('rohi-seen') === '1' } catch { /* ignore */ }
  }
  const reduced = prefersReducedMotion()
  const speed = returning.current ? 1.9 : 1
  const total = reduced ? 900 : Math.round(ANIM_MS / speed + HOLD_MS)

  const finish = () => {
    if (finished.current) return
    finished.current = true
    setPct(100)
    setLeaving(true)
    try { sessionStorage.setItem('rohi-seen', '1') } catch { /* ignore */ }
    setTimeout(onDone, reduced ? 200 : 900)
  }

  useEffect(() => {
    let raf
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - start) / total)
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
      setPct(Math.round(eased * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else finish()
    }
    raf = requestAnimationFrame(tick)
    const skip = setTimeout(() => setCanSkip(true), 1600)
    return () => { cancelAnimationFrame(raf); clearTimeout(skip) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const label = [...STEPS].reverse().find(([from]) => pct >= from)[1]

  return (
    <div className={`loader ${leaving ? 'is-leaving' : ''}`} role="progressbar" aria-label="در حال بارگذاری" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="loader-grid" aria-hidden="true" />
      {!reduced && <LogoMotion speed={speed} className="loader-motion" />}
      <div className="loader-hud">
        <div className="loader-meta latin">
          <span>ROHI SYSTEM</span>
          <span>{label}</span>
          <span className="loader-pct">{String(pct).padStart(3, '0')}%</span>
        </div>
        <div className="loader-bar"><i style={{ transform: `scaleX(${pct / 100})` }} /></div>
      </div>
      <button type="button" className={`loader-skip ${canSkip && !leaving ? 'is-on' : ''}`} onClick={finish} tabIndex={canSkip ? 0 : -1}>
        رد کردن
      </button>
    </div>
  )
}
