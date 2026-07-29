# Аудит репозитория для проекта «ИИ в работе» (/ai-masterclass)

Дата: 29.07.2026 · Ветка-база: `migration/yandex-cloud-prep` (прод) · Фича-ветка: `feature/ai-masterclass`

## 1. Стек сайта

| Параметр | Значение |
|---|---|
| Framework | Next.js **16.2.3**, App Router, React **19.2.4**, TypeScript 5 (strict) |
| Стили | Tailwind CSS **4** (`@tailwindcss/postcss`) + CSS-переменные в `globals.css` |
| Анимации (существующие) | `framer-motion` 12 — используется в публичных страницах (`PageTransition` и др.) |
| Шрифты | `next/font/google`: Inter (`--font-sans`, cyrillic), JetBrains Mono (`--font-mono`), Source Serif 4 (`--font-display`) |
| БД/бэкенд | Prisma 7 + PostgreSQL (локально на VM), next-auth v5 beta, Resend, S3 SDK (Object Storage) |
| Аналитика | Яндекс.Метрика (`src/components/YandexMetrika.tsx`) — новый трекер не нужен |
| SEO | `metadataBase`, JSON-LD (`src/lib/seo.ts`), sitemap.ts, robots.ts, opengraph-image.tsx |
| Деплой | Yandex Cloud VM, pm2, ручной деплой прод-ветки `migration/yandex-cloud-prep` (см. runbook). CI auto-deploy слушает `main` — **пушить в main нельзя** без решения владельца |

## 2. Структура routes

- `src/app/(public)/…` — публичные страницы под общим layout с `Header`, `Footer`, `PageTransition` и `pt-16`.
- `src/app/admin`, `src/app/api`, `src/app/show` — вне публичной группы.
- **Вывод:** `/ai-masterclass` создаём как **самостоятельный route вне группы `(public)`** (`src/app/ai-masterclass/`), чтобы: тёмная immersive-тема не конфликтовала со светлым «warm paper» layout; не наследовать header/`pt-16`; иметь собственный `layout.tsx` с метаданными. Ссылка на основной сайт даётся внутри самой страницы (бренд-строка).

## 3. Дизайн-система и совместимость

Токены сайта — светлая «бумажная» гамма (`--paper #F9F7F2`, `--ink #0F1A2E`, `--cobalt #1F4DDE`). Палитра мастер-класса — тёмная (из ТЗ). Смешивать нельзя.
**Решение:** все токены мастер-класса объявляются в route-scoped обёртке `.mc-root` (CSS-модуль/локальный слой), глобальные токены не трогаем. Шрифты переиспользуем существующие (Inter — текст, Source Serif 4 — фирменные заголовки-акценты по необходимости; у Inter качественная кириллица).

## 4. Зависимости

Отсутствуют и добавляются **только в рамках этого роута**: `gsap` (+ScrollTrigger), `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three`.
Конфликт по ТЗ §9.2 (GSAP vs framer-motion): framer-motion остаётся для существующих страниц; внутри `/ai-masterclass` используется **только GSAP**. Smooth-scroll библиотеки не добавляем — нативный скролл.
Тестовая инфраструктура в репо отсутствует (нет vitest/playwright, нет `typecheck`-скрипта). Минимальный набор: `npx tsc --noEmit` + `npm run lint` + `npm run build`; e2e — отдельным решением позже.

## 5. Риски

1. **React 19 + R3F**: требуется @react-three/fiber v9; проверить совместимость на build.
2. **Next 16**: изменения API (см. AGENTS.md — читать `node_modules/next/dist/docs/` при сомнениях); `next/dynamic` c `ssr:false` в клиентских компонентах.
3. **Прод на VM со сборкой на месте**: добавление тяжёлых deps увеличит время `npm ci`/`build` на VM — допустимо, но отметить в runbook при деплое.
4. **ScrollTrigger + PageTransition**: наш route вне `(public)`, PageTransition не участвует — конфликтов нет.
5. **Производительность 3D**: единый canvas, DPR cap, пауза при `document.hidden`, отключение на mobile/reduced-motion (по ТЗ).
6. **Ветки**: main ↔ migration разошлись (45/1 коммитов). Фича базируется на прод-ветке; мердж в main — отдельное решение владельца.

## 6. Вопросы, не решаемые из репозитория

1. Куда мерджить и когда деплоить (`migration/yandex-cloud-prep` вручную? синхронизация с `main`?) — до пуша нужно подтверждение владельца.
2. Финальный URL для QR-кода на финальной сцене (ждёт утверждения URL).
3. Нужен ли immersive-режим совсем без бренд-шапки сайта или с минимальной бренд-строкой (в slice сделана минимальная строка-ссылка на главную).

## 7. Аналитика (Яндекс.Метрика, reachGoal; содержимое полей не передаётся)

mc_open, mc_start, mc_chapter_<id>, mc_presenter_open, mc_demo_open,
mc_prompt_builder_demo / _copy / _complete, mc_risk_quiz_complete,
mc_pilot_card_complete / _copy / _export, mc_contact_click, mc_finished,
mc_enterprise_view, mc_enterprise_arch_view, mc_enterprise_arch_done,
mc_enterprise_router_use, mc_enterprise_route_local / _masked / _blocked / _confirm,
mc_enterprise_to_pilot.

## 8. Presenter mode

?presenter=1 (алиас present=1), &notes=1. Клавиши: Space/PageDown/ArrowDown — вперёд;
PageUp/ArrowUp — назад; Home/End; F — fullscreen; N — заметки; S — snap; Esc — закрыть
заметки/выйти из fullscreen. Сцен в порядке presenter: 20.
