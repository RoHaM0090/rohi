import SectionHead from '../components/SectionHead.jsx'
import SkillCard from '../components/SkillCard.jsx'
import Reveal from '../components/Reveal.jsx'
import { skills } from '../data/skills.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export default function Skills() {
  useDocumentTitle('مهارت‌ها')
  const pending = skills.some((s) => s.percentage == null)
  return (
    <div className="page container">
      <SectionHead as="h1" eyebrow="SKILLS // 0 → 100" title="مهارت‌ها" sub="درصدها سطح واقعی من را نشان می‌دهند، نه عدد تزئینی." />
      {import.meta.env.DEV && pending && (
        <Reveal className="devnote latin">
          DEV NOTE — some skills have <code>percentage: null</code>. Open <code>src/data/skills.js</code> and set the real values (0–100).
        </Reveal>
      )}
      <div className="sgrid">
        {skills.map((s, i) => (<SkillCard key={s.id} skill={s} delay={(i % 3) * 80} />))}
      </div>
    </div>
  )
}
