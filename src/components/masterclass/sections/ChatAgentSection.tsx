"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "../gsapSetup";
import { motion, ease } from "../motion";
import { chatAgent, stepColors } from "../content.ru";

type Props = {
  lite: boolean;
  mobile: boolean;
  ready: boolean;
};

/**
 * Одна система, три уровня зрелости: чат → помощник → агент.
 * Ядро остаётся, вокруг него нарастают документы, цель, план и границы.
 */
export default function ChatAgentSection({ lite, mobile, ready }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ready || lite) return;
    const ctx = gsap.context(() => {
      const words = wordsRef.current?.querySelectorAll<HTMLElement>(".mc-caa-word");
      const setStage = (idx: number) => {
        words?.forEach((el, i) => el.setAttribute("data-active", String(i === idx)));
      };

      gsap.set("#caa-chat", { opacity: 1 });
      gsap.set("#caa-assistant", { opacity: 0 });
      gsap.set("#caa-agent", { opacity: 0 });
      gsap.set("#caa-key", { opacity: 0, y: 12 });

      const tl = gsap.timeline({
        defaults: { ease: ease.state },
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: viewportRef.current,
          start: "top top",
          end: mobile ? "+=180%" : "+=250%",
          scrub: motion.scrubSoft,
          onUpdate: (self) => setStage(self.progress < 0.25 ? 0 : self.progress < 0.55 ? 1 : 2),
        },
      });

      tl.to("#caa-assistant", { opacity: 1, duration: 0.2 }, 0.15)
        .to("#caa-agent", { opacity: 1, duration: 0.2 }, 0.5)
        .to("#caa-key", { opacity: 1, y: 0, duration: 0.14, ease: ease.ui }, 0.82);
    }, sectionRef);
    return () => ctx.revert();
  }, [ready, lite, mobile]);

  return (
    <section ref={sectionRef} id="chat-assistant-agent" className="mc-scene" aria-labelledby="caa-title">
      <div ref={viewportRef} className="mc-scene-viewport">
        <div>
          <p className="mc-eyebrow">{chatAgent.eyebrow}</p>
          <h2 id="caa-title" className="mc-h2" style={{ marginTop: "0.7rem" }}>
            {chatAgent.title}
          </h2>
          <div ref={wordsRef} className="mc-caa-words">
            {chatAgent.stages.map((s, i) => (
              <div key={s.name} className="mc-caa-word" data-active={i === 0} style={{ color: stepColors[s.step] }}>
                {s.name}
                <small>{s.formula}</small>
                <em>{s.price}</em>
              </div>
            ))}
          </div>
        </div>

        <div className="mc-caa-stage">
          <svg
            className="mc-svg-stage"
            viewBox="0 0 640 480"
            role="img"
            aria-label="Одна система растёт: чат, затем помощник с документами, затем агент с целью, планом и границами"
          >
            {/* ядро */}
            <circle cx="320" cy="240" r="34" fill="rgba(37,199,232,0.14)" stroke="var(--accent-understand)" strokeWidth="2" />
            <circle cx="320" cy="240" r="8" fill="var(--accent-understand)" />

            {/* уровень 1 — чат */}
            <g id="caa-chat">
              <rect x="140" y="150" width="120" height="40" rx="12" fill="rgba(14,28,51,0.8)" stroke="var(--line-soft)" />
              <text x="200" y="175" textAnchor="middle" fill="var(--text-secondary)" fontSize="13">вопрос</text>
              <path d="M 262 170 L 300 218" stroke="var(--accent-understand)" strokeWidth="1.6" opacity="0.7" />
              <rect x="380" y="290" width="120" height="40" rx="12" fill="rgba(14,28,51,0.8)" stroke="var(--line-soft)" />
              <text x="440" y="315" textAnchor="middle" fill="var(--text-secondary)" fontSize="13">ответ</text>
              <path d="M 342 262 L 380 306" stroke="var(--accent-understand)" strokeWidth="1.6" opacity="0.7" />
            </g>

            {/* уровень 2 — помощник */}
            <g id="caa-assistant">
              {[0, 1, 2].map((i) => (
                <g key={i}>
                  <rect x={96 + i * 14} y={300 + i * 10} width="72" height="52" rx="8"
                    fill="rgba(14,28,51,0.85)" stroke="var(--accent-delegate)" strokeOpacity="0.55" />
                  <line x1={108 + i * 14} y1={316 + i * 10} x2={152 + i * 14} y2={316 + i * 10} stroke="var(--accent-delegate)" strokeOpacity="0.4" />
                  <line x1={108 + i * 14} y1={328 + i * 10} x2={144 + i * 14} y2={328 + i * 10} stroke="var(--accent-delegate)" strokeOpacity="0.4" />
                </g>
              ))}
              <text x="132" y="386" textAnchor="middle" fill="var(--text-secondary)" fontSize="12">документы</text>
              <path d="M 180 320 L 290 258" stroke="var(--accent-delegate)" strokeWidth="1.5" opacity="0.6" strokeDasharray="3 5" />
              <rect x="430" y="120" width="130" height="38" rx="10" fill="rgba(14,28,51,0.85)" stroke="var(--accent-delegate)" strokeOpacity="0.55" />
              <text x="495" y="144" textAnchor="middle" fill="var(--text-secondary)" fontSize="12">инструкции</text>
              <path d="M 452 158 L 352 222 " stroke="var(--accent-delegate)" strokeWidth="1.5" opacity="0.6" strokeDasharray="3 5" />
            </g>

            {/* уровень 3 — агент */}
            <g id="caa-agent">
              <rect x="60" y="60" width="520" height="360" rx="22" fill="none" stroke="var(--accent-rebuild)" strokeOpacity="0.5" strokeWidth="1.6" strokeDasharray="8 8" />
              <text x="84" y="92" fill="var(--accent-rebuild)" fontSize="12" letterSpacing="2">ГРАНИЦЫ</text>
              <circle cx="320" cy="80" r="12" fill="none" stroke="var(--accent-rebuild)" strokeWidth="2" />
              <path d="M 320 68 L 320 62" stroke="var(--accent-rebuild)" strokeWidth="2" />
              <text x="342" y="84" fill="var(--text-secondary)" fontSize="12">цель</text>
              {[0, 1, 2].map((i) => (
                <g key={i}>
                  <circle cx={430 + i * 52} cy={260 - i * 30} r="9" fill="none" stroke="var(--accent-rebuild)" strokeWidth="1.8" />
                  {i < 2 && (
                    <line x1={438 + i * 52} y1={255 - i * 30} x2={474 + i * 52} y2={235 - i * 30} stroke="var(--accent-rebuild)" strokeWidth="1.4" opacity="0.7" />
                  )}
                </g>
              ))}
              <text x="470" y="296" fill="var(--text-secondary)" fontSize="13">план</text>
              <g>
                <circle cx="234" cy="404" r="13" fill="rgba(66,201,138,0.15)" stroke="var(--accent-check)" strokeWidth="2" />
                <path d="M 228 404 L 232 409 L 241 398" stroke="var(--accent-check)" strokeWidth="2" fill="none" />
                <text x="256" y="409" fill="var(--text-secondary)" fontSize="12">подтверждение человека</text>
              </g>
            </g>
          </svg>
          <p id="caa-key" className="mc-key" style={{ textAlign: "center", marginTop: "1.2rem", maxWidth: "24em" }}>
            {chatAgent.key}
          </p>
        </div>
      </div>
    </section>
  );
}
