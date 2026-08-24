"use client"

import { Head, In, Slide, stateOf } from "../primitives"
import { boundary, contour, photos, pRebuild, scaleLadder } from "../content.ru"

type P = { index: number; total: number; active: boolean; beat: number }

/* ════════════════════════════════════════════════════════════
   22 — Лестница масштаба

   Шесть ступеней, физически поднимающихся слева направо.
   Нижняя строка — «чьё это решение»: именно она показывает,
   где заканчивается личный выбор руководителя.
   ════════════════════════════════════════════════════════════ */

export function ScaleLadder({ index, total, active, beat }: P) {
  const steps = scaleLadder.steps
  return (
    <Slide
      id={scaleLadder.id}
      tone="ink"
      label={scaleLadder.label}
      index={index}
      total={total}
      active={active}
      photo={photos.plantDusk}
    >
      <Head eyebrow={scaleLadder.eyebrow} title={scaleLadder.title} wide />

      <ol className="utpp-scale">
        {steps.map((s, i) => (
          <li
            key={s.n}
            className="utpp-fade"
            data-state={stateOf(i, beat)}
            style={{ ["--rise" as string]: `${(steps.length - 1 - i) * 2.1}rem` }}
          >
            <span className="utpp-num">{s.n}</span>
            <b>{s.name}</b>
            <span className="utpp-scale-what">{s.what}</span>
            <span className="utpp-scale-who">{s.who}</span>
          </li>
        ))}
      </ol>

      <p className="utpp-beat utpp-key utpp-scale-key" data-on={beat >= steps.length - 1}>
        {scaleLadder.key}
      </p>
    </Slide>
  )
}

/* ════════════════════════════════════════════════════════════
   23 — Корпоративный AI-контур

   Слои показаны сразу целиком — руководитель должен увидеть
   масштаб системы, — но разбираются по одному. Слева вертикаль
   контура прорастает вниз: это и есть ответ на вопрос
   «насколько глубоко это заходит в организацию».
   ════════════════════════════════════════════════════════════ */

export function Contour({ index, total, active, beat }: P) {
  const layers = contour.layers
  const current = layers[Math.min(beat, layers.length - 1)]!
  const done = beat >= layers.length

  return (
    <Slide
      id={contour.id}
      tone="ink"
      label={contour.label}
      index={index}
      total={total}
      active={active}
    >
      <div className="utpp-contour">
        <div className="utpp-contour-head">
          <Head eyebrow={contour.eyebrow} title={contour.title} lead={contour.lead} />

          <div className="utpp-beat utpp-contour-terms" data-on={done}>
            {contour.terms.map((t) => (
              <p key={t.term}>
                <b>{t.term}</b>
                {t.plain}
              </p>
            ))}
          </div>
        </div>

        <div className="utpp-contour-stack">
          <span
            className="utpp-contour-spine"
            aria-hidden="true"
            style={{ transform: `scaleY(${Math.min(beat + 1, layers.length) / layers.length})` }}
          />

          {layers.map((l, i) => (
            <div key={l.key} className="utpp-contour-layer utpp-fade" data-state={stateOf(i, beat)}>
              <p className="utpp-contour-name">
                <span className="utpp-num">{String(i + 1).padStart(2, "0")}</span>
                {l.name}
              </p>
              <ul>
                {l.nodes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          ))}

          <p className="utpp-contour-note" aria-live="polite">
            {done ? contour.key : current.note}
          </p>
        </div>
      </div>
    </Slide>
  )
}

/* ════════════════════════════════════════════════════════════
   24 — 4П: Перестроить

   Столбец «чьё решение» — главный. Он объясняет руководителю,
   где заканчивается личный инструмент и начинается архитектура.
   ════════════════════════════════════════════════════════════ */

export function PRebuild({ index, total, active, beat }: P) {
  return (
    <Slide
      id={pRebuild.id}
      tone="sheet"
      label={pRebuild.label}
      index={index}
      total={total}
      active={active}
    >
      <Head eyebrow={pRebuild.eyebrow} title={pRebuild.title} wide />

      <div className="utpp-trans" role="table" aria-label="Четыре уровня масштаба">
        <div className="utpp-trans-head" role="row">
          <span role="columnheader" />
          <span role="columnheader">Уровень</span>
          <span role="columnheader">Что меняется</span>
          <span role="columnheader">Чьё решение</span>
        </div>

        {pRebuild.levels.map((l, i) => (
          <In key={l.n} d={i + 2}>
            <div
              className="utpp-trans-row"
              role="row"
              data-last={i === pRebuild.levels.length - 1}
            >
              <span className="utpp-trans-n" role="cell">
                {l.n}
              </span>
              <span role="cell">
                <b>{l.name}</b>
                <em>{l.what}</em>
              </span>
              <span role="cell">{l.change}</span>
              <span role="cell">{l.who}</span>
            </div>
          </In>
        ))}
      </div>

      <p className="utpp-beat utpp-key utpp-trans-key" data-on={beat >= 1}>
        {pRebuild.key}
      </p>
    </Slide>
  )
}

/* ════════════════════════════════════════════════════════════
   25 — Граница самостоятельной работы

   Здесь нет и не должно быть продажи услуги. Слева — то, что
   руководитель может начать делать сегодня вечером. Справа —
   то, где начинается чужая ответственность. Границу зритель
   проводит сам.
   ════════════════════════════════════════════════════════════ */

export function Boundary({ index, total, active, beat }: P) {
  return (
    <Slide
      id={boundary.id}
      tone="ivory"
      label={boundary.label}
      index={index}
      total={total}
      active={active}
    >
      <Head eyebrow={boundary.eyebrow} title={boundary.title} wide />

      <div className="utpp-vs">
        <div className="utpp-beat utpp-vs-col" data-accent="true" data-on={beat >= 0}>
          <p className="utpp-vs-name">{boundary.self.name}</p>
          <ul>
            {boundary.self.items.map((s) => (
              <li key={s} data-sign="plus">
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="utpp-vs-mid" aria-hidden="true">
          граница
        </div>

        <div className="utpp-beat utpp-vs-col" data-on={beat >= 1}>
          <p className="utpp-vs-name">{boundary.pro.name}</p>
          <ul>
            {boundary.pro.items.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="utpp-beat utpp-boundary-foot" data-on={beat >= 2}>
        <p className="utpp-key">{boundary.key}</p>
        <p className="utpp-boundary-sub">{boundary.sub}</p>
      </div>
    </Slide>
  )
}
