// ============================================================
//  پروژه‌ها — برای افزودن پروژه‌ی جدید فقط یک آیتم به آخر لیست اضافه کن.
//
//  id               : شناسه‌ی یکتا (انگلیسی و بدون فاصله) — در آدرس صفحه استفاده می‌شود
//  title            : عنوان
//  category         : یکی از id های categories (web / logo / thumbnail / 3d / catia / gaming)
//  image            : مسیر عکس نهایی (داخل public/assets/projects/...)
//  thumb            : (اختیاری) نسخه‌ی سبک عکس برای کارت‌ها
//  shortDescription : توضیح کوتاه
//  technologies     : (اختیاری) لیست ابزارها، مثلاً ['Blender']
//  link             : (اختیاری) لینک پروژه
//  aspect           : (اختیاری) نسبت تصویر برای کارت، مثل '1/1' — پیش‌فرض '16/9'
//  featured         : (اختیاری) true = در صفحه‌ی اصلی نمایش داده شود
// ============================================================

export const categories = [
  { id: 'web', label: 'وب', labelEn: 'Web' },
  { id: 'logo', label: 'لوگو', labelEn: 'Logo' },
  { id: 'thumbnail', label: 'تامنیل', labelEn: 'Thumbnail' },
  { id: '3d', label: 'سه‌بعدی', labelEn: '3D' },
  { id: 'catia', label: 'CATIA', labelEn: 'CATIA', showWhenEmpty: true },
  { id: 'gaming', label: 'گیمینگ', labelEn: 'Gaming' },
]

const P = '/assets/projects'
const img = (cat, name) => ({ image: `${P}/${cat}/${name}.webp`, thumb: `${P}/${cat}/${name}-thumb.webp` })

