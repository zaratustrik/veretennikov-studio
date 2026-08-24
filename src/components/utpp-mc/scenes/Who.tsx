"use client"

import { Reveal, Scene } from "../primitives"
import { who } from "../content.ru"

/**
 * АКТ V. Стык ролей. Сцена сознательно не продаёт услугу: она показывает,
 * что задача лежит на пересечении четырёх компетенций, и называет момент,
 * когда своими силами дальше не пройти.
 */
export default function Who({ index, total }: { index: number; total: number }) {
  return (
    <Scene id={who.id} tone="ivory" label={who.sceneLabel} index={index} total={total}>
      <Reveal>
        <p className="utpp-eyebrow utpp-eyebrow--muted">{who.eyebrow}</p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="utpp-h2">{who.title}</h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="utpp-lead">{who.lead}</p>
      </Reveal>

      <ul className="utpp-who">
        {who.roles.map((r, i) => (
          <Reveal as="li" key={r.name} delay={0.16 + i * 0.07}>
            <span className="utpp-num">{String(i + 1).padStart(2, "0")}</span>
            <b>{r.name}</b>
            <span className="utpp-who-short">{r.short}</span>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={0.46}>
        <p className="utpp-key utpp-who-key">{who.key}</p>
      </Reveal>
    </Scene>
  )
}
