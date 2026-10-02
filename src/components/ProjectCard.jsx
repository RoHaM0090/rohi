import { TLink } from './PageTransition.jsx'
import Icon from './Icon.jsx'
import { getCategory } from '../data/projects.js'
import { useTilt } from '../hooks/useTilt.js'

export default function ProjectCard({ project, className = '' }) {
  const tilt = useTilt(5)
  const cat = getCategory(project.category)
  return (
    <TLink
      to={`/projects/${project.id}`}
      quick
      ref={tilt.ref}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
      className={`pcard tilt ${className}`}
      aria-label={`${project.title} — مشاهده‌ی پروژه`}
      data-cursor
    >
      <div className="pcard-media" style={{ aspectRatio: project.aspect || '16 / 9' }}>
        <img src={project.thumb || project.image} alt={project.title} loading="lazy" decoding="async" draggable="false" />
        <span className="pcard-sweep" aria-hidden="true" />
      </div>
      <div className="pcard-info">
        <span className="pcard-cat latin">{cat?.labelEn || project.category}</span>
        <h3 className="pcard-title">{project.title}</h3>
        <span className="pcard-go" aria-hidden="true"><Icon name="arrow" size={16} /></span>
      </div>
    </TLink>
  )
}
