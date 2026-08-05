"use client";

import { useEffect, useRef } from "react";
import { gsap } from "../gsapSetup";
import { ease, motion } from "../motion";
import { rag } from "../content.ru";

type Props = {
  lite: boolean;
  ready: boolean;
};

/**
 * Поиск по внутренним документам (на рынке — RAG).
 * Отвечает на вопрос, который возникает сразу после схемы шлюза:
 * как модель узнаёт правила организации и почему ответу можно верить.
 * Сцена спокойная: в бонусном блоке уже две pin-сцены подряд.
 */
export default function RagSection({ lite, ready }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ready || lite || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: ease.ui },
        scrollTrigger: { trigger: "#rag-flow", start: "top 74%" },
      });

      // три шага собираются по порядку — это и есть весь механизм
      tl.from(".mc-rag-step", {
        opacity: 0,
        y: 16,
        duration: motion.base,
        stagger: motion.staggerBase,
      })
        .from(".mc-rag-arrow", { opacity: 0, duration: motion.fast, stagger: motion.staggerTight }, "<0.15")
        // акцент на ссылке: именно она делает ответ проверяемым
        .fromTo(
          "#rag-source",
          { boxShadow: "0 0 0 0 rgba(66,201,138,0)" },
          { boxShadow: "0 0 0 3px rgba(66,201,138,0.32)", duration: motion.slow, ease: ease.state },
          ">-0.1",
        );

      gsap.from(".mc-rag-col", {
        opacity: 0,
        y: 14,
        duration: motion.base,
        stagger: motion.staggerBase,
        ease: ease.ui,
        scrollTrigger: { trigger: "#rag-columns", start: "top 80%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [ready, lite]);

  return (
    <section
      ref={sectionRef}
      id="rag"
      className="mc-section mc-section--calm mc-center"
      aria-labelledby="rag-title"
    >
      <p className="mc-eyebrow" style={{ color: "var(--accent-understand)" }}>
        {rag.eyebrow}
      </p>
      <h2 id="rag-title" className="mc-h2">
        {rag.title}
      </h2>
      <p className="mc-lead" style={{ textAlign: "center" }}>{rag.lead}</p>
      <p className="mc-small" style={{ marginTop: "0.3rem", opacity: 0.72 }}>{rag.termNote}</p>

      <div id="rag-flow" className="mc-rag-flow">
        {rag.steps.map((s, i) => (
          <div key={s.name} className="mc-rag-cell">
            {i > 0 && (
              <span className="mc-rag-arrow" aria-hidden="true">
                →
              </span>
            )}
            <div className="mc-rag-step" id={i === 2 ? "rag-source" : undefined} data-last={i === 2 || undefined}>
              <i aria-hidden="true">{i + 1}</i>
              <b>{s.name}</b>
              <span>{s.short}</span>
            </div>
          </div>
        ))}
      </div>

      <div id="rag-columns" className="mc-rag-columns">
        {[rag.gains, rag.needs].map((col, i) => (
          <div key={col.title} className="mc-rag-col" data-kind={i === 0 ? "gains" : "needs"}>
            <b>{col.title}</b>
            <ul>
              {col.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mc-rag-caution">{rag.caution}</p>

      <p className="mc-key" style={{ marginTop: "1.8rem" }}>
        {rag.key}
      </p>
    </section>
  );
}
