"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { gsap } from "../gsapSetup";
import { motion } from "../motion";
import { cycle } from "../content.ru";

type Props = {
  lite: boolean;
  mobile: boolean;
  ready: boolean;
};

/** Живой цикл из 7 этапов; «оценка ↔ уточнение» проходит два оборота. */
export default function CycleSection({ lite, mobile, ready }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const layout = useMemo(() => {
    const cx = 310;
    const cy = 230;
    const r = 168;
    return cycle.steps.map((name, i) => {
      const a = -90 + (360 / cycle.steps.length) * i;
      const rad = (a * Math.PI) / 180;
      return { name, x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    });
  }, []);

  useLayoutEffect(() => {
    if (!ready || lite) return;
    const ctx = gsap.context(() => {
      gsap.set(".cycle-node", { opacity: 0.25 });
      gsap.set("#cycle-loop-arc", { opacity: 0 });
      gsap.set("#cycle-key", { opacity: 0, y: 12 });

      // последовательность подсветки: 0..3, loop 3↔4 дважды, 5, 6
      const seq = [0, 1, 2, 3, 4, 3, 4, 5, 6];
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: viewportRef.current,
          start: "top top",
          end: mobile ? "+=160%" : "+=220%",
          scrub: motion.scrubSoft,
        },
      });

      seq.forEach((nodeIdx, k) => {
        const at = 0.04 + k * 0.13;
        tl.to(`.cycle-node`, { opacity: 0.25, duration: 0.05 }, at);
        tl.to(`#cycle-node-${nodeIdx}`, { opacity: 1, duration: 0.06 }, at + 0.02);
        if (k >= 4 && k <= 6) {
          tl.to("#cycle-loop-arc", { opacity: 0.85, duration: 0.05 }, at);
        }
      });
      tl.to("#cycle-loop-arc", { opacity: 0, duration: 0.06 }, 0.04 + 7 * 0.13);
      tl.to("#cycle-key", { opacity: 1, y: 0, duration: 0.12 }, 0.04 + 8 * 0.13);
    }, sectionRef);
    return () => ctx.revert();
  }, [ready, lite, mobile]);

  return (
    <section ref={sectionRef} id="cycle" className="mc-scene" aria-labelledby="cycle-title">
      <div ref={viewportRef} className="mc-scene-viewport">
        <div>
          <p className="mc-eyebrow" style={{ color: "var(--accent-check)" }}>
            {cycle.eyebrow}
          </p>
          <h2 id="cycle-title" className="mc-h2" style={{ marginTop: "0.7rem" }}>
            {cycle.title}
          </h2>
          <p id="cycle-key" className="mc-key" style={{ marginTop: "2rem", maxWidth: "12em" }}>
            Первый ответ — черновик. Итерация занимает минуты.
          </p>
        </div>

        <div>
          <svg
            className="mc-svg-stage"
            viewBox="0 0 620 470"
            role="img"
            aria-label="Цикл: задача, контекст, черновик, оценка, уточнение, проверка, применение"
            style={{ maxWidth: 560, margin: "0 auto" }}
          >
            <circle cx="310" cy="230" r="168" fill="none" stroke="rgba(120,180,230,0.12)" strokeWidth="1.5" />
            {/* дуга повтора оценка↔уточнение */}
            <path
              id="cycle-loop-arc"
              d="M 403 355 A 168 168 0 0 1 282 396"
              fill="none"
              stroke="var(--accent-check)"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0"
            />
            {layout.map((n, i) => (
              <g key={n.name} id={`cycle-node-${i}`} className="cycle-node" opacity="0.25">
                <circle cx={n.x} cy={n.y} r="10" fill={i === 3 || i === 4 ? "var(--accent-check)" : "var(--accent-understand)"} opacity="0.9" />
                <text
                  x={n.x + (n.x > 300 ? 20 : n.x < 220 ? -20 : 0)}
                  y={n.y + (n.y > 300 ? 32 : n.y < 160 ? -22 : 6)}
                  textAnchor={n.x > 300 ? "start" : n.x < 220 ? "end" : "middle"}
                  fill="var(--text-primary)"
                  fontSize="17"
                  fontWeight="650"
                >
                  {n.name}
                </text>
              </g>
            ))}
            <text x="310" y="224" textAnchor="middle" fill="var(--text-secondary)" fontSize="14">
              оценка ↔ уточнение
            </text>
            <text x="310" y="246" textAnchor="middle" fill="var(--text-secondary)" fontSize="14">
              повторяются
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
