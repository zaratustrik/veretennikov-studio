"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../gsapSetup";
import { motion, ease } from "../motion";
import { entWhy } from "../content.ru";
import { track } from "../analytics";

type Props = {
  lite: boolean;
  mobile: boolean;
  ready: boolean;
};

/**
 * Зачем предприятию свой контур: материалы по-разному маршрутизируются
 * к внешним моделям. Малый контур агента (предыдущая сцена) расширяется
 * до контура организации — смысловой переход.
 */
export default function EnterpriseWhySection({ lite, mobile, ready }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ready || lite) return;
    const ctx = gsap.context(() => {
      const thoughts = listRef.current?.querySelectorAll<HTMLElement>(".mc-formula-item");
      const setThought = (idx: number) => {
        thoughts?.forEach((el, i) => el.setAttribute("data-active", String(i <= idx)));
      };
      setThought(-1);

      gsap.set("#ew-contour", { attr: { x: 150, y: 170, width: 180, height: 180 }, opacity: 0.5 });
      gsap.set(".ew-dot", { x: 0, opacity: 0 });
      gsap.set("#ew-boundary", { opacity: 0 });
      gsap.set(".ew-mark", { opacity: 0 });
      gsap.set("#ew-key", { opacity: 0, y: 14 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        once: true,
        onEnter: () => track("mc_enterprise_view"),
      });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: viewportRef.current,
          start: "top top",
          end: mobile ? "+=180%" : "+=240%",
          scrub: motion.scrubSoft,
          onUpdate: (self) =>
            setThought(self.progress < 0.3 ? -1 : self.progress < 0.5 ? 0 : self.progress < 0.7 ? 1 : 2),
        },
      });

      // 1) контур агента расширяется до контура предприятия
      tl.to("#ew-contour", {
        attr: { x: 24, y: 60, width: 380, height: 400 },
        opacity: 1,
        duration: 0.16,
        ease: ease.state,
      }, 0.02);

      // 2) наивные потоки: все материалы летят наружу
      tl.to(".ew-dot", { opacity: 0.9, duration: 0.04, stagger: 0.015 }, 0.2)
        .to(".ew-dot", { x: 250, duration: 0.16, stagger: 0.02 }, 0.24);

      // 3) появляется граница-шлюз
      tl.to("#ew-boundary", { opacity: 1, duration: 0.08 }, 0.42);

      // 4) маршруты: часть проходит, часть обезличивается, часть блокируется, часть остаётся
      tl.to(".ew-dot[data-route='pass']", { x: 470, duration: 0.14 }, 0.52)
        .to(".ew-dot[data-route='mask']", { x: 262, duration: 0.08 }, 0.52)
        .to(".ew-mark[data-route='mask']", { opacity: 1, duration: 0.05 }, 0.6)
        .to(".ew-dot[data-route='mask']", { x: 470, duration: 0.12 }, 0.66)
        .to(".ew-mark[data-route='block']", { opacity: 1, duration: 0.05 }, 0.6)
        .to(".ew-dot[data-route='stay']", { x: 90, duration: 0.1 }, 0.56)
        .to(".ew-mark[data-route='stay']", { opacity: 1, duration: 0.05 }, 0.66);

      // 5) финальная мысль
      tl.to("#ew-key", { opacity: 1, y: 0, duration: 0.12, ease: ease.ui }, 0.9);
    }, sectionRef);
    return () => ctx.revert();
  }, [ready, lite, mobile]);

  return (
    <section ref={sectionRef} id="enterprise-why" className="mc-scene" aria-labelledby="ew-title">
      <div ref={viewportRef} className="mc-scene-viewport">
        <div>
          <p className="mc-eyebrow" style={{ color: "var(--accent-rebuild)" }}>
            {entWhy.eyebrow}
          </p>
          <h2 id="ew-title" className="mc-h2" style={{ marginTop: "0.7rem" }}>
            {entWhy.title}
          </h2>
          <p className="mc-lead" style={{ marginTop: "1rem" }}>
            {entWhy.lead}
          </p>
          <div ref={listRef} className="mc-formula-list" style={{ marginTop: "1.8rem" }}>
            {entWhy.thoughts.map((t) => (
              <div className="mc-formula-item" data-active={false} key={t}>
                <div className="mc-key" style={{ fontSize: "clamp(1.05rem, 1.7vw, 1.45rem)" }}>{t}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <svg
            className="mc-svg-stage"
            viewBox="0 0 760 520"
            role="img"
            aria-label="Материалы предприятия по-разному маршрутизируются к внешним ИИ-сервисам через контролируемую границу"
          >
            {/* контур предприятия (расширяется из контура агента) */}
            <rect
              id="ew-contour"
              x="24"
              y="60"
              width="380"
              height="400"
              rx="20"
              fill="none"
              stroke="var(--accent-check)"
              strokeOpacity="0.45"
              strokeWidth="1.6"
              strokeDasharray="9 8"
            />
            <text x="46" y="92" fill="var(--accent-check)" fontSize="13" letterSpacing="2">
              ПРЕДПРИЯТИЕ
            </text>

            {/* рабочее место и материалы */}
            <rect x="60" y="120" width="150" height="46" rx="10" fill="rgba(14,28,51,0.85)" stroke="var(--line-soft)" />
            <text x="135" y="149" textAnchor="middle" fill="var(--text-primary)" fontSize="15" fontWeight="650">
              рабочее место
            </text>
            {entWhy.materials.map((m, i) => (
              <g key={m.name}>
                <rect x="60" y={196 + i * 44} width="120" height="30" rx="7" fill="rgba(14,28,51,0.7)" stroke="var(--line-soft)" />
                <text x="120" y={217 + i * 44} textAnchor="middle" fill="var(--text-secondary)" fontSize="14">
                  {m.name}
                </text>
                <circle className="ew-dot" data-route={m.route} cx="192" cy={211 + i * 44} r="5"
                  fill={m.route === "block" ? "var(--danger)" : m.route === "mask" ? "var(--accent-delegate)" : m.route === "stay" ? "var(--accent-check)" : "var(--accent-understand)"} />
                {/* маркеры исхода на границе / внутри */}
                {m.route === "mask" ? (
                  <g className="ew-mark" data-route="mask">
                    <circle cx="454" cy={211 + i * 44} r="9" fill="none" stroke="var(--accent-delegate)" strokeWidth="1.6" strokeDasharray="3 3" />
                    <text x="497" y={216 + i * 44} fill="var(--accent-delegate)" fontSize="13">обезличено</text>
                  </g>
                ) : null}
                {m.route === "block" ? (
                  <g className="ew-mark" data-route="block">
                    <text x="452" y={217 + i * 44} fill="var(--danger)" fontSize="15" fontWeight="700">×</text>
                    <text x="497" y={216 + i * 44} fill="var(--danger)" fontSize="13">остановлено</text>
                  </g>
                ) : null}
                {m.route === "stay" ? (
                  <text className="ew-mark" data-route="stay" x="292" y={217 + i * 44} fill="var(--accent-check)" fontSize="13">
                    остаётся внутри
                  </text>
                ) : null}
              </g>
            ))}

            {/* граница-шлюз */}
            <g id="ew-boundary">
              <line x1="480" y1="90" x2="480" y2="470" stroke="var(--accent-rebuild)" strokeWidth="2.5" strokeDasharray="10 7" opacity="0.8" />
              <text x="480" y="72" textAnchor="middle" fill="var(--accent-rebuild)" fontSize="13" letterSpacing="2">
                КОНТРОЛИРУЕМАЯ ГРАНИЦА
              </text>
            </g>

            {/* внешние модели */}
            <g opacity="0.9">
              <rect x="560" y="170" width="160" height="180" rx="24" fill="rgba(20,40,68,0.35)" stroke="var(--line-soft)" />
              <text x="640" y="205" textAnchor="middle" fill="var(--text-secondary)" fontSize="14">
                внешние ИИ-модели
              </text>
              {[0, 1, 2].map((i) => (
                <circle key={i} cx={600 + i * 40} cy={270} r="14" fill="none" stroke="var(--accent-understand)" strokeOpacity="0.6" strokeWidth="1.6" />
              ))}
            </g>
          </svg>
          <p id="ew-key" className="mc-key" style={{ textAlign: "center", marginTop: "1.2rem" }}>
            {entWhy.key}
          </p>
        </div>
      </div>
    </section>
  );
}
