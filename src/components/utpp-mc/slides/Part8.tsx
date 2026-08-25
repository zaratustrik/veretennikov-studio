"use client"

import { Head, In, Slide } from "../primitives"
import {
  alreadyWorks,
  blockFinale,
  languageGap,
  outsideView,
  signals,
  twoLanguages,
  utppAssets,
} from "../content.ru"

type P = { index: number; total: number; active: boolean; beat: number }

/* ════════════════════════════════════════════════════════════
   ЧАСТЬ 8 — ВЗГЛЯД СО СТОРОНЫ

   Семь слайдов после финала. Блок самостоятельный: он не меняет
   и не переписывает предыдущие двадцать восемь, а продолжает их.

   Ход собственного исследования на сцену не выносится: зал видит
   готовое наблюдение, а не историю наших рабочих гипотез.
   Методология — в docs/17_UTPP_AI_ANALYSIS_RESEARCH.md.

   Ни одной фотографии — сознательно: слайд 28 заканчивается срезом
   кадра, и снимок на 29-м стоял бы встык.
   ════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════
   29 — Взгляд со стороны

   Задача экрана — сменить рамку и сразу очертить границы разговора.
   Три строки рамки важнее самого утверждения: они снимают вопрос
   «вы что, аудит нам провели» до того, как он возникнет.
   ════════════════════════════════════════════════════════════ */

