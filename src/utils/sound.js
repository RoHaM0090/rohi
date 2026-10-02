// Subtle UI sounds, synthesized with WebAudio (no audio files, no downloads).
// Everything is very quiet and the user can mute it from the navbar.
const KEY = 'rohi-sound'
let ctx = null
let enabled = true
const listeners = new Set()

try {
  const saved = localStorage.getItem(KEY)
  if (saved !== null) enabled = saved === '1'
} catch { /* storage may be blocked */ }

const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

function tone({ f = 600, f2 = f, dur = 0.08, vol = 0.03, type = 'sine', delay = 0 }) {
  const c = getCtx()
  if (!c) return
  const t = c.currentTime + delay
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.setValueAtTime(f, t)
  if (f2 !== f) o.frequency.exponentialRampToValueAtTime(f2, t + dur)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g).connect(c.destination)
  o.start(t)
  o.stop(t + dur + 0.02)
}

const SOUNDS = {
  click: () => tone({ f: 920, f2: 640, dur: 0.07, vol: 0.035 }),
  tick: () => tone({ f: 1400, dur: 0.03, vol: 0.015, type: 'triangle' }),
  nav: () => { tone({ f: 180, f2: 720, dur: 0.28, vol: 0.03, type: 'sawtooth' }) },
  toast: () => { tone({ f: 660, dur: 0.08, vol: 0.03 }); tone({ f: 990, dur: 0.12, vol: 0.03, delay: 0.09 }) },
  open: () => tone({ f: 300, f2: 800, dur: 0.14, vol: 0.03, type: 'triangle' }),
  egg: () => [330, 440, 554, 660, 880].forEach((f, i) => tone({ f, dur: 0.18, vol: 0.035, delay: i * 0.09, type: 'triangle' })),
}

export const sound = {
  get enabled() { return enabled },
  play(name) {
    if (!enabled || reduced()) return
    try { SOUNDS[name]?.() } catch { /* ignore */ }
  },
  toggle() {
    enabled = !enabled
    try { localStorage.setItem(KEY, enabled ? '1' : '0') } catch { /* ignore */ }
    listeners.forEach((l) => l(enabled))
    if (enabled) { try { SOUNDS.click() } catch { /* ignore */ } }
    return enabled
  },
  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn) },
}
