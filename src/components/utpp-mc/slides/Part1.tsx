"use client"

import Image from "next/image"
import { Head, In, Slide, stateOf } from "../primitives"
import {
  generation,
  photos,
  programVsAi,
  pVerify,
  title,
  whyErrors,
} from "../content.ru"

type P = { index: number; total: number; active: boolean; beat: number }

/* ════════════════════════════════════════════════════════════
   01 — Титр
   ════════════════════════════════════════════════════════════ */

export function TitleSlide({ index, total, active }: P) {
  return (
    <Slide
      id={title.id}
      tone="ivory"
      label={title.label}
      index={index}
      total={total}
      active={active}
      cut={photos.titleRoom}
    >
      <div className="utpp-title">
        <In>
          <p className="utpp-eyebrow">{title.eyebrow}</p>
        </In>
        <In d={1}>
          <h1 className="utpp-h1">{title.title}</h1>
        </In>
        <In d={2}>
          <ol className="utpp-title-words">
            {title.words.map((w, i) => (
              <li key={w}>
                <span className="utpp-num">{String(i + 1).padStart(2, "0")}</span>
                <b>{w}</b>
              </li>
            ))}
          </ol>
        </In>
        <In d={3}>
          <p className="utpp-lead utpp-title-lead">{title.lead}</p>
        </In>
        <In d={4}>
          <footer className="utpp-title-foot">
            <Image
              src="/utpp/utpp-logo-ink.png"
              alt="Уральская торгово-промышленная палата"
              width={144}
              height={54}
              className="utpp-title-mark"
              priority
            />
            <div>
              <p className="utpp-note">{title.event}</p>
              <p className="utpp-note utpp-title-author">{title.author}</p>
            </div>
          </footer>
        </In>
      </div>
    </Slide>
  )
}

/* ════════════════════════════════════════════════════════════
   02 — Обычная программа против нейросети

   Самое понятное место мастер-класса и потому первое.
   Левая колонка — знакомая всем детерминированная логика,
   правая — вероятностная. Бордовым отмечена только правая:
   это то новое, ради чего собрались.
   ════════════════════════════════════════════════════════════ */

export function ProgramVsAi({ index, total, active, beat }: P) {
  return (
    <Slide
      id={programVsAi.id}
      tone="sheet"
      label={programVsAi.label}
      index={index}
      total={total}
      active={active}
      photo={photos.textureScale}
    >
      <Head eyebrow={programVsAi.eyebrow} title={programVsAi.title} wide />

      <div className="utpp-vs">
        <div className="utpp-beat utpp-vs-col" data-on={beat >= 0}>
          <p className="utpp-vs-name">{programVsAi.program.name}</p>
          <p className="utpp-vs-formula">{programVsAi.program.formula}</p>
          <p className="utpp-vs-text">{programVsAi.program.example}</p>
          <ul>
            <li>{programVsAi.program.trait}</li>
            <li>{programVsAi.program.trait2}</li>
          </ul>
        </div>

        <div className="utpp-vs-mid" aria-hidden="true">
          против
        </div>

        <div className="utpp-beat utpp-vs-col" data-accent="true" data-on={beat >= 1}>
          <p className="utpp-vs-name">{programVsAi.ai.name}</p>
          <p className="utpp-vs-formula">{programVsAi.ai.formula}</p>
          <p className="utpp-vs-text">{programVsAi.ai.example}</p>
          <ul>
            <li>{programVsAi.ai.trait}</li>
            <li>{programVsAi.ai.trait2}</li>
          </ul>
        </div>
      </div>

      <p className="utpp-beat utpp-key utpp-vs-key" data-on={beat >= 2}>
        {programVsAi.key}
      </p>
    </Slide>
  )
}

/* ════════════════════════════════════════════════════════════
   03 — Как собирается ответ

   Центральная объясняющая анимация деки. Предложение буквально
   собирается перед зрителем по одному фрагменту, и рядом видно,
   из чего именно модель выбирала на каждом шаге. Термины —
   токен, контекстное окно, генерация, LLM — появляются последними,
   когда механизм уже показан.
   ════════════════════════════════════════════════════════════ */

