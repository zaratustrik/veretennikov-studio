"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { gsap } from "../gsapSetup";
import { motion } from "../motion";
import { ladder } from "../content.ru";

type Props = {
  lite: boolean;
  mobile: boolean;
  ready: boolean;
};

/**
 * Маршрут зрелости: один процесс становится всё более автоматизированным.
 * Точка движется по восходящему пути; на каждой станции — крупное слово
 * и мини-схема процесса (ручные блоки → блоки ИИ + контрольные точки).
 */
export default function LadderSection({ lite, mobile, ready }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const shortRef = useRef<HTMLDivElement>(null);

  const stations = useMemo(
    () =>
      ladder.stations.map((s, i) => ({
        ...s,
        x: 70 + i * 148,
        y: 330 - i * 48,
      })),
    [],
  );
  const pathD = useMemo(
    () => `M ${stations.map((s) => `${s.x} ${s.y}`).join(" L ")}`,
    [stations],
  );

  useLayoutEffect(() => {
    if (!ready || lite) return;
    const ctx = gsap.context(() => {
      const setStation = (idx: number) => {
        const st = ladder.stations[idx];
        if (wordRef.current) wordRef.current.textContent = st.name;
        if (shortRef.current) shortRef.current.textContent = st.short;
        sectionRef.current
          ?.querySelectorAll<SVGGElement>(".ladder-node")
          .forEach((el, i) => el.setAttribute("opacity", i <= idx ? "1" : "0.25"));
        // мини-схема: ручные блоки гаснут, ИИ-блоки и точки контроля появляются
        sectionRef.current
          ?.querySelectorAll<SVGRectElement>(".ladder-manual")
          .forEach((el, i) => el.setAttribute("opacity", i < 5 - idx ? "0.85" : "0.15"));
        sectionRef.current
          ?.querySelectorAll<SVGRectElement>(".ladder-ai")
          .forEach((el, i) => el.setAttribute("opacity", i < idx ? "0.9" : "0.12"));
        sectionRef.current
          ?.querySelectorAll<SVGCircleElement>(".ladder-cp")
          .forEach((el, i) => el.setAttribute("opacity", i < Math.max(0, idx - 1) ? "1" : "0.12"));
      };
      setStation(0);

      gsap.set("#ladder-dot", { attr: { cx: stations[0].x, cy: stations[0].y } });
      gsap.set("#ladder-path", { strokeDashoffset: 1 });
      gsap.set("#ladder-key", { opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: viewportRef.current,
          start: "top top",
          end: mobile ? "+=170%" : "+=230%",
          scrub: motion.scrubSoft,
          onUpdate: (self) => setStation(Math.min(5, Math.floor(self.progress * 6.4))),
        },
      });

      tl.to("#ladder-path", { strokeDashoffset: 0, duration: 0.9 }, 0.05);
      stations.forEach((s, i) => {
        if (i === 0) return;
        tl.to("#ladder-dot", { attr: { cx: s.x, cy: s.y }, duration: 0.15 }, 0.05 + i * 0.15);
      });
      tl.to("#ladder-key", { opacity: 1, duration: 0.1 }, 1.0);
    }, sectionRef);
    return () => ctx.revert();
  }, [ready, lite, mobile, stations]);

  return (
    <section ref={sectionRef} id="ladder" className="mc-scene" aria-labelledby="ladder-title">
      <div ref={viewportRef} className="mc-scene-viewport" style={{ gridTemplateColumns: "minmax(0,4fr) minmax(0,8fr)" }}>
        <div>
          <p className="mc-eyebrow" style={{ color: "var(--accent-rebuild)" }}>
            {ladder.eyebrow}
          </p>
          <h2 id="ladder-title" className="mc-h2" style={{ marginTop: "0.7rem" }}>
            {ladder.title}
          </h2>
          <div className="mc-ladder-word" ref={wordRef} style={{ marginTop: "2.2rem", color: "var(--accent-rebuild)" }}>
            {ladder.stations[0].name}
          </div>
          <div className="mc-ladder-short" ref={shortRef}>
            {ladder.stations[0].short}
          </div>
          <p id="ladder-key" className="mc-body" style={{ marginTop: "2rem" }}>
            {ladder.key}
          </p>
        </div>

        <div className="mc-ladder-stage">
          <svg
            className="mc-svg-stage"
            viewBox="0 0 880 420"
            role="img"
            aria-label="Маршрут зрелости от ручной работы до агента под контролем"
          >
            <path
              id="ladder-path"
              d={pathD}
              fill="none"
              stroke="var(--accent-rebuild)"
              strokeWidth="2"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset="0"
              opacity="0.7"
            />
            {stations.map((s, i) => (
              <g key={s.name} className="ladder-node" opacity={i === 0 ? 1 : 0.25}>
                <circle cx={s.x} cy={s.y} r="8" fill="var(--accent-rebuild)" />
                <text x={s.x} y={s.y - 18} textAnchor="middle" fill="var(--text-primary)" fontSize="15" fontWeight="650">
                  {s.name}
                </text>
              </g>
            ))}
            <circle id="ladder-dot" r="13" fill="none" stroke="var(--text-primary)" strokeWidth="2" cx={stations[0].x} cy={stations[0].y} />

            {/* мини-схема процесса внизу: ручные блоки → ИИ-блоки + контроль */}
            <g transform="translate(120, 368)">
              <text x="-8" y="14" textAnchor="end" fill="var(--text-secondary)" fontSize="12">
                процесс:
              </text>
              {[0, 1, 2, 3, 4].map((i) => (
                <rect key={`m${i}`} className="ladder-manual" x={i * 64} y={0} width="48" height="20" rx="5"
                  fill="none" stroke="var(--text-secondary)" strokeWidth="1.4" opacity="0.85" />
              ))}
              {[0, 1, 2, 3, 4].map((i) => (
                <rect key={`a${i}`} className="ladder-ai" x={i * 64} y={0} width="48" height="20" rx="5"
                  fill="rgba(141,107,255,0.2)" stroke="var(--accent-rebuild)" strokeWidth="1.4" opacity="0.12" />
              ))}
              {[0, 1, 2, 3].map((i) => (
                <circle key={`c${i}`} className="ladder-cp" cx={i * 64 + 56} cy={10} r="4"
                  fill="var(--accent-check)" opacity="0.12" />
              ))}
              <text x="330" y="14" fill="var(--text-secondary)" fontSize="12">
                ● контрольные точки
              </text>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
