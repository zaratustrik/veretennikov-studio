import { IntegrationContour, Stage0Flow } from "./diagrams"
import {
  ConsolidatedLoad,
  DirectReturn,
  MergedPool,
  NetworkFlow,
  SalesLoop,
} from "./freight"
import { HeroBackdrop } from "./parts"

export type Slide = {
  id: string
  /** Название для точек перехода и счётчика. */
  nav: string
  /** У экрана есть фоновое изображение — содержимое поднимается над ним. */
  hero?: boolean
  render: () => React.ReactNode
}

/* ── 1. Управление грузопотоками ────────────────────────────── */

function Title() {
  return (
    <>
      <HeroBackdrop name="highway-terminal" />
      <div className="kdm-inner kdm-stack">
        <div>
          <p className="kdm-eyebrow">Центр развития и внедрения искусственного интеллекта</p>
          <p className="kdm-small" style={{ marginTop: 6 }}>Свердловская область</p>
        </div>

        <h2 className="kdm-h2" style={{ fontSize: "var(--kdm-t-hero)", maxWidth: "16ch", lineHeight: 1.03 }}>
          Управление грузопотоками КИТ
        </h2>

        <p className="kdm-lead" style={{ maxWidth: "52ch" }}>
          Сборные грузы · транзитные склады · прямые рейсы · оптимизация загрузки
        </p>

        <div className="kdm-strap">
          <p className="kdm-strap-t" style={{ maxWidth: "44ch" }}>
            Оптимизировать движение груза через сеть — и тем же контуром эффективнее
            использовать прямые рейсы.
          </p>
          <p className="kdm-small" style={{ maxWidth: "42ch" }}>
            После вашего уточнения мы перестроили постановку. Поправьте, если поняли неверно.
          </p>
        </div>
      </div>
    </>
  )
}

/* ── 2. Сборный груз как сетевая задача ─────────────────────── */

function ConsolidatedFreight() {
  return (
    <div className="kdm-inner kdm-stack-s">
      <p className="kdm-eyebrow">02 · Предмет оптимизации</p>
      <h2 className="kdm-h2" style={{ maxWidth: "26ch" }}>
        Едут вместе — маршруты разные
      </h2>

      <div className="kdm-svg-wrap" data-h="lg" style={{ marginTop: "clamp(6px,1.2vh,18px)" }}>
        <ConsolidatedLoad />
      </div>

      <div className="kdm-strap">
        <p className="kdm-strap-t" style={{ maxWidth: "40ch" }}>
          Оптимизируется не маршрут машины, а путь каждой партии.
        </p>
        <p className="kdm-small" style={{ maxWidth: "48ch" }}>
          У партии свой получатель, свой срок, свой транзитный узел и своё следующее плечо.
        </p>
      </div>
    </div>
  )
}

/* ── 3. Через какие узлы должен пройти груз ─────────────────── */

function NetworkPath() {
  return (
    <div className="kdm-inner kdm-stack-s">
      <p className="kdm-eyebrow">03 · Масштаб задачи</p>
      <h2 className="kdm-h2" style={{ maxWidth: "26ch" }}>
        Через какие узлы должен пройти груз
      </h2>

      <div className="kdm-svg-wrap" data-h="lg" style={{ marginTop: "clamp(6px,1.2vh,18px)" }}>
        <NetworkFlow />
      </div>

      <div className="kdm-strap">
        <p className="kdm-strap-t">Задача сетевая, а не рейсовая.</p>
        <p className="kdm-small" style={{ maxWidth: "62ch" }}>
          Точную постановку — что минимизируем и при каких ограничениях — формулируем
          после того, как увидим ваши данные.
        </p>
      </div>
    </div>
  )
}

/* ── 4. Прямой рейс: что после доставки ─────────────────────── */