export const projects = [
  // ---------- WEB ----------
  { id: 'tak-sazan', title: 'تک سازان', category: 'web', ...img('web', 'tak-sazan'),
    shortDescription: 'وب‌سایت معرفی خدمات تزریق پلاستیک و قالب‌سازی.',
    link: 'https://tak-sazzan.netlify.app', featured: true },
  { id: 'nova-graphic', title: 'NOVA GRAPHIC', category: 'web', ...img('web', 'nova-graphic'),
    shortDescription: 'وب‌سایت استودیوی طراحی گرافیک حرفه‌ای.',
    link: 'https://nova-graphic.netlify.app', featured: true },
  { id: 'robx-time', title: 'ربکس تایم', category: 'web', ...img('web', 'robx-time'),
    shortDescription: 'ابزار وب برای تحلیل اکانت روبلاکس.',
    link: 'https://robx-time.netlify.app', featured: true },

  // ---------- LOGO ----------
  { id: 'logo-01', title: 'لوگو — آبی', category: 'logo', ...img('design', 'logo-01'), aspect: '1/1', shortDescription: 'طراحی نشان گرافیکی با فضای آبی و نئونی.' },
  { id: 'logo-02', title: 'لوگو — سبز', category: 'logo', ...img('design', 'logo-02'), aspect: '1/1', shortDescription: 'لوگوی ROHI با تم سبز.', featured: true },
  { id: 'logo-03', title: 'لوگو — قرمز', category: 'logo', ...img('design', 'logo-03'), aspect: '1/1', shortDescription: 'لوگوی ROHI با تم قرمز.' },
  { id: 'logo-04', title: 'لوگو — طلایی', category: 'logo', ...img('design', 'logo-04'), aspect: '1/1', shortDescription: 'لوگوی ROHI با حس طلایی و فلزی.' },
  { id: 'logo-05', title: 'نشان — بنفش', category: 'logo', ...img('design', 'logo-05'), aspect: '1/1', shortDescription: 'طرح نشان گرافیکی در رنگ بنفش و آبی.' },
  { id: 'logo-06', title: 'گرافیک — سبز و مشکی', category: 'logo', ...img('design', 'logo-06'), aspect: '1/1', shortDescription: 'ترکیب‌بندی گرافیکی با تم سبز.' },

  // ---------- THUMBNAIL ----------
  { id: 'thumbnail-01', title: 'تامنیل ماینکرفت — ASMR', category: 'thumbnail', ...img('minecraft', 'thumbnail-01'), shortDescription: 'تامنیل ویدیوی ASMR ماینکرفت.', featured: true },
  { id: 'thumbnail-02', title: 'تامنیل ماینکرفت — زیر آب', category: 'thumbnail', ...img('minecraft', 'thumbnail-02'), shortDescription: 'تامنیل با تم دریا و هیولای زیرآبی.' },
  { id: 'thumbnail-03', title: 'تامنیل ماینکرفت — ASMR کیبورد', category: 'thumbnail', ...img('minecraft', 'thumbnail-03'), shortDescription: 'تامنیل ASMR با کیبورد رنگی.', featured: true },
  { id: 'thumbnail-04', title: 'تامنیل ماینکرفت — ماینینگ', category: 'thumbnail', ...img('minecraft', 'thumbnail-04'), shortDescription: 'تامنیل سینمایی با تم غار و الماس.' },
  { id: 'thumbnail-05', title: 'تامنیل ماینکرفت — چالش روز', category: 'thumbnail', ...img('minecraft', 'thumbnail-05'), shortDescription: 'تامنیل چالش چند‌روزه.' },
  { id: 'thumbnail-06', title: 'تامنیل ماینکرفت — بیابان', category: 'thumbnail', ...img('minecraft', 'thumbnail-06'), shortDescription: 'تامنیل با تم بیابان و آسمان روشن.' },
  { id: 'thumbnail-07', title: 'تامنیل ماینکرفت — بینگو', category: 'thumbnail', ...img('minecraft', 'thumbnail-07'), shortDescription: 'تامنیل دو‌نفره‌ی بینگو.' },
  { id: 'thumbnail-08', title: 'تامنیل ماینکرفت — 999 Kills', category: 'thumbnail', ...img('minecraft', 'thumbnail-08'), shortDescription: 'تامنیل تیره و اکشن.' },
  { id: 'thumbnail-09', title: 'تامنیل ماینکرفت — فول اینچنت', category: 'thumbnail', ...img('minecraft', 'thumbnail-09'), shortDescription: 'تامنیل رنگی و پرانرژی.' },
  { id: 'thumbnail-10', title: 'تامنیل ماینکرفت — نِدر', category: 'thumbnail', ...img('minecraft', 'thumbnail-10'), shortDescription: 'تامنیل با نور بنفش و فضای نِدر.' },
  { id: 'thumbnail-11', title: 'تامنیل ماینکرفت — تیم', category: 'thumbnail', ...img('minecraft', 'thumbnail-11'), shortDescription: 'تامنیل گروهی با نور درخشان.' },

  // ---------- 3D (Blender) ----------
  { id: 'render-01', title: 'رندر بلندر — شخصیت', category: '3d', ...img('3d', 'render-01'), technologies: ['Blender'], shortDescription: 'رندر سه‌بعدی یک شخصیت ماینکرفتی.' },
  { id: 'render-02', title: 'رندر بلندر — ست الماسی', category: '3d', ...img('3d', 'render-02'), technologies: ['Blender'], shortDescription: 'رندر شخصیت با زره‌ی الماسی.', featured: true },
  { id: 'render-03', title: 'رندر بلندر — حرکت', category: '3d', ...img('3d', 'render-03'), technologies: ['Blender'], shortDescription: 'ژست دینامیک با نورپردازی تیره.' },
  { id: 'render-04', title: 'رندر بلندر — صحنه‌ی سینمایی', category: '3d', ...img('3d', 'render-04'), technologies: ['Blender'], shortDescription: 'صحنه‌ی سه‌بعدی با نورپردازی و محیط.', featured: true },
  { id: 'render-05', title: 'رندر بلندر — مجموعه', category: '3d', ...img('3d', 'render-05'), aspect: '1/1', technologies: ['Blender'], shortDescription: 'چند شخصیت در یک ترکیب‌بندی.' },
  { id: 'render-06', title: 'رندر بلندر — پرتره', category: '3d', ...img('3d', 'render-06'), technologies: ['Blender'], shortDescription: 'رندر نزدیک از یک شخصیت.' },
  { id: 'render-07', title: 'رندر بلندر — ROHI', category: '3d', ...img('3d', 'render-07'), aspect: '1/1', technologies: ['Blender'], shortDescription: 'رندر شخصیت با تیغه‌ی بنفش.' },
  { id: 'render-08', title: 'رندر بلندر — نور و سایه', category: '3d', ...img('3d', 'render-08'), technologies: ['Blender'], shortDescription: 'بازی نور و سایه روی یک شخصیت.' },
]

export const getProject = (id) => projects.find((p) => p.id === id)
export const getCategory = (id) => categories.find((c) => c.id === id)
export const projectsByCategory = (id) => projects.filter((p) => p.category === id)
