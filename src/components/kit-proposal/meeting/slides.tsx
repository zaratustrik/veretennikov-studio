import {
  AI_BOUNDARIES,
  AiStack,
  BOUNDARY_TONE,
  NetworkScale,
  ResourceCycle,
  SolutionOrigin,
  Stage0Flow,
  WhatToOptimise,
} from "./diagrams"
import { HeroBackdrop, Zone } from "./parts"

export type Slide = {
  id: string
  /** Название для точек перехода и счётчика. */
  nav: string
  /** У экрана есть фоновое изображение — содержимое поднимается над ним. */
  hero?: boolean
  render: () => React.ReactNode
}

/* ── 1. Как мы поняли задачу ────────────────────────────────── */

function Understanding() {
  return (
    <>
      <HeroBackdrop name="highway-terminal" />
      <div className="kdm-inner kdm-stack">
        <div>
          <p className="kdm-eyebrow">Центр развития и внедрения искусственного интеллекта</p>
          <p className="kdm-small" style={{ marginTop: 6 }}>Свердловская область</p>
        </div>

      <h2 className="kdm-h2" style={{ fontSize: "var(--kdm-t-hero)", maxWidth: "18ch", lineHeight: 1.03 }}>
        Как мы поняли задачу
      </h2>

      <div className="kdm-cols" data-c="side" style={{ marginTop: "clamp(6px,1.2vh,20px)" }}>
        <div className="kdm-stack-s">
          <p className="kdm-lead">
            Не вторая транспортная система. Не отдельная система для беспилотников.
          </p>
          <p className="kdm-statement" style={{ maxWidth: "24ch" }}>
            Операционный слой управления магистральной сетью и ресурсами.
          </p>
        </div>

        <div className="kdm-stack-s">
          <p className="kdm-body kdm-white" style={{ fontSize: "var(--kdm-t-lead)", lineHeight: 1.42, maxWidth: "46ch" }}>
            Он связывает задания, исполнение, события и следующие решения — и не пытается
            заменить то, что уже решает свою задачу.
          </p>
          <div className="kdm-chain" style={{ marginTop: "clamp(12px,1.8vh,26px)" }}>
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
      </div>

      <div className="kdm-strap">
        <p className="kdm-strap-t">Поправьте нас, если поняли неверно.</p>
        <p className="kdm-small" style={{ maxWidth: "58ch" }}>
          Дальше всё построено на этой рамке.
        </p>
      </div>
      </div>
    </>
  )
}

/* ── 2. Где может лежать эффект ─────────────────────────────── */

function EffectZones() {
  return (
    <div className="kdm-inner kdm-stack-s">
      <p className="kdm-eyebrow">02 · Карта возможностей</p>
      <h2 className="kdm-h2" style={{ maxWidth: "26ch" }}>
        Где может лежать эффект для КИТ
      </h2>

      <div className="kdm-zones" style={{ marginTop: "clamp(10px,1.6vh,26px)" }}>
        <Zone
          isLead
          n="Контур 1 · вероятный вход"
          title="Сеть и ресурсы"
          lead="Что везёт ресурс сейчас и чем продолжит работу дальше."
          tags={["магистральные плечи", "загрузка ресурса", "следующий груз", "порожний пробег", "план и факт"]}
          image="trailer-executors"
        />
        <Zone
          n="Контур 2 · смежный"
          title="Узел и терминал"
          lead="Потери возникают не только на дороге, но и в момент передачи исполнения."
          tags={["ожидание", "слот и очередь", "передача ответственности", "сцепка и расцепка", "готовность к выезду"]}
          image="terminal-dusk"
        />
        <Zone
          n="Контур 3 · перспективный"
          title="Данные и документы"
          lead="Накопленные данные, регламенты и документы как рабочий ресурс сотрудников."
          tags={["причины отклонений", "внутренние знания", "регламенты", "аналитика", "цифровой помощник"]}
          image="control-room"
        />
      </div>

      <div className="kdm-strap">
        <p className="kdm-strap-t" style={{ maxWidth: "40ch" }}>
          Скорее всего, начинать имеет смысл с одного контура. Но устроены они связанно.
        </p>
        <p className="kdm-small" style={{ maxWidth: "46ch" }}>
          Какой из трёх для вас приоритетен сейчас — один из вопросов этой встречи.
        </p>
      </div>
    </div>
  )
}

