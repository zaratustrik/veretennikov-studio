"use client"

import { Reveal, Scene } from "../primitives"
import { casePlant } from "../content.ru"

/**
 * АКТ IV, кейс директора предприятия.
 *
 * Слева — семь источников, справа — один экран. Композиция сцены и есть
 * её тезис: не новая лента информации, а фильтр управленческого внимания.
 * Бордовым отмечен только верхний раздел — то, что действительно требует
 * первого лица.
 */
export default function CasePlant({ index, total }: { index: number; total: number }) {
  return (
    <Scene
      id={casePlant.id}
      tone="ink"
      label={casePlant.sceneLabel}
      index={index}
      total={total}
    >
      <Reveal>
        <p className="utpp-eyebrow">{casePlant.eyebrow}</p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="utpp-h2 utpp-h2--wide">{casePlant.title}</h2>
      </Reveal>

      <div className="utpp-plant">
        <Reveal delay={0.12} className="utpp-plant-src">
          <p className="utpp-note">Источники данных</p>
          <ul>
            {casePlant.sources.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="utpp-small utpp-plant-lead">{casePlant.lead}</p>
        </Reveal>

        <div className="utpp-plant-arrow" aria-hidden="true">
          <svg viewBox="0 0 60 12">
            <line x1="0" y1="6" x2="48" y2="6" />
            <path d="M60 6 L48 1.5 L48 10.5 Z" />
          </svg>
        </div>

        <Reveal delay={0.2} className="utpp-plant-brief">
          <p className="utpp-note">Утренний брифинг · 07:40</p>
          <div className="utpp-plant-bands">
            {casePlant.briefing.map((band, i) => (
              <section key={band.band} data-band={band.band} style={{ transitionDelay: `${i * 0.05}s` }}>
                <h3>{band.label}</h3>
                <ul>
                  {band.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <p className="utpp-small utpp-plant-note">{casePlant.note}</p>
        </Reveal>
      </div>

      <Reveal delay={0.34}>
        <p className="utpp-key utpp-plant-key">{casePlant.key}</p>
      </Reveal>
    </Scene>
  )
}
