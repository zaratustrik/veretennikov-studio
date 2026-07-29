"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { gsap } from "../gsapSetup";
import { motion, ease } from "../motion";
import { programVsAi } from "../content.ru";

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
    for (let i = 0; i < 30; i++) {
      nodes.push({
        x: 400 + rng() * 320,
        y: 120 + rng() * 300,
        r: 2.6 + rng() * 2.4,
      });
    }
    const links: Array<[number, number]> = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        if (Math.hypot(dx, dy) < 78) links.push([i, j]);
      }
    }
    // путь запроса — через 5 узлов слева направо
    const sorted = [...nodes.keys()].sort((a, b) => nodes[a].x - nodes[b].x);
    const queryIdx = [
      sorted[0],
      sorted[7],
      sorted[13],
      sorted[20],
      sorted[27],
    ];
    const queryPoints = queryIdx
      .map((i) => `${nodes[i].x},${nodes[i].y}`)
      .join(" ");
    // примеры-точки: входят сверху к случайным узлам
    const examples = Array.from({ length: 12 }, (_, k) => {
      const target = nodes[Math.floor(rng() * nodes.length)];
      return { x: target.x, y: target.y, delay: k };
    });
    return { nodes, links, queryPoints, examples };
  }, []);
}

export default function ProgramVsAISection({ lite, mobile, ready }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const field = useField();

  useLayoutEffect(() => {
    if (!ready || lite) return;
    const ctx = gsap.context(() => {
      const steps = stepsRef.current?.querySelectorAll<HTMLElement>(".mc-step");
      const setStep = (idx: number) => {
        steps?.forEach((el, i) =>
          el.setAttribute("data-active", String(i === idx)),
        );
      };

      // исходные состояния (в разметке всё в финальном виде — важно для lite)
      gsap.set("#pv-output", { opacity: 0 });
      gsap.set("#pv-input", { x: 0, y: 0, opacity: 1 });
      gsap.set("#pv-right", { opacity: 0.25 });
      gsap.set(".pv-example", { y: -70, opacity: 0 });
      gsap.set(".pv-link", { attr: { "stroke-width": 0.5 }, opacity: 0.2 });
      gsap.set("#pv-query", { strokeDashoffset: 1 });
      gsap.set(".pv-variant", { opacity: 0, y: 8 });
      gsap.set("#pv-warning", { opacity: 0, y: 12 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: viewportRef.current,
          start: "top top",
          end: mobile ? "+=180%" : "+=260%",
          scrub: motion.scrubSoft,
          onUpdate: (self) => setStep(Math.min(3, Math.floor(self.progress * 4))),
        },
      });

      // 1) машина правил: вход едет по фиксированной дорожке — дважды
      const runMachine = (t: gsap.core.Timeline, at: number) => {
        t.fromTo(
          "#pv-input",
          { x: 0, y: 0, opacity: 1 },
          { y: 148, duration: 0.06 },
          at,
        )
          .to("#pv-input", { x: 118, duration: 0.06 })
          .to("#pv-input", { y: 258, duration: 0.06 })
          .to("#pv-input", { x: 238, duration: 0.06 })
          .to("#pv-input", { opacity: 0, duration: 0.02 })
          .to("#pv-output", { opacity: 1, duration: 0.03 }, "<");
      };
      runMachine(tl, 0);
      tl.to("#pv-output", { opacity: 0.35, duration: 0.02 }, 0.3);
      runMachine(tl, 0.32);

      // 2) фокус переходит на нейросеть
      tl.to("#pv-left", { opacity: 0.3, duration: 0.1 }, 0.62)
        .to("#pv-right", { opacity: 1, duration: 0.12 }, 0.62);

      // 3) примеры вливаются, связи усиливаются
      tl.to(
        ".pv-example",
        { y: 0, opacity: 0.9, duration: 0.14, stagger: 0.012, ease: ease.ui },
        0.78,
      ).to(
        ".pv-link-strong",
        { attr: { "stroke-width": 1.7 }, opacity: 0.55, duration: 0.14 },
        0.82,
      );

      // 4) запрос проходит через сеть → вероятностные варианты
      tl.to("#pv-query", { strokeDashoffset: 0, duration: 0.16 }, 1.02)
        .to(
          ".pv-variant",
          { opacity: (i) => [0.95, 0.55, 0.3][i], y: 0, duration: 0.08, stagger: 0.05, ease: ease.ui },
          1.14,
        )
        .to("#pv-warning", { opacity: 1, y: 0, duration: 0.1, ease: ease.ui }, 1.3);
    }, sectionRef);
    return () => ctx.revert();
  }, [ready, lite, mobile]);

  return (
    <section
      ref={sectionRef}
      id="program-vs-ai"
      className="mc-scene"
      aria-labelledby="pv-title"
    >
      <div ref={viewportRef} className="mc-scene-viewport">
        <div>
          <p className="mc-eyebrow">{programVsAi.eyebrow}</p>
          <h2 id="pv-title" className="mc-h2" style={{ marginTop: "0.6rem" }}>
            {programVsAi.title}
          </h2>
          <p className="mc-body" style={{ marginTop: "0.9rem" }}>
            {programVsAi.lead}
          </p>
          <div
            ref={stepsRef}
            className="mc-scene-steps"
            style={{ marginTop: "1.6rem" }}
          >
            {programVsAi.items?.map((it, i) => (
              <div className="mc-step" data-active={i === 0} key={it.title}>
                <h3>{it.title}</h3>
                <p>{it.text}</p>
              </div>
            ))}
          </div>
          <p className="mc-metaphor-note" style={{ marginTop: "1.2rem" }}>
            Упрощённая визуальная метафора — не буквальная схема работы
            нейросети.
          </p>
        </div>

        <div>
          <svg
            className="mc-svg-stage"
            viewBox="0 0 760 520"
            role="img"
            aria-label="Слева — программа с фиксированными правилами, справа — обучаемая сеть связей"
          >
            {/* ── левая половина: машина правил ── */}
            <g id="pv-left">
              <rect
                x="22"
                y="70"
                width="308"
                height="380"
                rx="16"
                fill="rgba(16,33,58,0.55)"
                stroke="var(--line-soft)"
              />
              <text x="46" y="106" fill="var(--text-primary)" fontSize="15" fontWeight="700">
                Обычная программа
              </text>
              <polyline
                points="66,140 66,288 184,288 184,398 304,398"
                fill="none"
                stroke="rgba(120,180,230,0.35)"
                strokeWidth="2"
                strokeDasharray="4 6"
              />
              <rect
                id="pv-input"
                x="53"
                y="127"
                width="26"
                height="26"
                rx="5"
                fill="var(--accent-understand)"
                opacity="0"
              />
              <g id="pv-output" opacity="1">
                <rect
                  x="286"
                  y="384"
                  width="34"
                  height="28"
                  rx="6"
                  fill="none"
                  stroke="var(--accent-understand)"
                  strokeWidth="2"
                />
                <text
                  x="176"
                  y="440"
                  fill="var(--text-secondary)"
                  fontSize="12"
                  textAnchor="middle"
                >
                  одинаковый вход — одинаковый результат
                </text>
              </g>
              <text x="46" y="475" fill="var(--text-secondary)" fontSize="12">
                правила → результат
              </text>
            </g>

            {/* ── правая половина: обучаемая сеть ── */}
            <g id="pv-right">
              <text x="400" y="106" fill="var(--text-primary)" fontSize="15" fontWeight="700">
                Нейросеть
              </text>
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
                  opacity={k % 3 === 0 ? 0.55 : 0.2}
                />
              ))}
              {field.nodes.map((n, k) => (
                <circle
                  key={k}
                  cx={n.x}
                  cy={n.y}
                  r={n.r}
                  fill="#e9b24b"
                  opacity="0.75"
                />
              ))}
              {field.examples.map((e2, k) => (
                <circle
                  key={k}
                  className="pv-example"
                  cx={e2.x}
                  cy={e2.y}
                  r="1.8"
                  fill="#f5f8fc"
                  opacity="0.9"
                />
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
                <g
                  key={i}
                  className="pv-variant"
                  opacity={[0.95, 0.55, 0.3][i]}
                >
                  <rect
                    x={560 + i * 62}
                    y={452}
                    width="52"
                    height="26"
                    rx="6"
                    fill="none"
                    stroke="var(--accent-understand)"
                    strokeWidth="1.6"
                  />
                  <text
                    x={586 + i * 62}
                    y={469}
                    fill="var(--text-secondary)"
                    fontSize="11"
                    textAnchor="middle"
                  >
                    {["ответ A", "ответ B", "ответ C"][i]}
                  </text>
                </g>
              ))}
              <text x="400" y="508" fill="var(--text-secondary)" fontSize="12">
                примеры → веса → вероятностный результат
              </text>
            </g>
          </svg>

          <div
            id="pv-warning"
            className="mc-banner"
            style={{ marginTop: "1rem" }}
          >
            <strong>Уверенный тон — не гарантия истины.</strong> ИИ даёт сильный
            черновик, а факты, логику и риски проверяет человек.{" "}
            <span className="mc-pill" style={{ marginLeft: "0.4rem" }}>
              убедительно ≠ правильно
            </span>
          </div>
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
