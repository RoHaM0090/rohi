import { useRef, useState } from 'react'
import Btn from './Btn.jsx'
import Icon from './Icon.jsx'
import Clock from './Clock.jsx'
import { Emblem, WrenchArt } from './Motifs.jsx'
import { profile } from '../data/profile.js'
import { skills } from '../data/skills.js'
import { useTilt } from '../hooks/useTilt.js'

export default function Hero() {
  const tilt = useTilt(7)
  const coord = useRef(null)
  const raf = useRef(0)
  const [photoOk, setPhotoOk] = useState(true)

  const onMove = (e) => {
    if (raf.current || !coord.current) return
    raf.current = requestAnimationFrame(() => {
      raf.current = 0
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      if (coord.current) coord.current.textContent = `X ${x >= 0 ? '+' : ''}${x.toFixed(2)}  Y ${y >= 0 ? '+' : ''}${y.toFixed(2)}`
    })
  }

  return (
    <section className="hero" aria-labelledby="hero-title" onPointerMove={onMove}>
      <div className="hero-bg" aria-hidden="true">
        <i className="hero-orb" />
        <WrenchArt className="hero-wrench" />
      </div>

      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="hero-eyebrow latin"><i className="live-dot" /> ROHI SYSTEM // ONLINE</p>
          <h1 id="hero-title">
            <span className="hero-greet">{profile.greeting}</span>
            <span className="hero-name latin" aria-label={profile.nickname}>
              {profile.nickname.split('').map((c, i) => (
                <span key={i} className="hero-letter" style={{ '--i': i }} aria-hidden="true">{c}</span>
              ))}
            </span>
          </h1>
          <p className="hero-tag">{profile.tagline}</p>
          <div className="hero-cta">
            <Btn to="/projects" icon="arrow">مشاهده‌ی پروژه‌ها</Btn>
            <Btn to="/contact" variant="ghost" icon="send">ارتباط با من</Btn>
          </div>
          <div className="hero-meta latin">
            <span>{profile.nameEn}</span>
            <span className="sep" />
            <span>{profile.title}</span>
          </div>
        </div>

        <div className="hero-visual" ref={tilt.ref} onPointerMove={tilt.onPointerMove} onPointerLeave={tilt.onPointerLeave}>
          <div className="hero-frame glass">
            <i className="corner corner--tl" /><i className="corner corner--tr" /><i className="corner corner--bl" /><i className="corner corner--br" />
            <div className="hero-photo">
              {photoOk ? (
                <img src={profile.heroPhoto} alt={profile.photoAlt} onError={() => setPhotoOk(false)} decoding="async" fetchpriority="high" />
              ) : (
                <div className="hero-fallback">
                  <Emblem tone="white" size={230} />
                  {import.meta.env.DEV && <span className="hero-hint latin">PHOTO → public/assets/profile/roham.jpg</span>}
                </div>
              )}
              <span className="hero-light" aria-hidden="true" />
              <span className="hero-scan" aria-hidden="true" />
            </div>
          </div>

          <div className="fpanel fpanel--a glass latin"><Icon name="code" size={15} /><span>CODE · DESIGN · 3D</span></div>
          <div className="fpanel fpanel--b glass latin"><Icon name="cube" size={15} /><span>BLENDER</span></div>
          <div className="fpanel fpanel--c glass latin"><span className="live-dot" /><span ref={coord}>X +0.00  Y +0.00</span></div>
          <div className="fpanel fpanel--d glass"><Clock variant="compact" /></div>
        </div>
      </div>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track latin">
          {[0, 1].map((k) => (
            <ul key={k}>
              {skills.map((s) => (<li key={s.id}>{s.nameEn}<i /></li>))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
