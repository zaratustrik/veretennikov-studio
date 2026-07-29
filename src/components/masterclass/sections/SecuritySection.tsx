"use client";

import { useEffect, useRef } from "react";
import { gsap } from "../gsapSetup";
import { ease, motion } from "../motion";
import { dataSafety, safeAgent } from "../content.ru";

type Props = {
  lite: boolean;
  ready: boolean;
};

/** Безопасность данных (уровни допуска) и безопасный агент (контур). */
export default function SecuritySection({ lite, ready }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready || lite || !rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".mc-level", {
        opacity: 0,
        x: -18,
        duration: motion.base,
        stagger: motion.staggerBase,
        ease: ease.ui,
        scrollTrigger: { trigger: "#data-safety", start: "top 70%" },
      });
      gsap.from("#sa-stage > *", {
        opacity: 0,
        y: 16,
        duration: motion.base,
        stagger: motion.staggerTight,
        ease: ease.ui,
        scrollTrigger: { trigger: "#safe-agent", start: "top 70%" },
      });
    }, rootRef);
    return () => ctx.revert();
  }, [ready, lite]);

  return (
    <div ref={rootRef}>
      <section id="data-safety" className="mc-section mc-section--calm mc-center" aria-labelledby="ds-title">
        <p className="mc-eyebrow" style={{ color: "var(--accent-check)" }}>
          {dataSafety.eyebrow}
        </p>
        <h2 id="ds-title" className="mc-h2">
          {dataSafety.title}
        </h2>
        <div className="mc-levels">
          {dataSafety.levels.map((l) => (
            <div key={l.name} className="mc-level" style={{ ["--level-color" as string]: l.color }}>
              <b>{l.name}</b>
              <span>{l.rule}</span>
            </div>
          ))}
        </div>
        <p className="mc-key" style={{ marginTop: "2.2rem" }}>
          {dataSafety.key}
        </p>
      </section>

      <section id="safe-agent" className="mc-section mc-section--calm mc-center" aria-labelledby="sa-title">
        <p className="mc-eyebrow" style={{ color: "var(--accent-check)" }}>
          {safeAgent.eyebrow}
        </p>
        <h2 id="sa-title" className="mc-h2">
          {safeAgent.title}
        </h2>

        <div id="sa-stage" style={{ width: "100%", maxWidth: 720, margin: "2.2rem auto 0" }}>
          <svg
            className="mc-svg-stage"
            viewBox="0 0 640 340"
            role="img"
            aria-label="Агент работает внутри ограниченного контура; человек подтверждает действия"
          >
            <rect x="30" y="26" width="580" height="288" rx="20" fill="none" stroke="var(--accent-check)" strokeOpacity="0.45" strokeWidth="1.6" strokeDasharray="9 8" />
            <text x="52" y="56" fill="var(--accent-check)" fontSize="12" letterSpacing="2">
              КОНТУР ДОСТУПА
            </text>
            <circle cx="250" cy="170" r="30" fill="rgba(37,199,232,0.12)" stroke="var(--accent-understand)" strokeWidth="2" />
            <text x="250" y="176" textAnchor="middle" fill="var(--text-primary)" fontSize="14" fontWeight="650">
              агент
            </text>
            <g>
              <rect x="360" y="90" width="104" height="34" rx="8" fill="rgba(14,28,51,0.85)" stroke="var(--line-soft)" />
              <text x="412" y="112" textAnchor="middle" fill="var(--text-secondary)" fontSize="12">чтение</text>
              <rect x="360" y="216" width="104" height="34" rx="8" fill="rgba(14,28,51,0.85)" stroke="var(--warning)" strokeOpacity="0.6" />
              <text x="412" y="238" textAnchor="middle" fill="var(--text-secondary)" fontSize="12">изменение</text>
              <path d="M 282 156 L 360 108" stroke="var(--line-soft)" strokeWidth="1.5" />
              <path d="M 282 186 L 360 232" stroke="var(--warning)" strokeWidth="1.5" strokeDasharray="4 5" />
            </g>
            <g>
              <circle cx="530" cy="233" r="15" fill="rgba(66,201,138,0.15)" stroke="var(--accent-check)" strokeWidth="2" />
              <path d="M 523 233 L 528 239 L 538 226" stroke="var(--accent-check)" strokeWidth="2.2" fill="none" />
              <text x="530" y="270" textAnchor="middle" fill="var(--text-secondary)" fontSize="12">человек</text>
              <path d="M 464 233 L 515 233" stroke="var(--accent-check)" strokeWidth="1.6" />
            </g>
            <g>
              <rect x="92" y="90" width="96" height="34" rx="8" fill="rgba(14,28,51,0.85)" stroke="var(--line-soft)" />
              <text x="140" y="112" textAnchor="middle" fill="var(--text-secondary)" fontSize="12">журнал</text>
              <path d="M 222 152 L 172 124" stroke="var(--line-soft)" strokeWidth="1.5" />
              <rect x="92" y="216" width="96" height="34" rx="8" fill="rgba(240,93,104,0.1)" stroke="var(--danger)" strokeOpacity="0.6" />
              <text x="140" y="238" textAnchor="middle" fill="var(--danger)" fontSize="12">стоп</text>
              <path d="M 222 188 L 172 226" stroke="var(--danger)" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="4 5" />
            </g>
          </svg>
          <div className="mc-chips" style={{ margin: "1.6rem auto 0" }}>
            {safeAgent.rules.map((r) => (
              <span key={r} className="mc-chip">
                {r}
              </span>
            ))}
          </div>
        </div>
        <p className="mc-key" style={{ marginTop: "2.2rem", maxWidth: "22em" }}>
          {safeAgent.key}
        </p>
      </section>
    </div>
  );
}
