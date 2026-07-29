"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "../gsapSetup";
import { ease, motion } from "../motion";
import { goodBad } from "../content.ru";

type Props = {
  lite: boolean;
  ready: boolean;
};

/**
 * Живая трансформация: расплывчатый запрос → структурированное поручение.
 * Управляется кнопкой (детерминированно, одинаково работает на сцене).
 */
export default function GoodBadSection({ lite, ready }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0); // 0 = только плохой запрос
  const total = goodBad.improvements.length;

  useEffect(() => {
    if (!ready || lite || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".mc-gb-stage > *", {
        opacity: 0,
        y: 16,
        duration: motion.base,
        stagger: motion.staggerBase,
        ease: ease.ui,
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [ready, lite]);

  const improved = step > 0;
  const done = step >= total;
  const queryText = improved
    ? goodBad.improvements.slice(0, step).map((i) => i.text).join(" ")
    : goodBad.bad;

  return (
    <section ref={sectionRef} id="good-bad" className="mc-section mc-section--calm mc-center" aria-labelledby="gb-title">
      <p className="mc-eyebrow" style={{ color: "var(--accent-delegate)" }}>
        {goodBad.eyebrow}
      </p>
      <h2 id="gb-title" className="mc-h2">
        {goodBad.title}
      </h2>

      <div className="mc-gb-stage">
        <div
          className="mc-gb-query"
          style={{
            borderColor: done
              ? "color-mix(in srgb, var(--accent-check) 60%, transparent)"
              : improved
                ? "color-mix(in srgb, var(--accent-delegate) 45%, transparent)"
                : "color-mix(in srgb, var(--danger) 45%, transparent)",
          }}
          aria-live="polite"
        >
          «{queryText}»
        </div>

        {!improved ? (
          <div className="mc-gb-fog" aria-hidden="true">
            <span>?</span>
            <span>какой проект…</span>
            <span>?</span>
            <span>для кого…</span>
            <span>?</span>
          </div>
        ) : (
          <div className="mc-gb-additions" aria-label="Добавленные компоненты">
            {goodBad.improvements.map((imp, i) => (
              <span key={imp.name} className="mc-gb-add" data-on={i < step}>
                + {imp.name}
              </span>
            ))}
          </div>
        )}

        <button
          type="button"
          className="mc-btn mc-btn-primary"
          onClick={() => setStep((s) => (s >= total ? 0 : s + 1))}
        >
          {done ? "Сбросить" : step === 0 ? "Улучшить запрос" : `Добавить ещё (${step}/${total})`}
        </button>

        {done ? <p className="mc-key">{goodBad.key}</p> : null}
      </div>
    </section>
  );
}
