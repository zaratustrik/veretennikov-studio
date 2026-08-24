"use client"

import { Reveal, Scene } from "../primitives"
import { operation } from "../content.ru"

/**
 * ПОНЯТЬ. Самая частая управленческая ошибка — задача формулируется
 * на уровне подразделения. Три пары «не — а» переводят её на уровень
 * операции. Бордовым выделено только правое: то, что предлагается.
 */
export default function Operation({ index, total }: { index: number; total: number }) {
  return (
    <Scene
      id={operation.id}
      tone="ivory"
      label={operation.sceneLabel}
      index={index}
      total={total}
    >
      <Reveal>
        <p className="utpp-eyebrow">{operation.eyebrow}</p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="utpp-h2">{operation.title}</h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="utpp-lead">{operation.lead}</p>
      </Reveal>

      <ul className="utpp-pairs">
        {operation.pairs.map((p, i) => (
          <Reveal as="li" key={p.area} delay={0.16 + i * 0.07}>
            <p className="utpp-pairs-area">{p.area}</p>
            <div className="utpp-pairs-cols">
              <p className="utpp-pairs-wrong">
                <span>не</span>
                {p.wrong}
              </p>
              <p className="utpp-pairs-right">
                <span>а</span>
                {p.right}
              </p>
            </div>
          </Reveal>
        ))}
      </ul>
    </Scene>
  )
}
