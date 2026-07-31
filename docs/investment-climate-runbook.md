# Investment Climate Web — инструкция по доступу, обновлению и деплою

Дата: 01.08.2026.

## 1. Доступ

- URL: `https://veretennikov.info/presentation/investment-climate-sverdlovsk-a7k9m2`
- Страница не в меню, не в sitemap; robots: `/presentation/` disallow + метадата noindex/nofollow/noarchive.
- Пароль: env `INVEST_CLIMATE_PASSWORD` на VM (`/var/www/studio/.env.production`, зеркалится в `.env` — см. личный runbook §4). После ввода — httpOnly-cookie на 30 дней; deep links (`?item=31`) сохраняются после входа.
- Сменить пароль: поправить env → `pm2 reload studio --update-env`. Кука у старых пользователей перестанет подходить автоматически (хеш не совпадёт).

## 2. Deep links для встречи

- Конкретное мероприятие: `...?item=31`
- Поиск: `...?q=техприсоединение`
- Презентационный режим: кнопка «Презентация» в шапке (Esc — выход).

## 3. Обновление данных (без правки компонентов)

Контент живёт в `src/data/investment-climate/*.json` и генерируется из аналитического корпуса:

1. Правки делаются в корпусе `C:\Users\Home-PC\OneDrive\Документы\_ANALIZ` (final_analysis/*.md, 07_revised_roadmap.csv и т.д.).
2. Запустить генераторы (локально, где доступен корпус):
   ```bash
   python scripts/build-invest-climate-data.py
   python scripts/build-invest-climate-data2.py
   ```
   Скрипты валидируют данные и печатают отчёт (обязательно смотреть VALIDATION/CROSS-VALIDATION).
3. Закоммитить изменённые JSON + задеплоить (см. §4).

Точечные правки (опечатка и т.п.) можно вносить прямо в JSON — но при следующей генерации они будут перезаписаны; правь первоисточник в _ANALIZ.

Курируемые блоки (summary, problems, journey, newRoadmap, practices, sources) редактируются в самих генераторах (`scripts/build-invest-climate-data*.py`) — это осознанно: единая точка правды с валидацией ссылок.

## 4. Деплой

По личному runbook (§2): коммит в `migration/yandex-cloud-prep` → push → SSH на VM → `git reset --hard origin/... && npm run build && pm2 reload studio`. package.json этой фичей не меняется — `npm ci` не нужен.

ВНИМАНИЕ: в worktree есть незакоммиченные чужие правки `package.json`/`package-lock.json` — в коммиты фичи их не включать.

## 5. Первичная настройка пароля (однократно)

```bash
# на VM: добавить строку в /var/www/studio/.env.production
INVEST_CLIMATE_PASSWORD=<пароль>
# зеркалим и перезапускаем
sudo cp /var/www/studio/.env.production /var/www/studio/.env
sudo -u deploy bash -lc "pm2 reload studio --update-env"
```

Пароль передавать руководству отдельным каналом (не в письме со ссылкой).

## 6. Ограничения (аналитические и технические)

- Оценки показателей карты — из проекта DOCX; порегиональная выгрузка АСИ запрошена (U-101).
- Недоступность Инвесткарты зафиксирована из тестовой среды; страница помечает это как «требует проверки из РФ-сети» (U-107).
- Стоимости мероприятий — категории (орг./ИТ), не рубли.
- Часть результатов бенчмарков — заявления регионов/ведомств; на странице маркируются бейджем «заявлено».
- Поиск — клиентский по подготовленному индексу; при существенном росте данных перейти на серверный.
