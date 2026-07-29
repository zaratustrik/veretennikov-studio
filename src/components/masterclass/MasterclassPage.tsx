"use client";

import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "./gsapSetup";
import { chapters } from "./content.ru";
import { useQualityProfile } from "./useQualityProfile";
import ChapterNavigation from "./ChapterNavigation";
import HeroSection from "./sections/HeroSection";
import ProgramVsAISection from "./sections/ProgramVsAISection";
import FourPSection from "./sections/FourPSection";

const MasterclassCanvas = dynamic(() => import("./MasterclassCanvas"), {
  ssr: false,
});

export default function MasterclassPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const quality = useQualityProfile();
  const [activeChapter, setActiveChapter] = useState<string>("hero");

  const { ready, lite, mobile } = quality;
  const showCanvas = ready && !lite && !mobile;

  // маркер lite-режима на .mc-root (для CSS-фолбэков)
  useEffect(() => {
    const root = rootRef.current?.closest(".mc-root");
    root?.setAttribute("data-lite", String(lite));
  }, [lite]);

  // прогресс-бар и активная глава
  useLayoutEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      if (progressRef.current) {
        gsap.to(progressRef.current, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.4,
          },
        });
      }
      chapters.forEach((ch) => {
        ScrollTrigger.create({
          trigger: `#${ch.id}`,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) setActiveChapter(ch.id);
          },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, [ready]);

  return (
    <div ref={rootRef}>
      <div ref={progressRef} className="mc-progress" aria-hidden="true" />
      <ChapterNavigation active={activeChapter} />
      {showCanvas ? <MasterclassCanvas /> : null}

      <HeroSection lite={lite || mobile} ready={ready} />
      <ProgramVsAISection lite={lite} mobile={mobile} ready={ready} />
      <FourPSection lite={lite} mobile={mobile} ready={ready} />

      {/* хвост slice: приглашение к продолжению истории */}
      <section
        className="mc-section"
        aria-label="Продолжение в разработке"
        style={{ paddingBottom: "9rem" }}
      >
        <div className="mc-banner">
          <strong>Это первый вертикальный срез интерактивной версии.</strong>{" "}
          Дальше по плану — сцены «Поручить», «Проверить», «Перестроить»,
          демонстрации, безопасность и практические инструменты (конструктор
          запроса и карточка ИИ-пилота).
        </div>
      </section>

      {lite && ready ? (
        <span className="mc-lite-note" role="status">
          lite mode
        </span>
      ) : null}
    </div>
  );
}
