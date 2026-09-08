# Site refresh 2026

Цель: ускорить понимание компетенций и повысить вероятность качественного B2B-обращения. Только локальная реализация; production требует отдельного разрешения.

## Статус — концепция интегрирована в публичный контур локально
2026-09-07: найден репозиторий C:/_PROJECT_SITE/pr (Next.js 16.2.3, React 19, Tailwind 4, Prisma 7). Корень C:/_PROJECT_SITE не является git-репозиторием.
Локальная главная отличается от production: локально «Системы / Истории», на production — диагностика и ИИ. Нельзя считать локальную ветку актуальной копией production.

Открыть http://127.0.0.1:3200/. Рабочая копия: `C:/_PROJECT_SITE/site-refresh-review`, основана на production branch commit `5356320`. Запуск: `npm.cmd run dev -- --hostname 127.0.0.1 --port 3200`.

Принят B / Visual Rebalance: AI и цифровые системы ведут; industrial production показывает предметную глубину и остаётся самостоятельным направлением. Концепция перенесена на `/` актуальной production branch и распространена через общий layout, header, footer, typography и CTA на публичные страницы. Production не изменён.

## Документы
- HANDOFF.md — начать следующему исполнителю; 20 пунктов передачи.
- AUDIT_STRATEGY.md — аудит, контраргументы редизайну, A/B/C, проверка бизнеса.
- DECISIONS.md — принятое/отвергнутое.
- ASTRA_WORKLOG.md — ход работы.
- IMPLEMENTATION_PLAN.md — P0/P1/P2.
- ASSET_MANIFEST.md — inventory и происхождение материалов.
- QA_CHECKLIST.md — результаты и ограничения.
- SITEWIDE_REVIEW.md — охват и результаты проверки публичных страниц.
- DEPLOYMENT_NOTES.md — обезличенная актуальная схема deployment.

2026-09-08: зависимости восстановлены строго из lockfile, Prisma client пересоздан. Полные TypeScript и production build (123 страницы), а также ESLint изменённых TS/TSX проходят. Chromium проверен на desktop/mobile для 30 representative public URL. Перенос в рабочий checkout, staging-проверка заявки и пользовательский visual review остаются перед deployment.
