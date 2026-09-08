# Handoff · Visual Rebalance

## 1. Executive summary
Исследование, стратегия и site-wide интеграция публичного контура завершены. Утверждённый Site Refresh развёрнут на https://veretennikov.info/ из production branch `migration/yandex-cloud-prep`, commit `33b366a31e277fe004f189593db9597a74bfdc83`. Post-deploy smoke QA пройден; критических regressions нет. Rollback commit: `5356320488e05cae71b1ad9141457c6944196a14`.

## 2. Концепция
B / Visual Rebalance: оффер + схема → опыт → проекты → ситуации → метод → связь с production → FAQ → CTA. Сохраняется коммерческая архитектура существующего сайта.

## 3. Бизнес-гипотеза
Механизм и конкретный проект до длинного объяснения ускоряют понимание и дают основание доверять. AI/автоматизация/custom software ведут; production/3D — предметный опыт и самостоятельная услуга. Конверсия и клиентское восприятие ещё не измерены.

## 4. Что изменено
Новая SSR homepage установлена на `/` актуальной ветки, сохранён один stateful сценарный блок. Три project links, реальный промышленный poster, три before/after сценария и CTA подключены к существующим страницам. Общий публичный layout получил новую типографику, CTA, skip-link и motion policy; case-study используют общие header/footer; mobile menu поддерживает inert/Escape. На ключевых AI-услугах добавлены короткие схемы механизма, на `/razbor` — быстрый якорь к форме.

## 5. Полный список файлов задачи

Новые компоненты и стили:

- `src/components/site-refresh/RefreshHome.tsx`
- `src/components/site-refresh/ProcessExplorer.tsx`
- `src/components/site-refresh/refresh.css`
- `src/components/public/ServiceMechanism.tsx`
- `src/components/public/studio.css`

Общая оболочка и главная:

- `src/app/(public)/page.tsx`
- `src/app/(public)/layout.tsx`
- `src/app/show/[slug]/layout.tsx`
- `src/components/public/Header.tsx`
- `src/components/public/Footer.tsx`
- `src/components/public/ProductPage.tsx`
- `src/components/public/Wordmark.tsx`

Публичные страницы с приведёнными к общей системе акцентами:

- `src/app/(public)/about/page.tsx`
- `src/app/(public)/brief/page.tsx`
- `src/app/(public)/brief/thanks/page.tsx`
- `src/app/(public)/cases/page.tsx`
- `src/app/(public)/contact/page.tsx`
- `src/app/(public)/lab/page.tsx`
- `src/app/(public)/manifesto/page.tsx`
- `src/app/(public)/production/page.tsx`
- `src/app/(public)/programs/page.tsx`
- `src/app/(public)/razbor/page.tsx`
- `src/app/(public)/razbor/thanks/page.tsx`
- `src/app/(public)/services/page.tsx`
- `src/app/(public)/services/ai-automation/page.tsx`
- `src/app/(public)/services/ai-knowledge-base/page.tsx`
- `src/app/(public)/services/ai-sales-assistant/page.tsx`
- `src/app/(public)/services/b2b-content-engine/page.tsx`
- `src/app/(public)/services/digital-twin-visualization/page.tsx`
- `src/app/(public)/services/expo-stand/page.tsx`
- `src/app/(public)/services/industrial-video/page.tsx`
- `src/app/(public)/services/mini-apps-games/page.tsx`
- `src/app/(public)/sospp/page.tsx`

Документы: все файлы `docs/site-refresh-2026/`, включая новые `SITEWIDE_REVIEW.md` и `DEPLOYMENT_NOTES.md`.

Работа выполнена в отдельном worktree от `5356320`; исходные пользовательские изменения в `C:/_PROJECT_SITE/pr` и существующем worktree не менялись. Глобальный git config не менялся.

## 6. Components/patterns
RefreshHome({origin}) — полная самостоятельная страница внутри root layout. Default origin ведёт на production; при интеграции origin="" и устранить двойные main/header/footer с public layout. ProcessExplorer: один useState, buttons aria-pressed/aria-controls, live region, min-height. FlowIcon: три SVG. Метод, FAQ, mobile menu: details/summary без JS.

## 7. Design principles
Paper/ink/cobalt из tokens, muted #626872. Крупное обещание + механизм. Схемы явно маркированы; учебные материалы не выдаются за клиентские screenshots. Не приписывать AI всему списку заказчиков. Важный контент виден до JS.

