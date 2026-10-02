// ============================================================
//  چت‌بات ROHI — فقط پرسش و پاسخ‌های از پیش‌تعریف‌شده (بدون هوش مصنوعی)
//  برای افزودن سوال جدید یک آیتم به لیست اضافه کن.
//  answer می‌تواند متن یا تابعی باشد که متن برمی‌گرداند.
//  action: (اختیاری) دکمه‌ای زیر پاسخ { label, to }
// ============================================================
import { projects, categories } from './projects.js'
import { socials } from './socials.js'

export const botName = 'ROHI ASSISTANT'

export const botQA = [
  {
    id: 'who',
    q: 'ROHI کیه؟',
    answer:
      'ROHI نام برند «رهام پیرزادی» است؛ یک سازنده‌ی همه‌فن‌حریف که کدنویسی، طراحی گرافیک، سه‌بعدی و طراحی مهندسی را کنار هم می‌گذارد. شعارش: «Creative Swiss Army Knife».',
    action: { label: 'درباره‌ی ROHI', to: '/about' },
  },
  {
    id: 'skills',
    q: 'چه مهارت‌هایی داره؟',
    answer:
      'برنامه‌نویسی و توسعه‌ی وب، طراحی گرافیک (لوگو و تامنیل)، Blender برای سه‌بعدی، CATIA برای طراحی مهندسی و علاقه‌ی زیاد به دنیای Roblox و Minecraft.',
    action: { label: 'دیدن مهارت‌ها', to: '/skills' },
  },
  {
    id: 'projects',
    q: 'چه پروژه‌هایی ساخته؟',
    answer: () => {
      const used = categories.filter((c) => projects.some((p) => p.category === c.id)).map((c) => c.label)
      return `تا الان ${projects.length} نمونه‌کار در سایت ثبت شده: ${used.join('، ')}. همه‌شان را می‌توانی در صفحه‌ی پروژه‌ها ببینی.`
    },
    action: { label: 'گالری پروژه‌ها', to: '/projects' },
  },
  {
    id: 'tools',
    q: 'با چه چیزهایی کار می‌کنه؟',
    answer:
      'کد و ابزارهای وب برای ساخت سایت، Blender برای رندر و انیمیشن، CATIA برای طراحی قطعه و تمپلیت، و ابزارهای گرافیکی برای لوگو و تامنیل.',
    action: { label: 'ROHI LAB', to: '/lab' },
  },
  {
    id: 'contact',
    q: 'چطور با ROHI تماس بگیرم؟',
    answer: () => {
      const tg = socials.find((s) => s.id === 'telegram')
      const ig = socials.find((s) => s.id === 'instagram')
      return `سریع‌ترین راه تلگرام است (@${tg?.username}). اینستاگرام: ${ig?.username} — ایمیل و روبیکا هم در صفحه‌ی ارتباط هست.`
    },
    action: { label: 'صفحه‌ی ارتباط', to: '/contact' },
  },
]
