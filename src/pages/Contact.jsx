import { useState } from 'react'
import SectionHead from '../components/SectionHead.jsx'
import Reveal from '../components/Reveal.jsx'
import Btn from '../components/Btn.jsx'
import Icon from '../components/Icon.jsx'
import QRCard from '../components/QRCard.jsx'
import { useToast } from '../components/Toast.jsx'
import { socials, phone, contactTargets } from '../data/socials.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      ta.remove()
      return ok
    } catch {
      return false
    }
  }
}

export default function Contact() {
  useDocumentTitle('ارتباط')
  const toast = useToast()
  const [form, setForm] = useState({ name: '', reply: '', message: '' })
  const [showPhone, setShowPhone] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const compose = () => {
    const lines = [form.message.trim()]
    if (form.name.trim()) lines.push('', `— ${form.name.trim()}`)
    if (form.reply.trim()) lines.push(`راه تماس: ${form.reply.trim()}`)
    return lines.join('\n')
  }
  const valid = () => {
    if (form.message.trim().length < 3) { toast('لطفاً پیامت را بنویس.', { type: 'err' }); return false }
    return true
  }
  const viaTelegram = () => {
    if (!valid()) return
    window.open(`https://t.me/${contactTargets.telegramUser}?text=${encodeURIComponent(compose())}`, '_blank', 'noopener,noreferrer')
    toast('تلگرام باز شد؛ پیام را آنجا ارسال کن.', { icon: 'telegram' })
  }
  const viaEmail = () => {
    if (!valid()) return
    const subject = encodeURIComponent('پیام از وب‌سایت ROHI')
    window.location.href = `mailto:${contactTargets.email}?subject=${subject}&body=${encodeURIComponent(compose())}`
    toast('برنامه‌ی ایمیل باز شد.', { icon: 'mail' })
  }
  const copy = async (text, label) => {
    const ok = await copyText(text)
    toast(ok ? `${label} کپی شد.` : 'کپی نشد؛ دستی کپی کن.', { type: ok ? 'ok' : 'err', icon: ok ? 'copy' : 'close' })
  }

  return (
    <div className="page container">
      <SectionHead as="h1" eyebrow="CONTACT // OPEN CHANNEL" title="ارتباط با ROHI" sub="هر راهی که راحت‌تری؛ جواب می‌دهم." />

      <div className="contact-grid">
        <div className="contact-left">
          <ul className="channels">
            {socials.map((s, i) => {
              const external = !s.url.startsWith('mailto:')
              return (
                <Reveal as="li" key={s.id} delay={i * 70}>
                  <div className="channel glass">
                    <a className="channel-main" href={s.url} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
                      <span className="channel-ic"><Icon name={s.icon} size={22} /></span>
                      <span className="channel-txt">
                        <strong className="latin">{s.label}</strong>
                        <span className="latin">{s.id === 'email' ? s.username : `@${s.username}`}</span>
                      </span>
                    </a>
                    <button type="button" className="icon-btn" onClick={() => copy(s.id === 'email' ? s.username : s.username, s.label)} aria-label={`کپی ${s.label}`}>
                      <Icon name="copy" size={16} />
                    </button>
                  </div>
                </Reveal>
              )
            })}
            {phone.enabled && (
              <Reveal as="li" delay={socials.length * 70}>
                <div className="channel glass">
                  {showPhone ? (
                    <a className="channel-main" href={`tel:${phone.tel}`}>
                      <span className="channel-ic"><Icon name="phone" size={22} /></span>
                      <span className="channel-txt"><strong>تماس تلفنی</strong><span className="latin" dir="ltr">{phone.display}</span></span>
                    </a>
                  ) : (
                    <button type="button" className="channel-main" onClick={() => setShowPhone(true)}>
                      <span className="channel-ic"><Icon name="phone" size={22} /></span>
                      <span className="channel-txt"><strong>تماس تلفنی</strong><span>برای دیدن شماره بزن</span></span>
                    </button>
                  )}
                  {showPhone && (
                    <button type="button" className="icon-btn" onClick={() => copy(phone.tel, 'شماره')} aria-label="کپی شماره"><Icon name="copy" size={16} /></button>
                  )}
                </div>
              </Reveal>
            )}
          </ul>
          {phone.enabled && (
            <Reveal delay={200}><Btn href={`tel:${phone.tel}`} icon="phone" className="call-btn">تماس بگیر</Btn></Reveal>
          )}
        </div>

        <Reveal className="form glass" delay={100}>
          <h2 className="form-title">پیام بنویس</h2>
          <div className="field">
            <label htmlFor="c-name">نام (اختیاری)</label>
            <input id="c-name" value={form.name} onChange={set('name')} autoComplete="name" />
          </div>
          <div className="field">
            <label htmlFor="c-reply">راه تماس با تو (اختیاری)</label>
            <input id="c-reply" value={form.reply} onChange={set('reply')} placeholder="آیدی تلگرام، ایمیل…" />
          </div>
          <div className="field">
            <label htmlFor="c-msg">پیام</label>
            <textarea id="c-msg" rows={5} value={form.message} onChange={set('message')} required />
          </div>
          <div className="form-actions">
            <Btn onClick={viaTelegram} icon="telegram">ارسال با تلگرام</Btn>
            <Btn onClick={viaEmail} variant="ghost" icon="mail">ارسال با ایمیل</Btn>
          </div>
          <p className="form-note">
            این سایت سرور و پایگاه‌داده ندارد و پیام‌ها ذخیره نمی‌شوند. با دکمه‌ها، پیام تو در تلگرام یا برنامه‌ی ایمیل خودت آماده‌ی ارسال می‌شود.
          </p>
        </Reveal>
      </div>

      <section className="section-tight" aria-labelledby="qr-h">
        <SectionHead eyebrow="QR // SCAN" title={<span id="qr-h">اسکن کن</span>} sub="با دوربین گوشی اسکن کن تا مستقیم به ROHI برسی." />
        <Reveal className="center"><QRCard /></Reveal>
      </section>
    </div>
  )
}
