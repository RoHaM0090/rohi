import { createContext, forwardRef, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import LogoMotion from './LogoMotion.jsx'
import { Claws } from './Motifs.jsx'
import { prefersReducedMotion } from '../utils/env.js'
import { sound } from '../utils/sound.js'

/*
 * Cinematic route transitions:
 *   cover (slats close) -> hold (logo motion plays, new page mounts underneath) -> reveal (slats open)
 * `quick` skips the logo motion (used for project detail pages).
 */
const Ctx = createContext({ go: () => {} })
export const useGo = () => useContext(Ctx).go

export function TransitionProvider({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [phase, setPhase] = useState('idle')
  const [withLogo, setWithLogo] = useState(false)
  const [runId, setRunId] = useState(0)
  const busy = useRef(false)
  const here = useRef('')
  here.current = location.pathname + location.search

  const go = useCallback(
    (to, { quick = false } = {}) => {
      if (busy.current) return
      if (to === here.current) { window.scrollTo({ top: 0, behavior: 'smooth' }); return }
      sound.play('nav')
      if (prefersReducedMotion()) { navigate(to); return }
      busy.current = true
      const T = quick ? { cover: 500, hold: 100, reveal: 650 } : { cover: 500, hold: 1050, reveal: 650 }
      setWithLogo(!quick)
      setRunId((n) => n + 1)
      setPhase('cover')
      setTimeout(() => { navigate(to); setPhase('hold') }, T.cover)
      setTimeout(() => setPhase('reveal'), T.cover + T.hold)
      setTimeout(() => { setPhase('idle'); busy.current = false }, T.cover + T.hold + T.reveal)
    },
    [navigate],
  )

  const value = useMemo(() => ({ go }), [go])

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className={`pt pt--${phase}`} aria-hidden="true">
        <div className="pt-slats">
          {[0, 1, 2, 3, 4, 5].map((i) => <i key={i} style={{ '--i': i }} />)}
        </div>
        <Claws className="pt-claws" />
        {withLogo && (phase === 'hold' || phase === 'reveal') && (
          <div className="pt-logo" key={runId}><LogoMotion speed={4.5} /></div>
        )}
      </div>
    </Ctx.Provider>
  )
}

/** A normal <a href> that runs the cinematic transition on click (right-click / new tab still work). */
export const TLink = forwardRef(function TLink({ to, quick = false, onClick, children, ...rest }, ref) {
  const go = useGo()
  const handle = (e) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || rest.target === '_blank') return
    e.preventDefault()
    go(to, { quick })
  }
  return <a ref={ref} href={to} onClick={handle} {...rest}>{children}</a>
})