## 8. Motion principles
Только реакция 180–220ms: цвет, стрелка, лёгкий zoom кадра. Нет autoplay, hidden scroll-reveal, WebGL, циклов, таймеров. Reduced-motion отключает движения/smooth-scroll; системную настройку ещё проверить.

## 9. Assets
ASSET_MANIFEST.md: один существующий Kinescope poster (next/image), ручные JSX/CSS/SVG схемы. Imagegen не применялся. Нужны разрешённые IT-screenshots двух цифровых проектов.

## 10. Намеренно не сделано
Не выполнялись записи БД, Prisma migration/db push/seed, отправка production-заявок, установка новых библиотек или изменение чужих файлов. Dependencies и Prisma schema в candidate не менялись. SEO/consent/analytics сохранены. Новые tracking events подключены только к CTA новой главной через существующий `CtaLink`; success события формы не менялись. Схемы не заменяют доказательства результата.

## 11. Следующий исполнитель
Новый redesign/refactor после deployment не запланирован. Следующие отдельные задачи возможны только по новому решению владельца: исправить canonical `/brief`, провести разрешённый production test lead, снять CWV baseline и измерять qualified-lead conversion. Актуальная запись deployment и rollback — `DEPLOYMENT_NOTES.md`.

## 12. P0/P1/P2
P0: production deployment, commercial routes/metadata/consent, production build, post-deploy smoke и rollback фиксация — выполнено.
P1: реальные IT-assets, B2B 10/30 s тест, разрешённый production test lead, qualified-lead measurement, CWV, screen reader/OS reduced-motion/zoom.
P2: реальные motion fragments, CV/RAG/3D cases, форматирование после принятия концепции. Детали — IMPLEMENTATION_PLAN.md.

## 13. Запуск
Из `C:/_PROJECT_SITE/site-refresh-review`: `npm.cmd run dev -- --hostname 127.0.0.1 --port 3200`, открыть `/`. Dev process запущен в сессии; если остановится, запустить заново.

## 14. Проверки
`npx.cmd eslint src/components/site-refresh/RefreshHome.tsx src/components/site-refresh/ProcessExplorer.tsx src/app/site-refresh/page.tsx`

`npx.cmd tsc -p docs/site-refresh-2026/tsconfig.preview.json`

Полные: `npx.cmd tsc --noEmit --incremental false`, `npm.cmd run build`. Changed-files lint и полные TypeScript PASS; локальный build PASS 2026-09-08, `123/123` страниц. Production build PASS, `126/126` страниц, build ID `9bi_63svOqwtKU7aaXt13`. HTTP `200` получен для homepage, основных каталогов, трёх representative cases, `/razbor`, `/brief`, robots и sitemap. Browser console/runtime errors после deploy отсутствуют.

## 15. Bugs/ограничения
Production работает на утверждённом candidate. Build оставляет существующие предупреждения Custom Highlight API закрытой читальни и pg-connection-string о будущей семантике SSL; эти зоны не менялись. `/brief` наследует canonical главной страницы. Формы открыты и проверены без отправки; серверный success не тестировался. Общность нового headline проверить в клиентском тесте.

## 16. Performance risks
Root layout загружает 3 семейства шрифтов и может подключать Метрику по env. Slice не добавляет libraries/video/Framer. Image lazy/sizes/aspect-ratio. Высота сценариев стабильна на 1440/390/320. Aggregate CWV не измерены; нужен оптимизированный staging.

## 17. SEO risks
Актуальные production metadata/OG/JSON-LD, canonical host, sitemap и robots сохранены и проверены после deployment. Некритичное исключение: canonical `/brief` указывает на главную страницу.

## 18. Mobile issues
390/320 без overflow. Высота панели 640/670px; desktop 355px. Схема ниже CTA, не скрыта. Закрытое меню нативно не отображается. Возможна избыточная длина hero/мелкость подписей — оценить на телефонах. Полная accessibility-сертификация не заявляется.

## 19. Definition of Done
Концепция, публичная интеграция, пользовательский visual review, production build/deployment, desktop/mobile smoke, representative interactions, public templates, assets, основные HTTP/SEO проверки, rollback фиксация и документы — выполнено. Реальная отправка формы и CWV baseline остаются отдельными задачами и не блокировали утверждённый deployment.

## 20. Финальная проверка Astra
Понятны ли AI/системы за 10 секунд? Может ли клиент назвать доказательство за 30? Не воспринимаются ли схемы как фиктивные интерфейсы? Сохранён ли AI приоритет и ценность production? Конкретен ли вход? Есть ли преимущество по реальным ответам B2B-клиентов, а не впечатлению дизайнера?
