# Logo Reveal — RH Panther

انیمیشن Logo Reveal سینمایی ۴.۵ ثانیه‌ای با HTML + CSS + JavaScript (Canvas 2D)، بدون هیچ وابستگی بیرونی.

## اجرا
1. پوشه را باز کن و فایل `index.html` را مستقیم در Chrome / Edge / Firefox / Safari باز کن (بدون سرور هم کار می‌کند).
2. کلیدها: `R` یا `Space` = پخش مجدد · `S` = روشن/خاموش کردن صدا · `F` = تمام‌صفحه
3. برای دیدن یک لحظه مشخص: `index.html?t=2.1` (ثانیه روی تایم‌لاین ۴.۵ ثانیه‌ای)

## ساختار
```
index.html            صفحه اصلی
assets/logo.png       لوگوی اصلی (سفید، پس‌زمینه شفاف) — بدون هیچ تغییری استفاده می‌شود
assets/audio/         اینجا فایل‌های صدا (whoosh, impact, ...) بگذار
src/config.js         همه تنظیمات (مدت، glow، تعداد ذرات، رنگ‌ها، دوربین، صدا)
src/main.js           موتور انیمیشن
src/audio.js          سیستم صدا (اختیاری)
src/contours.js       مسیر برداری خطوط لوگو (خودکار تولید می‌شود)
tools/extract-contours.py   تولید دوباره contours.js
```

## تنظیمات مهم (`src/config.js`)
- `duration` — مدت کل انیمیشن؛ کل تایم‌لاین متناسب کش/فشرده می‌شود
- `glow.intensity`، `flash.intensity`، `sweep.intensity` — شدت نورها
- `particles.ambient / formation / pass` — تعداد ذرات
- `colors.*` — رنگ‌ها
- `camera.zoom / drift`، `depth.thickness` — دوربین و عمق سه‌بعدی

## نکته درباره دقت لوگو
- فرم لوگو هیچ‌وقت دست‌کاری نمی‌شود؛ فقط خودِ PNG نمایش داده می‌شود.
- در فریم پایانی عمق و حرکت دوربین صفر می‌شود و لوگو دقیقاً هم‌تراز با پیکسل‌های صفحه (pixel-aligned) می‌ماند.
- اگر لوگوی دیگری گذاشتی: فایل را جایگزین `assets/logo.png` کن و اجرا کن:
  `python3 tools/extract-contours.py`  (نیاز به numpy, opencv-python, pillow)

## صدا
صدا پیش‌فرض خاموش است. با `S` صدای ساختگی (drone, whoosh, shimmer, impact) فعال می‌شود.
برای صدای حرفه‌ای، فایل‌ها را در `assets/audio/` بگذار و در `config.js` بخش `audio.files` را باز کن.
زمان هر cue در `audio.cues` قابل تغییر است.

## استفاده در سایت بدون پس‌زمینه (شفاف)
- حالت شفاف: `index.html?transparent=1` یا در `config.js` مقدار `transparent: true`.
- روش پیشنهادی برای قرار دادن در سایت: یک iframe شفاف
  `<iframe src="logo-reveal/index.html?transparent=1" style="border:0;background:transparent" allowtransparency></iframe>`
- این حالت روی پس‌زمینه‌های **تیره یا رنگی** عالی کار می‌کند (لوگو سفید است).
- روی پس‌زمینه **روشن** لوگوی سفید دیده نمی‌شود؛ باید نسخه مشکی (`22709.png`) و رنگ‌ها را تغییر داد.
