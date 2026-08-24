"use client"

import { Reveal, Scene } from "../primitives"
import { criteria } from "../content.ru"

/**
 * ПОНЯТЬ. Пять признаков как чертёжная спецификация: крупные номера,
 * волосяные линии, никаких карточек. Внизу — то, что в первую пробу
 * брать не следует, и правило отбраковки.
 */
export default function Criteria({ index, total }: { index: number; total: number }) {
  return (
    <Scene
      id={criteria.id}
      tone="sheet"
      label={criteria.sceneLabel}
      index={index}
      total={total}
    >
      <div className="utpp-criteria">
        <header className="utpp-criteria-head">
          <Reveal>
            <p className="utpp-eyebrow">{criteria.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="utpp-h2">{criteria.title}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="utpp-lead">{criteria.lead}</p>
          </Reveal>
          <Reveal delay={0.28}>
            <p className="utpp-key utpp-criteria-key">{criteria.key}</p>
          </Reveal>
        </header>

        <ol className="utpp-criteria-list">
          {criteria.items.map((it, i) => (
            <Reveal as="li" key={it.n} delay={0.12 + i * 0.055}>
              <span className="utpp-criteria-n">{it.n}</span>
              <div>
                <b>{it.name}</b>
                <span>{it.short}</span>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>

      <Reveal delay={0.34}>
        <p className="utpp-criteria-warn">{criteria.warn}</p>
      </Reveal>
    </Scene>
  )
}
