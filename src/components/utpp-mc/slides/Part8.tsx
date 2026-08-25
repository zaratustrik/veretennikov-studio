"use client"

import { Head, In, Slide, stateOf } from "../primitives"
import {
  blockFinale,
  fiveLevels,
  hypothesisCheck,
  knowledgeMap,
  pulse,
  searchTest,
  turnOnUs,
  utppScope,
  whyNow,
} from "../content.ru"

type P = { index: number; total: number; active: boolean; beat: number }

/* ════════════════════════════════════════════════════════════
   ЧАСТЬ 8 — РАЗБОР

   Девять слайдов после финала. Блок самостоятельный: он не меняет
   и не переписывает предыдущие двадцать восемь, а продолжает их.

   Ни одной фотографии — сознательно. Слайд 28 заканчивается срезом
   кадра, и снимок на 29-м стоял бы встык. Здесь носитель смысла —
   сами данные.
   ════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════
   29 — Поворот

   Единственная задача экрана — сменить рамку и сразу же поставить
   оговорку. Легенда из четырёх меток не украшение: дальше каждый
   экран опирается на неё, и зал должен успеть её прочитать.
   ════════════════════════════════════════════════════════════ */

export function TurnOnUs({ index, total, active, beat }: P) {
  return (
    <Slide
      id={turnOnUs.id}
      tone="ink"
      label={turnOnUs.label}
      index={index}
      total={total}
      active={active}
    >
      <div className="utpp-an-open">
        <div className="utpp-an-open-main">
          <In>
            <p className="utpp-eyebrow">{turnOnUs.eyebrow}</p>
          </In>
          <In d={1}>
            <p className="utpp-statement">{turnOnUs.statement}</p>
          </In>
          <In d={3}>
            <p className="utpp-statement-sub">{turnOnUs.sub}</p>
          </In>
        </div>

        <aside className="utpp-beat utpp-an-guard" data-on={beat >= 1}>
          <p className="utpp-note">{turnOnUs.disclaimerTitle}</p>
          <p className="utpp-an-guard-text">{turnOnUs.disclaimer}</p>

          <dl className="utpp-an-legend">
            {turnOnUs.legend.map((l) => (
              <div key={l.tag}>
                <dt>{l.tag}</dt>
                <dd>{l.what}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </Slide>
  )
}

/* ════════════════════════════════════════════════════════════
   30 — Понять: масштаб

   Экран уважения. Сначала цифры того, что уже построено, и только
   потом — разговор о входе. Обратный порядок превратил бы разбор
   в претензию.
   ════════════════════════════════════════════════════════════ */

export function UtppScope({ index, total, active, beat }: P) {
  return (
    <Slide
      id={utppScope.id}
      tone="sheet"
      label={utppScope.label}
      index={index}
      total={total}
      active={active}
    >
      <Head eyebrow={utppScope.eyebrow} title={utppScope.title} lead={utppScope.lead} wide />

      <ul className="utpp-facts">
        {utppScope.facts.map((f, i) => (
          <In as="li" key={f.n + f.what} d={Math.min(i + 2, 8)}>
            <b className="utpp-fact-n">{f.n}</b>
            <span className="utpp-fact-what">{f.what}</span>
            {f.more ? <span className="utpp-fact-more">{f.more}</span> : null}
          </In>
        ))}
      </ul>

      <p className="utpp-beat utpp-key utpp-facts-key" data-on={beat >= 1}>
        {utppScope.key}
      </p>
    </Slide>
  )
}

/* ════════════════════════════════════════════════════════════
   31 — Эксперимент

   Ядро блока. Пять строк открываются по одной, и первые три
   работают: зал должен увидеть, что мы не подбирали примеры под
   вывод. Ломается только на четвёртой.

   Строки открываются через data-on, а не через stateOf: таблицу
   с данными нельзя гасить по мере продвижения — к ней возвращаются
   глазами до конца слайда.
   ════════════════════════════════════════════════════════════ */

export function SearchTest({ index, total, active, beat }: P) {
  const rows = searchTest.rows
  const done = beat >= rows.length

  return (
    <Slide
      id={searchTest.id}
      tone="ivory"
      label={searchTest.label}
      index={index}
      total={total}
      active={active}
    >
      <Head eyebrow={searchTest.eyebrow} title={searchTest.title} lead={searchTest.lead} wide />

      <div className="utpp-probe" role="table" aria-label="Пять запросов к поиску по сайту">
        <div className="utpp-probe-head" role="row">
          <span role="columnheader">{searchTest.cols.q}</span>
          <span role="columnheader">{searchTest.cols.n}</span>
          <span role="columnheader">{searchTest.cols.first}</span>
        </div>

        {rows.map((r, i) => (
          <div
            key={r.q}
            className="utpp-beat utpp-probe-row"
            role="row"
            data-on={beat >= i}
            data-hit={r.hit}
          >
            <span role="cell">
              <b>{r.q}</b>
              <em>{r.note}</em>
            </span>
            <span className="utpp-probe-n" role="cell">
              {r.n}
            </span>
            <span role="cell">{r.first}</span>
          </div>
        ))}
      </div>

      <div className="utpp-beat utpp-probe-foot" data-on={done}>
        <p className="utpp-key">{searchTest.key}</p>
        <p className="utpp-warn utpp-probe-aside">{searchTest.aside}</p>
      </div>
    </Slide>
  )
}

/* ════════════════════════════════════════════════════════════
   32 — Проверка гипотезы

   Самый важный экран блока с точки зрения доверия. Здесь мы прямо
   показываем, что собственная гипотеза не подтвердилась целиком —
   и что вывод от этого стал точнее, а не слабее.
   ════════════════════════════════════════════════════════════ */

export function HypothesisCheck({ index, total, active, beat }: P) {
  const blocks = hypothesisCheck.blocks
  return (
    <Slide
      id={hypothesisCheck.id}
      tone="sheet"
      label={hypothesisCheck.label}
      index={index}
      total={total}
      active={active}
    >
      <Head eyebrow={hypothesisCheck.eyebrow} title={hypothesisCheck.title} wide />

      <ol className="utpp-hyp">
        {blocks.map((b, i) => (
          <li key={b.tag} className="utpp-beat utpp-hyp-block" data-on={beat >= i} data-last={i === blocks.length - 1}>
            <p className="utpp-hyp-tag">{b.tag}</p>
            <p className="utpp-h3">{b.title}</p>
            <p className="utpp-hyp-text">{b.text}</p>
          </li>
        ))}
      </ol>

      <div className="utpp-beat utpp-hyp-foot" data-on={beat >= blocks.length}>
        <p className="utpp-key">{hypothesisCheck.key}</p>
        <p className="utpp-hyp-sub">{hypothesisCheck.sub}</p>
      </div>
    </Slide>
  )
}

/* ════════════════════════════════════════════════════════════
   33 — Карта знания

   Прямой мостик к слайдам про RAG: та же задача, но на материале,
   который зал знает лучше нас. Английская версия — третьим beat'ом,
   как частный случай той же природы, а не как отдельный упрёк.
   ════════════════════════════════════════════════════════════ */

export function KnowledgeMap({ index, total, active, beat }: P) {
  return (
    <Slide
      id={knowledgeMap.id}
      tone="ink"
      label={knowledgeMap.label}
      index={index}
      total={total}
      active={active}
    >
      <Head eyebrow={knowledgeMap.eyebrow} title={knowledgeMap.title} wide />

      <ul className="utpp-cont">
        {knowledgeMap.containers.map((c, i) => (
          <In as="li" key={c.name} d={Math.min(i + 2, 8)}>
            <b className="utpp-h3">{c.name}</b>
            <span className="utpp-cont-n">{c.n}</span>
            <span className="utpp-cont-by">{c.by}</span>
          </In>
        ))}
      </ul>

      <p className="utpp-beat utpp-key utpp-cont-key" data-on={beat >= 1}>
        {knowledgeMap.key}
      </p>

      <aside className="utpp-beat utpp-cont-aside" data-on={beat >= 2}>
        <p className="utpp-note">{knowledgeMap.asideTag}</p>
        <p>{knowledgeMap.aside}</p>
      </aside>
    </Slide>
  )
}

/* ════════════════════════════════════════════════════════════
   34 — Пять уровней

   Сознательная визуальная рифма со «лестницей масштаба» слайда 22:
   зал уже умеет читать эту фигуру, и второй раз она читается сразу.
   Нижняя строка каждой ступени — условие, а не выгода.
   ════════════════════════════════════════════════════════════ */

export function FiveLevels({ index, total, active, beat }: P) {
  const steps = fiveLevels.steps
  return (
    <Slide
      id={fiveLevels.id}
      tone="ink"
      label={fiveLevels.label}
      index={index}
      total={total}
      active={active}
    >
      <Head eyebrow={fiveLevels.eyebrow} title={fiveLevels.title} wide />

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
        {fiveLevels.key}
      </p>
    </Slide>
  )
}

/* ════════════════════════════════════════════════════════════
   35 — «Пульс» и его границы

   Слева — на чём идея может стоять, справа — где ломается.
   Правая колонка появляется второй намеренно: сначала зал должен
   поверить в идею, иначе ограничения нечего ограничивать.
   ════════════════════════════════════════════════════════════ */

export function Pulse({ index, total, active, beat }: P) {
  return (
    <Slide
      id={pulse.id}
      tone="sheet"
      label={pulse.label}
      index={index}
      total={total}
      active={active}
    >
      <Head eyebrow={pulse.eyebrow} title={pulse.title} lead={pulse.lead} wide />

      <div className="utpp-vs">
        <div className="utpp-beat utpp-vs-col" data-accent="true" data-on={beat >= 0}>
          <p className="utpp-vs-name">{pulse.basis.name}</p>
          <ul>
            {pulse.basis.items.map((s) => (
              <li key={s} data-sign="plus">
                {s}
              </li>
            ))}
          </ul>
          <p className="utpp-small">{pulse.basis.note}</p>
        </div>

        <div className="utpp-vs-mid" aria-hidden="true">
          границы
        </div>

        <div className="utpp-beat utpp-vs-col" data-on={beat >= 1}>
          <p className="utpp-vs-name">{pulse.limits.name}</p>
          <ul>
            {pulse.limits.items.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="utpp-small">{pulse.limits.note}</p>
        </div>
      </div>

      <div className="utpp-beat utpp-boundary-foot" data-on={beat >= 2}>
        <p className="utpp-key">{pulse.key}</p>
        <p className="utpp-boundary-sub">{pulse.sub}</p>
      </div>
    </Slide>
  )
}

/* ════════════════════════════════════════════════════════════
   36 — Почему сейчас

   Ни одного аргумента от нас: только даты, которые уже назначены
   не нами. Дальше зал делает вывод сам — и потому он держится.
   ════════════════════════════════════════════════════════════ */

export function WhyNow({ index, total, active, beat }: P) {
  return (
    <Slide
      id={whyNow.id}
      tone="ink"
      label={whyNow.label}
      index={index}
      total={total}
      active={active}
    >
      <Head eyebrow={whyNow.eyebrow} title={whyNow.title} wide />

      <ol className="utpp-when">
        {whyNow.now.map((w, i) => (
          <li key={w.when} className="utpp-beat utpp-when-row" data-on={beat >= 0} style={{ transitionDelay: `${i * 90}ms` }}>
            <span className="utpp-when-date">{w.when}</span>
            <span className="utpp-when-what">{w.what}</span>
            <span className="utpp-when-why">{w.why}</span>
          </li>
        ))}
      </ol>

      {/* Регион и ключ — рядом, а не друг под другом: в столбец
          экран не помещался по высоте уже на 1920. */}
      <div className="utpp-when-foot">
        <div className="utpp-beat utpp-when-region" data-on={beat >= 1}>
          <ul>
            {whyNow.region.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <p className="utpp-small">{whyNow.regionNote}</p>
        </div>

        <p className="utpp-beat utpp-key utpp-when-key" data-on={beat >= 2}>
          {whyNow.key}
        </p>
      </div>
    </Slide>
  )
}

/* ════════════════════════════════════════════════════════════
   37 — Финал разбора

   Никакого предложения услуг. Последним на экране остаётся вопрос,
   отвечать на который зал будет уже без нас.
   ════════════════════════════════════════════════════════════ */

export function BlockFinale({ index, total, active, beat }: P) {
  return (
    <Slide
      id={blockFinale.id}
      tone="ivory"
      label={blockFinale.label}
      index={index}
      total={total}
      active={active}
    >
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
          <In d={4}>
            <p className="utpp-an-fin-steps" aria-label="Понять, Поручить, Проверить, Перестроить">
              {blockFinale.steps.map((s, i) => (
                <span key={s}>
                  {s}
                  {i < blockFinale.steps.length - 1 ? <i aria-hidden="true">→</i> : null}
                </span>
              ))}
            </p>
          </In>
        </div>

        <div className="utpp-beat utpp-an-fin-q" data-on={beat >= 1}>
          <p className="utpp-note">{blockFinale.questionTag}</p>
          <p className="utpp-an-fin-question">{blockFinale.question}</p>
          <p className="utpp-an-fin-quiet">{blockFinale.quiet}</p>
        </div>
      </div>
    </Slide>
  )
}
