import {
  AI_BOUNDARIES,
  AiStack,
  BOUNDARY_TONE,
  ChainFormation,
  PlannerOwnership,
  ResourceCycle,
  Stage0Flow,
} from "./diagrams"

export type Slide = {
  id: string
  /** Название для точек перехода и счётчика. */
  nav: string
  render: () => React.ReactNode
}

/* ── 1. Титул ───────────────────────────────────────────────── */

function Title() {
  return (
    <div className="kdm-inner kdm-stack">
      <p className="kdm-eyebrow">ТК КИТ × Veretennikov Studio</p>
      <h2 className="kdm-h1">
        Цифровой контур
        <br />
        магистральной логистики
      </h2>
      <p className="kdm-statement kdm-accent" style={{ maxWidth: "30ch" }}>
        От эффективности существующей сети — к автономной логистике.
      </p>
      <p className="kdm-small" style={{ marginTop: "clamp(20px,3vh,44px)" }}>
        Рабочая проектная концепция · август 2026
      </p>
    </div>
  )
}

/* ── 2. Что мы предлагаем ───────────────────────────────────── */

function Proposal() {
  return (
    <div className="kdm-inner kdm-stack">
      <p className="kdm-eyebrow">02 · Что мы предлагаем</p>

      <div className="kdm-cols" data-c="side">
        <div className="kdm-stack-s">
          <h2 className="kdm-h2">Единый операционный контур</h2>
          <p className="kdm-lead">
            Не вторая транспортная система. Не отдельная система для беспилотников.
          </p>
        </div>

        <div className="kdm-stack-s">
          <p className="kdm-body kdm-white" style={{ fontSize: "var(--kdm-t-lead)", lineHeight: 1.45 }}>
            Слой, который связывает в один процесс рейс, плечо, груз, полуприцеп, ресурс,
            узел, события, время прибытия и экономику перевозки.
          </p>
          <ul className="kdm-list" style={{ marginTop: "clamp(12px,1.6vh,22px)" }}>
            <li>Один план и один факт вместо картины, собранной из нескольких систем</li>
            <li>Видно, где ресурс сейчас и что он делает следующим</li>
            <li>Отклонение видно до того, как стало срывом срока</li>
          </ul>
        </div>
      </div>

      <div style={{ marginTop: "clamp(18px,2.6vh,40px)" }}>
        <div className="kdm-chain">
          <span>Задание</span>
          <i>→</i>
          <span>Исполнение</span>
          <i>→</i>
          <span>Событие</span>
          <i>→</i>
          <span data-hi="true">Решение</span>
          <i>→</i>
          <span>Следующий шаг</span>
        </div>
      </div>

      <div className="kdm-strap">
        <p className="kdm-strap-t">Работающие системы не заменяются.</p>
        <p className="kdm-small" style={{ maxWidth: "52ch" }}>
          Планировщик городской доставки, склад, документооборот и учётное ядро остаются
          на своих местах. Мы связываем их, а не переписываем.
        </p>
      </div>
    </div>
  )
}

/* ── 3. Круговые маршруты ───────────────────────────────────── */

function Backhaul() {
  return (
    <div className="kdm-inner kdm-stack-s">
      <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
        <p className="kdm-eyebrow">03 · Круговые маршруты</p>
        <span className="kdm-badge" data-k="hyp">
          Рабочая гипотеза · требует подтверждения КИТ
        </span>
      </div>

      <h2 className="kdm-h2" style={{ maxWidth: "24ch" }}>
        Не A → B. А непрерывная работа ресурса
      </h2>

      <div className="kdm-svg-wrap" data-h="md" style={{ marginTop: "clamp(8px,1.4vh,22px)" }}>
        <ResourceCycle />
      </div>

      <div className="kdm-cols" data-c="2" style={{ marginTop: "clamp(10px,1.6vh,24px)" }}>
        <p className="kdm-statement" style={{ maxWidth: "26ch" }}>
          Оптимизировать не маршрут, а последовательность полезной работы.
        </p>
        <p className="kdm-body" style={{ maxWidth: "60ch" }}>
          Минимизируем не километры сами по себе, а стоимость пустого движения, ожидания и
          неэффективного оборота. Задача не в том, чтобы построить геометрически красивый
          круг: короткий порожний переезд к выгодной следующей загрузке — нормальное решение.
        </p>
      </div>

      <div className="kdm-strap">
        <p className="kdm-strap-t">Что именно оптимизируем?</p>
        <p className="kdm-small" style={{ maxWidth: "62ch" }}>
          Тягач · полуприцеп · автопоезд · водителя · комбинацию ресурсов? И где в реальной
          технологии «Грузопровод™» происходит смена исполнения? Это первый вопрос встречи.
        </p>
      </div>
    </div>
  )
}

/* ── 4. Как формируется цепочка ─────────────────────────────── */

