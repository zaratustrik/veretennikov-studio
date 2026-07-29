"use client";

import { useEffect, useRef } from "react";
import { gsap } from "../gsapSetup";
import { ease, motion } from "../motion";
import { pickTask, measure } from "../content.ru";

type Props = {
  lite: boolean;
  ready: boolean;
};

/** Две спокойные секции шага «Перестроить»: выбор задачи и метрики. */
export default function PickMeasureSection({ lite, ready }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready || lite || !rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".mc-reveal").forEach((el) => {
        gsap.from(el.children, {
          opacity: 0,
          y: 14,
          duration: motion.base,
          stagger: motion.staggerTight,
          ease: ease.ui,
          scrollTrigger: { trigger: el, start: "top 74%" },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, [ready, lite]);

  return (
    <div ref={rootRef}>
      <section id="pick-task" className="mc-section mc-section--calm mc-center" aria-labelledby="pick-title">
        <p className="mc-eyebrow" style={{ color: "var(--accent-rebuild)" }}>
          {pickTask.eyebrow}
        </p>
        <h2 id="pick-title" className="mc-h2">
          {pickTask.title}
        </h2>
        <div className="mc-chips mc-reveal" style={{ marginTop: "1.6rem" }}>
          {pickTask.chips.map((c) => (
            <span key={c} className="mc-chip">
              ✓ {c}
            </span>
          ))}
        </div>
        <p className="mc-key" style={{ marginTop: "2.2rem" }}>
          {pickTask.key}
        </p>
      </section>

      <section id="measure" className="mc-section mc-section--calm mc-center" aria-labelledby="measure-title">
        <p className="mc-eyebrow" style={{ color: "var(--accent-rebuild)" }}>
          {measure.eyebrow}
        </p>
        <h2 id="measure-title" className="mc-h2">
          {measure.title}
        </h2>
        <div className="mc-metrics mc-reveal">
          {measure.metrics.map((m) => (
            <div key={m.name} className="mc-metric">
              <b>{m.name}</b>
              <span>{m.value}</span>
            </div>
          ))}
        </div>
        <p className="mc-key" style={{ marginTop: "2.4rem" }}>
          {measure.key}
        </p>
      </section>
    </div>
  );
}
