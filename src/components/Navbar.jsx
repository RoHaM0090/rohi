import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { TLink } from './PageTransition.jsx'
import { Emblem } from './Motifs.jsx'
import Icon from './Icon.jsx'
import Clock from './Clock.jsx'
import SoundToggle from './SoundToggle.jsx'
import SocialLinks from './SocialLinks.jsx'
import { NAV } from '../data/nav.js'
import { sound } from '../utils/sound.js'

const isActive = (to, path) => (to === '/' ? path === '/' : path === to || path.startsWith(`${to}/`))

export default function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [ind, setInd] = useState({ x: 0, w: 0, on: false })
  const listRef = useRef(null)

  const measure = useCallback(() => {
    const a = listRef.current?.querySelector('a.is-active')
    if (!a) { setInd((s) => ({ ...s, on: false })); return }
    setInd({ x: a.offsetLeft, w: a.offsetWidth, on: true })
  }, [])

  useLayoutEffect(() => { measure() }, [pathname, measure])
  useEffect(() => {
    window.addEventListener('resize', measure)
    document.fonts?.ready.then(measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
    if (!open) return undefined
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
        <TLink to="/" className="nav-brand" aria-label="ROHI — صفحه‌ی اصلی">
          <Emblem size={26} />
          <span className="nav-brand-text latin">ROHI</span>
        </TLink>

        <nav className="nav-links" aria-label="منوی اصلی" ref={listRef}>
          <span className="nav-ind" style={{ width: ind.w, transform: `translateX(${ind.x}px)`, opacity: ind.on ? 1 : 0 }} aria-hidden="true" />
          <ul>
            {NAV.map((n) => (
              <li key={n.to}>
                <TLink to={n.to} className={`${isActive(n.to, pathname) ? 'is-active' : ''} ${n.lab ? 'is-lab latin' : ''}`} aria-current={isActive(n.to, pathname) ? 'page' : undefined}>
                  {n.label}
                </TLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-tools">
          <Clock variant="compact" className="nav-clock" />
          <SoundToggle />
          <button
            type="button"
            className="icon-btn nav-burger"
            aria-label={open ? 'بستن منو' : 'باز کردن منو'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => { sound.play('open'); setOpen((v) => !v) }}
          >
            <Icon name={open ? 'close' : 'menu'} size={20} />
          </button>
        </div>
      </header>

      <div id="mobile-menu" className={`mmenu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <nav aria-label="منوی موبایل">
          <ul>
            {NAV.map((n, i) => (
              <li key={n.to} style={{ '--i': i }}>
                <TLink to={n.to} tabIndex={open ? 0 : -1} className={isActive(n.to, pathname) ? 'is-active' : ''} onClick={() => setOpen(false)}>
                  <span className="mmenu-idx latin">0{i + 1}</span>
                  <span className="mmenu-label">{n.label}</span>
                  <span className="mmenu-en latin">{n.en}</span>
                </TLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mmenu-foot">
          <SocialLinks />
          <Clock variant="full" />
        </div>
      </div>
    </>
  )
}
