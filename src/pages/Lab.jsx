import { useEffect, useRef, useState } from 'react'
import SectionHead from '../components/SectionHead.jsx'
import Reveal from '../components/Reveal.jsx'
import Icon from '../components/Icon.jsx'
import { PantherEyes, WrenchArt, Emblem } from '../components/Motifs.jsx'
import { sound } from '../utils/sound.js'
import { isPanther, isUnlocked, setPanther } from '../utils/panther.js'
import { prefersReducedMotion } from '../utils/env.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

/* ---------- 01 Panther Eyes ---------- */
function EyesLab() {
  const ref = useRef(null)
  const move = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--ex', String(Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2))))
    el.style.setProperty('--ey', String(Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2))))
  }
  return (
    <div ref={ref} className="lab-eyes" onPointerMove={move} data-cursor>
      <PantherEyes className="lab-eyes-art" />
      <p className="lab-hint">موس را حرکت بده</p>
    </div>
  )
}

/* ---------- 02 Wrench calibrator ---------- */
function WrenchLab() {
  const [deg, setDeg] = useState(0)
  const torque = Math.round(deg * 1.8)
  return (
    <div className="lab-wrench">
      <div className="lab-wrench-stage" style={{ '--r': `${deg}deg` }}>
        <WrenchArt className="lab-wrench-art" />
      </div>
      <label className="lab-range">
        <span className="latin">ANGLE {String(deg).padStart(2, '0')}°</span>
        <input type="range" min="0" max="90" value={deg} onChange={(e) => setDeg(Number(e.target.value))} aria-label="زاویه‌ی آچار" />
        <span className="latin lab-readout">TORQUE {torque} N·m <em>(toy)</em></span>
      </label>
    </div>
  )
}

/* ---------- 03 Spark sandbox ---------- */
function SparkLab() {
  const cv = useRef(null)
  const sparks = useRef([])
  const raf = useRef(0)

  const loop = () => {
    const c = cv.current
    if (!c) { raf.current = 0; return }
    const ctx = c.getContext('2d')
    ctx.clearRect(0, 0, c.width, c.height)
    sparks.current = sparks.current.filter((s) => s.life > 0)
    for (const s of sparks.current) {
      s.x += s.vx; s.y += s.vy; s.vy += 0.06; s.life -= 0.02
      ctx.fillStyle = `rgba(255,${120 + Math.round(s.life * 100)},30,${Math.max(0, s.life)})`
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r * s.life + 0.4, 0, 6.283); ctx.fill()
    }
    raf.current = sparks.current.length ? requestAnimationFrame(loop) : 0
  }
  const burst = (x, y) => {
    const n = prefersReducedMotion() ? 8 : 26
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283, v = 1 + Math.random() * 3.2
      sparks.current.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1, r: 1.5 + Math.random() * 2.2, life: 1 })
    }
    sound.play('tick')
    if (!raf.current) raf.current = requestAnimationFrame(loop)
  }
  const onClick = (e) => {
    const c = cv.current
    const r = c.getBoundingClientRect()
    burst((e.clientX - r.left) * (c.width / r.width), (e.clientY - r.top) * (c.height / r.height))
  }
  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); burst(cv.current.width / 2, cv.current.height / 2) }
  }
  useEffect(() => {
    const c = cv.current
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const r = c.getBoundingClientRect()
    c.width = r.width * dpr; c.height = r.height * dpr
    return () => cancelAnimationFrame(raf.current)
  }, [])

  return (
    <div className="lab-sparks" role="button" tabIndex={0} aria-label="جرقه بساز" onClick={onClick} onKeyDown={onKey} data-cursor>
      <canvas ref={cv} />
      <p className="lab-hint">کلیک کن</p>
    </div>
  )
}

/* ---------- 04 Locked ---------- */
function SecretLab() {
  const [open, setOpen] = useState(isUnlocked())
  const [on, setOn] = useState(isPanther())
  useEffect(() => {
    const h = () => { setOpen(true); setOn(isPanther()) }
    window.addEventListener('rohi:unlocked', h)
    return () => window.removeEventListener('rohi:unlocked', h)
  }, [])

  if (!open) {
    return (
      <div className="lab-locked">
        <Icon name="lock" size={30} />
        <h3 className="latin">LOCKED</h3>
        <p>یک راز اینجا پنهان است. شاید با یک ترتیب قدیمی از کلیدها (یا یک آچار کوچک) پیدایش کنی.</p>
      </div>
    )
  }
  return (
    <div className="lab-secret">
      <Emblem size={56} />
      <h3 className="latin">PANTHER MODE</h3>
      <p>رازت را پیدا کردی. این حالت تم سایت را تیره‌تر و پرانرژی‌تر می‌کند و یک نور دنبال موس می‌آید.</p>
      <button type="button" className={`btn btn--primary ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => { const n = !on; setPanther(n); setOn(n); sound.play('click') }}>
        <span className="btn-label">{on ? 'خاموش' : 'روشن'}</span><Icon name="spark" size={18} />
      </button>
    </div>
  )
}

export default function Lab() {
  useDocumentTitle('ROHI LAB')
  const exps = [
    ['EXP 01', 'چشم‌های پلنگ', <EyesLab key="a" />],
    ['EXP 02', 'کالیبراسیون آچار', <WrenchLab key="b" />],
    ['EXP 03', 'جرقه‌ساز', <SparkLab key="c" />],
    ['EXP ???', 'ناشناخته', <SecretLab key="d" />],
  ]
  return (
    <div className="page container">
      <SectionHead as="h1" eyebrow="ROHI LAB // EXPERIMENTS" title="ROHI LAB" sub="آزمایشگاه کوچک من؛ اینجا چیزهای تجربی و بازیگوش قرار می‌گیرند." />
      <div className="lab-grid">
        {exps.map(([tag, title, body], i) => (
          <Reveal key={tag} className="lab-card glass" delay={i * 80}>
            <p className="eyebrow latin">{tag}</p>
            <h2 className="lab-title">{title}</h2>
            <div className="lab-body">{body}</div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
