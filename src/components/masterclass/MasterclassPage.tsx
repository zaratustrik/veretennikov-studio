"use client";

import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "./gsapSetup";
import { chapters } from "./content.ru";
import { useQualityProfile } from "./useQualityProfile";
import { usePresenter } from "./usePresenter";
import { initAnalytics, track } from "./analytics";
import ChapterNavigation from "./ChapterNavigation";
import PresenterHUD from "./PresenterHUD";
import HeroSection from "./sections/HeroSection";
import ProgramVsAISection from "./sections/ProgramVsAISection";
import GenerationSection from "./sections/GenerationSection";
import ChatAgentSection from "./sections/ChatAgentSection";
import FourPSection from "./sections/FourPSection";
import FormulaSection from "./sections/FormulaSection";
import GoodBadSection from "./sections/GoodBadSection";
import CycleSection from "./sections/CycleSection";
import ChecklistSection from "./sections/ChecklistSection";
import TrafficSection from "./sections/TrafficSection";
import LadderSection from "./sections/LadderSection";
import PickMeasureSection from "./sections/PickMeasureSection";
import DemosSection from "./sections/DemosSection";
import SecuritySection from "./sections/SecuritySection";
import FinaleSection from "./sections/FinaleSection";

const MasterclassCanvas = dynamic(() => import("./MasterclassCanvas"), {
  ssr: false,
});

type Props = {
  metrikaId?: string;
};

export default function MasterclassPage({ metrikaId }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const quality = useQualityProfile();
  const [activeChapter, setActiveChapter] = useState<string>("hero");

  const { ready, lite, mobile, reducedMotion } = quality;
  const presenter = usePresenter(reducedMotion);
  const showCanvas = ready && !lite && !mobile;

  useEffect(() => {
    initAnalytics(metrikaId);
    track("mc_open");
  }, [metrikaId]);

  // маркеры режимов на .mc-root (для CSS)
  useEffect(() => {
    const root = rootRef.current?.closest(".mc-root");
    root?.setAttribute("data-lite", String(lite));
    root?.setAttribute("data-presenting", String(presenter.presenting));
  }, [lite, presenter.presenting]);

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
            if (self.isActive) {
              setActiveChapter(ch.id);
              track(`mc_chapter_${ch.id.replace(/-/g, "_")}`);
            }
          },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, [ready]);

  // пересчёт pinned-сцен после изменения размеров окна делает сам ScrollTrigger;
  // здесь только страховка от layout shift при повороте устройства
  useEffect(() => {
    if (!ready) return;
    const onOrientation = () => ScrollTrigger.refresh();
    window.addEventListener("orientationchange", onOrientation);
    return () => window.removeEventListener("orientationchange", onOrientation);
  }, [ready]);

  const flags = { lite, mobile, ready };

  return (
    <div ref={rootRef} lang="ru">
      <div ref={progressRef} className="mc-progress" aria-hidden="true" />
      <ChapterNavigation active={activeChapter} />
      {showCanvas ? <MasterclassCanvas /> : null}

      <HeroSection lite={lite || mobile} ready={ready} onPresenter={presenter.enter} />
      <ProgramVsAISection {...flags} />
      <GenerationSection {...flags} />
      <ChatAgentSection {...flags} />
      <FourPSection {...flags} />
      <FormulaSection lite={lite} ready={ready} />
      <GoodBadSection lite={lite} ready={ready} />
      <CycleSection {...flags} />
      <ChecklistSection lite={lite} ready={ready} />
      <TrafficSection lite={lite} ready={ready} />
      <LadderSection {...flags} />
      <PickMeasureSection lite={lite} ready={ready} />
      <DemosSection lite={lite} ready={ready} />
      <SecuritySection lite={lite} ready={ready} />
      <FinaleSection lite={lite || mobile} ready={ready} />

      {presenter.presenting ? <PresenterHUD presenter={presenter} /> : null}

      {lite && ready ? (
        <span className="mc-lite-note" role="status">
          lite mode
        </span>
      ) : null}
    </div>
  );
}