/* ── 2. Непрерывная работа ресурса ──────────────────────────── */

function ContinuousWork() {
  return (
    <div className="kdm-inner kdm-stack-s">
      <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
        <p className="kdm-eyebrow">03 · Вероятный вход</p>
        <span className="kdm-badge" data-k="hyp">Рабочая гипотеза</span>
      </div>

      <h2 className="kdm-h2" style={{ maxWidth: "26ch" }}>
        От отдельного рейса — к непрерывной работе ресурса
      </h2>

      <div className="kdm-svg-wrap" data-h="md" style={{ marginTop: "clamp(6px,1.2vh,20px)" }}>
        <ResourceCycle />
      </div>

      <div className="kdm-cols" data-c="2" style={{ marginTop: "clamp(10px,1.6vh,24px)" }}>
        <p className="kdm-statement" style={{ maxWidth: "27ch" }}>
          После выгрузки ресурс не должен автоматически превращаться в пустой перегон.
        </p>
        <p className="kdm-body" style={{ maxWidth: "58ch" }}>
          Задача — искать экономически разумное продолжение работы. Считаем не километры
          сами по себе, а стоимость пустого движения, ожидания и медленного оборота.
          Короткий порожний переезд к выгодной следующей загрузке — нормальное решение.
        </p>
      </div>

      <div className="kdm-strap">
        <p className="kdm-strap-t">В разговоре это прозвучало как «круговые маршруты».</p>
        <p className="kdm-small" style={{ maxWidth: "48ch" }}>
          Точную постановку выясняем вместе: близких задач несколько, и решаются они
          по-разному.
        </p>
      </div>
    </div>
  )
}

/* ── 3. Что именно оптимизируем ─────────────────────────────── */

function WhatExactly() {
  return (
    <div className="kdm-inner kdm-stack-s">
      <p className="kdm-eyebrow">04 · Главный вопрос</p>
      <h2 className="kdm-h2" style={{ maxWidth: "24ch" }}>
        Что именно нужно оптимизировать
      </h2>

      <div className="kdm-svg-wrap" data-h="md" style={{ marginTop: "clamp(6px,1.2vh,20px)" }}>
        <WhatToOptimise />
      </div>

      <div className="kdm-strap">
        <p className="kdm-strap-t" style={{ fontSize: "clamp(17px,1.6vw,30px)", maxWidth: "34ch" }}>
          Какой ресурс или комбинацию вы имеете в виду?
        </p>
        <p className="kdm-small" style={{ maxWidth: "52ch" }}>
          От ответа зависит и постановка задачи, и состав нужных данных. Здесь же ответ про
          автономность: беспилотный тягач — ещё одна строка в этом списке, со своими
          ограничениями.
        </p>
      </div>
    </div>
  )
}

/* ── 4. Откуда возникает решение ────────────────────────────── */

function SolutionSource() {
  return (
    <div className="kdm-inner kdm-stack-s">
      <p className="kdm-eyebrow">05 · Механика</p>
      <h2 className="kdm-h2">Откуда возникает решение</h2>

      <div className="kdm-svg-wrap" data-h="lg" style={{ marginTop: "clamp(6px,1.2vh,18px)" }}>
        <SolutionOrigin />
      </div>

      <div className="kdm-strap">
        <p className="kdm-strap-t">Новый оптимизатор не создаётся по умолчанию.</p>
        <p className="kdm-small" style={{ maxWidth: "78ch" }}>
          Сначала проверяем, что умеет уже работающий планировщик: какой функционал
          приобретён, покрывает ли он магистральную сеть и обратную загрузку, какие данные
          в него передаются. Если задача закрывается им — второй мы не строим.
        </p>
      </div>
    </div>
  )
}

/* ── 5. Что видит оператор ──────────────────────────────────── */

