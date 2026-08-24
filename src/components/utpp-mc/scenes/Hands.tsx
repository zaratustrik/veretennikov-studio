"use client"

import { Reveal, Scene } from "../primitives"
import { hands } from "../content.ru"

/**
 * АКТ III. «До сих пор ИИ только говорил».
 *
 * Единственная сцена, где меди дано звучать заметно: разъёмы — это
 * физическая метафора интеграции. Медь здесь не смысловой акцент,
 * а материал; бордовый в этой сцене не используется вовсе,
 * чтобы правило одного акцента не размывалось.
 */
export default function Hands({ index, total }: { index: number; total: number }) {
  return (
    <Scene id={hands.id} tone="sheet" label={hands.sceneLabel} index={index} total={total}>
      <div className="utpp-hands">
        <div className="utpp-hands-text">
          <Reveal>
            <p className="utpp-eyebrow utpp-eyebrow--muted">{hands.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="utpp-h2">{hands.title}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="utpp-lead">{hands.lead}</p>
          </Reveal>

          <dl className="utpp-hands-terms">
            {hands.terms.map((t, i) => (
              <Reveal key={t.term} delay={0.34 + i * 0.07}>
                <dt>{t.term}</dt>
                <dd>{t.full}</dd>
              </Reveal>
            ))}
          </dl>
        </div>

        <div className="utpp-hands-rail">
          <ul>
            {hands.tools.map((t, i) => (
              <Reveal as="li" key={t.key} delay={0.14 + i * 0.055}>
                <Port />
                <div>
                  <b>{t.name}</b>
                  <span>{t.short}</span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>

      <Reveal delay={0.5}>
        <p className="utpp-hands-key">{hands.key}</p>
      </Reveal>
    </Scene>
  )
}

/** Разъём: корпус, два контакта, направляющая. Латунь как материал. */
function Port() {
  return (
    <svg viewBox="0 0 40 24" className="utpp-port" aria-hidden="true">
      <line x1="0" y1="12" x2="9" y2="12" className="utpp-port-lead" />
      <rect x="9" y="4" width="17" height="16" rx="1.5" className="utpp-port-body" />
      <line x1="26" y1="8.5" x2="38" y2="8.5" className="utpp-port-pin" />
      <line x1="26" y1="15.5" x2="38" y2="15.5" className="utpp-port-pin" />
      <line x1="13.5" y1="7.5" x2="13.5" y2="16.5" className="utpp-port-key" />
    </svg>
  )
}
