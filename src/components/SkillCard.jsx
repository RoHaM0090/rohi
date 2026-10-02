import Icon from './Icon.jsx'
import { TLink } from './PageTransition.jsx'
import { useReveal } from '../hooks/useReveal.js'
import { useCountUp } from '../hooks/useCountUp.js'
import { useTilt } from '../hooks/useTilt.js'

const R = 44
const C = 2 * Math.PI * R

/** percentage === null  ->  "pending" state (real value not set yet in data/skills.js). */
export default function SkillCard({ skill, delay = 0 }) {
  const [rv, shown] = useReveal()
  const tilt = useTilt(6)
  const has = typeof skill.percentage === 'number'
  const value = useCountUp(has ? skill.percentage : 0, shown && has)

  return (
    <div ref={rv} className={`rv rv--up ${shown ? 'is-in' : ''}`} style={{ '--d': `${delay}ms` }}>
      <article
        ref={tilt.ref}
        onPointerMove={tilt.onPointerMove}
        onPointerLeave={tilt.onPointerLeave}
        className={`skill glass tilt ${has ? '' : 'is-pending'}`}
        data-cursor
      >
        <div className="skill-ring">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <circle className="skill-track" cx="50" cy="50" r={R} />
            <circle className="skill-fill" cx="50" cy="50" r={R} strokeDasharray={C} strokeDashoffset={C * (1 - value / 100)} />
          </svg>
          <div className="skill-icon"><Icon name={skill.icon} size={26} /></div>
        </div>
        <div className="skill-main">
          <h3 className="skill-name">{skill.name}</h3>
          <p className="skill-en latin">{skill.nameEn}</p>
          <p className="skill-note">{skill.note}</p>
          <div className="skill-bar" role="progressbar" aria-label={skill.name} aria-valuemin={0} aria-valuemax={100} aria-valuenow={has ? skill.percentage : undefined}>
            <i style={{ width: `${value}%` }} />
          </div>
        </div>
        <div className="skill-num latin">{has ? <>{value}<small>%</small></> : <span title="درصد واقعی در data/skills.js تنظیم می‌شود">—</span>}</div>
        {skill.category && (
          <TLink to={`/projects?cat=${skill.category}`} className="skill-link" aria-label={`نمونه‌کارهای ${skill.name}`} quick>
            <Icon name="arrow" size={16} />
          </TLink>
        )}
      </article>
    </div>
  )
}
