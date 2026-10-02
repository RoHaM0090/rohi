import { useReveal } from '../hooks/useReveal.js'
import { useCountUp } from '../hooks/useCountUp.js'

export default function Stat({ value, label, en }) {
  const [ref, shown] = useReveal()
  const n = useCountUp(value, shown)
  return (
    <div ref={ref} className="stat glass">
      <strong className="stat-n latin">{n}</strong>
      <span className="stat-l">{label}</span>
      {en && <span className="stat-en latin">{en}</span>}
    </div>
  )
}
