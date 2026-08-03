"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../gsapSetup";
import { motion, ease } from "../motion";
import { entGateway, entRouter } from "../content.ru";
import { track } from "../analytics";

type Props = {
  lite: boolean;
  mobile: boolean;
  ready: boolean;
};

/**
 * Центральная сцена корпоративного блока: архитектура безопасного
 * ИИ-контура собирается по этапам скролла. После сцены — учебный
 * маршрутизатор запросов (готовые варианты, без свободного ввода).
 */
export default function EnterpriseGatewaySection({ lite, mobile, ready }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [routerIdx, setRouterIdx] = useState<number | null>(null);
  const [routerOpen, setRouterOpen] = useState(false);

  useLayoutEffect(() => {
    if (!ready || lite) return;
    const ctx = gsap.context(() => {
      const markers = sectionRef.current?.querySelectorAll<HTMLElement>(".mc-stage-markers span");
      const setStage = (idx: number) => {
        markers?.forEach((el, i) => el.setAttribute("data-active", String(i <= idx)));
      };
      setStage(0);

      gsap.set("#eg-employee", { opacity: 0, y: -14 });
      gsap.set("#eg-cap-employee", { opacity: 0 });
      gsap.set("#eg-gateway", { opacity: 0, y: -14 });
      gsap.set(".eg-gw-label", { opacity: 0, y: 6 });
      gsap.set("#eg-local", { opacity: 0, x: -14 });
      gsap.set("#eg-route-local", { opacity: 0 });
      gsap.set("#eg-cap-local", { opacity: 0 });
      gsap.set("#eg-external", { opacity: 0, x: 14 });
      gsap.set(".eg-route", { opacity: 0 });
      gsap.set(".eg-route-pill", { opacity: 0, y: 8 });
      gsap.set("#eg-human", { opacity: 0, y: 10 });
      gsap.set("#eg-cap-human", { opacity: 0 });
      gsap.set("#eg-key", { opacity: 0, y: 12 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        once: true,
        onEnter: () => track("mc_enterprise_arch_view"),
      });

      let doneTracked = false;
      const tl = gsap.timeline({
        defaults: { ease: ease.ui },
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: viewportRef.current,
          start: "top top",
          end: mobile ? "+=220%" : "+=300%",
          scrub: motion.scrubSoft,
          onUpdate: (self) => {
            setStage(Math.min(4, Math.floor(self.progress * 5.4)));
            if (!doneTracked && self.progress > 0.97) {
              doneTracked = true;
              track("mc_enterprise_arch_done");
            }
          },
        },
      });

      // Этап 1. Сотрудник и единое окно
      tl.to("#eg-employee", { opacity: 1, y: 0, duration: 0.1 }, 0.02)
        .to("#eg-cap-employee", { opacity: 1, duration: 0.08 }, 0.1);

      // Этап 2. Корпоративный ИИ-шлюз
      tl.to("#eg-gateway", { opacity: 1, y: 0, duration: 0.1 }, 0.24)
        .to(".eg-gw-label", { opacity: 1, y: 0, duration: 0.06, stagger: 0.025 }, 0.3);

      // Этап 3. Локальный контур
      tl.to("#eg-local", { opacity: 1, x: 0, duration: 0.1 }, 0.42)
        .to("#eg-route-local", { opacity: 1, duration: 0.08 }, 0.44)
        .to("#eg-cap-local", { opacity: 1, duration: 0.08 }, 0.5);

      // Этап 4. Контролируемый выход во внешние модели
      tl.to("#eg-external", { opacity: 1, x: 0, duration: 0.1 }, 0.72)
        .to(".eg-route", { opacity: 1, duration: 0.08, stagger: 0.03 }, 0.78)
        .to(".eg-route-pill", { opacity: 1, y: 0, duration: 0.07, stagger: 0.035 }, 0.84);

      // Этап 5. Человек в контуре + финал
      tl.to("#eg-human", { opacity: 1, y: 0, duration: 0.1 }, 0.94)
        .to("#eg-cap-human", { opacity: 1, duration: 0.08 }, 1.0)
        .to("#eg-key", { opacity: 1, y: 0, duration: 0.1 }, 1.08);
    }, sectionRef);
    return () => ctx.revert();
  }, [ready, lite, mobile]);

  const chooseRoute = (i: number) => {
    setRouterIdx(i);
    track("mc_enterprise_router_use", false);
    track(entRouter.options[i].goal, false);
    if (entRouter.options[i].route === "confirm") track("mc_enterprise_route_confirm", false);
  };
  const chosen = routerIdx !== null ? entRouter.options[routerIdx] : null;

  return (
    <section ref={sectionRef} id="enterprise-gateway" className="mc-scene" aria-labelledby="eg-title">
      <div ref={viewportRef} className="mc-scene-viewport mc-scene-viewport--center">
        <div className="mc-center" style={{ width: "100%", gap: "0.7rem" }}>
          <p className="mc-eyebrow" style={{ color: "var(--accent-rebuild)" }}>
            {entGateway.eyebrow}
          </p>
          <h2 id="eg-title" className="mc-h2">
            {entGateway.title}
          </h2>
          <div className="mc-stage-markers" aria-hidden="true">
            {entGateway.stages.map((s, i) => (
              <span key={s} data-active={i === 0}>
                {s}
              </span>
            ))}
          </div>

          <svg
            className="mc-svg-stage"
            viewBox="0 0 720 560"
            role="img"
            aria-label="Архитектура: сотрудник — единое окно — ИИ-шлюз — локальный контур и контролируемый выход во внешние модели — подтверждение человеком"
            style={{ maxWidth: 620 }}
          >
            {/* Этап 1: сотрудник и единое окно */}
            <g id="eg-employee">
              <circle cx="360" cy="34" r="14" fill="none" stroke="var(--text-primary)" strokeWidth="2" />
              <path d="M 340 62 A 20 20 0 0 1 380 62" fill="none" stroke="var(--text-primary)" strokeWidth="2" />
              <rect x="260" y="74" width="200" height="40" rx="10" fill="rgba(37,199,232,0.1)" stroke="var(--accent-understand)" strokeWidth="1.6" />
              <text x="360" y="99" textAnchor="middle" fill="var(--text-primary)" fontSize="15" fontWeight="650">
                единое окно
              </text>
              <text id="eg-cap-employee" x="480" y="99" fill="var(--text-secondary)" fontSize="13">
                {entGateway.employeeCaption}
              </text>
            </g>

            {/* Этап 2: шлюз */}
            <g id="eg-gateway">
              <path d="M 360 114 L 360 140" stroke="var(--line-soft)" strokeWidth="2" />
              <rect x="150" y="140" width="420" height="96" rx="14" fill="rgba(141,107,255,0.08)" stroke="var(--accent-rebuild)" strokeWidth="1.8" />
              <text x="360" y="164" textAnchor="middle" fill="var(--accent-rebuild)" fontSize="14" fontWeight="700" letterSpacing="1">
                КОРПОРАТИВНЫЙ ИИ-ШЛЮЗ
              </text>
              {entGateway.gatewayLabels.map((l, i) => (
                <text
                  key={l}
                  className="eg-gw-label"
                  x={186 + (i % 2) * 212}
                  y={186 + Math.floor(i / 2) * 22}
                  fill="var(--text-secondary)"
                  fontSize="15"
                >
                  · {l}
                </text>
              ))}
            </g>

            {/* Этап 3: локальный контур */}
            <g id="eg-local">
              <path id="eg-route-local" d="M 260 236 L 190 268" stroke="var(--accent-understand)" strokeWidth="2" />
              <rect x="40" y="268" width="300" height="150" rx="16" fill="rgba(14,28,51,0.6)" stroke="var(--accent-check)" strokeOpacity="0.5" strokeWidth="1.6" strokeDasharray="8 7" />
              <text x="60" y="294" fill="var(--accent-check)" fontSize="13" letterSpacing="2">
                ЛОКАЛЬНЫЙ КОНТУР
              </text>
              {entGateway.localItems.map((l, i) => (
                <text key={l} x={60} y={316 + i * 20} fill="var(--text-secondary)" fontSize="14">
                  · {l}
                </text>
              ))}
              <g id="eg-cap-local">
                <text x="60" y="440" fill="var(--text-secondary)" fontSize="13">{entGateway.localCaption}</text>
                <text x="60" y="458" fill="var(--text-secondary)" fontSize="13">{entGateway.localCaption2}</text>
              </g>
            </g>

            {/* Этап 4: контролируемый выход наружу */}
            <g id="eg-external">
              <rect x="470" y="268" width="210" height="150" rx="24" fill="rgba(20,40,68,0.35)" stroke="var(--line-soft)" />
              <text x="575" y="298" textAnchor="middle" fill="var(--text-secondary)" fontSize="14">
                внешние модели
              </text>
              {[0, 1, 2].map((i) => (
                <circle key={i} cx={520 + i * 55} cy={350} r="15" fill="none" stroke="var(--accent-understand)" strokeOpacity="0.6" strokeWidth="1.6" />
              ))}
            </g>
            {/* маршруты из шлюза наружу */}
            <g>
              <path className="eg-route" d="M 460 236 L 530 268" stroke="var(--accent-delegate)" strokeWidth="2" strokeDasharray="6 5" />
              <circle className="eg-route" cx="497" cy="247" r="8" fill="none" stroke="var(--accent-delegate)" strokeWidth="1.5" strokeDasharray="3 3" />
              <path className="eg-route" d="M 570 236 L 620 256" stroke="var(--danger)" strokeWidth="2" />
              <text className="eg-route" x="628" y="262" fill="var(--danger)" fontSize="15" fontWeight="700">
                ×
              </text>
            </g>

            {/* Этап 5: человек в контуре */}
            <g id="eg-human">
              <path d="M 360 418 L 360 458" stroke="var(--line-soft)" strokeWidth="2" />
              <circle cx="360" cy="482" r="17" fill="rgba(66,201,138,0.15)" stroke="var(--accent-check)" strokeWidth="2" />
              <path d="M 352 482 L 357 488 L 369 474" stroke="var(--accent-check)" strokeWidth="2.2" fill="none" />
              <text id="eg-cap-human" x="360" y="526" textAnchor="middle" fill="var(--text-secondary)" fontSize="14">
                {entGateway.humanCaption}
              </text>
            </g>
          </svg>

          <div className="mc-zone-row" aria-hidden="true">
            {entGateway.routes.map((r) => (
              <span key={r.name} className="eg-route-pill mc-chip" style={{ borderColor: `color-mix(in srgb, ${r.color} 55%, transparent)`, fontSize: "0.9rem" }}>
                {r.name}
              </span>
            ))}
          </div>

          <div id="eg-key" style={{ maxWidth: 760 }}>
            <p className="mc-key">{entGateway.key}</p>
          </div>
        </div>
      </div>

      {/* учебный маршрутизатор запросов (опциональное углубление) */}
      <div className="mc-section mc-center" style={{ paddingTop: "2rem" }}>
        <h3 className="mc-key" style={{ fontSize: "clamp(1.3rem, 2.2vw, 1.9rem)" }}>{entRouter.title}</h3>
        {!routerOpen ? (
          <button type="button" className="mc-btn mc-btn-ghost" onClick={() => setRouterOpen(true)}>
            Разобрать {entRouter.options.length} запросов
          </button>
        ) : null}
        {routerOpen ? (
        <div className="mc-traffic" style={{ maxWidth: 620 }}>
          <div className="mc-traffic-card">
            <div className="mc-zone-row" role="group" aria-label="Выберите запрос">
              {entRouter.options.map((o, i) => (
                <button
                  key={o.text}
                  type="button"
                  className="mc-zone-btn"
                  style={{ ["--zone-color" as string]: o.color, fontSize: "0.88rem" }}
                  data-chosen={routerIdx === i}
                  onClick={() => chooseRoute(i)}
                >
                  {o.text}
                </button>
              ))}
            </div>
            <div className="mc-traffic-feedback" aria-live="polite">
              {chosen ? (
                <>
                  <b style={{ color: chosen.color }}>{chosen.routeName}.</b> {chosen.why}.
                </>
              ) : (
                "Выберите запрос — шлюз покажет маршрут."
              )}
            </div>
          </div>
        </div>
        ) : null}
        <p className="mc-privacy-note">{entGateway.disclaimer} {entRouter.disclaimer}</p>
      </div>
    </section>
  );
}
