"use client";

import { useEffect, useRef } from "react";
import { gsap } from "../gsapSetup";
import { ease, motion } from "../motion";
import { measure } from "../content.ru";

type Props = {
  lite: boolean;
  ready: boolean;
};

/**
 * Рамка первого пилота и три решения после него.
 * Идентификатор сцены остаётся `measure` — он закреплён в sceneOrder,
 * заметках ведущего и внешних ссылках.
 */
export default function PilotSection({ lite, ready }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ready || lite || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".mc-plan-item", {
        opacity: 0,
        y: 14,
        duration: motion.base,
        stagger: motion.staggerTight,
        ease: ease.ui,
        scrollTrigger: { trigger: "#plan-frame", start: "top 76%" },
      });
      // исходы появляются сверху вниз: «закрыть» читается последним и без драмы
      gsap.from(".mc-outcome", {
        opacity: 0,
        x: 18,
        duration: motion.base,
        stagger: motion.staggerBase,
        ease: ease.ui,
        scrollTrigger: { trigger: "#plan-outcomes", start: "top 80%" },
      });
      gsap.from(".mc-metric", {
        opacity: 0,
        y: 12,
        duration: motion.base,
        stagger: motion.staggerTight,
        ease: ease.ui,
        scrollTrigger: { trigger: "#plan-metrics", start: "top 84%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [ready, lite]);

  return (
    <section
      ref={sectionRef}
      id="measure"
      className="mc-section mc-section--calm mc-center"
      aria-labelledby="measure-title"
    >
      <p className="mc-eyebrow" style={{ color: "var(--accent-rebuild)" }}>
        {measure.eyebrow}
      </p>
      <h2 id="measure-title" className="mc-h2">
        {measure.title}
      </h2>
      <p className="mc-lead" style={{ textAlign: "center" }}>{measure.lead}</p>

      <div className="mc-plan">
        <div id="plan-frame" className="mc-plan-frame">
          {measure.frame.map((f) => (
            <div key={f.name} className="mc-plan-item">
              <b>{f.name}</b>
              <span>{f.short}</span>
            </div>
          ))}
        </div>

        <div className="mc-plan-outcomes">
          <p className="mc-eyebrow" style={{ opacity: 0.75, marginBottom: "0.9rem" }}>
            {measure.outcomesLead}
          </p>
          <div id="plan-outcomes">
            {measure.outcomes.map((o) => (
              <div key={o.name} className="mc-outcome" style={{ borderColor: o.color }}>
                <b style={{ color: o.color }}>{o.name}</b>
                <span>{o.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="plan-metrics" className="mc-metrics">
        {measure.metrics.map((m) => (
          <div key={m.name} className="mc-metric">
            <b>{m.name}</b>
            <span>{m.value}</span>
          </div>
        ))}
      </div>

      <p className="mc-key" style={{ marginTop: "2rem" }}>
        {measure.key}
      </p>
    </section>
  );
}
