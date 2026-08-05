"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../gsapSetup";
import { ease, motion } from "../motion";
import { entPath, stepColors } from "../content.ru";
import { track } from "../analytics";

type Props = {
  lite: boolean;
  ready: boolean;
};

/**
 * Путь внедрения: система разворачивается из одного пилота.
 * Слева — шесть шагов, справа — три концентрических уровня.
 * В конце — связка с 4П и мостик к карточке пилота.
 */
export default function EnterprisePathSection({ lite, ready }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ready || lite || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".ep-step", {
        opacity: 0,
        x: -16,
        duration: motion.base,
        stagger: motion.staggerBase,
        ease: ease.ui,
        scrollTrigger: { trigger: "#ep-steps", start: "top 72%" },
      });
      gsap.from(".ep-level", {
        opacity: 0,
        scale: 0.86,
        transformOrigin: "50% 50%",
        duration: motion.slow,
        stagger: { each: 0.18, from: "end" },
        ease: ease.state,
        scrollTrigger: { trigger: "#ep-levels", start: "top 70%" },
      });
      gsap.from(".ep-fourp", {
        opacity: 0,
        y: 12,
        duration: motion.base,
        stagger: motion.staggerBase,
        ease: ease.ui,
        scrollTrigger: { trigger: "#ep-fourp-list", start: "top 78%" },
      });
      gsap.from("#ep-bridge", {
        opacity: 0,
        y: 16,
        duration: motion.slow,
        ease: ease.major,
        scrollTrigger: { trigger: "#ep-bridge", start: "top 82%" },
      });
      ScrollTrigger.create({
        trigger: "#ep-bridge",
        start: "top 85%",
        once: true,
        onEnter: () => track("mc_enterprise_to_pilot"),
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [ready, lite]);

  return (
    <section ref={sectionRef} id="enterprise-path" className="mc-section mc-section--calm" aria-labelledby="ep-title">
      <div className="mc-center">
        <p className="mc-eyebrow" style={{ color: "var(--accent-rebuild)" }}>
          {entPath.eyebrow}
        </p>
        <h2 id="ep-title" className="mc-h2">
          {entPath.title}
        </h2>
      </div>

      <div className="mc-builder" style={{ alignItems: "center", marginTop: "3.5rem" }}>
        {/* шесть шагов */}
        <div id="ep-steps" style={{ display: "grid", gap: "1.1rem" }}>
          {entPath.steps.map((s, i) => (
            <div key={s.name} className="ep-step" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "0.9rem", alignItems: "baseline" }}>
              <i
                style={{
                  fontStyle: "normal",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "var(--accent-rebuild)",
                  border: "1px solid color-mix(in srgb, var(--accent-rebuild) 50%, transparent)",
                  borderRadius: "50%",
                  width: "1.7rem",
                  height: "1.7rem",
                  display: "inline-grid",
                  placeItems: "center",
                }}
              >
                {i + 1}
              </i>
              <div>
                <div style={{ fontWeight: 700, fontSize: "clamp(1.05rem, 1.6vw, 1.35rem)" }}>{s.name}</div>
                <div className="mc-small" style={{ marginTop: "0.15rem" }}>{s.short}</div>
              </div>
            </div>
          ))}
        </div>

        {/* три уровня — концентрическое разворачивание из пилота */}
        <div id="ep-levels">
          <svg
            className="mc-svg-stage"
            viewBox="0 0 560 460"
            role="img"
            aria-label="Три уровня внедрения: пилот, корпоративный помощник, корпоративный ИИ-контур"
          >
            <rect className="ep-level" x="30" y="30" width="500" height="400" rx="26" fill="none" stroke="var(--accent-rebuild)" strokeOpacity="0.5" strokeWidth="1.6" strokeDasharray="9 8" />
            <text className="ep-level" x="54" y="66" fill="var(--accent-rebuild)" fontSize="13" fontWeight="650">
              {entPath.levels[2].name}
            </text>
            <text className="ep-level" x="54" y="86" fill="var(--text-secondary)" fontSize="11">
              {entPath.levels[2].short}
            </text>

            <rect className="ep-level" x="110" y="120" width="340" height="250" rx="20" fill="rgba(233,178,75,0.05)" stroke="var(--accent-delegate)" strokeOpacity="0.55" strokeWidth="1.6" />
            <text className="ep-level" x="132" y="152" fill="var(--accent-delegate)" fontSize="13" fontWeight="650">
              {entPath.levels[1].name}
            </text>
            <text className="ep-level" x="132" y="171" fill="var(--text-secondary)" fontSize="11">
              {entPath.levels[1].short}
            </text>

            <rect className="ep-level" x="170" y="210" width="220" height="110" rx="14" fill="rgba(37,199,232,0.08)" stroke="var(--accent-understand)" strokeWidth="1.8" />
            <text className="ep-level" x="280" y="258" textAnchor="middle" fill="var(--accent-understand)" fontSize="15" fontWeight="700">
              {entPath.levels[0].name}
            </text>
            <text className="ep-level" x="280" y="280" textAnchor="middle" fill="var(--text-secondary)" fontSize="11">
              {entPath.levels[0].short}
            </text>
          </svg>
        </div>
      </div>

      <div className="mc-center" style={{ marginTop: "4rem" }}>
        <p className="mc-key" style={{ maxWidth: "30em" }}>{entPath.key}</p>

        <p id="ep-owner" className="mc-small" style={{ maxWidth: "46em", marginTop: "1.5rem", opacity: 0.85 }}>
          {entPath.owner}
        </p>

        <div id="ep-fourp-list" className="mc-formula-list" style={{ marginTop: "2.4rem", maxWidth: 680, textAlign: "left" }}>
          {entPath.fourP.map((f) => (
            <div key={f.title} className="mc-formula-item ep-fourp" data-active="true">
              <div className="mc-formula-label" style={{ color: stepColors[f.step] }}>
                {f.title}
              </div>
              <div className="mc-body">{f.text}</div>
            </div>
          ))}
        </div>

        <p id="ep-bridge" className="mc-key" style={{ marginTop: "3.5rem", color: "var(--text-primary)" }}>
          {entPath.bridge}
        </p>
      </div>
    </section>
  );
}
