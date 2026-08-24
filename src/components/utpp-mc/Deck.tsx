"use client"

import { useEffect, useRef } from "react"

import {
  attention,
  chapters,
  enough,
  memoryBridge,
  responsibility,
  sceneOrder,
} from "./content.ru"
import { useQualityProfile, useScrollProgress } from "./hooks"
import { usePresenter } from "./usePresenter"
import { Statement } from "./primitives"
import PresenterHUD from "./PresenterHUD"

import ColdOpen from "./scenes/ColdOpen"
import TitleCard from "./scenes/TitleCard"
import Ladder from "./scenes/Ladder"
import FourP from "./scenes/FourP"
import Operation from "./scenes/Operation"
import Criteria from "./scenes/Criteria"
import Brief from "./scenes/Brief"
import Rag from "./scenes/Rag"
import Autonomy from "./scenes/Autonomy"
import Process from "./scenes/Process"
import Hands from "./scenes/Hands"
import AgentFormula from "./scenes/AgentFormula"
import CaseUtpp from "./scenes/CaseUtpp"
import CasePlant from "./scenes/CasePlant"
import CaseOther from "./scenes/CaseOther"
import Transformation from "./scenes/Transformation"
import Contour from "./scenes/Contour"
import Who from "./scenes/Who"
import MyScenario from "./scenes/MyScenario"
import Callback from "./scenes/Callback"
import Finale from "./scenes/Finale"

const TOTAL = sceneOrder.length

/** Порядковый номер сцены для счётчика в углу — из единого источника. */
function n(id: string): number {
  return sceneOrder.indexOf(id) + 1
}

export default function Deck() {
  const barRef = useRef<HTMLDivElement>(null)
  const { reducedMotion, collapsed } = useQualityProfile()
  const presenter = usePresenter(reducedMotion, collapsed)

  useScrollProgress(barRef)

  // Маркеры режимов на корне раздела — их читает CSS
  useEffect(() => {
    const root = document.querySelector(".utpp-root")
    if (!root) return
    root.setAttribute("data-presenting", String(presenter.presenting))
  }, [presenter.presenting])

  const activeChapter = (() => {
    let id = chapters[0]?.id ?? ""
    chapters.forEach((c) => {
      if (sceneOrder.indexOf(c.id) <= presenter.sceneIdx) id = c.id
    })
    return id
  })()

  return (
    <div className="utpp-deck" lang="ru">
      <div ref={barRef} className="utpp-progress" aria-hidden="true" />

      <nav className="utpp-rail" aria-label="Главы мастер-класса">
        {chapters.map((c) => (
          <button
            key={c.id}
            type="button"
            data-active={c.id === activeChapter}
            onClick={() => presenter.go(sceneOrder.indexOf(c.id))}
          >
            <span>{c.label}</span>
          </button>
        ))}
      </nav>

      <ColdOpen index={n("cold-open")} total={TOTAL} collapsed={collapsed} />

      <Statement
        id={attention.id}
        tone="ink"
        label={attention.sceneLabel}
        index={n("attention")}
        total={TOTAL}
        text={attention.statement}
        sub={attention.sub}
      />

      <TitleCard index={n("title")} total={TOTAL} />
      <Ladder index={n("ladder")} total={TOTAL} collapsed={collapsed} />

      <Statement
        id={enough.id}
        tone="ivory"
        label={enough.sceneLabel}
        index={n("enough")}
        total={TOTAL}
        text={enough.statement}
        sub={enough.sub}
      />

      <FourP index={n("four-p")} total={TOTAL} />
      <Operation index={n("operation")} total={TOTAL} />
      <Criteria index={n("criteria")} total={TOTAL} />
      <Brief index={n("brief")} total={TOTAL} />

      <Statement
        id={memoryBridge.id}
        tone="ink"
        label={memoryBridge.sceneLabel}
        index={n("memory-bridge")}
        total={TOTAL}
        text={memoryBridge.statement}
        sub={memoryBridge.sub}
      />

      <Rag index={n("rag")} total={TOTAL} collapsed={collapsed} />
      <Autonomy index={n("autonomy")} total={TOTAL} />

      <Statement
        id={responsibility.id}
        tone="ink"
        label={responsibility.sceneLabel}
        index={n("responsibility")}
        total={TOTAL}
        text={responsibility.statement}
        sub={responsibility.sub}
      />

      <Process index={n("process")} total={TOTAL} />
      <Hands index={n("hands")} total={TOTAL} />
      <AgentFormula index={n("agent-formula")} total={TOTAL} />
      <CaseUtpp index={n("case-utpp")} total={TOTAL} collapsed={collapsed} />
      <CasePlant index={n("case-plant")} total={TOTAL} />
      <CaseOther index={n("case-other")} total={TOTAL} />
      <Transformation index={n("transformation")} total={TOTAL} />
      <Contour index={n("contour")} total={TOTAL} collapsed={collapsed} />
      <Who index={n("who")} total={TOTAL} />
      <MyScenario index={n("my-scenario")} total={TOTAL} />
      <Callback index={n("callback")} total={TOTAL} />
      <Finale index={n("finale")} total={TOTAL} />

      <p className="utpp-brandbar" aria-hidden="true">
        Veretennikov Studio · превью · не для распространения
      </p>

      {!presenter.presenting ? (
        <button type="button" className="utpp-enter" onClick={presenter.enter}>
          Режим показа <kbd>P</kbd>
        </button>
      ) : null}

      {presenter.presenting ? <PresenterHUD presenter={presenter} /> : null}

      {presenter.black ? (
        <div
          className="utpp-black"
          role="presentation"
          onClick={() => presenter.next()}
        />
      ) : null}
    </div>
  )
}
