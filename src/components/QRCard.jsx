import { useMemo, useState } from 'react'
import QRCode from 'qrcode'
import { Emblem } from './Motifs.jsx'
import { socials } from '../data/socials.js'
import { profile } from '../data/profile.js'
import { sound } from '../utils/sound.js'

/** Branded, scannable QR. Targets are built from data/socials.js and data/profile.js. */
function useMatrix(text) {
  return useMemo(() => {
    try {
      const q = QRCode.create(text, { errorCorrectionLevel: 'H' })
      return { size: q.modules.size, get: (r, c) => q.modules.get(r, c) }
    } catch {
      return null
    }
  }, [text])
}

function QRSvg({ text }) {
  const m = useMatrix(text)
  if (!m) return <p className="qr-err">ساخت QR ممکن نشد.</p>
  const { size } = m
  const Q = 3 // quiet zone
  const total = size + Q * 2
  const mid = size / 2
  const hole = Math.max(5, Math.round(size * 0.2)) // centre area reserved for the emblem
  const inFinder = (r, c) => (r < 8 && c < 8) || (r < 8 && c >= size - 8) || (r >= size - 8 && c < 8)
  const cells = []
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!m.get(r, c) || inFinder(r, c)) continue
      if (Math.abs(r - mid + 0.5) < hole / 2 + 0.5 && Math.abs(c - mid + 0.5) < hole / 2 + 0.5) continue
      cells.push(<rect key={`${r}-${c}`} x={c + Q + 0.06} y={r + Q + 0.06} width="0.88" height="0.88" rx="0.28" />)
    }
  }
  const finder = (x, y) => (
    <g key={`${x}-${y}`} transform={`translate(${x + Q} ${y + Q})`}>
      <path fillRule="evenodd" d="M1.6 0h3.8A1.6 1.6 0 017 1.6v3.8A1.6 1.6 0 015.4 7H1.6A1.6 1.6 0 010 5.4V1.6A1.6 1.6 0 011.6 0zM1 1v5h5V1z" />
      <rect x="2" y="2" width="3" height="3" rx="0.8" />
    </g>
  )
  return (
    <svg className="qr-svg" viewBox={`0 0 ${total} ${total}`} role="img" aria-label={`QR code: ${text}`}>
      <rect width={total} height={total} rx="2" fill="#fff" />
      <g fill="#0b0b0e">
        {cells}
        {finder(0, 0)}{finder(size - 7, 0)}{finder(0, size - 7)}
      </g>
      <circle cx={total / 2} cy={total / 2} r={hole / 2 + 0.2} fill="#fff" />
    </svg>
  )
}

export default function QRCard() {
  const tg = socials.find((s) => s.id === 'telegram')
  const ig = socials.find((s) => s.id === 'instagram')
  const targets = [
    tg && { id: 'telegram', label: 'Telegram', url: tg.url },
    ig && { id: 'instagram', label: 'Instagram', url: ig.url },
    profile.siteUrl && { id: 'site', label: 'Website', url: profile.siteUrl },
  ].filter(Boolean)
  const [active, setActive] = useState(targets[0]?.id)
  const cur = targets.find((t) => t.id === active) || targets[0]
  if (!cur) return null

  return (
    <div className="qr glass">
      <div className="qr-tabs" role="tablist" aria-label="هدف QR">
        {targets.map((t) => (
          <button key={t.id} role="tab" type="button" aria-selected={t.id === cur.id} className={`chip ${t.id === cur.id ? 'is-on' : ''}`} onClick={() => { sound.play('tick'); setActive(t.id) }}>
            <span className="latin">{t.label}</span>
          </button>
        ))}
      </div>
      <div className="qr-frame">
        <i className="qr-corner qr-corner--a" /><i className="qr-corner qr-corner--b" /><i className="qr-corner qr-corner--c" /><i className="qr-corner qr-corner--d" />
        <QRSvg text={cur.url} />
        <span className="qr-emblem"><Emblem tone="orange" size={26} /></span>
        <span className="qr-scan" aria-hidden="true" />
      </div>
      <p className="qr-cap latin">SCAN → {cur.label.toUpperCase()}</p>
    </div>
  )
}
