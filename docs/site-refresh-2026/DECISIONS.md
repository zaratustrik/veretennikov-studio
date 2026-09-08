# Decisions

- Production не деплоить.
- Сохранить пользовательские изменения: .claude/settings.local.json, src/app/robots.ts; untracked .claude/launch.json, .claude/worktrees/, public/deck/, src/app/deck/, src/components/deck/, src/data/decks/.
- Сначала проверить расхождение production и локальной главной; не переносить неподтверждённые показатели из статического cases.ts.

## Принято после исследования
- B / Visual Rebalance: новая коммуникация главной при сохранении коммерческих маршрутов. Сравнение A/B/C и контраргументы — AUDIT_STRATEGY.md.
- Изолированная `/site-refresh` в основном repo. Не править root homepage и чужой worktree. Перенос — выборочная интеграция в актуальную ветку.
- AI, автоматизация и custom software — основное предложение. Production/3D — самостоятельная услуга и предметный опыт; не приписывать AI всем промышленным заказчикам.
- Схема по публичному кейсу в hero; проекты перед длинным объяснением метода. Сценарии «сейчас / с системой» переключаются кнопками.
- Не использовать generative images, kit/utpp/deck как якобы реальные интерфейсы. Не заявлять ROI и сроки окупаемости без измерений.
- Никакого autoplay/WebGL. CSS, inline SVG, нативные details, один client island.
- CTA сохраняет существующий /razbor, отдельный /brief для готовой задачи. В preview ссылки абсолютные на production, в интеграции origin="".
- `noindex, nofollow` и canonical на production для preview. Production metadata и sitemap не менять.
- 2026-09-08 по продолжению задачи восстановлены штатные зависимости через npm ci --ignore-scripts и Prisma client через prisma generate. Версии/package-lock не менялись, миграции не выполнялись. Полные build и TypeScript теперь проходят.
- Актуальный production источник — `migration/yandex-cloud-prep` в Yandex Cloud по личному runbook владельца. Runbook не коммитить; секреты и приватные URL не переносить в проектную документацию.
- Публичный коммерческий контур унифицируется с Visual Rebalance. Закрытые презентации, читальни, порталы, live-интерфейсы и admin сохраняют свои продуктовые стили.
- Case-study используют общий public header/footer; пользователю проще продолжить к услугам, разбору и контактам.
- Убраны задерживающие чтение page-transition/scroll-reveal эффекты в публичном контуре. Сохранены короткие hover/focus реакции и reduced-motion policy.
