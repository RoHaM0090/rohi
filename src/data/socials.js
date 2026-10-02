// ============================================================
//  شبکه‌ها و راه‌های ارتباطی — فقط همین‌جا را ویرایش کن
//  username را بدون @ بنویس.
// ============================================================
export const socials = [
  { id: 'telegram', label: 'Telegram', username: 'LILRH70', url: 'https://t.me/LILRH70', icon: 'telegram' },
  { id: 'instagram', label: 'Instagram', username: 'lil__rohi', url: 'https://instagram.com/lil__rohi', icon: 'instagram' },
  { id: 'rubika', label: 'Rubika', username: 'LILRH70', url: 'https://rubika.ir/LILRH70', icon: 'rubika' },
  { id: 'email', label: 'Email', username: 'roham3189@gmail.com', url: 'mailto:roham3189@gmail.com', icon: 'mail' },
]

export const phone = {
  enabled: true, // برای حذف کامل شماره از سایت: false
  display: '0938 690 5546',
  tel: '+989386905546',
}

// ایمیل و آیدی تلگرام که فرم تماس از آن‌ها استفاده می‌کند
export const contactTargets = {
  email: 'roham3189@gmail.com',
  telegramUser: 'LILRH70',
}

export const getSocial = (id) => socials.find((s) => s.id === id)
