"use client"

import { useEffect, useRef } from "react"

import {
  canItAct,
  docsQuestion,
  parts,
  photos,
  slideIndexOf,
  slideOrder,
  slides,
  TOTAL,
} from "./content.ru"
import { useDeck, useIdle, useQuality, useSwipe } from "./useDeck"
import { Statement } from "./primitives"
import PresenterHUD from "./PresenterHUD"

import { Generation, ProgramVsAi, PVerify, TitleSlide, WhyErrors } from "./slides/Part1"
import { LocalLlm, MarketEast, MarketWorld, ModelProductApi } from "./slides/Part2"
import { MemoryThree, PDelegate, WhatIsChat } from "./slides/Part3"
import { Rag, RagNotTraining, RagUtpp } from "./slides/Part4"
import { AgentFormula, ApiMcp, CaseDoctor, PUnderstand } from "./slides/Part5"
import { Boundary, Contour, PRebuild, ScaleLadder } from "./slides/Part6"
import { Finale, FourP, MyScenario } from "./slides/Part7"

export default function Deck() {
  const stageRef = useRef<HTMLDivElement>(null)
  const { reducedMotion, collapsed } = useQuality()
  const deck = useDeck(collapsed)
  const idle = useIdle()
  const { slide, beat } = deck

  useSwipe(stageRef, deck.next, deck.prev)

  // Маркер режима показа на корне раздела — его читает CSS
  useEffect(() => {
    const root = document.querySelector(".utpp-root")
    root?.setAttribute("data-presenting", String(deck.presenting))
  }, [deck.presenting])

  // Тон текущего слайда красит служебные элементы поверх сцены
  useEffect(() => {
    const root = document.querySelector(".utpp-root") as HTMLElement | null
    if (!root) return
    const tone = slides[slide]?.tone ?? "ivory"
    root.style.setProperty("--u-arrow", tone === "ink" ? "#8b7a9c" : "#8c8394")
    root.style.setProperty("--u-rail-fg", tone === "ink" ? "#8b7a9c" : "#8c8394")
  }, [slide])

  const activePart = (() => {
    let id = parts[0]?.id ?? ""
    parts.forEach((p) => {
      if (slideIndexOf(p.id) <= slide) id = p.id
    })
    return id
  })()

  /** Слайд отрисовывается, только если он рядом: 28 экранов сразу не нужны. */
  const near = (i: number) => Math.abs(i - slide) <= 1

  const render = (i: number) => {
    const meta = slides[i]!
    const props = { index: i + 1, total: TOTAL, active: i === slide, beat: i === slide ? beat : 0 }

    switch (meta.id) {
      case "title":
        return <TitleSlide key={meta.id} {...props} />
      case "program-vs-ai":
        return <ProgramVsAi key={meta.id} {...props} />
      case "generation":
        return <Generation key={meta.id} {...props} />
      case "why-errors":
        return <WhyErrors key={meta.id} {...props} />
      case "p-verify":
        return <PVerify key={meta.id} {...props} />
      case "model-product-api":
        return <ModelProductApi key={meta.id} {...props} />
      case "market-world":
        return <MarketWorld key={meta.id} {...props} />
      case "market-east":
        return <MarketEast key={meta.id} {...props} />
      case "local-llm":
        return <LocalLlm key={meta.id} {...props} />
      case "what-is-chat":
        return <WhatIsChat key={meta.id} {...props} />
      case "memory-three":
        return <MemoryThree key={meta.id} {...props} />
      case "p-delegate":
        return <PDelegate key={meta.id} {...props} />
      case "docs-question":
        return (
          <Statement
            key={meta.id}
            id={docsQuestion.id}
            tone="ink"
            label={docsQuestion.label}
            index={props.index}
            total={TOTAL}
            active={props.active}
            text={docsQuestion.statement}
            sub={docsQuestion.sub}
            photo={photos.archive}
          />
        )
      case "rag":
        return <Rag key={meta.id} {...props} />
      case "rag-not-training":
        return <RagNotTraining key={meta.id} {...props} />
      case "rag-utpp":
        return <RagUtpp key={meta.id} {...props} />
      case "can-it-act":
        return (
          <Statement
            key={meta.id}
            id={canItAct.id}
            tone="ink"
            label={canItAct.label}
            index={props.index}
            total={TOTAL}
            active={props.active}
            text={canItAct.statement}
            sub={canItAct.sub}
            photo={photos.connectors}
          />
        )
      case "agent-formula":
        return <AgentFormula key={meta.id} {...props} />
      case "api-mcp":
        return <ApiMcp key={meta.id} {...props} />
      case "case-doctor":
        return <CaseDoctor key={meta.id} {...props} />
      case "p-understand":
        return <PUnderstand key={meta.id} {...props} />
      case "scale-ladder":
        return <ScaleLadder key={meta.id} {...props} />
      case "contour":
        return <Contour key={meta.id} {...props} />
      case "p-rebuild":
        return <PRebuild key={meta.id} {...props} />
      case "boundary":
        return <Boundary key={meta.id} {...props} />
      case "four-p":
        return <FourP key={meta.id} {...props} />
      case "my-scenario":
        return <MyScenario key={meta.id} {...props} />
      case "finale":
        return <Finale key={meta.id} {...props} />
      default:
        return null
    }
  }

  return (
    <div className="utpp-stage" ref={stageRef} lang="ru" data-idle={idle || undefined}>
      <div
        className="utpp-progress"
        aria-hidden="true"
        style={{ transform: `scaleX(${(slide + 1) / TOTAL})` }}
      />

      <div
        className="utpp-track"
        data-instant={deck.instant || reducedMotion}
        style={{ transform: `translate3d(${-slide * 100}vw, 0, 0)` }}
      >
        {slides.map((meta, i) =>
          near(i) ? (
            render(i)
          ) : (
            <div
              key={meta.id}
              className="utpp-slide"
              data-tone={meta.tone}
              aria-hidden="true"
            />
          ),
        )}
      </div>

      <nav className="utpp-rail" aria-label="Разделы мастер-класса">
        {parts.map((p) => (
          <button
            key={p.id}
            type="button"
            data-active={p.id === activePart}
            onClick={() => deck.goSlide(slideIndexOf(p.id))}
          >
            <span>{p.label}</span>
          </button>
        ))}
      </nav>

      <div className="utpp-arrows">
        <button
          type="button"
          onClick={deck.prev}
          disabled={slide === 0 && beat === 0}
          aria-label="Назад"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5 L8 12 L15 19" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={deck.next}
          disabled={slide === TOTAL - 1 && beat === deck.beatsHere - 1}
          aria-label="Вперёд"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 5 L16 12 L9 19" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {!deck.presenting ? (
        <button type="button" className="utpp-enter" onClick={deck.enterPresenter}>
          Режим показа <kbd>P</kbd>
        </button>
      ) : null}

      <p className="utpp-brandbar" aria-hidden="true">
        Veretennikov Studio · превью · не для распространения
      </p>

      {deck.presenting ? <PresenterHUD deck={deck} /> : null}

      {deck.black ? (
        <div className="utpp-black" role="presentation" onClick={deck.next} />
      ) : null}

      <p className="utpp-sr" role="status" aria-live="polite">
        Слайд {slide + 1} из {TOTAL}: {slides[slide]?.label}
        {deck.beatsHere > 1 ? `, шаг ${beat + 1} из ${deck.beatsHere}` : ""}
      </p>

      <span className="utpp-sr">
        Навигация: стрелка вправо или пробел — вперёд, стрелка влево — назад,
        P — режим показа. Всего слайдов: {slideOrder.length}.
      </span>
    </div>
  )
}
