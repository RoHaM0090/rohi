import { useState } from 'react'
import Icon from './Icon.jsx'
import { Emblem } from './Motifs.jsx'
import Btn from './Btn.jsx'
import { tools } from '../data/tools.js'
import { projectsByCategory } from '../data/projects.js'
import { sound } from '../utils/sound.js'

/** The "Creative Swiss Army Knife": pick a blade to see what it does. Edit blades in data/tools.js */
export default function ToolDeck() {
  const [id, setId] = useState(tools[0].id)
  const cur = tools.find((t) => t.id === id) || tools[0]
  const count = cur.category ? projectsByCategory(cur.category).length : 0

  return (
    <div className="deck">
      <div className="deck-orbit" role="tablist" aria-label="ابزارهای ROHI" aria-orientation="vertical">
        <div className="deck-core" aria-hidden="true"><Emblem size={84} /><i className="deck-ring" /></div>
        {tools.map((t, i) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={t.id === cur.id}
            className={`deck-tool ${t.id === cur.id ? 'is-on' : ''}`}
            style={{ '--a': `${(360 / tools.length) * i - 90}deg` }}
            onClick={() => { sound.play('tick'); setId(t.id) }}
            onFocus={() => setId(t.id)}
          >
            <Icon name={t.icon} size={20} />
            <span>{t.name}</span>
          </button>
        ))}
      </div>

      <div className="deck-detail glass" role="tabpanel" aria-live="polite" key={cur.id}>
        <p className="eyebrow latin">BLADE {String(tools.indexOf(cur) + 1).padStart(2, '0')} / {String(tools.length).padStart(2, '0')}</p>
        <h3>{cur.name}</h3>
        <p className="latin deck-en">{cur.en}</p>
        <p>{cur.text}</p>
        {cur.category && (
          <Btn to={`/projects?cat=${cur.category}`} variant="ghost" icon="arrow" quick>
            {count ? `${count} نمونه‌کار` : 'نمونه‌کارها'}
          </Btn>
        )}
      </div>
    </div>
  )
}