function Chain() {
  return (
    <div className="kdm-inner kdm-stack-s">
      <p className="kdm-eyebrow">04 · Как формируется цепочка</p>
      <h2 className="kdm-h2">Спрос · ресурсы · подбор</h2>

      <div className="kdm-svg-wrap" data-h="lg" style={{ marginTop: "clamp(10px,1.8vh,26px)" }}>
        <ChainFormation />
      </div>

      <div className="kdm-strap">
        <p className="kdm-strap-t" style={{ fontFamily: "var(--kdm-mono)", fontSize: "clamp(15px,1.3vw,24px)" }}>
          тягач ≠ полуприцеп ≠ водитель ≠ груз ≠ рейс
        </p>
        <p className="kdm-small" style={{ maxWidth: "64ch" }}>
          Разные сущности с разными ограничениями и разной доступностью. Здесь же ответ
          про автономность: беспилотный тягач становится ещё одной строкой в реестре
          ресурсов со своими условиями работы. Задание, груз, полуприцеп и логика
          подбора при этом не меняются.
        </p>
      </div>
    </div>
  )
}

/* ── 5. Чей это планировщик ─────────────────────────────────── */

function Planner() {
  return (
    <div className="kdm-inner kdm-stack-s">
      <p className="kdm-eyebrow">05 · Чей это планировщик</p>
      <h2 className="kdm-h2" style={{ maxWidth: "26ch" }}>
        Сначала выясняем, чем задача закрывается сегодня
      </h2>

      <div className="kdm-svg-wrap" data-h="lg" style={{ marginTop: "clamp(10px,1.8vh,26px)" }}>
        <PlannerOwnership />
      </div>

      <div className="kdm-strap">
        <p className="kdm-strap-t">Мы не конкурируем с тем, что уже работает.</p>
        <p className="kdm-small" style={{ maxWidth: "58ch" }}>
          Компания внедряет специализированный планировщик городской доставки. Прежде чем
          говорить о собственном алгоритме магистральной задачи, нужно понять, где проходит
          граница его возможностей — а не предполагать её.
        </p>
      </div>
    </div>
  )
}

/* ── 6. Control Tower ───────────────────────────────────────── */

