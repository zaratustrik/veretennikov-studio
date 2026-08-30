"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Hero visual — зацикленная градированная motion-марка. Исходный клип
 * отгрейжен так, что фон уходит в почти белый; mix-blend-mode: multiply
 * растворяет его в бумаге секции, а радиальная маска съедает края —
 * прямоугольника видео не видно, «блюпринт» будто лежит на бумаге.
 *
 * ВАЖНО про вес. Клип весит ~1,9 МБ. Раньше он прятался на мобильном
 * только CSS-классом `hidden lg:block` — браузер всё равно скачивал файл,
 * то есть телефон тянул почти два мегабайта ради того, чего не увидит.
 * Теперь <video> монтируется только после того, как клиент подтвердил
 * ширину ≥ 1024px: до этого в дереве нет ни тега, ни сетевого запроса.
 *
 * muted · loop · autoplay · playsInline, постер для мгновенной отрисовки
 * и корректный фолбэк для prefers-reduced-motion.
 */

const DESKTOP_QUERY = "(min-width: 1024px)";

const MASK =
  "radial-gradient(ellipse 72% 70% at 50% 47%, #000 50%, rgba(0,0,0,0.35) 70%, transparent 82%)";

const SHARED: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  mixBlendMode: "multiply",
  WebkitMaskImage: MASK,
  maskImage: MASK,
};

function useIsDesktop(): boolean {
  // false на сервере и при первом клиентском рендере — разметка совпадает,
  // гидрация не расходится, запроса к видео нет.
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return isDesktop;
}

export default function HeroMarkVideo() {
  const reduce = useReducedMotion();
  const isDesktop = useIsDesktop();

  return (
    <div
      aria-hidden
      style={{
        position: "relative",
        width: "100%",
        height: "min(560px, 60vh)",
        overflow: "hidden",
        marginInline: "auto",
      }}
    >
      {!isDesktop ? null : reduce ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/hero/hero-mark-poster.jpg" alt="" style={SHARED} />
      ) : (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/hero/hero-mark-poster.jpg"
          style={SHARED}
        >
          <source src="/hero/hero-mark.webm" type="video/webm" />
          <source src="/hero/hero-mark.mp4" type="video/mp4" />
        </video>
      )}
    </div>
  );
}
