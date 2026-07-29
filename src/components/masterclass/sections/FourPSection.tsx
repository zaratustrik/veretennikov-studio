"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { gsap } from "../gsapSetup";
import { motion, ease } from "../motion";
import { fourP, stepColors } from "../content.ru";

type Props = {
  lite: boolean;
  mobile: boolean;
  ready: boolean;
};

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
  const arcs = useMemo(() => fourP.items.map((_, i) => arcPath(i)), []);

  useLayoutEffect(() => {
    if (!ready || lite) return;
    const ctx = gsap.context(() => {
      const words = listRef.current?.querySelectorAll<HTMLElement>(".mc-fourp-word");
      const setActive = (idx: number) => {
        words?.forEach((el, i) => el.setAttribute("data-active", String(i === idx)));
      };

      gsap.set(".fourp-arc", { strokeDashoffset: 1 });
      gsap.set("#fourp-core", { opacity: 0, scale: 0.92, transformOrigin: "50% 50%" });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: viewportRef.current,
          start: "top top",
          end: mobile ? "+=150%" : "+=210%",
          scrub: motion.scrubSoft,
          onUpdate: (self) => setActive(Math.min(3, Math.floor(self.progress * 4.3))),
        },
      });

      tl.to("#fourp-core", { opacity: 1, scale: 1, duration: 0.14, ease: ease.ui }, 0);
      fourP.items.forEach((_, i) => {
        tl.to(`#fourp-arc-${i}`, { strokeDashoffset: 0, duration: 0.2 }, 0.08 + i * 0.24);
      });
      tl.to("#fourp-ring", { rotate: 3, transformOrigin: "50% 50%", duration: 0.1, ease: ease.state }, 1.06);
    }, sectionRef);
    return () => ctx.revert();
  }, [ready, lite, mobile]);

  return (
    <section ref={sectionRef} id="four-p" className="mc-scene" aria-labelledby="fourp-title">
      <div ref={viewportRef} className="mc-scene-viewport" style={{ gridTemplateColumns: "minmax(0,5fr) minmax(0,7fr)" }}>
        <div>
          <p className="mc-eyebrow" style={{ color: "var(--accent-delegate)" }}>
            {fourP.eyebrow}
          </p>
          <h2 id="fourp-title" className="mc-h2" style={{ marginTop: "0.7rem", marginBottom: "2.4rem" }}>
            {fourP.title}
          </h2>
          <div ref={listRef} className="mc-fourp-words">
            {fourP.items.map((it, i) => (
              <div className="mc-fourp-word" data-active={i === 0} key={it.title} style={{ color: stepColors[it.step] }}>
                {it.title}
                <small>— {it.short}</small>
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
            style={{ maxWidth: 520, margin: "0 auto" }}
          >
            <g id="fourp-ring">
              <circle cx="210" cy="210" r="150" fill="none" stroke="rgba(120,180,230,0.09)" strokeWidth="10" />
              {fourP.items.map((it, i) => (
                <path
                  key={it.step}
                  id={`fourp-arc-${i}`}
                  className="fourp-arc"
                  d={arcs[i]}
                  fill="none"
                  stroke={stepColors[it.step]}
                  strokeWidth="10"
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset="0"
                />
              ))}
            </g>
            <g id="fourp-core">
              <circle cx="210" cy="210" r="84" fill="rgba(14,28,51,0.7)" stroke="var(--line-soft)" />
              <text x="210" y="224" textAnchor="middle" fill="var(--text-primary)" fontSize="44" fontWeight="800">
                4П
              </text>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
