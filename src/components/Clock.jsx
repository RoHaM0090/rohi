import { useEffect, useState } from 'react'

const dateFmt = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

/** Live clock using the visitor's local time zone. variant: "full" | "compact" */
export default function Clock({ variant = 'full', className = '' }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const time = now.toLocaleTimeString('en-GB', { hour12: false })
  const tz = (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone } catch { return 'LOCAL' } })()
  return (
    <div className={`clock clock--${variant} ${className}`}>
      <time className="clock-time latin" dateTime={now.toISOString()}>{time}</time>
      {variant === 'full' && (
        <span className="clock-meta">
          <span>{dateFmt.format(now)}</span>
          <span className="latin clock-tz">{tz}</span>
        </span>
      )}
    </div>
  )
}
