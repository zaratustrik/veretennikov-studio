"use client";

import { useEffect, useRef } from "react";
import { gsap } from "../gsapSetup";
import { ease, motion } from "../motion";
import { checklist } from "../content.ru";

type Props = {
  lite: boolean;
  ready: boolean;
};

export default function ChecklistSection({ lite, ready }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ready || lite || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".mc-chip", {
        opacity: 0,
        y: 12,
        duration: motion.base,
        stagger: motion.staggerTight,
        ease: ease.ui,
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
      });
      gsap.from(".mc-checklist-key", {
        opacity: 0,
        y: 14,
        duration: motion.slow,
        ease: ease.major,
        scrollTrigger: { trigger: sectionRef.current, start: "top 55%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [ready, lite]);

  return (
    <section ref={sectionRef} id="checklist" className="mc-section mc-section--calm mc-center" aria-labelledby="cl-title">
      <p className="mc-eyebrow" style={{ color: "var(--accent-check)" }}>
        {checklist.eyebrow}
      </p>
      <h2 id="cl-title" className="mc-h2">
        {checklist.title}
      </h2>
      <div className="mc-chips" style={{ marginTop: "1.6rem" }}>
        {checklist.chips.map((c) => (
          <span key={c} className="mc-chip">
            ✓ {c}
          </span>
        ))}
      </div>
      <p className="mc-key mc-checklist-key" style={{ marginTop: "2.2rem" }}>
        {checklist.key}
      </p>
    </section>
  );
}
