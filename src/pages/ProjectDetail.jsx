import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Btn from '../components/Btn.jsx'
import Icon from '../components/Icon.jsx'
import Reveal from '../components/Reveal.jsx'
import { TLink } from '../components/PageTransition.jsx'
import { getCategory, getProject, projects } from '../data/projects.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import NotFound from './NotFound.jsx'

export default function ProjectDetail() {
  const { id } = useParams()
  const project = getProject(id)
  const [zoom, setZoom] = useState(false)
  useDocumentTitle(project?.title)

  useEffect(() => {
    if (!zoom) return undefined
    const onKey = (e) => { if (e.key === 'Escape') setZoom(false) }
    window.addEventListener('keydown', onKey)
    document.documentElement.classList.add('menu-open')
    return () => { window.removeEventListener('keydown', onKey); document.documentElement.classList.remove('menu-open') }
  }, [zoom])

  if (!project) return <NotFound />
  const cat = getCategory(project.category)
  const i = projects.indexOf(project)
  const prev = projects[(i - 1 + projects.length) % projects.length]
  const next = projects[(i + 1) % projects.length]

  return (
    <article className="page container detail">
      <TLink to={`/projects?cat=${project.category}`} quick className="back"><Icon name="arrow" size={16} /> بازگشت به پروژه‌ها</TLink>

      <Reveal kind="mask" className="detail-media glass">
        <button type="button" className="detail-zoom" onClick={() => setZoom(true)} aria-label="نمایش تمام‌صفحه‌ی تصویر" data-cursor>
          <img src={project.image} alt={project.title} decoding="async" />
        </button>
        <i className="corner corner--tl" /><i className="corner corner--tr" /><i className="corner corner--bl" /><i className="corner corner--br" />
      </Reveal>

      <Reveal className="detail-info" delay={100}>
        <p className="eyebrow latin">{cat?.labelEn || project.category} // {String(i + 1).padStart(2, '0')}</p>
        <h1 className="detail-title">{project.title}</h1>
        <p className="lead">{project.shortDescription}</p>
        <div className="detail-meta">
          <span className="chip is-on">{cat?.label || project.category}</span>
          {project.technologies?.map((t) => (<span key={t} className="chip latin">{t}</span>))}
        </div>
        {project.link && <Btn href={project.link} external icon="external">مشاهده‌ی پروژه</Btn>}
      </Reveal>

      <nav className="detail-nav" aria-label="پروژه‌ی قبلی و بعدی">
        <TLink to={`/projects/${prev.id}`} quick className="dn glass"><Icon name="arrow" size={16} /><span><small>قبلی</small>{prev.title}</span></TLink>
        <TLink to={`/projects/${next.id}`} quick className="dn dn--next glass"><span><small>بعدی</small>{next.title}</span><Icon name="arrow" size={16} className="flip" /></TLink>
      </nav>

      {zoom && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={project.title} onClick={() => setZoom(false)}>
          <img src={project.image} alt={project.title} />
          <button type="button" className="icon-btn lightbox-x" aria-label="بستن" onClick={() => setZoom(false)}><Icon name="close" size={20} /></button>
        </div>
      )}
    </article>
  )
}
