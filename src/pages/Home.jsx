import Hero from '../components/Hero.jsx'
import Reveal from '../components/Reveal.jsx'
import SectionHead from '../components/SectionHead.jsx'
import Stat from '../components/Stat.jsx'
import Btn from '../components/Btn.jsx'
import Icon from '../components/Icon.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import SocialLinks from '../components/SocialLinks.jsx'
import { TLink } from '../components/PageTransition.jsx'
import { Emblem } from '../components/Motifs.jsx'
import { projects, categories } from '../data/projects.js'
import { skills } from '../data/skills.js'
import { profile } from '../data/profile.js'
import { getSocial } from '../data/socials.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export default function Home() {
  useDocumentTitle('')
  const featured = projects.filter((p) => p.featured).slice(0, 6)
  const usedCats = categories.filter((c) => projects.some((p) => p.category === c.id)).length
  const tg = getSocial('telegram')

  return (
    <>
      <Hero />

      {/* ABOUT — short intro */}
      <section className="section container" aria-labelledby="home-about">
        <div className="split">
          <div>
            <SectionHead eyebrow="01 // ABOUT" title={<span id="home-about">{profile.concept}</span>} sub="یک نفر، چند دنیا: کد، طراحی، سه‌بعدی و مهندسی؛ همه با هم." />
            <Reveal delay={120}>
              <p className="lead">
                من رهام پیرزادی هستم و با نام ROHI کار می‌کنم. دوست دارم یک ایده را از صفر تا نتیجه‌ی نهایی خودم بسازم؛ چه یک سایت باشد، چه یک لوگو، تامنیل یا یک رندر سه‌بعدی.
              </p>
            </Reveal>
            <Reveal delay={200}><Btn to="/about" variant="ghost" icon="arrow">بیشتر درباره‌ی ROHI</Btn></Reveal>
          </div>
          <Reveal kind="fade" delay={150} className="stats">
            <Stat value={projects.length} label="نمونه‌کار" en="PROJECTS" />
            <Stat value={usedCats} label="دسته‌ی کاری" en="CATEGORIES" />
            <Stat value={projects.filter((p) => p.category === 'web').length} label="پروژه‌ی وب" en="WEB" />
          </Reveal>
        </div>
      </section>

      {/* SKILLS — toolbelt */}
      <section className="section container" aria-labelledby="home-skills">
        <SectionHead eyebrow="02 // TOOLBELT" title={<span id="home-skills">جعبه‌ابزار</span>} sub="هر چیزی که برای ساختن لازم است." />
        <Reveal className="toolbelt">
          {skills.map((s, i) => (
            <TLink key={s.id} to="/skills" className="tool-chip glass" style={{ '--i': i }}>
              <Icon name={s.icon} size={18} /><span>{s.name}</span>
            </TLink>
          ))}
        </Reveal>
      </section>

      {/* PROJECTS */}
      {featured.length > 0 && (
        <section className="section container" aria-labelledby="home-projects">
          <SectionHead eyebrow="03 // SELECTED WORK" title={<span id="home-projects">پروژه‌های منتخب</span>} sub="نتیجه‌ها حرف می‌زنند." />
          <div className="pgrid">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 90}><ProjectCard project={p} /></Reveal>
            ))}
          </div>
          <Reveal className="center"><Btn to="/projects" icon="arrow">همه‌ی پروژه‌ها</Btn></Reveal>
        </section>
      )}

      {/* CONTACT */}
      <section className="section container" aria-labelledby="home-contact">
        <Reveal className="cta glass">
          <Emblem size={68} className="cta-emblem" />
          <p className="eyebrow latin">04 // CONTACT</p>
          <h2 id="home-contact" className="cta-title">بیا یک چیز جالب بسازیم.</h2>
          <p className="cta-sub">پیام بده؛ سریع‌ترین راه تلگرام است.</p>
          <div className="cta-actions">
            {tg && <Btn href={tg.url} external icon="telegram">پیام در تلگرام</Btn>}
            <Btn to="/contact" variant="ghost" icon="arrow">همه‌ی راه‌های ارتباطی</Btn>
          </div>
          <SocialLinks className="cta-socials" />
        </Reveal>
      </section>
    </>
  )
}
