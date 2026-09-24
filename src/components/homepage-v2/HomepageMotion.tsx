"use client";

import { useEffect } from "react";

export default function HomepageMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".hpv2-root");
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(".hpv2-root [data-reveal]"),
    );
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    root?.classList.add("hpv2-motion-ready");

    if (reduceMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.setAttribute("data-visible", "true"));
      return () => root?.classList.remove("hpv2-motion-ready");
    }

    const pending = new Set(elements);
    let observer: IntersectionObserver | null = null;
    let frame = 0;

    const reveal = (element: HTMLElement) => {
      element.setAttribute("data-visible", "true");
      pending.delete(element);
      observer?.unobserve(element);
    };

    const revealPassedElements = () => {
      pending.forEach((element) => {
        if (element.getBoundingClientRect().top < window.innerHeight * 1.08) {
          reveal(element);
        }
      });
      if (pending.size === 0) window.removeEventListener("scroll", onScroll);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        revealPassedElements();
      });
    };

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target as HTMLElement);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.12 },
    );

    elements.forEach((element) => observer?.observe(element));
    window.addEventListener("scroll", onScroll, { passive: true });
    revealPassedElements();

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      root?.classList.remove("hpv2-motion-ready");
    };
  }, []);

  return null;
}
