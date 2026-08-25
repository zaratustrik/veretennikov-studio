"use client"

import { Head, In, Slide } from "../primitives"
import {
  blockFinale,
  digitalContour,
  findingAnswer,
  languageGap,
  outsideView,
  registryNetwork,
  routeNotWindow,
  secondLanguage,
  threeModels,
  utppAssets,
} from "../content.ru"

type P = { index: number; total: number; active: boolean; beat: number }

/* ════════════════════════════════════════════════════════════
   ЧАСТЬ 8 — ВЗГЛЯД СО СТОРОНЫ

   Десять слайдов после финала. Блок самостоятельный: он не меняет
   и не переписывает предыдущие двадцать восемь, а продолжает их.

   Ход собственного исследования на сцену не выносится: зал видит
   готовые наблюдения, а не историю рабочих гипотез.

   Ни одной фотографии — сознательно: слайд 28 заканчивается срезом
   кадра, и снимок на 29-м стоял бы встык.
   ════════════════════════════════════════════════════════════ */

/* ── 29 · Взгляд со стороны ───────────────────────────────────
   Три строки рамки важнее самого утверждения: они снимают вопрос
   «вы что, аудит нам провели» до того, как он возникнет.
   ─────────────────────────────────────────────────────────── */

export function OutsideView({ index, total, active, beat }: P) {
  return (
    <Slide id={outsideView.id} tone="ink" label={outsideView.label} index={index} total={total} active={active}>
      <div className="utpp-an-open">
        <div>
          <In>
            <p className="utpp-eyebrow">{outsideView.eyebrow}</p>
          </In>
          <In d={1}>
            <p className="utpp-statement">{outsideView.statement}</p>
          </In>
          <In d={3}>
            <p className="utpp-statement-sub">{outsideView.sub}</p>
          </In>
        </div>

        <aside className="utpp-beat utpp-an-guard" data-on={beat >= 1}>
          <p className="utpp-note">{outsideView.frameTag}</p>
          <ul className="utpp-ov-frame">
            {outsideView.frame.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </aside>
      </div>
    </Slide>
  )
}

/* ── 30 · Масштаб ─────────────────────────────────────────────
   Экран уважения. Пять чисел без комментариев: разговор дальше
   идёт от сильной стороны, а не от нехватки.
   ─────────────────────────────────────────────────────────── */

export function UtppAssets({ index, total, active, beat }: P) {
  return (
    <Slide id={utppAssets.id} tone="sheet" label={utppAssets.label} index={index} total={total} active={active}>
      <Head eyebrow={utppAssets.eyebrow} title={utppAssets.title} lead={utppAssets.lead} wide />

      <ul className="utpp-facts">
        {utppAssets.facts.map((f, i) => (
          <In as="li" key={f.n + f.what} d={Math.min(i + 2, 8)}>
            <b className="utpp-fact-n">{f.n}</b>
            <span className="utpp-fact-what">{f.what}</span>
          </In>
        ))}
      </ul>

      <p className="utpp-beat utpp-key utpp-facts-key" data-on={beat >= 1}>
        {utppAssets.key}
      </p>
    </Slide>
  )
}

/* ── 31 · Большой цифровой контур ─────────────────────────────
   Расхождение чисел показано не как найденная ошибка, а как
   следствие масштаба: сначала пять контуров, и лишь потом две
   карточки. Обратный порядок читался бы как придирка.
   ─────────────────────────────────────────────────────────── */

export function DigitalContour({ index, total, active, beat }: P) {
  return (
    <Slide id={digitalContour.id} tone="ivory" label={digitalContour.label} index={index} total={total} active={active}>
      <Head eyebrow={digitalContour.eyebrow} title={digitalContour.title} wide />

      <div className="utpp-beat utpp-hosts" data-on={beat >= 0}>
        <p className="utpp-note">{digitalContour.contoursTag}</p>
        <ul>
          {digitalContour.contours.map((c) => (
            <li key={c.host}>
              <b>{c.host}</b>
              <span>{c.what}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="utpp-beat utpp-cards" data-on={beat >= 1}>
        <p className="utpp-note">{digitalContour.cardsTag}</p>
        <div className="utpp-cards-pair">
          {digitalContour.cards.map((c) => (
            <div key={c.page} className="utpp-card">
              <p className="utpp-card-name">{c.page}</p>
              <dl>
                {c.rows.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>

      <div className="utpp-beat utpp-contour-foot" data-on={beat >= 2}>
        <p className="utpp-key">{digitalContour.key}</p>
        <ul className="utpp-beat utpp-uses" data-on={beat >= 3}>
          {digitalContour.uses.map((u) => (
            <li key={u.name}>
              <b>{u.name}</b>
              <span>{u.what}</span>
            </li>
          ))}
        </ul>
      </div>
    </Slide>
  )
}

/* ── 32 · Ответ есть, дойти сложнее ───────────────────────────
   Акцент не на том, что поиск чего-то не нашёл, а на том, что
   ответ у Палаты существует по каждому вопросу.
   ─────────────────────────────────────────────────────────── */

export function FindingAnswer({ index, total, active, beat }: P) {
  return (
    <Slide id={findingAnswer.id} tone="sheet" label={findingAnswer.label} index={index} total={total} active={active}>
      <Head eyebrow={findingAnswer.eyebrow} title={findingAnswer.title} wide />

      <div className="utpp-probe" role="table" aria-label="Запросы предпринимателей и первые результаты поиска">
        <div className="utpp-probe-head" role="row">
          <span role="columnheader">{findingAnswer.cols.q}</span>
          <span role="columnheader">{findingAnswer.cols.a}</span>
        </div>
        {findingAnswer.rows.map((r, i) => (
          <In key={r.q} d={Math.min(i + 2, 8)}>
            <div className="utpp-probe-row" role="row" data-hit={r.hit}>
              <span role="cell">{r.q}</span>
              <span role="cell">{r.a}</span>
            </div>
          </In>
        ))}
      </div>

      <div className="utpp-beat utpp-have" data-on={beat >= 1}>
        <p className="utpp-note">{findingAnswer.haveTag}</p>
        <ul>
          {findingAnswer.have.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </div>

      <p className="utpp-beat utpp-key utpp-have-key" data-on={beat >= 2}>
        {findingAnswer.key}
      </p>
    </Slide>
  )
}

/* ── 33 · Разрыв между языками ────────────────────────────────
   Самый чистый экран блока. Последнее звено бордовое: акцент
   в этой системе означает «здесь нужен человек».
   ─────────────────────────────────────────────────────────── */

export function LanguageGap({ index, total, active, beat }: P) {
  return (
    <Slide id={languageGap.id} tone="ink" label={languageGap.label} index={index} total={total} active={active}>
      <div className="utpp-gap">
        <In>
          <p className="utpp-eyebrow">{languageGap.eyebrow}</p>
        </In>
        <In d={1}>
          <p className="utpp-statement utpp-gap-claim">{languageGap.statement}</p>
        </In>

        <ol className="utpp-chain">
          {languageGap.chain.map((c, i) => (
            <li
              key={c.n}
              className="utpp-beat utpp-chain-step"
              data-on={beat >= i + 1}
              data-human={c.human ? "" : undefined}
            >
              <span className="utpp-num">{c.n}</span>
              <b>{c.name}</b>
              <span className="utpp-chain-what">{c.what}</span>
            </li>
          ))}
        </ol>

        <p className="utpp-beat utpp-warn utpp-gap-note" data-on={beat >= languageGap.chain.length}>
          {languageGap.note}
        </p>
      </div>
    </Slide>
  )
}

/* ── 34 · Второй языковой контур ──────────────────────────────
   Показываем не объёмы в знаках, а две даты: 2026 против 2020.
   Разрыв в шесть лет виден с последнего ряда, объём в знаках —
   нет.
   ─────────────────────────────────────────────────────────── */

export function SecondLanguage({ index, total, active, beat }: P) {
  return (
    <Slide id={secondLanguage.id} tone="sheet" label={secondLanguage.label} index={index} total={total} active={active}>
      <Head eyebrow={secondLanguage.eyebrow} title={secondLanguage.title} wide />

      <div className="utpp-years">
        {secondLanguage.years.map((y, i) => (
          <In key={y.year} d={i + 2}>
            <div className="utpp-year" data-stale={y.stale ? "" : undefined}>
              <b>{y.year}</b>
              <span className="utpp-year-side">{y.side}</span>
              <span className="utpp-year-what">{y.what}</span>
            </div>
          </In>
        ))}
      </div>

      <p className="utpp-beat utpp-year-why" data-on={beat >= 1}>
        {secondLanguage.why}
      </p>

      <div className="utpp-beat utpp-pipe" data-on={beat >= 2}>
        <p className="utpp-note">{secondLanguage.pipeTag}</p>
        <ol>
          {secondLanguage.pipe.map((s, i) => (
            <li key={s} data-human={i === secondLanguage.humanAt ? "" : undefined}>
              {s}
            </li>
          ))}
        </ol>
      </div>
    </Slide>
  )
}

/* ── 35 · 976 членов — не только список ───────────────────────
   Один и тот же массив отвечает на два разных вопроса: о связях
   и о повторяющихся сигналах. Оговорка про границы обязательна
   и стоит рядом с самой идеей, а не в конце.
   ─────────────────────────────────────────────────────────── */

export function RegistryNetwork({ index, total, active, beat }: P) {
  return (
    <Slide id={registryNetwork.id} tone="ink" label={registryNetwork.label} index={index} total={total} active={active}>
      <Head eyebrow={registryNetwork.eyebrow} title={registryNetwork.title} wide />

      <div className="utpp-sig">
        <div className="utpp-beat utpp-sig-col" data-on={beat >= 0}>
          <p className="utpp-sig-name">{registryNetwork.now.name}</p>
          <ul>
            {registryNetwork.now.items.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        <div className="utpp-sig-mid" aria-hidden="true">
          →
        </div>

        <div className="utpp-beat utpp-sig-col" data-accent="true" data-on={beat >= 1}>
          <p className="utpp-sig-name">{registryNetwork.could.name}</p>
          <ul>
            {registryNetwork.could.items.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="utpp-small">{registryNetwork.scopeNote}</p>
        </div>
      </div>

      <div className="utpp-beat utpp-signals2" data-on={beat >= 2}>
        <p className="utpp-note">{registryNetwork.signalsTag}</p>
        <p className="utpp-signals2-flow">
          {registryNetwork.signals.from.join(" · ")}
          <i aria-hidden="true"> → </i>
          <b>{registryNetwork.signals.to.join(" · ")}</b>
        </p>
      </div>

      <div className="utpp-beat utpp-sig-foot" data-on={beat >= 3}>
        <p className="utpp-key">{registryNetwork.key}</p>
        <p className="utpp-sig-honest">{registryNetwork.human}</p>
      </div>
    </Slide>
  )
}

/* ── 36 · Три модели ──────────────────────────────────────────
   Третья карточка нужна не как образец, а как ограничение:
   она показывает, что мы различаем инструмент и институциональную
   модель.
   ─────────────────────────────────────────────────────────── */

export function ThreeModels({ index, total, active, beat }: P) {
  const models = threeModels.models
  return (
    <Slide id={threeModels.id} tone="sheet" label={threeModels.label} index={index} total={total} active={active}>
      <Head eyebrow={threeModels.eyebrow} title={threeModels.title} wide />

      <div className="utpp-models">
        {models.map((m, i) => (
          <div key={m.who} className="utpp-beat utpp-model" data-on={beat >= i} data-take={m.take}>
            <p className="utpp-model-who">{m.who}</p>
            <p className="utpp-model-what">{m.what}</p>
            <p className="utpp-model-link">{m.link}</p>
            <p className="utpp-model-verdict">{m.verdict}</p>
          </div>
        ))}
      </div>

      <p className="utpp-beat utpp-key utpp-models-key" data-on={beat >= models.length}>
        {threeModels.key}
      </p>
    </Slide>
  )
}

/* ── 37 · Не единое окно, а маршрут ───────────────────────────
   Институциональный экран. Он существует ровно затем, чтобы
   в зале не осталось впечатления, будто Палате предлагают забрать
   чужие функции.
   ─────────────────────────────────────────────────────────── */

export function RouteNotWindow({ index, total, active, beat }: P) {
  return (
    <Slide id={routeNotWindow.id} tone="ink" label={routeNotWindow.label} index={index} total={total} active={active}>
      <Head eyebrow={routeNotWindow.eyebrow} title={routeNotWindow.title} wide />

      <p className="utpp-beat utpp-task" data-on={beat >= 0}>
        {routeNotWindow.task}
      </p>

      <div className="utpp-beat utpp-split" data-on={beat >= 1}>
        {routeNotWindow.split.map((s, i) => (
          <div key={s.side} className="utpp-split-col" data-own={i === 0 ? "" : undefined}>
            <p className="utpp-split-name">{s.side}</p>
            <ul>
              {s.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="utpp-beat utpp-warn utpp-route-fact" data-on={beat >= 2}>
        {routeNotWindow.fact}
      </p>

      <div className="utpp-beat utpp-route-foot" data-on={beat >= 3}>
        <p className="utpp-route-chain">
          {routeNotWindow.chain.map((c, i) => (
            <span key={c}>
              {c}
              {i < routeNotWindow.chain.length - 1 ? <i aria-hidden="true">→</i> : null}
            </span>
          ))}
        </p>
        <p className="utpp-key">{routeNotWindow.key}</p>
      </div>
    </Slide>
  )
}

/* ── 38 · Итог ────────────────────────────────────────────────
   Ни предложения услуг, ни сроков, ни дорожной карты.
   ─────────────────────────────────────────────────────────── */

export function BlockFinale({ index, total, active, beat }: P) {
  return (
    <Slide id={blockFinale.id} tone="ivory" label={blockFinale.label} index={index} total={total} active={active}>
      <div className="utpp-an-fin">
        <div>
          <In>
            <p className="utpp-eyebrow">{blockFinale.eyebrow}</p>
          </In>
          <In d={1}>
            <p className="utpp-statement">{blockFinale.statement}</p>
          </In>
          <In d={3}>
            <p className="utpp-an-fin-body">{blockFinale.body}</p>
          </In>
        </div>

        <div className="utpp-beat utpp-an-fin-q" data-on={beat >= 1}>
          <p className="utpp-note">{blockFinale.questionTag}</p>
          <p className="utpp-an-fin-question">{blockFinale.question}</p>
        </div>
      </div>
    </Slide>
  )
}
