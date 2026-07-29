"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "../gsapSetup";
import { ease, motion } from "../motion";
import { demos } from "../content.ru";
import { track } from "../analytics";

type Props = {
  lite: boolean;
  ready: boolean;
};

/** Три демонстрационных сценария в одной рабочей среде (вкладки). */
export default function DemosSection({ lite, ready }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (!ready || lite || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".mc-demo-stage, .mc-tabs", {
        opacity: 0,
        y: 18,
        duration: motion.slow,
        ease: ease.major,
        stagger: 0.1,
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [ready, lite]);

  // смена сценария: краткая анимация перетекания
  useEffect(() => {
    if (lite || !stageRef.current) return;
    const items = stageRef.current.querySelectorAll(".mc-demo-item, .mc-demo-human");
    gsap.fromTo(
      items,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: motion.fast, stagger: motion.staggerTight, ease: ease.ui },
    );
  }, [tab, lite]);

  const d = demos.tabs[tab];

  const selectTab = (i: number) => {
    setTab(i);
    track("mc_demo_open");
  };

  return (
    <section ref={sectionRef} id="demos" className="mc-section mc-section--calm mc-center" aria-labelledby="demos-title">
      <p className="mc-eyebrow">{demos.eyebrow}</p>
      <h2 id="demos-title" className="mc-h2">
        {demos.title}
      </h2>

      <div className="mc-tabs" role="tablist" aria-label="Демонстрационные сценарии" style={{ marginTop: "1.4rem" }}>
        {demos.tabs.map((t, i) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            className="mc-tab"
            aria-selected={i === tab}
            onClick={() => selectTab(i)}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="mc-demo-stage" ref={stageRef}>
        <div className="mc-demo-flow" role="tabpanel" aria-label={d.name}>
          <div className="mc-demo-col" aria-label="Вход">
            {d.input.map((x) => (
              <div key={x} className="mc-demo-item">
                {x}
              </div>
            ))}
          </div>
          <div className="mc-demo-arrow" aria-hidden="true">
            →
          </div>
          <div className="mc-demo-col" aria-label="Результат">
            {d.output.map((x) => (
              <div key={x} className="mc-demo-item mc-demo-item--out">
                {x}
              </div>
            ))}
          </div>
        </div>
        <p className="mc-demo-human">✓ {d.human}</p>
      </div>

      <p className="mc-small" style={{ marginTop: "1.6rem", opacity: 0.75 }}>
        На мастер-классе эти сценарии выполняются вживую. Материалы обезличены.
      </p>
    </section>
  );
}