export function OutsideView({ index, total, active, beat }: P) {
  return (
    <Slide
      id={outsideView.id}
      tone="ink"
      label={outsideView.label}
      index={index}
      total={total}
      active={active}
    >
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

/* ════════════════════════════════════════════════════════════
   30 — Масштаб

   Экран уважения, и он стоит первым не случайно. Пять чисел,
   ни одного комментария к ним: разговор дальше идёт от сильной
   стороны, а не от нехватки.
   ════════════════════════════════════════════════════════════ */

export function UtppAssets({ index, total, active, beat }: P) {
  return (
    <Slide
      id={utppAssets.id}
      tone="sheet"
      label={utppAssets.label}
      index={index}
      total={total}
      active={active}
    >
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

/* ════════════════════════════════════════════════════════════
   31 — Два языка

   Не проверка и не тест: наблюдение за тем, что происходит,
   когда человек приходит со своей ситуацией. Слева — как это
   называется у Палаты, справа — как то же самое звучит у него.

   Вторым beat'ом появляется, что выдал поиск. Вердиктов нет:
   бордовая метка означает не «плохо», а «здесь и виден разрыв».
   ════════════════════════════════════════════════════════════ */

export function TwoLanguages({ index, total, active, beat }: P) {
  return (
    <Slide
      id={twoLanguages.id}
      tone="ivory"
      label={twoLanguages.label}
      index={index}
      total={total}
      active={active}
    >
      <Head eyebrow={twoLanguages.eyebrow} title={twoLanguages.title} wide />

      <div className="utpp-langs" role="table" aria-label="Язык Палаты и язык предпринимателя">
        <div className="utpp-langs-head" role="row">
          <span role="columnheader">{twoLanguages.heads.left}</span>
          <span aria-hidden="true" />
          <span role="columnheader">{twoLanguages.heads.right}</span>
        </div>

        {twoLanguages.pairs.map((p, i) => (
          <In key={p.chamber} d={Math.min(i + 2, 8)}>
            <div className="utpp-langs-row" role="row" data-hit={p.hit}>
              <span className="utpp-langs-left" role="cell">
                {p.chamber}
              </span>
              <span className="utpp-langs-mid" aria-hidden="true">
                ↔
              </span>
              <span className="utpp-langs-right" role="cell">
                <b>{p.business}</b>
                <em className="utpp-beat" data-on={beat >= 1}>
                  {p.found}
                </em>
              </span>
            </div>
          </In>
        ))}
      </div>

      <p className="utpp-beat utpp-key utpp-langs-key" data-on={beat >= 2}>
        {twoLanguages.key}
      </p>
    </Slide>
  )
}

/* ════════════════════════════════════════════════════════════
   32 — Разрыв между языками

   Самый чистый экран блока. Сначала одно утверждение на пустом
   поле, и только потом — цепочка из четырёх звеньев.

   Последнее звено бордовое: акцент в этой системе означает «здесь
   нужен человек». Ровно это и требуется сказать.
   ════════════════════════════════════════════════════════════ */

export function LanguageGap({ index, total, active, beat }: P) {
  return (
    <Slide
      id={languageGap.id}
      tone="ink"
      label={languageGap.label}
      index={index}
      total={total}
      active={active}
    >
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
      </div>
    </Slide>
  )
}

/* ════════════════════════════════════════════════════════════
   33 — Так Палата уже работает

   Политически и содержательно самый важный экран: мы ничего
   не предлагаем менять. Модель «человек описал ситуацию —
   эксперты ответили по существу» у Палаты уже есть, и она
   опубликована на её собственном сайте.
   ════════════════════════════════════════════════════════════ */

export function AlreadyWorks({ index, total, active, beat }: P) {
  return (
    <Slide
      id={alreadyWorks.id}
      tone="sheet"
      label={alreadyWorks.label}
      index={index}
      total={total}
      active={active}
    >
      <Head eyebrow={alreadyWorks.eyebrow} title={alreadyWorks.title} lead={alreadyWorks.lead} wide />

      <div className="utpp-case2">
        <div className="utpp-beat utpp-case2-col" data-on={beat >= 0}>
          <p className="utpp-note">{alreadyWorks.ask.tag}</p>
          <p className="utpp-case2-who">{alreadyWorks.ask.who}</p>
          <ul>
            {alreadyWorks.ask.items.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        <div className="utpp-case2-mid" aria-hidden="true">
          →
        </div>

        <div className="utpp-beat utpp-case2-col" data-accent="true" data-on={beat >= 1}>
          <p className="utpp-note">{alreadyWorks.answer.tag}</p>
          <ul className="utpp-case2-experts">
            {alreadyWorks.answer.items.map((e) => (
              <li key={e.who}>
                <b>{e.who}</b>
                <span>{e.what}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="utpp-beat utpp-key utpp-case2-key" data-on={beat >= 2}>
        {alreadyWorks.key}
      </p>
    </Slide>
  )
}

/* ════════════════════════════════════════════════════════════
   34 — Сигналы

   Переход от сайта к организации. Здесь легче всего скатиться
   в обещание, поэтому третий beat не вывод, а честная рамка:
   это гипотеза, и проверить её можно только изнутри.
   ════════════════════════════════════════════════════════════ */

export function Signals({ index, total, active, beat }: P) {
  return (
    <Slide
      id={signals.id}
      tone="ink"
      label={signals.label}
      index={index}
      total={total}
      active={active}
    >
      <Head eyebrow={signals.eyebrow} title={signals.title} wide />

      <div className="utpp-sig">
        <div className="utpp-beat utpp-sig-col" data-on={beat >= 0}>
          <p className="utpp-sig-name">{signals.sources.name}</p>
          <ul>
            {signals.sources.items.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        <div className="utpp-sig-mid" aria-hidden="true">
          →
        </div>

        <div className="utpp-beat utpp-sig-col" data-accent="true" data-on={beat >= 1}>
          <p className="utpp-sig-name">{signals.visible.name}</p>
          <ul>
            {signals.visible.items.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="utpp-beat utpp-sig-foot" data-on={beat >= 2}>
        <p className="utpp-key">{signals.key}</p>
        <p className="utpp-sig-honest">{signals.honest}</p>
        <p className="utpp-warn">{signals.bench}</p>
      </div>
    </Slide>
  )
}

/* ════════════════════════════════════════════════════════════
   35 — Итог взгляда со стороны

   Ни предложения услуг, ни сроков, ни дорожной карты. Последним
   на экране остаётся вопрос, отвечать на который зал будет
   уже без нас.
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
        </div>

        <div className="utpp-beat utpp-an-fin-q" data-on={beat >= 1}>
          <p className="utpp-note">{blockFinale.questionTag}</p>
          <p className="utpp-an-fin-question">{blockFinale.question}</p>
        </div>
      </div>
    </Slide>
  )
}
