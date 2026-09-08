# Implementation plan

## Сделано
- Аудит production/local, desktop/mobile, формы, analytics plumbing, tokens и assets.
- Сравнение трёх стратегий; концепция B.
- Самостоятельный browser-reviewable slice `/site-refresh`: header, hero, proof, сценарии, метод, связь с production, FAQ, CTA, footer.
- Изоляция CSS префиксом sr-, metadata noindex, отсутствие новых зависимостей.
- Локальная browser QA, lint/tsc; 2026-09-08 устранены блокеры окружения, полные TypeScript и build проходят (123 страницы в актуальной ветке).
- Концепция перенесена на `/` актуальной ветки в отдельном worktree; публичный layout, case-study, типографика, CTA и mobile menu приведены к общей системе.
- Browser QA расширена до 30 representative URL на desktop/mobile. Актуальная сборка: 123/123 страницы.

## P0 — перед переносом на главную
1. Просмотреть интегрированную локальную версию из `C:/_PROJECT_SITE/site-refresh-review` и согласовать визуальную систему.
2. Перенести/слить изменения в `migration/yandex-cloud-prep`, не затронув параллельные пользовательские изменения.
3. Сохранить текущие `/razbor`, `/brief`, `/production`, `/services/*` и `/show/*`, consent/attribution, footer и навигационные направления — локальная интеграция это уже делает.
4. Подключить актуальные CtaLink/goal с метками placement (hero/header/footer), case slug, scenario. Не считать click submit успешным лидом. Success — после серверной записи, с дедупликацией и consent.
5. После переноса повторить `npm ci`, `prisma generate`, build/type/lint. Не выполнять db push/migrate/seed, поскольку schema не менялась.
6. QA на production-like сборке. Отдельное разрешение пользователя на production-деплой.

## P1 — доказательства и измерение
- Получить screenshots двух цифровых систем и подтверждение описаний кейсов. Схемы можно оставить как объяснение рядом.
- Перевести selected cases на существующий Prisma query с isPublic:true, stable slug и fallback; не добавлять зависимость preview от боевой БД.
- 5–8 B2B интервью с 10/30 s тестом. Уточнить, достаточно ли явен AI в новом h1/eyebrow и не слишком ли общий headline.
- Проверить ошибки поля формы, aria-describedby, focus при серверной ошибке; stage-only отправка с отключёнными уведомлениями.
- CrUX/Search Console/Метрика/CRM baseline; события и квалификация воронки.
- Реальный reduced-motion, 200% zoom, screen reader и browser Safari/Firefox.

## P2 — развитие
- Дополнительные реальные визуальные кейсы 3D/CV/RAG, только с подтверждениями.
- Короткий video по нажатию, если он даёт больше понимания, чем poster.
- Уточнение текстов и локализация форматов времени; регулярная актуализация лет опыта.
- Форматировать новые TSX/CSS после согласования концепции, не затрагивая unrelated файлы.

## Бюджет исполнения
Следующий исполнитель может завершить механический перенос, форматирование и стандартные QA. Astra возвращается для оценки первых 10/30 секунд, правдивости proof и согласованности бренда. Новый task автоматически не создан.
