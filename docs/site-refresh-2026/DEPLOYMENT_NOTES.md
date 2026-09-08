# Deployment notes · основной сайт

Источник истины для инфраструктуры — личный runbook владельца, который хранится вне репозитория. Его секреты и приватные URL сюда не копируются.

Подтверждённая схема на 2026-09-08:

- production работает в Yandex Cloud;
- приложение: `/var/www/studio`, PM2 process `studio`, port 3000;
- production branch: `migration/yandex-cloud-prep`;
- CI workflow слушает `main`, поэтому до merge веток его нельзя использовать как доказательство автоматического production deploy;
- обновление текущей production branch выполняется вручную по личному runbook владельца;
- при изменении dependencies нужен `npm ci`; при изменении Prisma schema — отдельные `db push` и `prisma generate` согласно runbook;
- production deploy не выполнялся.

Старый `docs/deployment.md` с Timeweb и workflow, направленный на `main`, не соответствуют текущей production-схеме полностью. Перед публикацией этой работы сначала перенести/проверить изменения в `migration/yandex-cloud-prep`, затем выполнить staging/smoke проверки и получить отдельное разрешение владельца на production deploy.
