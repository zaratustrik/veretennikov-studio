"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "../gsapSetup";
import { ease, motion } from "../motion";
import { traffic } from "../content.ru";
import { track } from "../analytics";

type Props = {
  lite: boolean;
  ready: boolean;
};

export default function TrafficSection({ lite, ready }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [taskIdx, setTaskIdx] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [answered, setAnswered] = useState(0);

  useEffect(() => {
    if (!ready || lite || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".mc-traffic-card", {
        opacity: 0,
        y: 20,
        duration: motion.slow,
        ease: ease.major,
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [ready, lite]);

  const task = traffic.tasks[taskIdx];
  const correctZone = traffic.zones.find((z) => z.id === task.zone);
  const chosenZone = traffic.zones.find((z) => z.id === chosen);
  const match = chosen === task.zone;

  const choose = (zoneId: string) => {
    if (chosen) return;
    setChosen(zoneId);
    const n = answered + 1;
    setAnswered(n);
    if (n >= 3) track("mc_risk_quiz_complete");
  };

  const next = () => {
    setChosen(null);
    setTaskIdx((i) => (i + 1) % traffic.tasks.length);
  };

  return (
    <section ref={sectionRef} id="traffic" className="mc-section mc-section--calm mc-center" aria-labelledby="tr-title">
      <p className="mc-eyebrow" style={{ color: "var(--accent-check)" }}>
        {traffic.eyebrow}
      </p>
      <h2 id="tr-title" className="mc-h2">
        {traffic.title}
      </h2>
      <p className="mc-lead" style={{ textAlign: "center" }}>
        Определите, сколько контроля нужно задаче.
      </p>

      <div className="mc-traffic">
        <div className="mc-traffic-card">
          <div className="mc-traffic-task" aria-live="polite">
            {task.text}
          </div>
          <div className="mc-zone-row" role="group" aria-label="Выбор зоны риска">
            {traffic.zones.map((z) => (
              <button
                key={z.id}
                type="button"
                className="mc-zone-btn"
                style={{ ["--zone-color" as string]: z.color }}
                data-chosen={chosen === z.id}
                onClick={() => choose(z.id)}
                disabled={Boolean(chosen)}
              >
                {z.name}
              </button>
            ))}
          </div>
          <div className="mc-traffic-feedback" aria-live="polite">
            {chosen ? (
              <>
                <b style={{ color: correctZone?.color }}>
                  {match ? "Да — " : "Скорее "}
                  {correctZone?.name.toLowerCase()} зона.
                </b>{" "}
                {task.why}. <br />
                <span style={{ opacity: 0.8 }}>Правило зоны: {correctZone?.rule}.</span>
                {!match && chosenZone ? (
                  <span style={{ display: "block", marginTop: "0.4em", opacity: 0.7 }}>
                    Ваш выбор — {chosenZone.name.toLowerCase()}: границы зон зависят от практики организации, но ориентируйтесь на цену ошибки.
                  </span>
                ) : null}
              </>
            ) : (
              "Выберите зону — появится объяснение."
            )}
          </div>
          <div className="mc-traffic-meta">
            <span>
              {taskIdx + 1} / {traffic.tasks.length}
            </span>
            <button type="button" className="mc-btn mc-btn-ghost mc-btn-small" onClick={next}>
              Следующая задача
            </button>
          </div>
        </div>
      </div>

      <p className="mc-key" style={{ marginTop: "2rem" }}>
        {traffic.key}
      </p>
      <p className="mc-privacy-note">{traffic.disclaimer}</p>
    </section>
  );
}
