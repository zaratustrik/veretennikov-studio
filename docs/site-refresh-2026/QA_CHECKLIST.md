# QA · 2026-09-07–08

Актуальный site-wide прогон после интеграции описан в `SITEWIDE_REVIEW.md`: 30 representative public URL, Chromium desktop/mobile, build 123/123.

История: главная → механизм и проекты → выбор процесса → опубликованный разбор или кейс. Prototype не имеет собственного endpoint/БД/уведомлений.

| Проверка | Результат | Основание |
|---|---|---|
| Chromium desktop 1440×1000 | PASS | Hero, проекты, сценарии просмотрены; SSR content, no overlay |
| Tablet 768×1024 | PASS | Адаптивная сетка; overflow false |
| Mobile 390×844, narrow 320×740 | PASS | CTA до схемы, вертикальные flows, overflow false |
| Реальный poster | PASS | complete=true, naturalWidth>0, изображение просмотрено |
| Сценарии | PASS | Все 3 меняют схему/описание/ссылку; aria-pressed, focus остаётся на кнопке |
| Keyboard | PARTIAL PASS | Enter на сценариях, методе и меню; Space на FAQ. Полный screen-reader аудит не проводился |
| Закрытое mobile menu | PASS | nav.isVisible() false после закрытия details |
| Высоты сценариев после исправления | PASS | 1440px:355/355/355; 390px:640/640/640; 320px:670/670/670. Это не aggregate CLS |
| Reduced motion | PARTIAL | Проверены CSSOM rules отключения transition/animation/hover-transform/smooth-scroll; OS эмуляция не выполнена |
| Console errors preview | PASS | dev.logs(levels:error) → [] |
| Якорь к проектам | PASS | workTop≈90px, ниже sticky header |
| Production /razbor | PASS read-only | Форма открыта по CTA с главной; заявка не отправлялась |
| /show/industrial-cooperation | BLOCKED external | URL взят из production DOM, переход дал ERR_TIMED_OUT; destination не считать проверенным |
| Preview SEO | PASS | noindex,nofollow; canonical=https://veretennikov.info/ |
| Scoped lint / tsc | PASS | Обе команды exit 0 |
| Общая tsc | PASS 2026-09-08 | tsc --noEmit --incremental false, без ошибок после npm ci и prisma generate |
| Общий build | PASS 2026-09-08 | Next 16.2.3: compiled, TypeScript, 102/102 pages, exit 0. Есть предупреждение pg-connection-string о будущей семантике SSL |
| User changes | PASS по status | Исходные tracked modifications остались прежними; новые файлы задачи в трёх изолированных папках |

Не проверены: реальные CrUX p75/CWV, Lighthouse оптимизированной сборки, throttled mobile, aggregate CLS/INP/LCP, запись заявки/уведомления, все внешние ссылки, Safari/Firefox, OS reduced-motion, screen reader, 200% zoom. Рост лидов не измерен.

## Повторить
1. Viewports 1440/768/390/320: h1, CTA, diagram, poster, отсутствие overflow.
2. Tab/Enter/Space: scenarios, menu, method, FAQ; один aria-pressed, видимый focus.
3. Системный reduced-motion, 200% zoom и screen reader.
4. На staging с тестовой БД и отключёнными уведомлениями проверить form success/error, затем отдельно согласованные уведомления.

## Команды из C:/_PROJECT_SITE/pr
```powershell
npm.cmd run dev -- --hostname 127.0.0.1 --port 3100
npx.cmd eslint src/components/site-refresh/RefreshHome.tsx src/components/site-refresh/ProcessExplorer.tsx src/app/site-refresh/page.tsx
npx.cmd tsc -p docs/site-refresh-2026/tsconfig.preview.json
npx.cmd tsc --noEmit --incremental false
npm.cmd run build
```

Использован подключённый Chromium через CUA: CLI agent-browser отсутствовал в PATH. Viewport override сброшен, preview оставлен для просмотра. Production не изменён.
