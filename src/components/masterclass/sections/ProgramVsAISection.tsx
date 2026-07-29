"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { gsap } from "../gsapSetup";
import { motion, ease } from "../motion";
import { programVsAi, stepColors } from "../content.ru";

type Props = {
  lite: boolean;
  mobile: boolean;
  ready: boolean;
};

/** Детерминированное поле узлов «нейросети» */
function useField() {
  return useMemo(() => {
    const rng = mulberry32(42);
    const nodes: Array<{ x: number; y: number; r: number }> = [];
    for (let i = 0; i < 26; i++) {
      nodes.push({
        x: 420 + rng() * 300,
        y: 130 + rng() * 270,
        r: 2.6 + rng() * 2.2,
      });
    }
    const links: Array<[number, number]> = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        if (Math.hypot(dx, dy) < 82) links.push([i, j]);
      }
    }
    const sorted = [...nodes.keys()].sort((a, b) => nodes[a].x - nodes[b].x);
    const queryIdx = [sorted[0], sorted[6], sorted[12], sorted[18], sorted[24]];
    const queryPoints = queryIdx.map((i) => `${nodes[i].x},${nodes[i].y}`).join(" ");
    const examples = Array.from({ length: 10 }, () => {
      const t = nodes[Math.floor(rng() * nodes.length)];
      return { x: t.x, y: t.y };
    });
    return { nodes, links, queryPoints, examples };
  }, []);
}

