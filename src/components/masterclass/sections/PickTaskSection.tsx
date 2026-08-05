"use client";

import { useEffect, useRef } from "react";
import { gsap } from "../gsapSetup";
import { ease, motion } from "../motion";
import { pickTask } from "../content.ru";

type Props = {
  lite: boolean;
  ready: boolean;
};

/**
 * Выбирают не профессию, а операцию: три отраслевые пары «не X, а Y»
 * и пять фильтров, через которые проходит кандидат на первый пилот.
 */
export default function PickTaskSection({ lite, ready }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ready || lite || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".mc-pair", {
        opacity: 0,
        y: 16,
        duration: motion.base,
        stagger: motion.staggerBase,
        ease: ease.ui,
        scrollTrigger: { trigger: "#pick-pairs", start: "top 76%" },
      });
      // фильтры входят по очереди — это и есть последовательное сито
      gsap.from(".mc-filter", {
        opacity: 0,
        y: 18,
        duration: motion.base,
        stagger: motion.staggerBase,
        ease: ease.major,
        scrollTrigger: { trigger: "#pick-filters", start: "top 78%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [ready, lite]);

  return (
    <section
      ref={sectionRef}
      id="pick-task"
      className="mc-section mc-section--calm mc-center"
      aria-labelledby="pick-title"
    >
      <p className="mc-eyebrow" style={{ color: "var(--accent-rebuild)" }}>
        {pickTask.eyebrow}
      </p>
      <h2 id="pick-title" className="mc-h2">
        {pickTask.title}
      </h2>
      <p className="mc-lead" style={{ textAlign: "center" }}>{pickTask.lead}</p>

      <div id="pick-pairs" className="mc-pairs">
        {pickTask.pairs.map((p) => (
          <div key={p.area} className="mc-pair">
            <b>{p.area}</b>
            <s>не {p.wrong}</s>
            <span>а {p.right}</span>
          </div>
        ))}
      </div>

      <p className="mc-small" style={{ marginTop: "2.4rem", opacity: 0.85 }}>{pickTask.filtersLead}</p>
      <div id="pick-filters" className="mc-filters">
        {pickTask.filters.map((f, i) => (
          <div key={f.name} className="mc-filter">
            <i aria-hidden="true">{i + 1}</i>
            <b>{f.name}</b>
            <span>{f.short}</span>
          </div>
        ))}
      </div>

      <p className="mc-key" style={{ marginTop: "2.2rem" }}>
        {pickTask.key}
      </p>
      <p className="mc-small" style={{ marginTop: "1rem", opacity: 0.7 }}>{pickTask.flags}</p>
    </section>
  );
}
