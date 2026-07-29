"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "../gsapSetup";
import { motion, ease } from "../motion";
import { generation } from "../content.ru";

type Props = {
  lite: boolean;
  mobile: boolean;
  ready: boolean;
};

export default function GenerationSection({ lite, mobile, ready }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ready || lite) return;
    const ctx = gsap.context(() => {
      const markers = sectionRef.current?.querySelectorAll<HTMLElement>(".mc-stage-markers span");
      const setStage = (idx: number) => {
        markers?.forEach((el, i) => el.setAttribute("data-active", String(i <= idx)));
      };

      gsap.set(".gen-query", { opacity: 0, y: 16 });
      gsap.set(".mc-gen-ctx-chip", { opacity: 0, y: 12 });
      gsap.set(".gen-ghost-row", { opacity: 0 });
      gsap.set(".mc-gen-word", { opacity: 0, y: 8 });
      gsap.set(".mc-gen-check .mc-chip", { opacity: 0, y: 8 });
      gsap.set("#gen-key", { opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: viewportRef.current,
          start: "top top",
          end: mobile ? "+=180%" : "+=240%",
          scrub: motion.scrubSoft,
          onUpdate: (self) => setStage(Math.min(4, Math.floor(self.progress * 5.2))),
        },
      });

      tl.to(".gen-query", { opacity: 1, y: 0, duration: 0.12, ease: ease.ui }, 0.02)
        .to(".mc-gen-ctx-chip", { opacity: 1, y: 0, duration: 0.1, stagger: 0.05, ease: ease.ui }, 0.2)
        .to(".gen-ghost-row", { opacity: 1, duration: 0.1 }, 0.42)
        .to(".gen-ghost-row", { opacity: 0.25, duration: 0.08 }, 0.58)
        .to(".mc-gen-word", { opacity: 1, y: 0, duration: 0.07, stagger: 0.055, ease: ease.ui }, 0.62)
        .to(".mc-gen-check .mc-chip", { opacity: 1, y: 0, duration: 0.08, stagger: 0.05, ease: ease.ui }, 1.06)
        .to("#gen-key", { opacity: 1, duration: 0.12, ease: ease.ui }, 1.22);
    }, sectionRef);
    return () => ctx.revert();
  }, [ready, lite, mobile]);

  return (
    <section ref={sectionRef} id="generation" className="mc-scene" aria-labelledby="gen-title">
      <div ref={viewportRef} className="mc-scene-viewport mc-scene-viewport--center">
        <div className="mc-center" style={{ width: "100%" }}>
          <p className="mc-eyebrow">{generation.eyebrow}</p>
          <h2 id="gen-title" className="mc-h2">
            {generation.title}
          </h2>
          <div className="mc-stage-markers" aria-hidden="true" style={{ marginTop: "0.8rem" }}>
            {generation.stages.map((s, i) => (
              <span key={s} data-active={i === 0}>
                {s}
              </span>
            ))}
          </div>

          <div className="mc-gen-stage">
            <div className="mc-gen-query gen-query">«{generation.query}»</div>
            <div className="mc-gen-context">
              {generation.contextChips.map((c) => (
                <span key={c} className="mc-gen-ctx-chip">
                  + {c}
                </span>
              ))}
            </div>
            <div className="mc-gen-answer gen-ghost-row" aria-hidden="true">
              {["Добрый день…", "Здравствуйте!", "Уважаемый…"].map((v, i) => (
                <span key={v} className="mc-gen-ghost" style={{ opacity: 0.55 - i * 0.15 }}>
                  {v}
                </span>
              ))}
            </div>
            <div className="mc-gen-answer" aria-label="Ответ собирается по словам">
              {generation.answerWords.map((w, i) => (
                <span key={i} className="mc-gen-word">
                  {w}
                </span>
              ))}
            </div>
            <div className="mc-gen-check" aria-label="Зона проверки человеком">
              {generation.checks.map((c) => (
                <span key={c} className="mc-chip">
                  ✓ {c}
                </span>
              ))}
            </div>
          </div>

          <p id="gen-key" className="mc-key">
            {generation.key}
          </p>
          <p className="mc-metaphor-note">{generation.note}</p>
        </div>
      </div>
    </section>
  );
}
