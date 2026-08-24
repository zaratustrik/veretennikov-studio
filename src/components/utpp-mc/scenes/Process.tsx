"use client"

import { Reveal, Scene } from "../primitives"
import { process } from "../content.ru"

/**
 * ПЕРЕСТРОИТЬ. Два ряда шагов — «сейчас» и «после». Бордовым отмечены
 * только изменившиеся звенья. Главное сообщение считывается до чтения
 * подписей: меняется не процесс целиком, а два шага из пяти.
 */
export default function Process({ index, total }: { index: number; total: number }) {
  return (
    <Scene
      id={process.id}
      tone="sheet"
      label={process.sceneLabel}
      index={index}
      total={total}
    >
      <Reveal>
        <p className="utpp-eyebrow">{process.eyebrow}</p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="utpp-h2 utpp-h2--wide">{process.title}</h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="utpp-lead">{process.lead}</p>
      </Reveal>

      <div className="utpp-proc">
        {process.rows.map((row, ri) => (
          <Reveal key={row.id} delay={0.16 + ri * 0.1}>
            <div className="utpp-proc-row" data-kind={row.id}>
              <p className="utpp-proc-label">{row.label}</p>
              <ol>
                {row.steps.map((s, i) => {
                  const hot = "highlight" in row && row.highlight?.includes(i)
                  return (
                    <li key={s.name} data-hot={hot || undefined}>
                      <b>{s.name}</b>
                      <span>{s.short}</span>
                    </li>
                  )
                })}
              </ol>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="utpp-proc-take">
        {process.takeaways.map((t, i) => (
          <Reveal key={t.name} delay={0.36 + i * 0.06}>
            <p className="utpp-note">{t.name}</p>
            <p className="utpp-proc-take-text">{t.text}</p>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.56}>
        <p className="utpp-key utpp-proc-key">{process.key}</p>
      </Reveal>
    </Scene>
  )
}
