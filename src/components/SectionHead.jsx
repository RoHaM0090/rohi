import Reveal from './Reveal.jsx'

/** Section / page heading. Use as="h1" on inner pages. */
export default function SectionHead({ eyebrow, title, sub, as: H = 'h2', className = '' }) {
  return (
    <Reveal className={`shead ${className}`}>
      {eyebrow && <p className="eyebrow latin">{eyebrow}</p>}
      <H className="shead-title">{title}</H>
      {sub && <p className="shead-sub">{sub}</p>}
    </Reveal>
  )
}