export function Generation({ index, total, active, beat }: P) {
  const steps = generation.steps
  const shown = Math.max(0, Math.min(beat, steps.length))
  const currentIdx = beat - 1
  const current = currentIdx >= 0 && currentIdx < steps.length ? steps[currentIdx] : null
  const showTerms = beat >= steps.length + 1

  return (
    <Slide
      id={generation.id}
      tone="ink"
      label={generation.label}
      index={index}
      total={total}
      active={active}
    >
      <Head eyebrow={generation.eyebrow} title={generation.title} lead={generation.lead} wide />

      <div className="utpp-gen">
        <div className="utpp-gen-main">
          <p className="utpp-gen-prompt">{generation.prompt}</p>

          <p className="utpp-gen-line" aria-live="polite">
            {steps.slice(0, shown).map((s, i) => (
              <span key={s.chosen} data-fresh={i === shown - 1}>
                {s.chosen}{" "}
              </span>
            ))}
            <i className="utpp-gen-caret" data-on={shown < steps.length} aria-hidden="true" />
          </p>
        </div>

        <div className="utpp-gen-pick" data-on={current !== null}>
          <p className="utpp-note">Выбор следующего фрагмента</p>
          <ul>
            {(current?.options ?? steps[0]!.options).map((o, i) => (
              <li key={o} data-chosen={i === 0}>
                <span>{o}</span>
                <i style={{ transform: `scaleX(${1 - i * 0.34})` }} aria-hidden="true" />
              </li>
            ))}
          </ul>
          <p className="utpp-small">
            Модель оценивает продолжения и берёт наиболее уместное. Следующий шаг
            зависит от всего, что уже написано.
          </p>
        </div>
      </div>

      <div className="utpp-beat utpp-gen-terms" data-on={showTerms}>
        <dl>
          {generation.terms.map((t) => (
            <div key={t.term}>
              <dt>{t.term}</dt>
              <dd>{t.full}</dd>
            </div>
          ))}
        </dl>
        <p className="utpp-key utpp-gen-key">{generation.key}</p>
      </div>
    </Slide>
  )
}

/* ════════════════════════════════════════════════════════════
   04 — Почему нейросеть может ошибаться

   Не «ИИ плохой», а причинно: механизм подбирает уместное
   продолжение, встроенной проверки фактов в нём нет.
   Третий beat — демонстрация: две одинаково уверенные фразы,
   одна из которых выдумана. Вердикты открываются последними.
   ════════════════════════════════════════════════════════════ */

export function WhyErrors({ index, total, active, beat }: P) {
  return (
    <Slide
      id={whyErrors.id}
      tone="ivory"
      label={whyErrors.label}
      index={index}
      total={total}
      active={active}
    >
      <Head eyebrow={whyErrors.eyebrow} title={whyErrors.title} wide />

      <div className="utpp-err">
        <div className="utpp-err-left">
          <In>
            <p className="utpp-err-cause">{whyErrors.cause}</p>
          </In>
          <ul className="utpp-list utpp-err-list">
            {whyErrors.consequences.map((c) => (
              <li key={c.n}>
                <span className="utpp-list-n">{c.n}</span>
                <b>{c.text}</b>
              </li>
            ))}
          </ul>
        </div>

        <div className="utpp-beat utpp-err-demo" data-on={beat >= 1}>
          <p className="utpp-note">{whyErrors.demoLabel}</p>
          <p className="utpp-small utpp-err-demo-lead">{whyErrors.demoLead}</p>

          <ul>
            {whyErrors.demo.map((d) => (
              <li key={d.claim} data-verdict={beat >= 2 ? d.verdict : undefined}>
                <p className="utpp-err-claim">{d.claim}</p>
                <p className="utpp-err-note" data-on={beat >= 2}>
                  <b>{d.verdict === "true" ? "Достоверно" : "Выдумано"}</b>
                  {d.note}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="utpp-beat utpp-key utpp-err-key" data-on={beat >= 2}>
        {whyErrors.key}
      </p>
    </Slide>
  )
}

/* ════════════════════════════════════════════════════════════
   05 — 4П: Проверить

   Первое появление методики. Оно возникает не по плану, а по
   логике: только что объяснили, почему ошибки возможны в принципе.
   ════════════════════════════════════════════════════════════ */

export function PVerify({ index, total, active, beat }: P) {
  return (
    <Slide
      id={pVerify.id}
      tone="sheet"
      label={pVerify.label}
      index={index}
      total={total}
      active={active}
    >
      <Head eyebrow={pVerify.eyebrow} title={pVerify.title} lead={pVerify.lead} wide />

      <div className="utpp-verify">
        {pVerify.levels.map((l, i) => (
          <div
            key={l.key}
            className="utpp-fade utpp-verify-col"
            data-state={stateOf(i, beat)}
            data-last={i === pVerify.levels.length - 1}
          >
            <p className="utpp-verify-name">{l.name}</p>
            <p className="utpp-verify-role">{l.role}</p>
            <ul>
              {l.cases.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="utpp-verify-foot">
        <div className="utpp-beat" data-on={beat >= 2}>
          <p className="utpp-note">Проверять всегда, независимо от уровня</p>
          <ul className="utpp-verify-always">
            {pVerify.always.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
        <div className="utpp-beat" data-on={beat >= 2}>
          <p className="utpp-key">{pVerify.key}</p>
          <p className="utpp-small utpp-verify-disc">{pVerify.disclaimer}</p>
        </div>
      </div>
    </Slide>
  )
}
