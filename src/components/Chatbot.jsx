import { useEffect, useRef, useState } from 'react'
import { TLink } from './PageTransition.jsx'
import { Emblem } from './Motifs.jsx'
import Icon from './Icon.jsx'
import { botName, botQA } from '../data/chatbot.js'
import { sound } from '../utils/sound.js'
import { prefersReducedMotion } from '../utils/env.js'

/** Types a message out character by character (instant when reduced-motion is on). */
function Typed({ text, onTick }) {
  const [n, setN] = useState(prefersReducedMotion() ? text.length : 0)
  useEffect(() => {
    if (n >= text.length) return undefined
    const id = setTimeout(() => { setN((v) => Math.min(text.length, v + 2)); onTick?.() }, 16)
    return () => clearTimeout(id)
  }, [n, text, onTick])
  return <>{text.slice(0, n)}</>
}

const HELLO = 'سلام! من دستیار ROHI هستم. جواب‌هام از پیش نوشته شده‌ان (هوش مصنوعی نیستم)؛ یکی از سوال‌ها رو انتخاب کن.'

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState([{ id: 0, from: 'bot', text: HELLO }])
  const [typing, setTyping] = useState(false)
  const [asked, setAsked] = useState([])
  const body = useRef(null)
  const fab = useRef(null)
  const timer = useRef(0)
  const uid = useRef(1)

  const toBottom = () => { const el = body.current; if (el) el.scrollTop = el.scrollHeight }
  useEffect(toBottom, [msgs, typing, open])
  useEffect(() => () => clearTimeout(timer.current), [])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); fab.current?.focus() } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const ask = (qa) => {
    if (typing) return
    sound.play('click')
    setAsked((a) => (a.includes(qa.id) ? a : [...a, qa.id]))
    setMsgs((m) => [...m, { id: uid.current++, from: 'me', text: qa.q }])
    setTyping(true)
    timer.current = setTimeout(() => {
      const text = typeof qa.answer === 'function' ? qa.answer() : qa.answer
      setTyping(false)
      setMsgs((m) => [...m, { id: uid.current++, from: 'bot', text, action: qa.action, fresh: true }])
    }, prefersReducedMotion() ? 150 : 750)
  }

  const reset = () => { clearTimeout(timer.current); setTyping(false); setAsked([]); setMsgs([{ id: uid.current++, from: 'bot', text: HELLO }]) }
  const remaining = botQA.filter((q) => !asked.includes(q.id))
  const choices = remaining.length ? remaining : botQA

  return (
    <>
      <button ref={fab} type="button" className={`bot-fab ${open ? 'is-open' : ''}`} onClick={() => { sound.play('open'); setOpen((v) => !v) }} aria-expanded={open} aria-controls="bot-panel" aria-label={open ? 'بستن دستیار ROHI' : 'باز کردن دستیار ROHI'}>
        <Icon name={open ? 'close' : 'chat'} size={22} />
        <span className="bot-fab-ring" aria-hidden="true" />
      </button>

      <section id="bot-panel" className={`bot ${open ? 'is-open' : ''}`} aria-hidden={!open} aria-label="دستیار ROHI">
        <header className="bot-head">
          <div className="bot-avatar"><Emblem size={20} /></div>
          <div className="bot-id">
            <strong className="latin">{botName}</strong>
            <span><i className="bot-dot" /> پرسش و پاسخ آماده</span>
          </div>
          <button type="button" className="icon-btn" onClick={reset} aria-label="شروع دوباره" tabIndex={open ? 0 : -1}><Icon name="refresh" size={16} /></button>
        </header>

        <div className="bot-body" ref={body} aria-live="polite">
          {msgs.map((m) => (
            <div key={m.id} className={`bot-msg bot-msg--${m.from}`}>
              <p>{m.from === 'bot' && m.fresh ? <Typed text={m.text} onTick={toBottom} /> : m.text}</p>
              {m.action && (
                <TLink to={m.action.to} className="bot-action" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
                  {m.action.label} <Icon name="arrow" size={14} />
                </TLink>
              )}
            </div>
          ))}
          {typing && <div className="bot-msg bot-msg--bot bot-typing" aria-label="در حال نوشتن"><i /><i /><i /></div>}
        </div>

        <div className="bot-choices">
          {choices.map((q) => (
            <button key={q.id} type="button" className="chip" onClick={() => ask(q)} disabled={typing} tabIndex={open ? 0 : -1}>{q.q}</button>
          ))}
        </div>
      </section>
    </>
  )
}
