# Investment Climate Web — Этап 1: аудит

Дата: 01.08.2026. Задание: `_ANALIZ/web_page_3107.pdf` (23 стр.).

## 1. Кодовая база veretennikov.info

- Репо: `zaratustrik/veretennikov-studio`; прод-ветка `migration/yandex-cloud-prep`; рабочая копия — этот worktree.
- Стек: **Next.js 16.2.3 (App Router), React 19.2, TypeScript 5, Tailwind CSS v4** (@tailwindcss/postcss, конфиг в CSS), Prisma 7 + PostgreSQL (не нужен для нашей страницы — контент статический из данных), next-auth v5 beta (только /admin), framer-motion 12, react-markdown + remark-gfm + rehype-sanitize.
- ВАЖНО (AGENTS.md): версия Next новее общих знаний — перед кодом сверяться с `node_modules/next/dist/docs/`.
- Деплой: вручную SSH на Yandex Cloud VM (`/var/www/studio`, pm2 `studio`, nginx). Изменений package.json избегаем (иначе на VM нужен `npm ci`); в worktree есть незакоммиченные чужие правки `package.json`/`package-lock.json` — **не включать в наши коммиты**.
- Прецеденты закрытых страниц: `/presentation/sobolek-concept-vq7m3k` (метадата robots noindex/nofollow/noarchive, canonical null; собственный layout со шрифтом; robots.ts уже disallow `/presentation/`); `/p/`, `/b/` — скрытые слаги. Пароль нигде не реализован → делаем сами (cookie + env, POST-обработчик, сравнение через timingSafeEqual; редирект на исходный deep-link после входа).
- Шрифты: корневой layout — Inter; страницы могут добавлять свои (Manrope-паттерн). Стили — utility-классы + CSS-переменные с префиксом страницы (паттерн `--sb-*`) в scoped-обёртке.

## 2. Решения по размещению

- Route: `/presentation/investment-climate-sverdlovsk-a7k9m2` (внутри уже закрытого раздела; slug с энтропией + пароль поверх). Deep links: `?item=31`, `?view=...` (searchParams, сохранение при возврате).
- Route-группа получает свой `layout.tsx` (noindex-метадата по образцу sobolek) + серверный гейт пароля.
- Не входит в sitemap (sitemap.ts не перечисляет /presentation/*) — проверить при тестировании.
- Пароль: env `INVEST_CLIMATE_PASSWORD` на VM (runbook §4), cookie `ic_auth` (httpOnly, значение — HMAC от пароля), TTL 30 дней. Без пароля в клиентском коде.

## 3. Аналитический корпус (данные для страницы)

Готово и структурировано (не переписывать вручную — требование задания):

| Данные | Файл | Записей |
|---|---|---|
| 43 строки исходной карты | `_ANALIZ/sverdlovsk_investment_climate_corpus_2026/data/roadmap_rows.json` | 43 (поля: row, indicator, values, criterion, activity, start, end, kpi, responsible) |
| Новая редакция + вердикты + KPI + stop | `_ANALIZ/final_analysis/07_revised_roadmap.csv` | 43 × 36 колонок |
| Предварительные вердикты/влияние | `data/preliminary_assessments.json` | 43 |
| Построчные карточки (тексты обоснований) | `final_analysis/05_roadmap_item_by_item.md` | 43 карточки |
| KPI-словарь | `final_analysis/11_kpi_dictionary.md` | 30 KPI |
| Международные практики | `final_analysis/10_benchmark_practices.md` + `raw_benchmark/01–05` | 9 функций, 18 юрисдикций |
| Российские практики | `raw_benchmark/06_russian_regions.md` | 6 функций |
| Источники-утверждения | `final_analysis/source_claims.csv` | 32 |
| Матрица доказательств | `final_analysis/evidence_matrix.csv` | 43 |
| Экономика/рейтинг | `final_analysis/02_economic_profile.md`, `03_rating_gap_analysis.md` | — |
| Проблемы/зрелость РИС | `04_ris_maturity_assessment.md`, аудит сервисов | — |
| Предложения | `06_revised_roadmap.md`, `08_new_measures.md`, `15/16_implementation` | 30 строк + Н1–Н7 |
| Резюме | `00_executive_summary.md` | 7 блоков |

## 4. Полнота и пробелы данных (не выдумывать!)

Доступно: всё для блоков 1–14 задания. Пробелы, которые страница обязана показывать честно (статус достоверности):
- порегиональные оценки АСИ не подтверждены выгрузкой (U-101) — плашка «по данным проекта карты»;
- доступность Инвесткарты — «зафиксировано из тестовой среды, требует проверки из РФ-сети» (U-107);
- стоимость мероприятий — категории О/И1/И2, не рубли;
- связь со Стратегией 151-ОЗ — частична (тексты недоступны);
- заявленные регионами/агентствами цифры бенчмарков — маркировать «заявлено» vs «подтверждено» (есть в данных).

## 5. Риски реализации

1. Next 16/Tailwind 4 — сверяться с локальной документацией; не тянуть новые зависимости (никаких chart-библиотек — SVG руками или CSS).
2. Объём контента 43 карточек — данные в JSON-модулях `src/data/investment-climate/`, компоненты дженерик.
3. Не трогать общие файлы (robots.ts уже покрывает; layout корня не менять).
4. print styles и presentation mode — CSS-first (@media print; класс на root), без тяжёлых библиотек.
5. Деплой руками по runbook §2; env добавить по §4 до проверки доступа.