function ControlTower() {
  const options = [
    { n: "1", t: "Назначить груз B → C", s: "ожидание сокращается", rec: true },
    { n: "2", t: "Переезд 42 км, забрать C → D", s: "ожидания нет, но есть порожний пробег" },
    { n: "3", t: "Оставить как есть", s: "ожидание 2 ч 25 мин" },
  ]

  return (
    <div className="kdm-inner kdm-stack-s">
      <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
        <p className="kdm-eyebrow">06 · Что видит оператор</p>
        <span className="kdm-badge" data-k="concept">Пример интерфейса · данные условные</span>
      </div>

      <h2 className="kdm-h2" style={{ maxWidth: "22ch" }}>
        Следующий груз исчез. Что делать?
      </h2>

      <div className="kdm-cols" data-c="side" style={{ marginTop: "clamp(8px,1.4vh,22px)" }}>
        <div className="kdm-card" data-hi="true">
          <p className="kdm-card-k">Требует решения</p>
          <p className="kdm-card-t" style={{ fontSize: "clamp(20px,1.8vw,34px)" }}>Ресурс 047</p>

          <div style={{ marginTop: "clamp(12px,1.6vh,22px)", display: "flex", flexDirection: "column", gap: "clamp(7px,0.9vh,13px)" }}>
            {[
              ["Текущая перевозка", "выполняется", ""],
              ["Прибытие", "16:40", ""],
              ["Следующая загрузка", "отменена", "bad"],
              ["Ожидание без работы", "2 ч 25 мин", "warn"],
            ].map(([k, v, s]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, fontSize: "var(--kdm-t-body)" }}>
                <span style={{ color: "var(--kdm-ink-3)" }}>{k}</span>
                <span style={{ fontWeight: 500, color: s === "bad" ? "var(--kdm-bad)" : s === "warn" ? "var(--kdm-warn)" : "#fff" }}>
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
          Картина ситуации имеет ценность только тогда, когда помогает принять следующее решение.
        </p>
        <p className="kdm-small" style={{ maxWidth: "42ch" }}>
          Сравнение вариантов появляется после того, как появятся данные. Сейчас это образ
          экрана, а не работающий расчёт.
        </p>
      </div>
    </div>
  )
}

/* ── 6. От маршрута к сети ──────────────────────────────────── */

function FromRouteToNetwork() {
  return (
    <div className="kdm-inner kdm-stack-s">
      <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
        <p className="kdm-eyebrow">07 · Масштаб</p>
        <span className="kdm-badge" data-k="later">Развитие после подтверждения базовой задачи</span>
      </div>

      <h2 className="kdm-h2" style={{ maxWidth: "24ch" }}>
        От одного маршрута — к управлению сетью
      </h2>

      <div className="kdm-svg-wrap" data-h="md" style={{ marginTop: "clamp(8px,1.4vh,22px)" }}>
        <NetworkScale />
      </div>

      <div className="kdm-strap">
        <p className="kdm-strap-t">Ничего из пунктирной части не входит в первый этап.</p>
        <p className="kdm-small" style={{ maxWidth: "62ch" }}>
          Это направление, а не план работ. Смысл показывать его сейчас один: то, что
          проверяется на одном направлении, не должно мешать расширению потом.
        </p>
      </div>
    </div>
  )
}

/* ── 7. Этап 0 ──────────────────────────────────────────────── */

function NextStep() {
  return (
    <div className="kdm-inner kdm-stack">
      <p className="kdm-eyebrow">08 · Следующий шаг</p>
      <h2 className="kdm-h2" style={{ fontSize: "clamp(34px,4.2vw,78px)" }}>
        Этап 0
      </h2>

      <p className="kdm-lead" style={{ maxWidth: "42ch" }}>
        Совместно пройти один реальный процесс и определить точную постановку задачи.
      </p>

      <div className="kdm-svg-wrap" data-h="sm" style={{ marginTop: "clamp(10px,1.8vh,28px)" }}>
        <Stage0Flow />
      </div>

      <div className="kdm-cols" data-c="2" style={{ marginTop: "clamp(10px,1.6vh,24px)" }}>
        <ul className="kdm-list">
          <li>Один реальный рейс от заказа до закрытия</li>
          <li>Одно направление или связка направлений</li>
          <li>Один действующий терминал — стройка не нужна</li>
        </ul>
        <ul className="kdm-list">
          <li>Доступные исторические данные</li>
          <li>Карта систем и данных</li>
          <li>Baseline и постановка задачи оптимизации</li>
        </ul>
      </div>

      <div className="kdm-strap">
        <p className="kdm-strap-t" style={{ fontSize: "clamp(17px,1.6vw,30px)", maxWidth: "30ch" }}>
          Сначала выясняем, где эффект. Потом решаем, что разрабатывать.
        </p>
        <p className="kdm-small" style={{ maxWidth: "44ch" }}>
          После первого этапа проект может стать меньше. Это нормальный результат, а не
          неудача.
        </p>
      </div>
    </div>
  )
}

/* ── Приложение · вне основной последовательности ───────────── */

function DataAppendix() {
  return (
    <div className="kdm-inner kdm-stack-s">
      <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
        <p className="kdm-eyebrow">Приложение · по запросу</p>
        <span className="kdm-badge" data-k="later">Контур 3 · не входит в этап 0</span>
      </div>

      <h2 className="kdm-h2" style={{ maxWidth: "28ch" }}>
        Данные и документы как рабочий ресурс
      </h2>

      <div className="kdm-svg-wrap" data-h="sm" style={{ marginTop: "clamp(6px,1.2vh,18px)" }}>
        <AiStack />
      </div>

      <div className="kdm-cols" data-c="2" style={{ marginTop: "clamp(10px,1.6vh,24px)" }}>
        <div>
          <p className="kdm-card-k">Примеры вопросов к данным, документам и внутренним знаниям</p>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: "clamp(6px,0.8vh,11px)" }}>
            {[
              "Почему за неделю выросло ожидание на направлении?",
              "Какие ресурсы завтра рискуют остаться без следующего задания?",
              "Какой регламент действует при передаче полуприцепа в узле?",
            ].map((q) => (
              <p
                key={q}
                style={{
                  fontSize: "var(--kdm-t-body)",
                  lineHeight: 1.3,
                  color: "#fff",
                  borderLeft: "2px solid var(--kdm-hyp)",
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
              <div key={r.a} style={{ display: "flex", gap: 14, alignItems: "baseline", fontSize: "var(--kdm-t-body)", lineHeight: 1.3 }}>
                <span style={{ flex: "1 1 0", color: "var(--kdm-ink-2)" }}>{r.a}</span>
                <span style={{ color: "var(--kdm-ink-3)" }}>→</span>
                <span style={{ flex: "1 1 0", color: BOUNDARY_TONE[r.tone], fontWeight: 500 }}>{r.b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="kdm-strap">
        <p className="kdm-small" style={{ maxWidth: "98ch" }}>
          Это не часть этапа 0 и не обязательная тема встречи. Но если КИТ увидит здесь
          ценность, накопленные данные и цифровой контур могут стать основой для
          внутреннего инструмента сотрудников и руководства. Клиентский сервис — отдельная
          история, и он у компании есть.
        </p>
      </div>
    </div>
  )
}

export const SLIDES: Slide[] = [
  { id: "understanding", nav: "Как мы поняли задачу", hero: true, render: Understanding },
  { id: "zones", nav: "Где может лежать эффект", render: EffectZones },
  { id: "continuous", nav: "Непрерывная работа ресурса", render: ContinuousWork },
  { id: "what", nav: "Что именно оптимизируем", render: WhatExactly },
  { id: "origin", nav: "Откуда возникает решение", render: SolutionSource },
  { id: "tower", nav: "Что видит оператор", render: ControlTower },
  { id: "network", nav: "От маршрута к сети", render: FromRouteToNetwork },
  { id: "next", nav: "Этап 0", render: NextStep },
]

/** Показывается только по отдельному действию; в основную последовательность не входит. */
export const APPENDIX: Slide = { id: "data", nav: "Данные", render: DataAppendix }
