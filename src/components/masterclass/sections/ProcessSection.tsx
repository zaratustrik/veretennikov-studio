"use client";

import { useEffect, useRef } from "react";
import { gsap } from "../gsapSetup";
import { ease, motion } from "../motion";
import { process, stepColors } from "../content.ru";

type Props = {
  lite: boolean;
  ready: boolean;
};

/**
 * «Сейчас → После»: тот же процесс из пяти шагов, но ИИ появляется ровно на одном.
 * Сцена спокойная (без pin): в блоке «Перестроить» уже есть длинный pin у маршрута зрелости.
 * Анимация отвечает на один вопрос — что именно изменилось в процессе.
 */
export default function ProcessSection({ lite, ready }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ready || lite || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: ease.ui },
        scrollTrigger: { trigger: "#process-rows", start: "top 72%" },
      });

      tl.from('[data-row="now"] .mc-proc-step', {
        opacity: 0,
        y: 16,
        duration: motion.base,
        stagger: motion.staggerTight,
      })
        .from(
          "#process-arrow",
          { opacity: 0, scaleY: 0.2, transformOrigin: "50% 0%", duration: motion.fast },
          ">-0.1",
        )
        .from(
          '[data-row="after"] .mc-proc-step',
          { opacity: 0, y: 16, duration: motion.base, stagger: motion.staggerTight },
          ">-0.05",
        )
        .fromTo(
          ".mc-proc-step[data-hi='true']",
          { boxShadow: "0 0 0 0 rgba(141,107,255,0)" },
          {
            boxShadow: "0 0 0 3px rgba(141,107,255,0.34)",
            duration: motion.slow,
            ease: ease.state,
          },
          ">-0.15",
        );

      gsap.from(".mc-proc-take", {
        opacity: 0,
        y: 14,
        duration: motion.base,
        stagger: motion.staggerBase,
        ease: ease.ui,
        scrollTrigger: { trigger: "#process-takeaways", start: "top 80%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [ready, lite]);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="mc-section mc-section--calm mc-center"
      aria-labelledby="process-title"
    >
      <p className="mc-eyebrow" style={{ color: "var(--accent-rebuild)" }}>
        {process.eyebrow}
      </p>
      <h2 id="process-title" className="mc-h2">
        {process.title}
      </h2>
      <p className="mc-lead" style={{ textAlign: "center" }}>{process.lead}</p>
      <p className="mc-small" style={{ marginTop: "0.4rem", opacity: 0.7 }}>{process.example}</p>

      <div id="process-rows" className="mc-proc">
        {process.rows.map((row) => (
          <div key={row.id} className="mc-proc-row" data-row={row.id}>
            <div className="mc-proc-label" data-row={row.id}>
              {row.label}
            </div>
            <div className="mc-proc-steps">
              {row.steps.map((s, i) => {
                const hi = "highlight" in row && row.highlight === i;
                return (
                  <div key={`${row.id}-${s.name}`} className="mc-proc-step" data-hi={hi || undefined}>
                    {hi && (
                      <span id="process-arrow" className="mc-proc-arrow" aria-hidden="true">
                        ↓
                      </span>
                    )}
                    <b>{s.name}</b>
                    <span>{s.short}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div id="process-takeaways" className="mc-proc-takes">
        {process.takeaways.map((t) => (
          <div key={t.name} className="mc-proc-take" style={{ borderColor: stepColors[t.step] }}>
            <b style={{ color: stepColors[t.step] }}>{t.name}</b>
            <span>{t.text}</span>
          </div>
        ))}
      </div>

      <p className="mc-key" style={{ marginTop: "2.2rem" }}>
        {process.key}
      </p>
    </section>
  );
}