export default function ProgramVsAISection({ lite, mobile, ready }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const field = useField();

  useLayoutEffect(() => {
    if (!ready || lite) return;
    const ctx = gsap.context(() => {
      const items = listRef.current?.querySelectorAll<HTMLElement>(".mc-formula-item");
      const setStep = (idx: number) => {
        items?.forEach((el, i) => el.setAttribute("data-active", String(i === idx)));
      };

      gsap.set("#pv-output", { opacity: 0 });
      gsap.set("#pv-input", { x: 0, y: 0, opacity: 1 });
      gsap.set("#pv-right", { opacity: 0.18 });
      gsap.set(".pv-example", { y: -70, opacity: 0 });
      gsap.set(".pv-link-strong", { attr: { "stroke-width": 0.5 }, opacity: 0.2 });
      gsap.set("#pv-query", { strokeDashoffset: 1 });
      gsap.set(".pv-variant", { opacity: 0, y: 8 });
      gsap.set("#pv-verdict", { opacity: 0, y: 14 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: viewportRef.current,
          start: "top top",
          end: mobile ? "+=170%" : "+=250%",
          scrub: motion.scrubSoft,
          onUpdate: (self) => setStep(self.progress < 0.45 ? 0 : 1),
        },
      });

      // 1) машина правил — дважды одинаковый маршрут
      const run = (at: number) => {
        tl.fromTo("#pv-input", { x: 0, y: 0, opacity: 1 }, { y: 148, duration: 0.06 }, at)
          .to("#pv-input", { x: 118, duration: 0.06 })
          .to("#pv-input", { y: 258, duration: 0.06 })
          .to("#pv-input", { x: 238, duration: 0.06 })
          .to("#pv-input", { opacity: 0, duration: 0.02 })
          .to("#pv-output", { opacity: 1, duration: 0.03 }, "<");
      };
      run(0);
      tl.to("#pv-output", { opacity: 0.35, duration: 0.02 }, 0.3);
      run(0.32);

      // 2) фокус — на обучаемое поле
      tl.to("#pv-left", { opacity: 0.22, duration: 0.1 }, 0.62)
        .to("#pv-right", { opacity: 1, duration: 0.12 }, 0.62)
        .to(".pv-example", { y: 0, opacity: 0.9, duration: 0.14, stagger: 0.012, ease: ease.ui }, 0.74)
        .to(".pv-link-strong", { attr: { "stroke-width": 1.7 }, opacity: 0.55, duration: 0.14 }, 0.8);

      // 3) вероятностный результат и вывод
      tl.to("#pv-query", { strokeDashoffset: 0, duration: 0.16 }, 1.0)
        .to(".pv-variant", { opacity: (i) => [0.95, 0.5, 0.28][i], y: 0, duration: 0.08, stagger: 0.05, ease: ease.ui }, 1.12)
        .to("#pv-verdict", { opacity: 1, y: 0, duration: 0.12, ease: ease.ui }, 1.3);
    }, sectionRef);
    return () => ctx.revert();
  }, [ready, lite, mobile]);

  return (
    <section ref={sectionRef} id="program-vs-ai" className="mc-scene" aria-labelledby="pv-title">
      <div ref={viewportRef} className="mc-scene-viewport">
        <div>
          <p className="mc-eyebrow">{programVsAi.eyebrow}</p>
          <h2 id="pv-title" className="mc-h2" style={{ marginTop: "0.7rem" }}>
            {programVsAi.title}
          </h2>
          <div ref={listRef} className="mc-formula-list">
            {programVsAi.formulas.map((f, i) => (
              <div className="mc-formula-item" data-active={i === 0} key={f.label}>
                <div className="mc-formula-label" style={{ color: stepColors[f.step] }}>
                  {f.label}
                </div>
                <div className="mc-formula">{f.formula}</div>
              </div>
            ))}
          </div>
          <p className="mc-metaphor-note" style={{ marginTop: "2rem" }}>
            {programVsAi.note}
          </p>
        </div>

        <div>
          <svg
            className="mc-svg-stage"
            viewBox="0 0 760 500"
            role="img"
            aria-label="Слева — программа с фиксированными правилами, справа — обучаемая сеть связей"
          >
            <g id="pv-left">
              <rect x="24" y="70" width="300" height="370" rx="18" fill="rgba(14,28,51,0.5)" stroke="var(--line-soft)" />
              <polyline
                points="66,140 66,288 184,288 184,398 296,398"
                fill="none"
                stroke="rgba(120,180,230,0.3)"
                strokeWidth="2"
                strokeDasharray="4 7"
              />
              <rect id="pv-input" x="53" y="127" width="26" height="26" rx="6" fill="var(--accent-understand)" opacity="0" />
              <g id="pv-output" opacity="1">
                <rect x="282" y="384" width="34" height="28" rx="7" fill="none" stroke="var(--accent-understand)" strokeWidth="2" />
              </g>
              <text x="44" y="475" fill="var(--text-secondary)" fontSize="13">
                один вход — один результат
              </text>
            </g>

            <g id="pv-right">
              {field.links.map(([a, b], k) => (
                <line
                  key={k}
                  className={`pv-link${k % 3 === 0 ? " pv-link-strong" : ""}`}
                  x1={field.nodes[a].x}
                  y1={field.nodes[a].y}
                  x2={field.nodes[b].x}
                  y2={field.nodes[b].y}
                  stroke="var(--accent-delegate)"
                  strokeWidth={k % 3 === 0 ? 1.7 : 0.5}
                  opacity={k % 3 === 0 ? 0.55 : 0.18}
                />
              ))}
              {field.nodes.map((n, k) => (
                <circle key={k} cx={n.x} cy={n.y} r={n.r} fill="#e9b24b" opacity="0.7" />
              ))}
              {field.examples.map((e2, k) => (
                <circle key={k} className="pv-example" cx={e2.x} cy={e2.y} r="1.8" fill="#f5f8fc" opacity="0.9" />
              ))}
              <polyline
                id="pv-query"
                points={field.queryPoints}
                fill="none"
                stroke="var(--accent-understand)"
                strokeWidth="2.4"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset="0"
              />
              {[0, 1, 2].map((i) => (
                <g key={i} className="pv-variant" opacity={[0.95, 0.5, 0.28][i]}>
                  <rect x={556 + i * 64} y={438} width="54" height="28" rx="7" fill="none" stroke="var(--accent-understand)" strokeWidth="1.6" />
                  <text x={583 + i * 64} y={456} fill="var(--text-secondary)" fontSize="11" textAnchor="middle">
                    {["ответ A", "ответ B", "ответ C"][i]}
                  </text>
                </g>
              ))}
              <text x="420" y="493" fill="var(--text-secondary)" fontSize="13">
                много примеров — вероятный ответ
              </text>
            </g>
          </svg>
          <p id="pv-verdict" className="mc-key" style={{ marginTop: "1.4rem", textAlign: "center" }}>
            уверенный тон <span style={{ color: "var(--danger)" }}>≠</span> правильный ответ
          </p>
        </div>
      </div>
    </section>
  );
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
