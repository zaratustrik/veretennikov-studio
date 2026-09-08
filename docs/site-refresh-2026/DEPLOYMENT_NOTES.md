# Deployment notes · основной сайт

Источник истины для инфраструктуры — личный runbook владельца `C:\Users\Home-PC\Documents\_VeretennikovInfo2\veretennikov-runbook.md`. Его секреты и приватные URL в репозиторий не копируются.

## Production deployment · 2026-09-08

- Разрешение владельца: получено после принятия `PRODUCTION_READINESS.md`.
- Production branch: `migration/yandex-cloud-prep`.
- Утверждённый candidate и deployed code commit: `33b366a31e277fe004f189593db9597a74bfdc83`.
- Rollback commit: `5356320488e05cae71b1ad9141457c6944196a14`.
- Deployment time: `2026-09-08 10:19:57 +05:00` (`2026-09-08T05:19:57Z`).
- Production checkout перед deploy: clean, commit `5356320488e05cae71b1ad9141457c6944196a14`.
- Candidate worktree перед deploy: clean; candidate был fast-forward относительно production branch.
- Последний локальный candidate build: PASS, `123/123` страниц.
- Production build на VM: PASS, `126/126` страниц; build ID `9bi_63svOqwtKU7aaXt13`.
- PM2 process `studio`: online после `pm2 reload studio --update-env`, unstable restarts `0`, локальный HTTP `200`.
- Production checkout после deploy: clean, commit совпал с candidate.

Deployment выполнен вручную по актуальной Yandex Cloud процедуре из личного runbook владельца: обновлена только production branch, выполнены production build и reload PM2. Устаревший workflow для `main` не использовался. Dependencies и Prisma schema не менялись, поэтому `npm ci`, Prisma migration, `db push`, `generate` и `seed` на production не выполнялись.

Первая SSH-попытка завершилась banner timeout до установления соединения и до любых изменений. Повтор по процедуре runbook прошёл успешно.

## Production smoke QA

Проверка завершена `2026-09-08 10:30:53 +05:00`.

- HTTP `200`: `/`, `/services`, `/production`, `/cases`, `/show/industrial-cooperation`, `/show/road-analytics-platform`, `/show/belojarskaya-aes`, `/razbor`, `/brief`, `/robots.txt`, `/sitemap.xml`.
- Desktop homepage: новый hero, структура, CTA и основной asset отображаются корректно; горизонтального overflow нет.
- Mobile homepage `390×844`: layout без overflow; mobile menu открывается, изолирует основной контент, закрывается по Escape и возвращает focus на trigger.
- Главный CTA ведёт на `/razbor`; якорь формы работает.
- `/services`, `/production`, `/cases`: единая публичная оболочка, один `main`, корректные заголовки и canonical, browser console errors отсутствуют.
- Кейсы `industrial-cooperation`, `road-analytics-platform`, `belojarskaya-aes`: HTTP `200`, корректные H1/canonical, общие header/footer и CTA, runtime errors отсутствуют.
- Assets: production и cases-постеры загрузились с ненулевой шириной; stylesheet/script assets подключены.
- `/razbor`: форма и обязательные поля доступны; отправка не выполнялась.
- `/brief`: форма после hydration отображается, обязательные контактные поля и consent доступны; отправка не выполнялась.
- Metadata: title, canonical и `robots=index, follow` проверены на основных страницах; `robots.txt` разрешает публичный контур и указывает production sitemap; `sitemap.xml` отдаётся как XML.
- После deploy в PM2/nginx не обнаружены новые ошибки; записи PM2 error log относятся ко времени до deployment.
- Production code commit совпадает с утверждённым candidate: `33b366a31e277fe004f189593db9597a74bfdc83`.

Критических regressions не обнаружено. Rollback не выполнялся.

## Известные некритичные ограничения

- `/brief` наследует canonical главной страницы `https://veretennikov.info/`; собственный title и `robots=index, follow` корректны.
- Реальная production-заявка не отправлялась, поскольку отдельного разрешения на test lead не было.
- Aggregate CWV и бизнес-конверсия в рамках smoke QA не измерялись.
- Build сохраняет ранее известные предупреждения Custom Highlight API закрытой читальни и `pg-connection-string` о будущей SSL-семантике; затронутые зоны в Site Refresh не менялись.

## Rollback

Если после handoff обнаружится критическая regression, использовать rollback procedure из личного runbook владельца и commit `5356320488e05cae71b1ad9141457c6944196a14`. Публичные инструкции, секреты и устаревший `main` workflow для rollback не использовать.