function ControlTower() {
  const options = [
    { n: "1", t: "Назначить груз B → C", s: "простой сокращается до 20 мин", rec: true },
    { n: "2", t: "Переезд 42 км, забрать C → D", s: "простой 0, но порожний пробег" },
    { n: "3", t: "Сохранить исходный план", s: "простой 2 ч 25 мин" },
  ]

  return (
    <div className="kdm-inner kdm-stack-s">
      <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
        <p className="kdm-eyebrow">06 · Control Tower</p>
        <span className="kdm-badge" data-k="concept">Concept UI · пример интерфейса</span>
      </div>

      <h2 className="kdm-h2">Управление исключениями, а не дашборд</h2>

      <div className="kdm-cols" data-c="side" style={{ marginTop: "clamp(10px,1.8vh,26px)" }}>
        <div className="kdm-card" data-hi="true">
          <p className="kdm-card-k">Требует решения</p>
          <p className="kdm-card-t" style={{ fontSize: "clamp(20px,1.8vw,34px)" }}>Ресурс 047</p>

          <div style={{ marginTop: "clamp(12px,1.6vh,22px)", display: "flex", flexDirection: "column", gap: "clamp(7px,0.9vh,13px)" }}>
            {[
              ["Текущая перевозка", "выполняется", ""],
              ["Прибытие", "16:40", ""],
              ["Следующая загрузка", "отменена", "bad"],
              ["Прогноз простоя", "2 ч 25 мин", "warn"],
            ].map(([k, v, s]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, fontSize: "var(--kdm-t-body)" }}>
                <span style={{ color: "var(--kdm-ink-3)" }}>{k}</span>
                <span
                  style={{
                    fontWeight: 500,
                    color: s === "bad" ? "var(--kdm-bad)" : s === "warn" ? "var(--kdm-warn)" : "#fff",
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="kdm-stack-s">
          <p className="kdm-card-k">Возможные действия</p>
          {options.map((o) => (
            <div
              key={o.n}
              className="kdm-card"
              data-hi={o.rec ? "true" : undefined}
              style={{ display: "flex", gap: 16, alignItems: "baseline", padding: "clamp(12px,1.1vw,20px)" }}
            >
              <span style={{ fontFamily: "var(--kdm-mono)", color: "var(--kdm-ink-3)", fontSize: "var(--kdm-t-small)" }}>
                {o.n}
              </span>
              <span style={{ flex: 1 }}>
                <span style={{ display: "block", fontSize: "var(--kdm-t-body)", fontWeight: 500, color: "#fff" }}>
                  {o.t}
                </span>
                <span style={{ display: "block", fontSize: "var(--kdm-t-small)", color: "var(--kdm-ink-3)", marginTop: 4 }}>
                  {o.s}
                </span>
              </span>
              {o.rec ? (
                <span className="kdm-badge" data-k="concept" style={{ padding: "4px 10px" }}>
                  Рекомендуется
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="kdm-strap">
        <p className="kdm-strap-t">Не только показать проблему — помочь принять следующее решение.</p>
        <p className="kdm-small" style={{ maxWidth: "50ch" }}>
          Расчёт вариантов появляется тогда, когда есть данные. До обследования это образ
          интерфейса, а не обещание работающего алгоритма.
        </p>
      </div>
    </div>
  )
}

/* ── 7. Доверенный AI-контур ────────────────────────────────── */

function AiLayer() {
  return (
    <div className="kdm-inner kdm-stack-s">
      <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
        <p className="kdm-eyebrow">07 · Перспектива</p>
        <span className="kdm-badge" data-k="later">Не входит в Этап 0 и Этап 1</span>
      </div>

      <h2 className="kdm-h2">Доверенный корпоративный AI-контур</h2>

      <div className="kdm-svg-wrap" data-h="sm" style={{ marginTop: "clamp(8px,1.4vh,22px)" }}>
        <AiStack />
      </div>

      <div className="kdm-cols" data-c="2" style={{ marginTop: "clamp(12px,1.8vh,28px)" }}>
        <div>
          <p className="kdm-card-k">Вопросы, на которые он отвечает</p>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: "clamp(7px,0.9vh,12px)" }}>
            {[
              "Почему за неделю вырос порожний пробег на направлении?",
              "Какие ресурсы завтра могут остаться без следующего задания?",
              "Найди действующий регламент передачи полуприцепа в узле.",
            ].map((q) => (
              <p
                key={q}
                style={{
                  fontSize: "var(--kdm-t-body)",
                  lineHeight: 1.3,
                  color: "#fff",
                  borderLeft: "2px solid var(--kdm-accent)",
                  paddingLeft: 14,
                }}
              >
                {q}
              </p>
            ))}
          </div>
        </div>

        <div>
          <p className="kdm-card-k">Что чем решается</p>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: "clamp(5px,0.7vh,10px)" }}>
            {AI_BOUNDARIES.map((r) => (
              <div
                key={r.a}
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "baseline",
                  fontSize: "var(--kdm-t-body)",
                  lineHeight: 1.3,
                }}
              >
                <span style={{ flex: "1 1 0", color: "var(--kdm-ink-2)" }}>{r.a}</span>
                <span style={{ color: "var(--kdm-ink-3)" }}>→</span>
                <span style={{ flex: "1 1 0", color: BOUNDARY_TONE[r.tone], fontWeight: 500 }}>
                  {r.b}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="kdm-strap">
        <p className="kdm-small" style={{ maxWidth: "88ch" }}>
          Данные предприятия используются по правилам предприятия: разграничение доступа,
          аудит запросов, контроль того, что не должно уходить наружу. Конкретные требования
          безопасности — вопрос обследования, а не наше предположение.
        </p>
      </div>
    </div>
  )
}

/* ── 8. Следующий шаг ───────────────────────────────────────── */

function NextStep() {
  return (
    <div className="kdm-inner kdm-stack">
      <p className="kdm-eyebrow">08 · Следующий шаг</p>
      <h2 className="kdm-h2" style={{ fontSize: "clamp(34px,4.2vw,78px)" }}>
        Этап 0
      </h2>

      <div className="kdm-figs" style={{ marginTop: "clamp(6px,1.2vh,18px)" }}>
        {[
          ["Один", "реальный процесс"],
          ["Одно", "направление"],
          ["Один", "действующий терминал"],
          ["1–3 мес", "исторических данных"],
        ].map(([v, l]) => (
          <div key={l}>
            <div className="kdm-fig-v kdm-accent">{v}</div>
            <div className="kdm-fig-l">{l}</div>
          </div>
        ))}
      </div>

      <div className="kdm-svg-wrap" data-h="sm" style={{ marginTop: "clamp(14px,2.2vh,32px)" }}>
        <Stage0Flow />
      </div>

      <div className="kdm-strap">
        <p className="kdm-strap-t" style={{ fontSize: "clamp(18px,1.7vw,32px)", maxWidth: "28ch" }}>
          Сначала выясняем, где реально находится эффект. Затем решаем, что разрабатывать.
        </p>
        <p className="kdm-small" style={{ maxWidth: "44ch" }}>
          После Этапа 0 проект может стать меньше, а не обязательно больше. Это нормальный
          результат.
        </p>
      </div>
    </div>
  )
}

export const SLIDES: Slide[] = [
  { id: "title", nav: "Титул", render: Title },
  { id: "proposal", nav: "Что предлагаем", render: Proposal },
  { id: "backhaul", nav: "Круговые маршруты", render: Backhaul },
  { id: "chain", nav: "Как формируется цепочка", render: Chain },
  { id: "planner", nav: "Чей планировщик", render: Planner },
  { id: "tower", nav: "Control Tower", render: ControlTower },
  { id: "ai", nav: "AI-контур", render: AiLayer },
  { id: "next", nav: "Следующий шаг", render: NextStep },
]
