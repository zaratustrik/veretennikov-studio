"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../gsapSetup";
import { motion, ease } from "../motion";
import { hero, stepColors } from "../content.ru";
import { sceneStore } from "../sceneStore";

type Props = {
  lite: boolean;
  ready: boolean;
};

export default function HeroSection({ lite, ready }: Props) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!ready || lite) return;
    const ctx = gsap.context(() => {
      // входная последовательность
      const tl = gsap.timeline({ defaults: { ease: ease.major } });
      tl.from(".mc-hero-badge", { y: 14, opacity: 0, duration: motion.base })
        .from(
          ".mc-hero-title",
          { y: 22, opacity: 0, duration: motion.slow },
          "-=0.15",
        )
        .fromTo(
          ".mc-hero-word",
          { y: 10, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: motion.base,
            stagger: motion.staggerBase * 2.4,
            ease: ease.ui,
          },
          "-=0.3",
        )
        .from(
          ".mc-hero-lead, .mc-hero-actions, .mc-hero-author",
          {
            y: 12,
            opacity: 0,
            duration: motion.base,
            stagger: motion.staggerBase,
            ease: ease.ui,
          },
          "-=0.2",
        );

      // скролл hero → прогресс для canvas
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top top",
        end: "bottom top",
        scrub: motion.scrubSoft,
        onUpdate: (self) => {
          sceneStore.heroProgress = self.progress;
          sceneStore.fade = 1 - self.progress * 0.9;
        },
      });
    }, ref);
    return () => ctx.revert();
  }, [ready, lite]);

  const start = () =>
    document
      .getElementById("program-vs-ai")
      ?.scrollIntoView({ behavior: "smooth" });
  const toc = () =>
    document.getElementById("four-p")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      ref={ref}
      id="hero"
      className="mc-section mc-hero"
      aria-label="ИИ в работе — начало"
    >
      <p className="mc-pill mc-hero-badge">{hero.badge}</p>
      <h1 className="mc-h1 mc-hero-title" style={{ marginTop: "1.4rem" }}>
        {hero.title}
      </h1>
      <div className="mc-hero-words" style={{ marginTop: "1.1rem" }}>
        {hero.words.map((w) => (
          <span
            key={w.step}
            className="mc-hero-word"
            style={{ color: stepColors[w.step] }}
          >
            <span
              className="mc-dot"
              style={{ background: stepColors[w.step] }}
            />
            {w.text}
          </span>
        ))}
      </div>
      <p className="mc-lead mc-hero-lead" style={{ marginTop: "1.6rem" }}>
        {hero.lead}
      </p>
      <div
        className="mc-hero-actions"
        style={{ display: "flex", gap: "0.8rem", marginTop: "2.2rem", flexWrap: "wrap" }}
      >
        <button type="button" className="mc-btn mc-btn-primary" onClick={start}>
          Начать
        </button>
        <button type="button" className="mc-btn mc-btn-ghost" onClick={toc}>
          К методике 4П
        </button>
      </div>
      <p
        className="mc-body mc-hero-author"
        style={{ marginTop: "2.6rem", opacity: 0.8 }}
      >
        {hero.author}
      </p>
      <span className="mc-scroll-hint" aria-hidden="true">
        ЛИСТАЙТЕ ВНИЗ
      </span>
    </section>
  );
}
