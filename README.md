# ROHI — وب‌سایت شخصی رهام پیرزادی

React + Vite، بدون بک‌اند و دیتابیس.

## اجرا
```
npm install
npm run dev        # اجرای محلی
npm run build      # ساخت نسخه‌ی نهایی در پوشه‌ی dist
```
خروجی `dist` را روی Netlify / Vercel / GitHub Pages می‌شود گذاشت (فایل `public/_redirects` برای Netlify آماده است).

## چیزهایی که باید خودت پر کنی
| کار | فایل |
|---|---|
| عکس شخصی | `public/assets/profile/roham.jpg` (تا وقتی نباشد لوگوی RH نمایش داده می‌شود) |
| درصد مهارت‌ها (الان `null` = «—») | `src/data/skills.js` |
| پروژه‌ی جدید | `src/data/projects.js` + عکس در `public/assets/projects/` |
| شبکه‌ها و شماره | `src/data/socials.js` |
| متن‌های معرفی، آدرس سایت برای QR | `src/data/profile.js` |
| پاسخ‌های چت‌بات | `src/data/chatbot.js` |

## لوگو موشن
انیمیشن اصلی خودت دست‌نخورده در `public/assets/logo-motion/` است و از طریق `src/components/LogoLoader.jsx` (لودر اولیه) و `PageTransition.jsx` (انتقال صفحات) نمایش داده می‌شود. برای تغییر تنظیمات: `public/assets/logo-motion/src/config.js`.

## Easter Egg
کد کونامی (↑ ↑ ↓ ↓ ← → ← → B A) یا ۷ کلیک سریع روی آچار کوچک پایین فوتر. فعال می‌شود Panther Mode (در ROHI LAB هم دیده می‌شود).