function DirectRun() {
  return (
    <div className="kdm-inner kdm-stack-s">
      <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
        <p className="kdm-eyebrow">04 · Второй источник эффекта</p>
        <span className="kdm-badge" data-k="hyp">Рабочая гипотеза</span>
      </div>

      <h2 className="kdm-h2" style={{ maxWidth: "24ch" }}>
        Машина выгрузилась. Что дальше?
      </h2>

      <div className="kdm-svg-wrap" data-h="lg" style={{ marginTop: "clamp(6px,1.2vh,18px)" }}>
        <DirectReturn />
      </div>

      <div className="kdm-strap">
        <p className="kdm-strap-t" style={{ maxWidth: "42ch" }}>
          Свободная машина — это транспортная ёмкость для следующего задания.
        </p>
        <p className="kdm-small" style={{ maxWidth: "48ch" }}>
          Вариант выбирается по деньгам и по операционной допустимости, а не по тому,
          насколько красиво замыкается маршрут.
        </p>
      </div>
    </div>
  )
}

/* ── 5. Объединение потоков ─────────────────────────────────── */

function OneNetwork() {
  return (
    <div className="kdm-inner kdm-stack-s">
      <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
        <p className="kdm-eyebrow">05 · Стратегическая идея</p>
        <span className="kdm-badge" data-k="hyp">Требует проверки на данных</span>
      </div>

      <h2 className="kdm-h2" style={{ maxWidth: "26ch" }}>
        Одна сеть заданий вместо двух отдельных потоков
      </h2>

      <div className="kdm-svg-wrap" data-h="lg" style={{ marginTop: "clamp(6px,1.2vh,18px)" }}>
        <MergedPool />
      </div>

      <div className="kdm-strap">
        <p className="kdm-strap-t" style={{ maxWidth: "40ch" }}>
          Не любой прямой рейс можно сшить со сборным.
        </p>
        <p className="kdm-small" style={{ maxWidth: "54ch" }}>
          География, время, вместимость, тип кузова, совместимость, график терминала,
          договорные условия. Система ищет варианты, которые допустимы — если они есть.
        </p>
      </div>
    </div>
  )
}

/* ── 6. Что видит оператор ──────────────────────────────────── */

