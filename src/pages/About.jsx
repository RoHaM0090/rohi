import SectionHead from '../components/SectionHead.jsx'
import Reveal from '../components/Reveal.jsx'
import ToolDeck from '../components/ToolDeck.jsx'
import Stat from '../components/Stat.jsx'
import Btn from '../components/Btn.jsx'
import Icon from '../components/Icon.jsx'
import { BASE } from '../utils/env.js'
import { Emblem, PantherEyes, WrenchArt } from '../components/Motifs.jsx'
import { profile } from '../data/profile.js'
import { projects, categories } from '../data/projects.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

const INTERESTS = [
  ['code', 'Programming'], ['web', 'Web Development'], ['design', 'Graphic Design'], ['logo', 'Logo Design'],
  ['image', 'Thumbnail Design'], ['cube', 'Blender'], ['gear', 'CATIA'], ['blocks', 'Roblox'], ['cube', 'Minecraft'], ['cube', '3D'],
]

export default function About() {
  useDocumentTitle('درباره')
  const usedCats = categories.filter((c) => projects.some((p) => p.category === c.id)).length

  return (
    <div className="page container">
      <SectionHead as="h1" eyebrow="ABOUT // ROHI" title={<>{profile.nameFa} <span className="latin accent">— {profile.nickname}</span></>} sub="سازنده‌ای که بین چند دنیا رفت‌وآمد می‌کند." />

      <section className="split about-intro" aria-label="معرفی">
        <Reveal className="about-id glass">
          <img className="about-photo" src={`${BASE}assets/profile/roham-portrait.jpg`} alt={profile.photoAlt} width="190" height="190" decoding="async" />
          <Emblem size={56} />
          <p className="latin about-concept">{profile.concept}</p>
        </Reveal>
        <Reveal delay={120}>
          <p className="lead">
            من رهام پیرزادی هستم و با نام <strong className="latin">ROHI</strong> کار می‌کنم. بین چند دنیا رفت‌وآمد می‌کنم: برنامه‌نویسی و توسعه‌ی وب، طراحی گرافیک، سه‌بعدی و طراحی مهندسی.
          </p>
          <p>
            چیزی که دوست دارم این است که یک ایده را از صفر تا نتیجه‌ی نهایی خودم بسازم؛ یک سایت، یک لوگو، یک تامنیل یا یک رندر. برای همین اسم این مجموعه را «چاقوی سوئیسیِ خلاق» گذاشته‌ام: هر تیغه یک مهارت است.
          </p>
        </Reveal>
      </section>

      <section className="section-tight" aria-labelledby="about-deck">
        <SectionHead eyebrow="THE KNIFE" title={<span id="about-deck">تیغه‌ها</span>} sub="روی هر تیغه بزن تا ببینی چه کاری از دستش برمی‌آید." />
        <Reveal kind="fade"><ToolDeck /></Reveal>
      </section>

      <section className="section-tight" aria-label="آمار">
        <Reveal kind="fade" className="stats stats--wide">
          <Stat value={projects.length} label="نمونه‌کار ثبت‌شده" en="PROJECTS" />
          <Stat value={usedCats} label="دسته‌ی کاری" en="CATEGORIES" />
          <Stat value={INTERESTS.length} label="علاقه و مهارت" en="INTERESTS" />
        </Reveal>
      </section>

      <section className="section-tight" aria-labelledby="about-int">
        <SectionHead eyebrow="INTERESTS" title={<span id="about-int">چیزهایی که دوستشان دارم</span>} />
        <Reveal className="interests">
          {INTERESTS.map(([ic, t], i) => (
            <span key={t + i} className="tool-chip glass" style={{ '--i': i }}><Icon name={ic} size={18} /><span className="latin">{t}</span></span>
          ))}
        </Reveal>
      </section>

      <section className="section-tight" aria-labelledby="about-brand">
        <SectionHead eyebrow="BRAND" title={<span id="about-brand">پلنگ و آچار</span>} sub="دو نماد پشت هویت ROHI." />
        <div className="duo">
          <Reveal className="motif glass">
            <PantherEyes className="motif-art" />
            <h3>پلنگ سیاه</h3>
            <p>آرامش، دقت و قدرتِ کنترل‌شده. نگاهی که قبل از حرکت، همه‌چیز را می‌سنجد.</p>
          </Reveal>
          <Reveal className="motif glass" delay={120}>
            <WrenchArt className="motif-art motif-art--wrench" />
            <h3>آچارفرانسه</h3>
            <p>ساختن، تنظیم و دقت مهندسی. ابزاری که هر چیزی را قابل‌ساختن می‌کند.</p>
          </Reveal>
        </div>
      </section>

      <Reveal className="center section-tight">
        <Btn to="/projects" icon="arrow">ببین چه ساخته‌ام</Btn>
      </Reveal>
    </div>
  )
}
