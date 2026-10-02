import { useRef } from 'react'
import { TLink } from './PageTransition.jsx'
import { Emblem } from './Motifs.jsx'
import Icon from './Icon.jsx'
import SocialLinks from './SocialLinks.jsx'
import Clock from './Clock.jsx'
import { NAV } from '../data/nav.js'
import { profile } from '../data/profile.js'

export default function Footer() {
  const clicks = useRef({ n: 0, t: 0 })
  // Hidden: 7 quick clicks on the tiny wrench wake the panther (see EasterEgg.jsx)
  const poke = () => {
    const now = Date.now()
    const c = clicks.current
    c.n = now - c.t < 1800 ? c.n + 1 : 1
    c.t = now
    if (c.n >= 7) { c.n = 0; window.dispatchEvent(new Event('rohi:egg')) }
  }
  return (
    <footer className="footer">
      <div className="footer-glow" aria-hidden="true" />
      <div className="container footer-grid">
        <div className="footer-id">
          <div className="footer-logo"><Emblem size={44} /><span className="footer-word latin">ROHI</span></div>
          <p className="footer-name latin">{profile.nameEn}</p>
          <p className="footer-statement">{profile.statement}</p>
          <SocialLinks />
        </div>
        <nav className="footer-nav" aria-label="منوی پایین سایت">
          <h2 className="footer-h latin">NAVIGATE</h2>
          <ul>
            {NAV.map((n) => (<li key={n.to}><TLink to={n.to}>{n.label}</TLink></li>))}
          </ul>
        </nav>
        <div className="footer-sys">
          <h2 className="footer-h latin">SYSTEM</h2>
          <Clock variant="full" />
          <p className="footer-tag latin">{profile.title}</p>
        </div>
      </div>
      <div className="container footer-bar">
        <span className="latin">© {new Date().getFullYear()} {profile.nameEn} — ROHI</span>
        <button type="button" className="footer-wrench" onClick={poke} aria-label="آچار" tabIndex={0}>
          <Icon name="wrench" size={14} />
        </button>
      </div>
    </footer>
  )
}
