"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { gsap } from "../gsapSetup";
import { motion, ease } from "../motion";
import { fourP, stepColors, type FourPStep } from "../content.ru";

type Props = {
  lite: boolean;
  mobile: boolean;
  ready: boolean;
};

const ORDER: FourPStep[] = ["understand", "delegate", "check", "rebuild"];

/** Дуга кольца: 82° на сегмент, 8° зазор, начало сверху */
function arcPath(index: number, r = 150, cx = 210, cy = 210): string {
  const seg = 82;
  const gap = 8;
  const start = -90 + index * (seg + gap);
  const end = start + seg;
  const p = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return `${cx + r * Math.cos(rad)},${cy + r * Math.sin(rad)}`;
  };
  return `M ${p(start)} A ${r} ${r} 0 0 1 ${p(end)}`;
}

export default function FourPSection({ lite, mobile, ready }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const arcs = useMemo(() => ORDER.map((_, i) => arcPath(i)), []);

  useLayoutEffect(() => {
    if (!ready || lite) return;
    const ctx = gsap.context(() => {
      const items =
        listRef.current?.querySelectorAll<HTMLElement>(".mc-fourp-item");
      const setActive = (idx: number) => {
        items?.forEach((el, i) =>
          el.setAttribute("data-active", String(i <= idx)),
        );
      };

      gsap.set(".fourp-arc", { strokeDashoffset: 1 });
      gsap.set("#fourp-core", { opacity: 0, scale: 0.9, transformOrigin: "50% 50%" });
      gsap.set("#fourp-tagline", { opacity: 0, y: 10 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: viewportRef.current,
          start: "top top",
          end: mobile ? "+=160%" : "+=220%",
          scrub: motion.scrubSoft,
          onUpdate: (self) =>
            setActive(Math.min(3, Math.floor(self.progress * 4.4))),
        },
      });

      tl.to("#fourp-core", { opacity: 1, scale: 1, duration: 0.12, ease: ease.ui }, 0);
      ORDER.forEach((_, i) => {
        tl.to(
          `#fourp-arc-${i}`,
          { strokeDashoffset: 0, duration: 0.2 },
          0.08 + i * 0.24,
        );
      });
      tl.to(
        "#fourp-tagline",
        { opacity: 1, y: 0, duration: 0.12, ease: ease.ui },
        1.05,
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [ready, lite, mobile]);

  return (
    <section
      ref={sectionRef}
      id="four-p"
      className="mc-scene"
      aria-labelledby="fourp-title"
    >
      <div ref={viewportRef} className="mc-fourp-grid">
        <div>
          <p
            className="mc-eyebrow"
            style={{ color: "var(--accent-delegate)" }}
          >
            {fourP.eyebrow}
          </p>
          <h2 id="fourp-title" className="mc-h2" style={{ marginTop: "0.6rem" }}>
            {fourP.title}
          </h2>
          <p className="mc-body" style={{ marginTop: "0.9rem" }}>
            {fourP.lead}
          </p>
          <div ref={listRef} style={{ marginTop: "1.4rem" }}>
            {fourP.items?.map((it, i) => (
              <div
                className="mc-fourp-item"
                data-active={i === 0}
                key={it.title}
              >
                <span
                  className="mc-fourp-num"
                  style={{
                    color: stepColors[it.accent ?? "understand"],
                    borderColor: stepColors[it.accent ?? "understand"],
                  }}
                >
                  {i + 1}
                </span>
                <div>
                  <h3 style={{ color: stepColors[it.accent ?? "understand"] }}>
                    {it.title}
                  </h3>
                  <p>{it.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <svg
            className="mc-svg-stage"
            viewBox="0 0 420 420"
            role="img"
            aria-label="Кольцо методики 4П из четырёх цветных сегментов"
            style={{ maxWidth: 480, margin: "0 auto" }}
          >
            <circle
              cx="210"
              cy="210"
              r="150"
              fill="none"
              stroke="rgba(120,180,230,0.10)"
              strokeWidth="10"
            />
            {ORDER.map((step, i) => (
              <path
                key={step}
                id={`fourp-arc-${i}`}
                className="fourp-arc"
                d={arcs[i]}
                fill="none"
                stroke={stepColors[step]}
                strokeWidth="10"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset="0"
              />
            ))}
            <g id="fourp-core">
              <circle
                cx="210"
                cy="210"
                r="86"
                fill="rgba(16,33,58,0.75)"
                stroke="var(--line-soft)"
              />
              <text
                x="210"
                y="200"
                textAnchor="middle"
                fill="var(--text-primary)"
                fontSize="40"
                fontWeight="800"
              >
                4П
              </text>
              <text
                x="210"
                y="228"
                textAnchor="middle"
                fill="var(--text-secondary)"
                fontSize="12"
              >
                одна методика —
              </text>
              <text
                x="210"
                y="246"
                textAnchor="middle"
                fill="var(--text-secondary)"
                fontSize="12"
              >
                любой масштаб
              </text>
            </g>
          </svg>
          <p
            id="fourp-tagline"
            className="mc-body"
            style={{ textAlign: "center", marginTop: "0.8rem" }}
          >
            Дальше — каждый шаг отдельно, с примерами и демонстрациями.
          </p>
        </div>
      </div>
    </section>
  );
}
