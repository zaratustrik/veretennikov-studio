"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../gsapSetup";
import { motion, ease } from "../motion";
import { hero, stepColors } from "../content.ru";
import { sceneStore } from "../sceneStore";
import { track } from "../analytics";

type Props = {
  lite: boolean;
  ready: boolean;
  onPresenter: () => void;
};

export default function HeroSection({ lite, ready, onPresenter }: Props) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!ready || lite) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: ease.major } });
      tl.from(".mc-hero-marker", { y: 10, opacity: 0, duration: motion.base })
        .from(".mc-hero-title", { y: 26, opacity: 0, duration: motion.cinematic }, "-=0.2")
        .fromTo(
          ".mc-hero-word",
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: motion.slow, stagger: 0.16, ease: ease.ui },
          "-=0.55",
        )
        .from(".mc-hero-lead", { y: 10, opacity: 0, duration: motion.base, ease: ease.ui }, "-=0.3")
        .from(
          ".mc-hero-actions, .mc-hero-author, .mc-scroll-hint",
          { opacity: 0, duration: motion.slow, ease: ease.ui },
          "-=0.1",
        );

      ScrollTrigger.create({
        trigger: ref.current,
        start: "top top",
        end: "bottom top",
        scrub: motion.scrubSoft,
        onUpdate: (self) => {
          sceneStore.heroProgress = self.progress;
          sceneStore.fade = Math.max(0, 1 - self.progress * 1.15);
        },
      });
    }, ref);
    return () => ctx.revert();
  }, [ready, lite]);

  const start = () => {
    track("mc_start");
    document.getElementById("program-vs-ai")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={ref} id="hero" className="mc-section mc-hero" aria-label="ИИ в работе — начало">
      <p className="mc-hero-marker">{hero.marker}</p>
      <h1 className="mc-h1 mc-hero-title">{hero.title}</h1>
      <div className="mc-hero-words">
        {hero.words.map((w) => (
          <span key={w.step} className="mc-hero-word" style={{ color: stepColors[w.step] }}>
            <span className="mc-dot" style={{ background: stepColors[w.step] }} />
            {w.text}
          </span>
        ))}
      </div>
      <p className="mc-lead mc-hero-lead">{hero.lead}</p>
      <div className="mc-hero-actions" style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
        <button type="button" className="mc-btn mc-btn-primary" onClick={start}>
          Начать
        </button>
        <button type="button" className="mc-btn mc-btn-ghost" onClick={onPresenter}>
          Режим ведущего
        </button>
      </div>
      <p className="mc-hero-author">{hero.author}</p>
      <span className="mc-scroll-hint" aria-hidden="true">
        ЛИСТАЙТЕ ВНИЗ
      </span>
    </section>
  );
}
