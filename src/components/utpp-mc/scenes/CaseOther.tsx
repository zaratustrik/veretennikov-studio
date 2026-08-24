"use client"

import { Reveal, Scene } from "../primitives"
import { caseOther } from "../content.ru"

/**
 * АКТ IV, короткий непроизводственный кейс. Сцена намеренно тихая
 * и центральной не является: её задача — показать, что архитектура
 * одна и та же, и отпустить внимание перед крупным актом о масштабе.
 */
export default function CaseOther({ index, total }: { index: number; total: number }) {
  return (
    <Scene
      id={caseOther.id}
      tone="ivory"
      label={caseOther.sceneLabel}
      index={index}
      total={total}
    >
      <Reveal>
        <p className="utpp-eyebrow utpp-eyebrow--muted">{caseOther.eyebrow}</p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="utpp-h2">{caseOther.title}</h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="utpp-lead">{caseOther.lead}</p>
      </Reveal>

      <ol className="utpp-chain">
        {caseOther.chain.map((c, i) => (
          <Reveal as="li" key={c.name} delay={0.16 + i * 0.06}>
            <b>{c.name}</b>
            <span>{c.short}</span>
          </Reveal>
        ))}
      </ol>

      <Reveal delay={0.46}>
        <p className="utpp-key utpp-chain-key">{caseOther.key}</p>
      </Reveal>
    </Scene>
  )
}
