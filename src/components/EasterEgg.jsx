import { useCallback, useEffect, useRef, useState } from 'react'
import { Emblem, Claws } from './Motifs.jsx'
import Icon from './Icon.jsx'
import { sound } from '../utils/sound.js'
import { isPanther, setPanther, unlock } from '../utils/panther.js'

/*
 * Hidden experience. Triggers:
 *   - Konami code on the keyboard (↑ ↑ ↓ ↓ ← → ← → B A)
 *   - 7 quick clicks on the tiny wrench in the footer
 * Reward: a cinematic "panther awakens" screen + the unlockable Panther Mode.
 */
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
const LINES = [
  '> panther.exe ........ awakened',
  '> wrench.calibrate() .. true',
  '> secret.found ........ ROHI-LAB',
]

export default function EasterEgg() {
  const [open, setOpen] = useState(false)
  const [panther, setP] = useState(isPanther())
  const buf = useRef([])
  const stage = useRef(null)
  const closeBtn = useRef(null)

  const trigger = useCallback(() => {
    unlock()
    setP(isPanther())
    setOpen(true)
    sound.play('egg')
    window.dispatchEvent(new Event('rohi:unlocked'))
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.target instanceof Element && e.target.closest('input,textarea,select')) return
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
      buf.current = [...buf.current, k].slice(-KONAMI.length)
      if (buf.current.length === KONAMI.length && KONAMI.every((x, i) => buf.current[i] === x)) { buf.current = []; trigger() }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('rohi:egg', trigger)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('rohi:egg', trigger) }
  }, [trigger])

  useEffect(() => {
    if (!open) return undefined
    document.documentElement.classList.add('egg-open')
    closeBtn.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => { document.documentElement.classList.remove('egg-open'); window.removeEventListener('keydown', onKey) }
  }, [open])

  const onMove = (e) => {
    const el = stage.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--ex', String(((e.clientX - r.left) / r.width - 0.5) * 2))
    el.style.setProperty('--ey', String(((e.clientY - r.top) / r.height - 0.5) * 2))
  }

  if (!open) return null
  return (
    <div className="egg" role="dialog" aria-modal="true" aria-label="راز مخفی ROHI" onPointerMove={onMove}>
      <Claws className="egg-claws" />
      <div className="egg-stage" ref={stage}>
        <div className="egg-logo">
          <Emblem tone="white" size={260} />
          <i className="egg-eye egg-eye--l" /><i className="egg-eye egg-eye--r" />
        </div>
        <p className="egg-badge latin">ACCESS GRANTED</p>
        <h2 className="egg-title">پلنگ بیدار شد.</h2>
        <p className="egg-text">تو رازِ مخفی ROHI رو پیدا کردی. این کار از هر ۱۰۰ نفر شاید یک نفر رو بتونه!</p>
        <ul className="egg-term latin" aria-hidden="true">
          {LINES.map((l, i) => <li key={l} style={{ '--i': i }}>{l}</li>)}
        </ul>
        <div className="egg-actions">
          <button type="button" className={`btn btn--primary ${panther ? 'is-on' : ''}`} aria-pressed={panther} onClick={() => { const n = !panther; setPanther(n); setP(n); sound.play('click') }}>
            <span className="btn-label">{panther ? 'غیرفعال کردن Panther Mode' : 'فعال کردن Panther Mode'}</span>
            <Icon name="spark" size={18} />
          </button>
          <button ref={closeBtn} type="button" className="btn btn--ghost" onClick={() => setOpen(false)}>
            <span className="btn-label">بستن</span>
            <Icon name="close" size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
