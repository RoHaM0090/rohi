import { useSearchParams } from 'react-router-dom'
import SectionHead from '../components/SectionHead.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import Reveal from '../components/Reveal.jsx'
import Icon from '../components/Icon.jsx'
import { Emblem } from '../components/Motifs.jsx'
import { categories, projects } from '../data/projects.js'
import { sound } from '../utils/sound.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export default function Projects() {
  useDocumentTitle('پروژه‌ها')
  const [params, setParams] = useSearchParams()
  const visible = categories.filter((c) => c.showWhenEmpty || projects.some((p) => p.category === c.id))
  const requested = params.get('cat')
  const cat = visible.some((c) => c.id === requested) ? requested : 'all'
  const list = cat === 'all' ? projects : projects.filter((p) => p.category === cat)

  const pick = (id) => {
    sound.play('tick')
    setParams(id === 'all' ? {} : { cat: id }, { replace: true })
  }

  return (
    <div className="page container">
      <SectionHead as="h1" eyebrow="WORK // GALLERY" title="پروژه‌ها" sub="نتیجه‌ی نهایی مهم‌تر از هر توضیحی است." />

      <Reveal className="filters" role="tablist" aria-label="دسته‌بندی پروژه‌ها">
        <button type="button" role="tab" aria-selected={cat === 'all'} className={`chip ${cat === 'all' ? 'is-on' : ''}`} onClick={() => pick('all')}>
          همه <small className="latin">{projects.length}</small>
        </button>
        {visible.map((c) => (
          <button key={c.id} type="button" role="tab" aria-selected={cat === c.id} className={`chip ${cat === c.id ? 'is-on' : ''}`} onClick={() => pick(c.id)}>
            {c.label} <small className="latin">{projects.filter((p) => p.category === c.id).length}</small>
          </button>
        ))}
      </Reveal>

      {list.length ? (
        <div className="masonry" key={cat}>
          {list.map((p, i) => (
            <Reveal key={p.id} className="masonry-item" delay={(i % 4) * 70}><ProjectCard project={p} /></Reveal>
          ))}
        </div>
      ) : (
        <Reveal className="empty glass">
          <Emblem size={64} />
          <Icon name="wrench" size={28} />
          <h2>به‌زودی</h2>
          <p>نمونه‌کارهای این بخش در حال آماده‌سازی است.</p>
        </Reveal>
      )}
    </div>
  )
}