function ControlTower() {
  const options = [
    { n: "1", t: "Развести партии по двум плечам", s: "срок сохраняется, растёт число перегрузок", rec: true },
    { n: "2", t: "Отправить через соседний узел", s: "дольше на плече, но без перегрузки" },
    { n: "3", t: "Оставить план", s: "риск по двум партиям из четырёх" },
  ]

  return (
    <div className="kdm-inner kdm-stack-s">
      <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
        <p className="kdm-eyebrow">06 · Что видит оператор</p>
        <span className="kdm-badge" data-k="concept">
          Concept UI · расчёт возможен только на данных КИТ
        </span>
      </div>

      <h2 className="kdm-h2" style={{ maxWidth: "24ch" }}>
        Транзитный узел перегружен. Кого это задевает?
      </h2>

      <div className="kdm-cols" data-c="side" style={{ marginTop: "clamp(8px,1.4vh,22px)" }}>
        <div className="kdm-card" data-hi="true">
          <p className="kdm-card-k">Требует решения</p>
          <p className="kdm-card-t" style={{ fontSize: "clamp(19px,1.7vw,32px)" }}>
            Терминал C · окно 14:00
          </p>

          <div style={{ marginTop: "clamp(12px,1.6vh,22px)", display: "flex", flexDirection: "column", gap: "clamp(7px,0.9vh,13px)" }}>
            {[
              ["Затронуто партий", "4 из 11", "warn"],
              ["Под риском срока", "2 партии", "bad"],
              ["Ожидание обработки", "+3 ч 10 мин", "warn"],
              ["Свободная машина рядом", "есть, до 40 км", "ok"],
            ].map(([k, v, s]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, fontSize: "var(--kdm-t-body)" }}>
                <span style={{ color: "var(--kdm-ink-3)" }}>{k}</span>
                <span
                  style={{
                    fontWeight: 500,
                    color:
                      s === "bad" ? "var(--kdm-bad)"
                      : s === "warn" ? "var(--kdm-warn)"
                      : s === "ok" ? "var(--kdm-ok)"
                      : "#fff",
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="kdm-stack-s">
          <p className="kdm-card-k">Варианты продолжения</p>
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
                <span style={{ display: "block", fontSize: "var(--kdm-t-body)", fontWeight: 500, color: "#fff" }}>{o.t}</span>
                <span style={{ display: "block", fontSize: "var(--kdm-t-small)", color: "var(--kdm-ink-3)", marginTop: 4 }}>{o.s}</span>
              </span>
              {o.rec ? (
                <span className="kdm-badge" data-k="concept" style={{ padding: "4px 10px" }}>Предлагается</span>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="kdm-strap">
        <p className="kdm-strap-t" style={{ maxWidth: "38ch" }}>
          Видно не «узел перегружен», а какие партии и какие сроки это задевает.
        </p>
        <p className="kdm-small" style={{ maxWidth: "42ch" }}>
          Чтобы так считать, нужен плановый и фактический путь каждой партии. Это и есть
          основа контура.
        </p>
      </div>
    </div>
  )
}

/* ── 7. Встраивание в существующий контур ───────────────────── */

function Integration() {
  return (
    <div className="kdm-inner kdm-stack-s">
      <p className="kdm-eyebrow">07 · Границы</p>
      <h2 className="kdm-h2" style={{ maxWidth: "24ch" }}>
        Не вместо систем, а между ними
      </h2>

      <div className="kdm-svg-wrap" data-h="lg" style={{ marginTop: "clamp(6px,1.2vh,18px)" }}>
        <IntegrationContour />
      </div>

      <div className="kdm-strap">
        <p className="kdm-strap-t" style={{ maxWidth: "38ch" }}>
          Не заменяем работающие системы — соединяем их вокруг операционного ядра.
        </p>
        <p className="kdm-small" style={{ maxWidth: "50ch" }}>
          Корпоративные процессы остаются в привычной среде, данные о грузопотоке
          и расчёты — в специализированном контуре.
        </p>
      </div>
    </div>
  )
}

/* ── 8. Второй контур: продажи ──────────────────────────────── */

function SalesContour() {
  return (
    <div className="kdm-inner kdm-stack-s">
      <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
        <p className="kdm-eyebrow">08 · Отдельный контур</p>
        <span className="kdm-badge" data-k="later">Не входит в оптимизационное ядро</span>
      </div>

      <h2 className="kdm-h2" style={{ maxWidth: "26ch" }}>
        Что предложить конкретному клиенту
      </h2>

      <div className="kdm-svg-wrap" data-h="md" style={{ marginTop: "clamp(6px,1.2vh,18px)" }}>
        <SalesLoop />
      </div>

      <div className="kdm-strap">
        <p className="kdm-strap-t" style={{ maxWidth: "40ch" }}>
          Отдельная польза, отдельная проверка, отдельное решение.
        </p>
        <p className="kdm-small" style={{ maxWidth: "50ch" }}>
          С оптимизацией грузопотоков это не связано и в один этап не объединяется.
        </p>
      </div>
    </div>
  )
}

/* ── 9. Этап 0 ──────────────────────────────────────────────── */

function NextStep() {
  const streams = [
    {
      k: "A",
      t: "Сборные грузопотоки",
      s: "несколько терминалов, набор направлений, история партий и фактических плеч",
      goal: "можно ли улучшить консолидацию и прохождение через сеть",
      lead: true,
    },
    {
      k: "B",
      t: "Прямые рейсы",
      s: "история рейсов, загрузка, порожние участки, доступные тогда задания",
      goal: "где существовали разумные варианты последующей загрузки",
    },
    {
      k: "C",
      t: "Продажи",
      s: "обезличенная история клиентов: продукты, направления, частота, сезонность",
      goal: "работает ли рекомендация продукта и следующего действия",
    },
  ]

  return (
    <div className="kdm-inner kdm-stack-s">
      <p className="kdm-eyebrow">09 · Следующий шаг</p>
      <h2 className="kdm-h2" style={{ fontSize: "clamp(30px,3.8vw,66px)" }}>
        Этап 0
      </h2>

      <p className="kdm-lead" style={{ maxWidth: "48ch" }}>
        Три направления проверки. Запускать все три сразу не нужно — приоритет определяем
        сегодня.
      </p>

      <div className="kdm-zones" style={{ marginTop: "clamp(8px,1.4vh,22px)" }}>
        {streams.map((s) => (
          <article className="kdm-zone" data-lead={s.lead ? "true" : undefined} key={s.k}>
            <div className="kdm-zone-body">
              <span className="kdm-zone-n">Направление {s.k}</span>
              <h3 className="kdm-zone-t">{s.t}</h3>
              <p className="kdm-zone-l">{s.s}</p>
              <div className="kdm-zone-tags">
                <span>Цель: {s.goal}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="kdm-svg-wrap" data-h="sm" style={{ marginTop: "clamp(8px,1.4vh,20px)" }}>
        <Stage0Flow />
      </div>

      <div className="kdm-strap">
        <p className="kdm-strap-t" style={{ maxWidth: "34ch" }}>
          Проверяем на ваших грузопотоках. Потом решаем, что разрабатывать.
        </p>
        <p className="kdm-small" style={{ maxWidth: "40ch" }}>
          После первого этапа проект может стать меньше. Это нормальный результат.
        </p>
      </div>
    </div>
  )
}

/* ── Приложение · вне основной последовательности ───────────── */

function DataAppendix() {
  const uses = [
    { who: "Менеджеру по продажам", what: "карточка клиента, подготовка к звонку, черновик предложения" },
    { who: "Сотруднику", what: "поиск по регламентам, инструкциям и документам, помощь с ответом клиенту" },
    { who: "Руководителю", what: "вопросы к операционным данным, причины отклонений, аналитические выжимки" },
  ]
  const tech = [
    { a: "Консолидация и распределение", b: "математическая оптимизация" },
    { a: "Вероятность потребности в продукте", b: "статистика и модель, если хватит истории" },
    { a: "Объяснение, текст, поиск по знаниям", b: "языковая модель" },
  ]

  return (
    <div className="kdm-inner kdm-stack-s">
      <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
        <p className="kdm-eyebrow">Приложение · по запросу</p>
        <span className="kdm-badge" data-k="later">Не входит в этап 0</span>
      </div>

      <h2 className="kdm-h2" style={{ maxWidth: "28ch" }}>
        Данные и документы как рабочий ресурс
      </h2>

      <div className="kdm-cols" data-c="2" style={{ marginTop: "clamp(10px,1.6vh,26px)" }}>
        <div>
          <p className="kdm-card-k">Кому и что это даёт</p>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: "clamp(8px,1vh,14px)" }}>
            {uses.map((u) => (
              <div key={u.who} style={{ borderLeft: "2px solid var(--kdm-hyp)", paddingLeft: 14 }}>
                <p style={{ fontSize: "var(--kdm-t-body)", color: "#fff", fontWeight: 500, lineHeight: 1.25 }}>{u.who}</p>
                <p style={{ fontSize: "var(--kdm-t-small)", color: "var(--kdm-ink-2)", marginTop: 3, lineHeight: 1.35 }}>{u.what}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="kdm-card-k">Что чем решается</p>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: "clamp(7px,0.9vh,13px)" }}>
            {tech.map((r) => (
              <div key={r.a} style={{ display: "flex", gap: 14, alignItems: "baseline", fontSize: "var(--kdm-t-body)", lineHeight: 1.3 }}>
                <span style={{ flex: "1 1 0", color: "var(--kdm-ink-2)" }}>{r.a}</span>
                <span style={{ color: "var(--kdm-ink-3)" }}>→</span>
                <span style={{ flex: "1 1 0", color: "var(--kdm-accent-2)", fontWeight: 500 }}>{r.b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="kdm-strap">
        <p className="kdm-small" style={{ maxWidth: "96ch" }}>
          Языковая модель объясняет и готовит текст — она не выставляет оценку и не
          планирует перевозки. Клиентский сервис — отдельная история, и он у компании есть.
        </p>
      </div>
    </div>
  )
}

export const SLIDES: Slide[] = [
  { id: "title", nav: "Управление грузопотоками", hero: true, render: Title },
  { id: "consolidated", nav: "Едут вместе — маршруты разные", render: ConsolidatedFreight },
  { id: "network", nav: "Через какие узлы", render: NetworkPath },
  { id: "direct", nav: "Машина выгрузилась. Что дальше?", render: DirectRun },
  { id: "onenet", nav: "Одна сеть заданий", render: OneNetwork },
  { id: "tower", nav: "Что видит оператор", render: ControlTower },
  { id: "integration", nav: "Не вместо систем, а между ними", render: Integration },
  { id: "sales", nav: "Что предложить клиенту", render: SalesContour },
  { id: "next", nav: "Этап 0", render: NextStep },
]

/** Показывается только по отдельному действию; в основную последовательность не входит. */
export const APPENDIX: Slide = { id: "data", nav: "Данные", render: DataAppendix }
