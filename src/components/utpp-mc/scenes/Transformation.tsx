"use client"

import { Reveal, Scene } from "../primitives"
import { transformation } from "../content.ru"

/**
 * АКТ V. Четыре уровня масштаба. Ключевой столбец — «чьё это решение»:
 * именно он объясняет руководителю, где проходит граница между личным
 * инструментом и вопросом первого лица.
 */
export default function Transformation({ index, total }: { index: number; total: number }) {
  return (
    <Scene
      id={transformation.id}
      tone="sheet"
      label={transformation.sceneLabel}
      index={index}
      total={total}
    >
      <Reveal>
        <p className="utpp-eyebrow">{transformation.eyebrow}</p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="utpp-h2">{transformation.title}</h2>
      </Reveal>

      <div className="utpp-trans" role="table" aria-label="Четыре уровня масштаба">
        <div className="utpp-trans-head" role="row">
          <span role="columnheader" />
          <span role="columnheader">Уровень</span>
          <span role="columnheader">Чьё решение</span>
          <span role="columnheader">Что меняется</span>
        </div>

        {transformation.levels.map((l, i) => (
          <Reveal key={l.n} delay={0.12 + i * 0.07}>
            <div className="utpp-trans-row" role="row" data-last={i === transformation.levels.length - 1}>
              <span className="utpp-trans-n" role="cell">
                {l.n}
              </span>
              <span role="cell">
                <b>{l.name}</b>
                <em>{l.short}</em>
              </span>
              <span role="cell">{l.who}</span>
              <span role="cell">{l.change}</span>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.44}>
        <p className="utpp-key utpp-trans-key">{transformation.key}</p>
      </Reveal>
    </Scene>
  )
}
